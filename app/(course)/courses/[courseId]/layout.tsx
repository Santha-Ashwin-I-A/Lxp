import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CourseSideBar } from "./_components/course-sidebar";
import { auth } from "@clerk/nextjs/server";
import { CourseNavbar } from "./_components/course-navbar";

type tparams= Promise<{
    courseId: string;
}>;


const CourseLayout = async({
    children,
    params
}:{
    children: React.ReactNode,
    params: tparams
}) => {
    const user =auth();
    const userId = (await user).userId;
    if(!userId) return redirect("/")
    const {courseId} = await params;
    const course = await db.course.findUnique({
        where:{
            id: courseId
        },
        include:{
            Chapters:{
                where:{
                    isPublished:true,
                },
                include:{
                    userProgress:{
                        where:{
                            userId
                        }
                    }
                },
                orderBy:{
                    position:"asc"
                }
            }
        }
    });

    if(!course) return redirect("/");

    const progressCount = await getProgress(userId,course.id);

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSideBar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>   
        </div>
    )
}

export default CourseLayout;