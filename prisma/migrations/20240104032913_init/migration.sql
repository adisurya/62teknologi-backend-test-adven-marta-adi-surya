/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `displayPhone` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `isClosed` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Business` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Business` DROP COLUMN `createdAt`,
    DROP COLUMN `displayPhone`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `isClosed`,
    DROP COLUMN `reviewCount`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `display_phone` VARCHAR(191) NULL,
    ADD COLUMN `image_url` VARCHAR(255) NULL,
    ADD COLUMN `is_closed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `review_count` BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
