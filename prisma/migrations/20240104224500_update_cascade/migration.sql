-- DropForeignKey
ALTER TABLE `Business` DROP FOREIGN KEY `Business_coordinate_id_fkey`;

-- DropForeignKey
ALTER TABLE `Business` DROP FOREIGN KEY `Business_location_id_fkey`;

-- AddForeignKey
ALTER TABLE `Business` ADD CONSTRAINT `Business_coordinate_id_fkey` FOREIGN KEY (`coordinate_id`) REFERENCES `Coordinate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Business` ADD CONSTRAINT `Business_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
