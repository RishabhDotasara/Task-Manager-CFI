#!/bin/bash

# # Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h database -p 5432; do
  sleep 2
done
echo "PostgreSQL is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --name "init"# or use `migrate deploy` for production
if [ $? -ne 0 ]; then
  echo "Prisma migration failed!"
  exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Prisma client generation failed!"
  exit 1
fi

# Start the application server
echo "Starting the server..."
npm run dev

