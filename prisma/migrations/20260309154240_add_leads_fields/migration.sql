-- AlterTable
ALTER TABLE `leads` ADD COLUMN `agentId` INTEGER NULL,
    ADD COLUMN `aiSummary` TEXT NULL,
    ADD COLUMN `lastCallRecordUrl` TEXT NULL,
    MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
