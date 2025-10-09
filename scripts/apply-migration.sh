#!/bin/bash

# Apply time slots migration to remote Supabase
# Usage: bash scripts/apply-migration.sh

SUPABASE_URL="https://nzkcktausubexsfoqloo.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56a2NrdGF1c3ViZXhzZm9xbG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkxMjg3MiwiZXhwIjoyMDc1NDg4ODcyfQ.13wWTmq6KMLLK-MfsMBOSKJ0AhdASdZ9Rwq3KGInc6k"

echo "🚀 Applying time slots migration..."

# Read the migration file
MIGRATION_SQL=$(cat supabase/migrations/20250101000005_create_time_slots.sql)

# Execute via psql (requires PostgreSQL client)
# Alternative: Use Supabase Studio SQL Editor to run the migration manually

echo "✅ Migration file created: supabase/migrations/20250101000005_create_time_slots.sql"
echo "📝 Please run this SQL in your Supabase SQL Editor:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/nzkcktausubexsfoqloo/sql"
echo "2. Copy and paste the content from: supabase/migrations/20250101000005_create_time_slots.sql"
echo "3. Click 'Run' to execute"
echo ""
echo "Then run the seed data:"
echo "4. Copy and paste the content from: supabase/seed_time_slots.sql"
echo "5. Click 'Run' to execute"
