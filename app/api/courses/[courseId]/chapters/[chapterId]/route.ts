import Mux from "@mux/mux-node"
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const tokenId = process.env.MUX_TOKEN_ID;
const tokenSecret = process.env.MUX_TOKEN_Secret;
const {video} = new Mux({tokenId,tokenSecret});

export async function DELETE(req:Request,
    {
        params 
    }:{
        params:{courseId:string; chapterId:string}
    }) {
    try {
        const {courseId,chapterId} = await params;
        const course = await db.course.findUnique({
            where:{
                id:courseId
            }
        });
        if(!course) console.log("Cannot find course");

        const chapter = await db.chapter.findUnique({
            where:{
                id: chapterId,
                courseId: courseId,
            }
        });
        if(!chapter) console.log("cannot find chapter");

        if(chapter?.videoUrl){
            const exixtMuxData = await db.muxData.findFirst({
                where:{
                    chapterId: chapterId,
                }
            })
            if (exixtMuxData){
                await video.assets.delete(exixtMuxData.assetId);
                await db.muxData.delete({
                    where:{
                        id: exixtMuxData.id
                    }
                })
            }
        }
        
        const deleteChapter = await db.chapter.delete({
            where:{
                id:chapterId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where:{
                courseId: courseId,
                isPublished:true,
            }
        });
        if(!publishedChaptersInCourse.length){
            await db.course.update({
                where:{
                    id:courseId
                },
                data:{
                    isPublished:false,
                }
            })
        }
        return  NextResponse.json(deleteChapter);
    } catch (error) {
        if (error instanceof Error){
            console.log("Error: ", error.stack)
        }
        return new NextResponse("Internal server error",{status:500})
    }
}


export async function PATCH(req:Request,
    {
        params 
    }:{
        params:{chapterId:string}
    }
) {
    try {
        const {chapterId} = await params;
        const values = await req.json();
        const chapter = await db.chapter.update({
            where:{
                id:chapterId,
            },
            data:{
                ...values,
            }
        })
        if(values.videoUrl) {
            const exixtMuxData = await db.muxData.findFirst({
                where:{
                    chapterId: chapterId,
                }
            })
            if (exixtMuxData){
                await video.assets.delete(exixtMuxData.assetId);
                await db.muxData.delete({
                    where:{
                        id: exixtMuxData.id
                    }
                })
            }
            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy:["public"],
                test: false,
            });
            await db.muxData.create({
                data:{
                    chapterId: chapterId,
                    assetId: asset.id,
                    playbackId:asset.playback_ids?.[0].id,
                }
            });
        }
        return NextResponse.json({chapter});
    } catch(error) {
        if (error instanceof Error){
            console.log("Error: ", error.stack)
        }
        return new NextResponse("Internal server error",{status:500})
    }
}