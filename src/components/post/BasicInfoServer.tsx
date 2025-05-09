import path from "path";
import fs from 'fs';
import BasicInfo from "./BasicInfo";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const BasicInfoServer = async () => {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const provinces = JSON.parse(jsonData);
  const session = await auth.api.getSession({
      headers: await headers()
    })
    const currentSection = session?.session
    const user = session?.user
  if(currentSection?.userId === user?.id && currentSection?.token){
    <BasicInfo provinces={provinces} userId={""} />
  }
  return <>No user found</>
}

export default BasicInfoServer;