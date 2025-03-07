import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type tparams= Promise<{
    courseId: string;
}>;

const CourseIdPage = async({
    params
}: {
    params : tparams
}) => {
    const {courseId} = await params;
    const course = await db.course.findUnique({
        where:{
            id: courseId,
        },
        include:{
            Chapters:{
                where:{
                    isPublished:true,
                },
                orderBy:{
                    position:"asc",
                }
            }
        }
    });
    if(!course){ return redirect("/")};
    

    return redirect(`/courses/${course.id}/chapters/${course.Chapters[0].id}`);
}
 
export default CourseIdPage;