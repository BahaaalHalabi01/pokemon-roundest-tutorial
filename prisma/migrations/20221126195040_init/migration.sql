/*
  Warnings:

  - You are about to drop the column `noVote` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voteYes` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Vote` DROP COLUMN `noVote`,
    DROP COLUMN `voteYes`;
