import { Injectable, NotFoundException } from '@nestjs/common';
import { getPool } from '../../prisma/pool.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import type {
  StorefrontImageDto,
  StorefrontResponseDto,
} from './dto/storefront-response.dto.js';

// One message for "no such shop" and "not published yet", so drafts are not revealed.
const NOT_FOUND = 'Shop not found';

interface ShopRow {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  accent_color: string | null;
  announcement: string | null;
  is_published: boolean;
  business_category: string | null;
}

interface ProductRow {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  availability: string;
  is_featured: boolean;
  images: StorefrontImageDto[];
}

/**
 * Everything a customer needs to see one shop: the header, its categories, the visible products with
 * their photos, and the contact details. Drafts are only shown to their owner or an admin.
 */
@Injectable()
export class StorefrontService {
  async bySlug(
    slug: string,
    viewer: AuthenticatedUser | null,
  ): Promise<StorefrontResponseDto> {
    const pool = getPool();

    const { rows: shopRows } = await pool.query<ShopRow>(
      `SELECT s.id, s.owner_id, s.name, s.slug, s.description, s.logo_url, s.cover_image_url,
              s.accent_color, s.announcement, s.is_published, bc.name AS business_category
       FROM shops s
       LEFT JOIN business_categories bc ON bc.id = s.business_category_id
       WHERE s.slug = $1`,
      [slug],
    );
    const shop = shopRows[0];
    if (!shop) throw new NotFoundException(NOT_FOUND);

    const isOwner =
      viewer !== null &&
      (viewer.role === 'ADMIN' || viewer.id === shop.owner_id);
    if (!shop.is_published && !isOwner) throw new NotFoundException(NOT_FOUND);

    const [categories, products, contacts] = await Promise.all([
      pool.query<{ id: string; name: string; slug: string }>(
        `SELECT id, name, slug FROM product_categories WHERE shop_id = $1 ORDER BY name`,
        [shop.id],
      ),
      pool.query<ProductRow>(
        `SELECT p.id, p.category_id, p.name, p.slug, p.description, p.price::text AS price,
                p.availability, p.is_featured,
                COALESCE(
                  json_agg(
                    json_build_object('id', i.id, 'imageUrl', i.image_url, 'altText', i.alt_text)
                    ORDER BY i.display_order, i.created_at
                  ) FILTER (WHERE i.id IS NOT NULL),
                  '[]'
                ) AS images
         FROM products p
         LEFT JOIN product_images i ON i.product_id = p.id
         WHERE p.shop_id = $1 AND p.is_visible
         GROUP BY p.id
         ORDER BY p.is_featured DESC, p.created_at DESC`,
        [shop.id],
      ),
      pool.query<{ id: string; contact_type: string; contact_value: string }>(
        `SELECT id, contact_type, contact_value FROM shop_contacts WHERE shop_id = $1 ORDER BY created_at`,
        [shop.id],
      ),
    ]);

    return {
      shop: {
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        logoUrl: shop.logo_url,
        coverImageUrl: shop.cover_image_url,
        accentColor: shop.accent_color,
        announcement: shop.announcement,
        businessCategory: shop.business_category,
        isPublished: shop.is_published,
      },
      isPreview: !shop.is_published,
      isOwner,
      categories: categories.rows,
      products: products.rows.map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        price: row.price,
        availability: row.availability,
        isFeatured: row.is_featured,
        images: row.images,
      })),
      contacts: contacts.rows.map((row) => ({
        id: row.id,
        contactType: row.contact_type,
        contactValue: row.contact_value,
      })),
    };
  }
}
