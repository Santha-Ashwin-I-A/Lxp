"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname} from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = ()=>{
    const {userId} = useAuth();
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePlayer = pathname?.includes("/courses");

    return (
        <> 
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePlayer ? (
                    <Link href={"/"}>
                        <Button size={"sm"} variant={"ghost"}>
                            <LogOut className="h-4 w-4 mr-2"/>
                            Exit
                        </Button>
                    </Link>
                ): isTeacher(userId) ? (
                    <Link href={"/teacher/courses"}>
                        <Button size={"sm"} variant={"ghost"}>
                            Teacher mode
                        </Button>
                    </Link>
                ) : null}
                <UserButton
                    fallback="/"
                />
            </div>
        </>
    )

}