import { db } from "@/lib/db"
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const isOrder = body.cartData.placingOrder;
        const email = body.cartData.email;
        // console.log(body.cartData);
        if (!isOrder) {
            const items = body.cartData.items;
            const updatedUser = await db.user.update({
                where: {
                    email: email
                },
                data: {
                    cart: items
                }
            });
            if (!updatedUser) {
                console.log("User not found!");
                return NextResponse.json({ message: "User not found!", status: 404 });
            }
            return NextResponse.json({ message: "Cart Updated!", status: 200 });
        }
        if (isOrder) {
            const items = body.cartData.data.items;
            const id = body.cartData.data.id;
            const order = {
                id: id,
                items: items
            }
            const updatedUser = await db.user.update({
                where: {
                    email: email
                },
                data: {
                    cart: {},
                    orders: {
                        push: order
                    }
                }
            });
            // console.log("Items:", items);
            for (const item of Object.values(items)) {
                await db.items.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        stockQuantity: {
                            decrement: item.quantity
                        }
                    }
                });
            }
            if (!updatedUser) {
                console.log("User not found!");
                return NextResponse.json({ message: "User not found!", status: 404 });
            }
            return NextResponse.json({ message: "Order Placed!", status: 200 });
        }
        // return NextResponse.json({ message: "Order Placed!", status: 200 });
    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({ error: error.message, status: 500 });
    }
}
