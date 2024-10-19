import React, { createContext, useState, useEffect } from 'react';
import allproducts from '../assets/allproducts/allproducts';
export const Context = createContext(null);

const getdefaultcart = () => {
    let cart = {};
    for (let i = 0; i <= 100; i++) {
        cart[i] = 0;
    }
    return cart;
};

const ContextProvider = (props) => {
    const [cartItems, setcartItems] = useState(getdefaultcart());
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [shippingInfo, setShippingInfo] = useState(null);
    //const [pm, setpm] = useState(null);

    const gettotalcartitems = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + (quantity > 0 ? quantity : 0), 0);
    };

    const getTotalCartAmount = () => {
        let totalamount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = allproducts.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalamount += itemInfo.newprice * cartItems[item];
                }
            }
        }
        return totalamount.toFixed(2);
    };


    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/getcart', {
                method: 'POST',
                headers: {
                    'auth-token': `${sessionStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => setcartItems(data));
        }
    }, []);

    const addToCart = (itemid) => {
        setcartItems((prev) => ({ ...prev, [itemid]: prev[itemid] + 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${sessionStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemid }),
            });
        }
    };

    const removeFromCart = (itemId) => {
        setcartItems((prev) => ({ ...prev, [itemId]: Math.max(prev[itemId] - 1, 0) })); // Ensure quantity doesn't go below 0
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${sessionStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemId }),
            });
        }
    };

    const userinfo = () => {
        const userId = sessionStorage.getItem('userId');
        if (sessionStorage.getItem('auth-token') && userId) {
            return fetch(`http://localhost:5000/userdetails/${userId}`, {
                method: 'GET',
                headers: {
                    'auth-token': `${sessionStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        return data.user; // Return user data if the response is successful
                    } else {
                        return null; // Return null if user data is not retrieved
                    }
                })
                .catch(() => {
                    return null; // Return null if an error occurs
                });
        } else {
            return Promise.resolve(null); // Return a resolved promise with null if token or ID is missing
        }
    };

    const myorders = () => {
        const userId = sessionStorage.getItem('userId');

        return fetch(`http://localhost:5000/myorders/${userId}`, {
            method: 'GET',
            headers: {
                'auth-token': sessionStorage.getItem('auth-token'),
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    return []; 
                }
                throw new Error(`Error fetching orders: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success && Array.isArray(data.orders)) {
                return data.orders; // Return the orders if the response is successful
            } else {
                throw new Error('Expected data to contain an orders array');
            }
        })
        .catch(() => {
            return []; // Return an empty array in case of error
        });
    };

    const login = async (formData, navigate) => { // Accept formData as a parameter
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Use the passed formData
            });
            
            const responsedata = await response.json();
            
            if (responsedata.success) {
                setisLoggedIn(true); 
                sessionStorage.setItem('auth-token', responsedata.token);
                sessionStorage.setItem('userId', responsedata.userId);
    
                navigate('/');  // Redirect to the home page after login
            } else {
                alert(responsedata.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };
    

    //signup
    const signup = async (formData , navigate) => {
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const responsedata = await response.json();
            
            if (responsedata.success) {
                setisLoggedIn(true);
                sessionStorage.setItem('auth-token', responsedata.token);
                navigate('/');  // Redirect to the home page after signup
            } else {
                alert(responsedata.err);
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred while signing up. Please try again.");
        }
    };

    const handleLogout = (navigate) => {
        sessionStorage.removeItem("auth-token");
        setisLoggedIn(false);
        navigate("/account");  // Redirect to the account/login page after logout
    };

    //shiping info
    const handleShippingSubmit = (info) => {
        setShippingInfo(info); // Save shipping info in context
       // navigate('/payment'); // Navigate to payment page after shipping info is submitted
    };

    //handle paymentsubmit
    const handlePaymentSubmit = (navigate, setError, paymentMethod) => {
    // setpm(paymentMethod); // Assuming setpm is a state updater for the payment method
        console.log(shippingInfo);
    
        // Check if payment method and shipping info are provided
        if (!paymentMethod) {
            setError('Please select a payment method to proceed.');
            return;
        }
        if (!shippingInfo) {
            setError('Shipping info is required.');
            return;
        }
    
        setError(''); // Clear previous errors
    
        // Create order data
        const orderData = {
            user: sessionStorage.getItem('userId'), // Assuming you have the user's ID
            orderItems: Object.keys(cartItems).map(itemId => {
                const quantity = cartItems[itemId];
                const productInfo = allproducts.find(product => product.id === Number(itemId));
                return {
                    product: productInfo ? productInfo._id : null, // Assuming `_id` is the product ID in the database
                    name: productInfo ? productInfo.name : '', // Ensure product details are included
                    quantity,
                    price: productInfo ? productInfo.newprice : 0,
                    image: productInfo ? productInfo.image : ''
                };
            }).filter(item => item.product !== null && item.quantity > 0), // Exclude products that are not found or have zero quantity
            shippingInfo: shippingInfo, // Ensure you have the shipping information ready
            paymentInfo: {
                method: paymentMethod, // Use the correct variable for payment method
                id: '123', // Assuming you'll set this when payment is confirmed
                status: 'COD', // Initial status can be set as pending
                paidAt: Date.now() 
            },
            orderStatus: 'Processing', // Default status of the order
            totalPrice: getTotalCartAmount(), // Calculate the total price
            shippingPrice: 0, // Set shipping price if applicable
            dateOrdered: Date.now() // Automatically set the order creation date
        };
    
        // Send order data to the server
        fetch('http://localhost:5000/confirmorder', {
            method: 'POST',
            headers: {
                'auth-token': sessionStorage.getItem('auth-token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order confirmed successfully!');
                navigate('/ordersuccess');
            } else {
                console.log("Failed to confirm order", data.message || data); // Log the error message from server
            }
        })
        .catch(error => {
            console.error("Error while confirming the order:", error); // Log the error for debugging
            alert('Error while confirming the order.');
        });
    };
    


    // context values to export .
    const contextvalues = { allproducts,isLoggedIn,handlePaymentSubmit, handleShippingSubmit , cartItems,login,signup, handleLogout, userinfo, myorders, addToCart, removeFromCart, getTotalCartAmount, gettotalcartitems, getdefaultcart };
    
    return (
        <Context.Provider value={contextvalues}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
