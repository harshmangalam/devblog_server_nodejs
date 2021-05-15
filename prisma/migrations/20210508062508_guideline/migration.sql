/*
  Warnings:

  - You are about to drop the column `instruction` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "instruction",
ADD COLUMN     "submissionGuideline" TEXT;
