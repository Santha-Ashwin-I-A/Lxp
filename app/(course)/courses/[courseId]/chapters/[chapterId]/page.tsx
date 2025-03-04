import { getChapter } from "@/actions/get-chapters";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import Link from "next/link";
import { CourseProgressButton } from "./_components/ccourse-progress-button";
import { SGA } from "./_components/sga";

type tparams= Promise<{
    courseId: string;
    chapterId: string;
}>;

const ChapterIdPage = async({params}:{
    params:tparams
}) =>{
    const {courseId,chapterId} = await params;
    const user = auth();
    const userId = (await user).userId;
    if(!userId ) return redirect("/");

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } =await getChapter({
        userId,
        chapterId:chapterId,
        courseId:courseId,
    });

    if(!course || !chapter) return redirect("/");

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted; 


    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant={"success"}
                    label="You already completed this coures"
                />
            )}
            {isLocked && (
                <Banner
                    variant={"warning"}
                    label="You need to purchase this coures to watch this chapter."
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={chapterId}
                        title ={chapter.title}
                        courseId={courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId = {muxData?.playbackId}
                        isLocked = {isLocked}
                        completeOnEnd ={completeOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <div className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </div>
                        {purchase ? (
                            <CourseProgressButton
                                chapterId={chapterId}
                                courseId={courseId}
                                nextChapterId={nextChapter?.id}
                                isCompleted={!!userProgress?.isCompleted}
                            />
                        ):(
                            <CourseEnrollButton
                                courseId={courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator/>
                    <div>
                        <Preview value={chapter.description!}/>
                    </div>
                    <SGA
                        isCompleted={!!userProgress?.isCompleted}
                    />
                    {!!attachments.length &&(
                        <>
                            <Separator/>
                            <div p-4>
                                {attachments.map((attachment) => (
                                    <Link 
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                    >
                                        <File/>
                                        <div className="line-clamp-1">
                                            {attachment.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage;