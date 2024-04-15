'use client';
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
function LoadCartData({ session }) {
    const router = useRouter();
    const [cartData, setCartData] = useState([]);
    const { toast } = useToast();
    useEffect(() => {
        async function fetchData() {
            try {
                const getCartData = {
                    gettingOrder: false,
                    email: session.user.email,
                };
                const response = await fetch('/api/cart_pull', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getCartData)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const jsonData = await response.json();
                setCartData(jsonData.data.cart);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        }
        fetchData();
    }, [session.user]);

    const calculateTotalPrice = () => {
        return cartData.reduce((total, item) => total + (item.count * item.price), 0);
    };

    const placeOrder = async () => {
        try {
            const orderItems = cartData.reduce((acc, item) => {
                acc[item.id] = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.count
                };
                return acc;
            }, {});

            const response1 = await fetch('/api/store');
            if (response1.ok) {
                const jsonData = await response1.json();
                const cartItems = jsonData.data.reduce((acc, item) => {
                    acc[item.id] = {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.stockQuantity 
                    };
                    return acc;
                }, {});
                // console.log(cartItems['34']);
                // console.log(orderData);

                const OutOfStockItems = Object.keys(orderItems).filter(key => orderItems[key].quantity > cartItems[key].quantity);
                // console.log(OutOfStockItems[0]);
                if (OutOfStockItems.length > 0) {
                    toast({
                        title: "Out of Stock!",
                        description: OutOfStockItems.map(item => cartItems[item].name + "=>" + cartItems[item].quantity).join(", ") + " make the cart quantity less than stock quantity!",
                        variant: "destructive",
                    })
                    return;
                }
                const OrderData =
                {
                    items: orderItems,
                    id: Math.floor(Math.random() * 1000000),
                }
                const finalorderData = {
                    placingOrder: true,
                    email: session.user.email,
                    data: OrderData,
                };
                const response = await fetch('/api/cart_push', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cartData: finalorderData
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to clear order');
                }
                toast({
                    title: "Order Placed!",
                    description: "Your order has been placed successfully!",
                    variant: "default",
                })
                setCartData([]);
                router.refresh();
            }


        } catch (error) {
            console.error('Error placing order:', error);
        }
    };
    const [color,setbgcolor] = useState(true);
    // setbgcolor(!color)
    
    return (
        <div>
            <div className="font-semibold mb-4">Cart Items</div>
            {cartData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className='bg-black text-white'>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartData.map((item, itemIndex) => (
                                <tr key={item.id} className={`${itemIndex % 2 === 0 ? 'bg-zinc-400' : 'bg-zinc-200'}`}>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">{item.count}</td>
                                    <td className="border px-4 py-2">${item.price.toFixed(2)}</td>
                                    <td className="border px-4 py-2">${(item.count * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4">
                        <h3 className="font-semibold">Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-md mt-2" onClick={placeOrder}>Place Order</button>
                        <button className={`bg-${color?'white':'black'}`} onClick={()=>{setbgcolor(!color)}}>Change Color</button>
                    </div>
                </div>
            ) : (
                <div>No items in the cart</div>
            )}
        </div>

    );
}

export default LoadCartData;

