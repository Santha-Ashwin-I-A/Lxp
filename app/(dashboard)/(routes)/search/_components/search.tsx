import { db } from "@/lib/db";
import { Categories } from "./categories";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { CouresList } from "@/components/courses-list";
import { redirect } from "next/navigation";
import {Suspense} from "react";

type SearchPageProps= Promise<{
        title: string;
        categoryId: string;
}>

export const SearchPage = async({
    searchParams
}:{searchParams:SearchPageProps}) => {
    const user = auth();
    const userId = (await user).userId;
    const categories = await db.category.findMany({
        orderBy:{
            name:"asc"
        }
    });
    if(userId == null){
        console.log("No users found")
        return redirect("/")
    }
    const params = await searchParams;
    const courses = await getCourses({
        userId,
        ...params,
    });

    return ( 
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput/>
            </div>
            <div className="p-6 space-y-4">
                <Categories
                    items={categories}
                />
                <CouresList
                    items={courses}
                />
            </div>
        </>
     );
}