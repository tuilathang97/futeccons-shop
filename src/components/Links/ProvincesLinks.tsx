import path from 'path';
import fs from 'fs';
import { Province } from 'types';
import ProvincesLinksClient from './ProvincesLinksClient';

const ProvincesLinks = async () => {
  const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const allProvinces: Province[] = JSON.parse(jsonData);
  
  return <ProvincesLinksClient provinces={allProvinces} />;
}

export default ProvincesLinks;