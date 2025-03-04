"use client";
import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import {  Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";
import { Chapter,MuxData } from "@prisma/client";
import "@uploadthing/react/styles.css";


import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface ChapterVideoProps {
    initialData:Chapter & { muxData?: MuxData | null};
    courseId : string;
    chapterId : string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1)
})
if(!formSchema){} 

export const ChapterVideo = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoProps ) => {
    const [isEditting,setIsEditting] = useState(false);

    const toggleEdit = () =>setIsEditting((current) =>!current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/chapters/${chapterId}`,values);
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditting && (
                        <>Cancel</>
                    )}
                    {!isEditting && !initialData.videoUrl &&(
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add an video
                        </>
                    )}
                    {!isEditting && initialData.videoUrl &&(
                        <>
                            <Pencil  className="h-4 w-4 mr-2"/>
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                      <MuxPlayer
                        playbackId={initialData?.muxData?.playbackId || ""}
                        
                      />
                    </div>
                )
            )}
            {
                isEditting && (
                    <div>
                        <FileUpload
                            endpoint="chapterVideo"
                            onChange={(url)=>{
                                if(url){
                                    onSubmit({videoUrl:url});
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Upload this chapter&apos;s video
                        </div>
                    </div>
                )}
                {initialData.videoUrl && !isEditting && (
                    <div className="text-xs text-muted-foreground mt-2">
                        Videos can take a few minutes to process. Refresh the page if video does not appear.
                    </div>
                )}
        </div>
    )
}