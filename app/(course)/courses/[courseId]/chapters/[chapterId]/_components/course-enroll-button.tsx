"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({
    price,
    courseId,
}: CourseEnrollButtonProps) => {
    const [isLoading,setIsLoading] =useState(false);

    const onClick = async()=>{
        try {
            setIsLoading(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/checkout`)

            window.location.assign(response.data.url);
        } catch {
            toast.error("something went wrong");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size= {"sm"}
            className="w-full md:w-auto"
        >
            Enroll for {formatPrice(price)}
        </Button>
    )
}