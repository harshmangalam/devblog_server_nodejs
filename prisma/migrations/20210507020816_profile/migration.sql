/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "displayEmailOnProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" DECIMAL(65,30)[];

-- DropTable
DROP TABLE "Profile";
