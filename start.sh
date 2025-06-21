#!/bin/bash
set -e

echo "Starting application..."

echo "Running database migrations..."
bunx drizzle-kit generate
bunx drizzle-kit push

echo "Starting main application..."
exec bun run start