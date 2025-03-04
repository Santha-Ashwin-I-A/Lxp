import { IconBadge } from "@/components/icon-badge"
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    numberOfItems: number;
    variant?: "default" | "success";
    label: string;
    icon: LucideIcon;
}

export const InfoCard =({
    variant,
    icon:Icon,
    numberOfItems,
    label
}:InfoCardProps)=>{
    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge
                variant={variant}
                icon={Icon}
            />
            <div>
                <div className="font-medium">
                    {label}
                </div>
                <div className="text-gray-500 text-sm">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </div>
            </div>
        </div>
    )
}