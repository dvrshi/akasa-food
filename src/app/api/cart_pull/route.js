import { db } from "@/lib/db"
import { NextResponse } from "next/server";


export async function POST(req){
    try{
        const body = await req.json();
        const gettingOrder = body.gettingOrder;
        const email = body.email;
        if(!gettingOrder){
            const data = await db.user.findUnique({
                where:{
                    email: email,
                }
            });
            return NextResponse.json({data});
        }
        const data = await db.user.findUnique({
            where:{
                email: email,
            },
            select:{
                orders:true
            }
        });
        return NextResponse.json({data});
    }
    catch(error){
        return NextResponse.json({error: error.message,status: 500});
    }
}