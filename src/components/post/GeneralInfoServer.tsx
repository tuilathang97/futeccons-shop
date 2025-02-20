import { getCategories } from "@/lib/queries/categoryQueries";
import GeneralInfoClient from "./GeneralInfo";

const GeneralInfoServer = async () => {
  const categories = await getCategories();
  return(
    <GeneralInfoClient categories={categories}/>
  )
}

export default GeneralInfoServer;