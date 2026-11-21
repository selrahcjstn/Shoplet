#!/bin/sh
# Applies any pending database migrations, then starts the API.
# If a migration fails the container stops, so the API never runs against the wrong schema.
# Set RUN_MIGRATIONS=false to skip the migration step.
set -e

if [ "${RUN_MIGRATIONS:-true}" != "false" ]; then
  echo "Applying database migrations..."
  npx prisma db migrate --yes
fi

echo "Starting Shoplet API on port ${PORT:-3000}"
exec node dist/main
