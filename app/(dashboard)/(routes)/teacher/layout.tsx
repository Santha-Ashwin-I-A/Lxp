"use client";
import { isTeacher } from "@/lib/teacher";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const TeacherLayout = ({
    children
}:{
    children:React.ReactNode;
}) => {
    const user = useUser();
    const userId = user.user?.id;
    if(!isTeacher(userId)){
        return redirect("/");
    }
    return <>
        {children}
    </>;
}
 
export default TeacherLayout;