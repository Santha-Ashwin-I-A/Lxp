import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

type tparams= Promise<{
    courseId:string;
}>;

export async function POST(
    req:Request,
    {
        params 
    }:{
        params:tparams
    }) {
    try {
        const { courseId } = await params;  
        const user = await currentUser();
        const userId = user?.id;
        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress){
            return new NextResponse("Unauthorized",{status:401});
        }
        const course = await db.course.findUnique({
            where:{
                id:courseId,
                isPublished:true,
            }
        })

        const purchase = await db.purchase.findUnique({
            where:{
                userId_courseId:{
                    userId:user.id,
                    courseId:courseId,
                }
            }
        });
        if(purchase){
            return new NextResponse("Already purchased",{status:400})
        }
        if(!course){
            return new NextResponse("Not found",{status:404})
        }
        if (!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const newPurchase = await db.purchase.create({
            data:{
                userId:userId,
                courseId:courseId,
             }
        })
        if (newPurchase){
            console.log("New purchase detected")
        }
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity:1,
                price_data:{
                    currency:"USD",
                    product_data:{
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100),
                }
            }
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where:{
                userId:user.id,
            },
            select:{
                stripeCustomerId:true,
            }
        });
        
        if(!stripeCustomer){
            const customer = await stripe.customers.create({
                email:user.emailAddresses[0].emailAddress,
            });
            stripeCustomer = await db.stripeCustomer.create({
                data:{
                    userId:user.id,
                    stripeCustomerId:customer.id,
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode:'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
            metadata:{
                courseId: courseId,
                userId:user.id,
            }
        });
        return NextResponse.json({url:session.url});
    } catch (error) {
        console.log("[COURSE_ID_CheckOUt]",error);
        return new NextResponse("Internal error",{status:500})
    }
}