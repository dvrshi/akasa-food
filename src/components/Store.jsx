'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
function Store({ session }) {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const pict_url = {
        'Fruit': '/fruit.png',
        'Vegetables': '/veggies.png',
        'Non-veg': '/nonveg.png',
        'Veg': '/veg.png',
        'Drinks': '/drinks.png',
        'Dairy': '/dairy.png'
    };

    const { toast } = useToast();
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/store');
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData.data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    useEffect(() => {
        if (data) {
            if (selectedCategories.length === 0) {
                setFilteredData(data);
            } else {
                const filtered = data.filter((item) =>
                    selectedCategories.includes(item.category)
                );
                setFilteredData(filtered);
            }
        }
    }, [selectedCategories, data]);

    const handleIncrement = (id) => {
        setFilteredData(filteredData.map(item => {
            if (item.id === id) {
                return { ...item, count: (item.count || 0) + 1 };
            }
            return item;
        }));
    };

    const handleDecrement = (id) => {
        setFilteredData(filteredData.map(item => {
            if (item.id === id) {
                return { ...item, count: Math.max(0, (item.count || 0) - 1) };
            }
            return item;
        }));
    };

    const handleAddToCart = async () => {
        if (!session?.user) {
            toast({
                title: "Not Signed in!",
                description: "Please Log in to add items to cart!",
                variant: "destructive",
            })
            return;
        }
        const OutofStockItems = filteredData.filter(item => item.count > item.stockQuantity);
        if (OutofStockItems.length > 0) {
            toast({
                title: "Out of Stock!",
                description: OutofStockItems.map(item => item.name + " Count: " + item.stockQuantity).join(", ") + " are less than/out of stock!",
                variant: "destructive",
            })
            return;
        }

        const nonZeroItems = filteredData.filter(item => item.count > 0);
        const cartData = {
            placingOrder: false,
            items: nonZeroItems,
            email: session?.user?.email
        };

        // console.log(nonZeroItems);
        // console.log(cartData);
        const response = await fetch('/api/cart_push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartData
            })
        });
        toast({
            title: "Cart Saved!",
            description: "Items added to cart!",
            variant: "default",
        })
        // console.log(response);
    };
    return (
        <div className=''>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="bg-orange-600 py-2 px-4 rounded-md text-white" onClick={handleAddToCart}>Add to Cart</button>
            </div>
            <div className='w-full flex flex-col items-center' id='store div'>
                <div>Filter by Category:</div>
                <div className="w-full flex justify-center">
                    {Object.keys(pict_url).map((category) => (
                        <div style={{ marginRight: '20px' }} key={category}>
                            <input
                                type='checkbox'
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <label key={category} style={{ paddingLeft: '5px' }}>
                                {category}
                            </label>

                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))',
                gap: '50px',
                gridAutoFlow: 'dense',
            }}>
                {filteredData && filteredData.map((item) => (
                    <div key={item.id} className="border border-gray-300 p-4 text-center">
                        <h2>{item.name}</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src={pict_url[item.category]} alt={item.name} width={100} height={100} />
                        </div>
                        <div>{item.price}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button onClick={() => handleDecrement(item.id)} aria-label="Decrement">&nbsp;-&nbsp;</button>
                            <span className="mx-2">{item.count || 0}</span>
                            <button onClick={() => handleIncrement(item.id)} aria-label="Increment">&nbsp;+&nbsp;</button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}

export default Store;
