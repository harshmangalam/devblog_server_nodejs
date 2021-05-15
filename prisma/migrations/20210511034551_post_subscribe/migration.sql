/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostsUsersSubscribe` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscribeType" AS ENUM ('ALL', 'TOP_LEVEL', 'POST_AUTHOR');

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "_PostsUsersSubscribe" DROP CONSTRAINT "_PostsUsersSubscribe_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostsUsersSubscribe" DROP CONSTRAINT "_PostsUsersSubscribe_B_fkey";

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "_PostsUsersSubscribe";

-- DropEnum
DROP TYPE "PostCommentsSubscribe";

-- CreateTable
CREATE TABLE "Subscribe" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "SubscribeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CommentsLike" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommentsLike_AB_unique" ON "_CommentsLike"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentsLike_B_index" ON "_CommentsLike"("B");

-- AddForeignKey
ALTER TABLE "Subscribe" ADD FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribe" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentsLike" ADD FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentsLike" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
