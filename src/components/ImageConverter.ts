"use server"
import sharp from "sharp"

export default async function handleConvertImage(fileList: FileList) {
  if (fileList) {
    try {
      console.log({fileList})
      const formatedImages = Array.from(fileList).map((e) => {
        return sharp(e.name).toFormat("webp").webp({ quality: 80 })
      })
      console.log({ formatedImages })
      return formatedImages
    } catch {
      return []
    }
  }
  return []
}
