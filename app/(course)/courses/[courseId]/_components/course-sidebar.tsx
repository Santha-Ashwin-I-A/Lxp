
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";

interface CourseSideBarProps {
    course: Course & {
        Chapters:  (Chapter & {
            userProgress: UserProgress[] | null;
        })[]
    };
    progressCount: number;
}

export const CourseSideBar = async({
    course,
    progressCount,
}:CourseSideBarProps) => {
    const  user= auth();
    const userId =(await user).userId;
    if(!userId){
        return redirect("/")
    }
    const purchases = await db.purchase.findUnique({
        where:{
            userId_courseId:{
                userId,
                courseId: course.id,
            }
        }
    });

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <div className="font-semibold">
                    {course.title}
                </div>
                {purchases && (
                    <div className="mt-10">
                        <CourseProgress
                            variant="success"
                            value ={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.Chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchases}
                    />
                ))}
            </div>
        </div>
    )
}