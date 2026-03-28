-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SectionType" ADD VALUE 'pricing_table';
ALTER TYPE "SectionType" ADD VALUE 'steps';
ALTER TYPE "SectionType" ADD VALUE 'stats';
ALTER TYPE "SectionType" ADD VALUE 'logo_bar';
ALTER TYPE "SectionType" ADD VALUE 'gallery';
ALTER TYPE "SectionType" ADD VALUE 'divider';
