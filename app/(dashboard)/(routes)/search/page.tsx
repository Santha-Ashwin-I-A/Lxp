import {Suspense} from "react";
import { SearchPage } from "./_components/search";

type SearchPageProps= Promise<{
        title: string;
        categoryId: string;
}>

const Spage = ({
    searchParams
}:{searchParams:SearchPageProps})=>{
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchPage searchParams={searchParams} />
        </Suspense>
      )
}
 
export default Spage;