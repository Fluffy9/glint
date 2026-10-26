#!/bin/sh
set -eu

name=glint-commerce-test
port=54329

if ! command -v docker >/dev/null 2>&1; then
  echo "pnpm test:db needs Docker so it can apply the commerce migration to a throwaway database." >&2
  exit 1
fi

docker rm -f "$name" >/dev/null 2>&1 || true
docker run -d --name "$name" -e POSTGRES_HOST_AUTH_METHOD=trust -p "${port}:5432" postgres:16 >/dev/null

cleanup() {
  docker rm -f "$name" >/dev/null 2>&1 || true
}
trap cleanup EXIT

ready=0
i=0
while [ "$i" -lt 30 ]; do
  if docker exec "$name" pg_isready -U postgres >/dev/null 2>&1; then
    ready=1
    break
  fi
  i=$((i + 1))
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "Postgres did not become ready." >&2
  exit 1
fi

COMMERCE_TEST_ADMIN_URL="postgres://postgres@127.0.0.1:${port}/postgres" \
  pnpm exec vitest run --config vitest.db.config.mts
