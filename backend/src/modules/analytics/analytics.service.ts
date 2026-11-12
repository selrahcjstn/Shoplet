import { BadRequestException, Injectable } from '@nestjs/common';
import { assertShopAccess } from '../../common/utils/ownership.js';
import { getPool } from '../../prisma/pool.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import type {
  AnalyticsContactTypeDto,
  AnalyticsDayDto,
  AnalyticsLeastViewedDto,
  AnalyticsResponseDto,
  AnalyticsTopProductDto,
  AnalyticsTotalsDto,
} from './dto/index.js';

const DEFAULT_DAYS = 30;
const TOP_LIMIT = 5;

/** Adds whole days to a YYYY-MM-DD date. Done in UTC so it never skips a day. */
export function addDays(date: string, amount: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + amount);
  return d.toISOString().slice(0, 10);
}

export function sumDays(days: AnalyticsDayDto[]): AnalyticsTotalsDto {
  return days.reduce<AnalyticsTotalsDto>(
    (total, day) => ({
      storeViews: total.storeViews + day.storeViews,
      productViews: total.productViews + day.productViews,
      contactClicks: total.contactClicks + day.contactClicks,
    }),
    { storeViews: 0, productViews: 0, contactClicks: 0 },
  );
}

function assertTimezone(timezone: string): void {
  try {
    new Intl.DateTimeFormat('en', { timeZone: timezone });
  } catch {
    throw new BadRequestException('Timezone is not a valid timezone name');
  }
}

/**
 * Counts for one shop. A "day" is a calendar day in the requested timezone, so a
 * view at 11pm Manila time counts for that evening, not for the next UTC day.
 */
@Injectable()
export class AnalyticsService {
  async forShop(
    shopId: string,
    user: AuthenticatedUser,
    days = DEFAULT_DAYS,
    timezone = 'UTC',
  ): Promise<AnalyticsResponseDto> {
    assertTimezone(timezone);
    await assertShopAccess(shopId, user);

    const pool = getPool();

    const { rows: todayRows } = await pool.query<{ today: string }>(
      `SELECT to_char((now() AT TIME ZONE $1)::date, 'YYYY-MM-DD') AS today`,
      [timezone],
    );
    const to = todayRows[0]!.today;
    const from = addDays(to, -(days - 1));
    const previousFrom = addDays(from, -days);

    // Every local day from the start of the previous period to today, zeros included.
    const { rows: dayRows } = await pool.query<{
      date: string;
      store_views: number;
      product_views: number;
      contact_clicks: number;
    }>(
      `
      SELECT to_char(d, 'YYYY-MM-DD') AS date,
             COALESCE(sv.n, 0)::int AS store_views,
             COALESCE(pv.n, 0)::int AS product_views,
             COALESCE(cc.n, 0)::int AS contact_clicks
      FROM generate_series($1::date, $2::date, interval '1 day') AS d
      LEFT JOIN (
        SELECT (viewed_at AT TIME ZONE $4)::date AS day, count(*) AS n
        FROM store_views
        WHERE shop_id = $3
          AND viewed_at >= $1::date::timestamp AT TIME ZONE $4
          AND viewed_at <  ($2::date + 1)::timestamp AT TIME ZONE $4
        GROUP BY 1
      ) sv ON sv.day = d::date
      LEFT JOIN (
        SELECT (v.viewed_at AT TIME ZONE $4)::date AS day, count(*) AS n
        FROM product_views v
        JOIN products p ON p.id = v.product_id
        WHERE p.shop_id = $3
          AND v.viewed_at >= $1::date::timestamp AT TIME ZONE $4
          AND v.viewed_at <  ($2::date + 1)::timestamp AT TIME ZONE $4
        GROUP BY 1
      ) pv ON pv.day = d::date
      LEFT JOIN (
        SELECT (clicked_at AT TIME ZONE $4)::date AS day, count(*) AS n
        FROM contact_clicks
        WHERE shop_id = $3
          AND clicked_at >= $1::date::timestamp AT TIME ZONE $4
          AND clicked_at <  ($2::date + 1)::timestamp AT TIME ZONE $4
        GROUP BY 1
      ) cc ON cc.day = d::date
      ORDER BY d
      `,
      [previousFrom, to, shopId, timezone],
    );

    const all: AnalyticsDayDto[] = dayRows.map((row) => ({
      date: row.date,
      storeViews: row.store_views,
      productViews: row.product_views,
      contactClicks: row.contact_clicks,
    }));
    const daily = all.filter((day) => day.date >= from);
    const previousDays = all.filter((day) => day.date < from);

    const { rows: productRows } = await pool.query<{
      id: string;
      name: string;
      is_visible: boolean;
      views: number;
      clicks: number;
    }>(
      `
      SELECT id, name, is_visible, views, clicks FROM (
        SELECT p.id, p.name, p.is_visible,
          (SELECT count(*) FROM product_views v
             WHERE v.product_id = p.id
               AND v.viewed_at >= $2::date::timestamp AT TIME ZONE $4
               AND v.viewed_at <  ($3::date + 1)::timestamp AT TIME ZONE $4)::int AS views,
          (SELECT count(*) FROM contact_clicks c
             WHERE c.product_id = p.id AND c.shop_id = p.shop_id
               AND c.clicked_at >= $2::date::timestamp AT TIME ZONE $4
               AND c.clicked_at <  ($3::date + 1)::timestamp AT TIME ZONE $4)::int AS clicks
        FROM products p
        WHERE p.shop_id = $1
      ) t
      ORDER BY views DESC, clicks DESC, name
      `,
      [shopId, from, to, timezone],
    );

    const { rows: typeRows } = await pool.query<{
      contact_type: string;
      clicks: number;
    }>(
      `
      SELECT contact_type, count(*)::int AS clicks
      FROM contact_clicks
      WHERE shop_id = $1
        AND clicked_at >= $2::date::timestamp AT TIME ZONE $4
        AND clicked_at <  ($3::date + 1)::timestamp AT TIME ZONE $4
      GROUP BY contact_type
      ORDER BY clicks DESC, contact_type
      `,
      [shopId, from, to, timezone],
    );

    // Rows come back busiest first, so the top five are simply the first five with activity.
    const topProducts: AnalyticsTopProductDto[] = productRows
      .filter((row) => row.views > 0 || row.clicks > 0)
      .slice(0, TOP_LIMIT)
      .map((row) => ({
        productId: row.id,
        name: row.name,
        views: row.views,
        contactClicks: row.clicks,
      }));
    // The visible products with the fewest views, apart from the ones already shown as top.
    // Hidden products are left out on purpose: nobody can open them.
    const topIds = new Set(topProducts.map((p) => p.productId));
    const leastViewed: AnalyticsLeastViewedDto[] = productRows
      .filter((row) => row.is_visible && !topIds.has(row.id))
      .sort((a, b) => a.views - b.views || a.name.localeCompare(b.name))
      .slice(0, TOP_LIMIT)
      .map((row) => ({ productId: row.id, name: row.name, views: row.views }));
    const contactsByType: AnalyticsContactTypeDto[] = typeRows.map((row) => ({
      contactType: row.contact_type,
      clicks: row.clicks,
    }));

    return {
      range: { days, from, to, timezone },
      totals: sumDays(daily),
      previous: sumDays(previousDays),
      daily,
      topProducts,
      leastViewed,
      contactsByType,
    };
  }
}
