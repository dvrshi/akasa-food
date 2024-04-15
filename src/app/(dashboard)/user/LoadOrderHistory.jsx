'use client';
import React, { useState, useEffect } from 'react';

function LoadOrderHistory({ session }) {
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const getOrderData = {
                    
                    email: session.user.email,
                };
                const response = await fetch('/api/cart_pull', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getOrderData)
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setOrderHistory(jsonData.data.orders);

            }
            catch (error) {
                console.error('Error fetching order history:', error);
            }
        }
        fetchData();
    }, [session.user]);

    return (
        <div>
            <h2 className="font-semibold">Order History</h2>
            {orderHistory.map(order => (
                <div key={order.id} style={{ marginBottom: '20px' }}>
                    <h3 className="text-xl mb-2">Order ID: {order.id}</h3>
                    <table className="table-auto" style={{ width: '100%' }}>
                        <thead>
                            <tr className='bg-black text-white'>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(order.items).map((item, index) => (
                                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-zinc-400' : 'bg-zinc-200'}`}>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">${item.price}</td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                </tr>
                            ))}
                            <tr className='bg-black text-white'>
                                <td className="border px-4 py-2 font-semibold">Total</td>
                                <td className="border px-4 py-2 font-semibold"></td>
                                <td className="border px-4 py-2 font-semibold">${Object.values(order.items).reduce((acc, cur) => acc + (cur.price * cur.quantity), 0).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ marginTop: '10px' }}>
                        <span style={{ color: 'black' }}>Status: </span>
                        <span style={{ color: '#228B22' }}>Out for delivery.</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LoadOrderHistory;