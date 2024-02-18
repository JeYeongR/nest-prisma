/*
  Warnings:

  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `title` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `title` VARCHAR(30) NOT NULL,
    MODIFY `content` VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(30) NOT NULL,
    MODIFY `name` VARCHAR(10) NULL,
    MODIFY `password` VARCHAR(100) NOT NULL;
