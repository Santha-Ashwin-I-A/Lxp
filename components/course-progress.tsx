import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "success";
}
const colorByVariant={
    default:"text-sky-700",
    success:"text-emerald-700",
}
const sizeByVariant={
    default:"text-sm",
    success:"text-xs",
}

export const CourseProgress =({
    value,
    variant,
    size,
}:CourseProgressProps) =>{
    // if(size == undefined){
    //  size = "default"
    // }
    return (
        <div>
            <Progress
                className="h-2"
                value={value}
                variant={variant}
            />
            <div className={cn(
                "font-medium mt-2 text-sky-700",
                colorByVariant[variant || "default"],
                sizeByVariant[size || "default"],
            )}>
                {Math.round(value)}% Complete
            </div>
        </div>
    )
}