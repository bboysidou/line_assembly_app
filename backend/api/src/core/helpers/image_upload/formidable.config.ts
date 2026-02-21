import path from "path";
import fs from "fs";
import { promisify } from "util";

export const copyFile = promisify(fs.copyFile);
export const unlink = promisify(fs.unlink);

const UPLOAD_DIR = path.join(`${__dirname}/../../../`, "media");

export async function checkImageDir(
  userId: string,
  subDir: string = "",
): Promise<string> {
  const userDir = path.join(UPLOAD_DIR, `${userId}`, subDir);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
    console.log(`Created directory: ${userDir}`);
  }
  return userDir;
}

export async function deleteImage(imagePath: string): Promise<void> {
  try {
    await unlink(imagePath);
    console.log(`Deleted image: ${imagePath}`);
  } catch (error) {
    console.error(`Error deleting image: ${error}`);
  }
}
