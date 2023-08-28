/*
  Warnings:

  - The values [admin,user] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_viewers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_viewers" DROP CONSTRAINT "_viewers_A_fkey";

-- DropForeignKey
ALTER TABLE "_viewers" DROP CONSTRAINT "_viewers_B_fkey";

-- DropTable
DROP TABLE "_viewers";

-- CreateTable
CREATE TABLE "UserViewedPosts" (
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserViewedPosts_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "UserViewedPosts" ADD CONSTRAINT "UserViewedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserViewedPosts" ADD CONSTRAINT "UserViewedPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
