import path from "path";
import fs from 'fs';
import BasicInfo from "./BasicInfo";

const BasicInfoServer = async () => {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const provinces = JSON.parse(jsonData);
 return (
  <BasicInfo provinces={provinces} userId={""} />

 )
}

export default BasicInfoServer;