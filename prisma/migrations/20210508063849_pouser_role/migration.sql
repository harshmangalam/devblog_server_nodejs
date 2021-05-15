-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERTOR', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT E'USER';
