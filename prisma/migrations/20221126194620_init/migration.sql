/*
  Warnings:

  - Added the required column `noVote` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteYes` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Vote` ADD COLUMN `noVote` INTEGER NOT NULL,
    ADD COLUMN `voteYes` INTEGER NOT NULL;
