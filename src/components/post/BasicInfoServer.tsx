import path from "path";
import fs from 'fs';
import BasicInfo from "./BasicInfo";
import { getCurrentSession } from "@/lib/auth";

const BasicInfoServer = async () => {
  const {user} = await getCurrentSession()
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const provinces = JSON.parse(jsonData);
  return(
    user ? <BasicInfo provinces={provinces} userId={user.id} /> : null 
  )
}

export default BasicInfoServer;