/*
  Warnings:

  - A unique constraint covering the columns `[customDomain]` on the table `pages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "domainVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "pages_customDomain_key" ON "pages"("customDomain");
