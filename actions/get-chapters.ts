import { Chapter,Attachment } from "@prisma/client";

import { db } from "@/lib/db";
import { toast } from "react-toastify";


interface getChapterProps  {
    userId: string;
    chapterId: string;
    courseId: string;
};

export const getChapter = async({
    userId,
    chapterId,
    courseId,
}:getChapterProps) =>{
    try {
        const purchase = await db.purchase.findUnique({
        where:{
            userId_courseId:{
                userId,
                courseId,
            }
        }
    });
    const course = await db.course.findUnique({
        where:{
            isPublished:true,
            id:courseId,
        },
        select:{
            price:true
        }
    });
       
    const chapter = await db.chapter.findUnique({
        where:{
            id:chapterId,
            isPublished:true,
        }
    });

    if(!chapter || !course) {
        toast.error("Chapter or course not found");
    }
    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if(purchase) {
        attachments = await db.attachment.findMany({
            where:{
                courseId:courseId,
            }
        });
    }

    if (chapter?.isFree || purchase){
        muxData = await db.muxData.findUnique({
            where:{
                chapterId:chapterId,
            }
        });

        nextChapter = await db.chapter.findFirst({
            where:{
                courseId:courseId,
                isPublished:true,
                position:{
                    gt:chapter?.position,
                }
            },
            orderBy:{
                position:"asc",
            }
        });
    }

    const userProgress = await db.userProgress.findUnique({
        where:{
            userId_chapterId:{
                userId,
                chapterId,
            }
        }
    })
    return {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    };}
    catch(error){
        console.log("[GET_CHAPTER]",error);
        return {
            chapter:null,
            course:null,
            muxData:null,
            attachments:null,
            nextChapter:null,
            userProgress:null,
            purchase:null,
        }
    }  
}