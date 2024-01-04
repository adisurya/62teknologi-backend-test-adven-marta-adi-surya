/*
  Warnings:

  - A unique constraint covering the columns `[coordinate_id]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coordinate_id` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Business` ADD COLUMN `coordinate_id` BIGINT NOT NULL;

-- CreateTable
CREATE TABLE `Coordinate` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Business_coordinate_id_key` ON `Business`(`coordinate_id`);

-- AddForeignKey
ALTER TABLE `Business` ADD CONSTRAINT `Business_coordinate_id_fkey` FOREIGN KEY (`coordinate_id`) REFERENCES `Coordinate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
