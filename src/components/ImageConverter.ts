"use server"
import sharp from "sharp"

 export default async function handleConvertImage(fileList: FileList) {
    if (fileList) {
      try{
        const formatedImages = Array.from(fileList).map((e) => {
          sharp(e.name).toFormat("webp").webp({ quality: 80 })
        })
        console.log("convert success" + formatedImages)
        return formatedImages
      }catch{
        return []
      }
    }
    return []
  }
