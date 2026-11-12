#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/300bc115b71a6935062ae37974be329e183263faf4947200b1de4c2d5499d597/contract';
import startContract from '../../snapshots/300bc115b71a6935062ae37974be329e183263faf4947200b1de4c2d5499d597/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/30421681c5a3b01571168f0ecbc270e203bef37b6a6227c9b2bb7edc4b4491ae/contract';
import endContract from '../../snapshots/30421681c5a3b01571168f0ecbc270e203bef37b6a6227c9b2bb7edc4b4491ae/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('role', 'text', {
          notNull: true,
          default: lit('SELLER'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'users',
        constraint: 'users_role_check_e4000fce',
        expression: sql`"role" IN ('SELLER', 'ADMIN')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
