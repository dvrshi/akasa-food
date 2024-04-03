import { db } from "@/lib/db"
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body.session.user.email);
        if (body.session.user.email !== 'admin@gmail.com') {
            throw new Error('Unauthorized');
        }
        const data = await db.items.updateMany({
            data: {
                stockQuantity: 10
            }
        });
        return NextResponse.json({ data });
    }
    catch (error) {
        return NextResponse.json({ error: error.message, status: 500 });
    }
}