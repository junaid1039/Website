import React, { createContext, useState, useEffect } from 'react';
export const Context = createContext(null);

const getdefaultcart = () => {
    let cart = {};
    for (let i = 0; i <= 100; i++) {
        cart[i] = 0;
    }
    return cart;
};

const ContextProvider = (props) => {


    const baseurl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;


    const [cartItems, setCartItems] = useState(getdefaultcart());
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [shippingInfo, setShippingInfo] = useState(null);
    const [allproducts, setAllProducts] = useState([]);
    const [Adminproducts, setAdminproducts] = useState([]);


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
        const fetchCartItems = async () => {
            const token = sessionStorage.getItem('auth-token');
            if (token) {
                try {
                    const response = await fetch(`${baseurl}/getcart`, {
                        method: 'POST',
                        headers: {
                            'auth-token': token,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch cart items');
                    }
                    const data = await response.json();
                    setCartItems(data);
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                    // Optionally set an error state here to inform the user
                }
            }
        };

        fetchCartItems();
    }, [baseurl]);


    const addToCart = async (itemid) => {
        setCartItems((prev) => ({ ...prev, [itemid]: (prev[itemid] || 0) + 1 })); // Ensure default is 0

        const token = sessionStorage.getItem('auth-token');
        if (token) {
            try {
                const response = await fetch(`${baseurl}/addtocart`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'auth-token': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: itemid }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add item to cart');
                }

                const data = await response.json();
                // Optionally handle the response here (e.g., show a success message or update UI)
                console.log('Item added to cart:', data); // Logging for debugging
            } catch (error) {
                console.error('Error adding item to cart:', error);
                // Optionally set an error state to inform the user
            }
        }
    };


    const removeFromCart = async (itemId) => {
        // Update the local state to ensure quantity doesn't go below 0
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0), // Ensure default is 0
        }));

        const token = sessionStorage.getItem('auth-token');
        if (token) {
            try {
                const response = await fetch(`${baseurl}/removefromcart`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'auth-token': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to remove item from cart');
                }

                const data = await response.json();
                // Optionally handle the response here (e.g., show a success message or update UI)
                console.log('Item removed from cart:', data); // Logging for debugging
            } catch (error) {
                console.error('Error removing item from cart:', error);
                // Optionally set an error state to inform the user
            }
        }
    };


    const userinfo = async () => {
        const token = sessionStorage.getItem('auth-token');
        const userId = sessionStorage.getItem('userId');

        if (!token || !userId) {
            return null; // Return null immediately if token or userId is missing
        }

        try {
            const response = await fetch(`${baseurl}/userdetails/${userId}`, {
                method: 'GET',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            // Check if the response indicates success
            return data.success ? data.user : null;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null; // Return null if an error occurs
        }
    };


    const myorders = async () => {
        const userId = sessionStorage.getItem('userId');

        return fetch(`${baseurl}/myorders/${userId}`, {
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
            const response = await fetch(`${baseurl}/login`, {
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
    const signup = async (formData, navigate) => {
        try {
            const response = await fetch(`${baseurl}/signup`, {
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
                    product: productInfo ? productInfo._id : null,
                    name: productInfo ? productInfo.name : '',
                    quantity,
                    price: productInfo ? productInfo.newprice : 0,
                    image: productInfo ? productInfo.images[0] : ''
                };
            }).filter(item => item.product !== null && item.quantity > 0),

            shippingInfo: shippingInfo,

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
        fetch(`${baseurl}/confirmorder`, {
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
                    // alert('Order confirmed successfully!');
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

    useEffect(() => {
        fetchInfo();
    }, []);
    // Fetch all products
    const fetchUserIP = async () => {
        try {
            const response = await fetch('https://ipinfo.io/json');  // Fetch user's IP from external service
            const data = await response.json();
            return data.country;
        } catch (error) {
            console.error('Error fetching IP:', error);
            return null;
        }
    };
    
    const fetchInfo = async () => {
        try {
            // Get the user's IP address
            const countryCode = await fetchUserIP();
            // Construct the API request with IP in query params
            const url = countryCode ? `${baseurl}/allproducts?countryCode=${countryCode}` : `${baseurl}/allproducts`;
    
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setAllProducts(data.products); // Set products state
            return { success: true }; // Explicitly return success
        } catch (error) {
            setAllProducts([]); // Clear products if fetch fails
            return { success: false, error: error.message }; // Return success false with error
        }
    };
    

    //Admin allproducts

    const fnadminproducts = async () => {
        try {
            const response = await fetch(`${baseurl}/adminproducts`, {
                headers: {
                    'auth-token': sessionStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setAdminproducts(data.products || []);
            return { success: true, data};
        } catch (error) {
            console.error("Error fetching products:", error.message); 
            setAdminproducts([]); 
            return { success: false, error: error.message };
        }
    };
    



    // Confirm product removal
    const confirmDelete = async (productToDelete, setShowModal) => {
        try {
            await fetch(`${baseurl}/removeproduct`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': `${sessionStorage.getItem('auth-token')}`,
                },
                body: JSON.stringify({ id: productToDelete })
            });
            fnadminproducts(); // Refresh the product list
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Failed to remove product:', error);
            setShowModal(false);
        }
    };

    //fetch orders

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${baseurl}/allorders`, {
                method: 'GET',
                headers: {
                    'auth-token': `${sessionStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    return data.orders; // Return the fetched orders
                } else {
                    throw new Error('Failed to fetch orders');
                }
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (error) {
            throw new Error('Error fetching orders: ' + error.message);
        }
    };

    ///fetch users
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${baseurl}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${sessionStorage.getItem('auth-token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                return data.users; // Return user data here
            } else {
                console.error('Error fetching users:', data.message);
                return []; // Return an empty array on error
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            return []; // Return an empty array on error
        }
    };
    
     // Fetch all carousel entries
     const fetchCarousels = async () => {
        try {
            const response = await fetch(`${baseurl}/getcarousel`, {
                method: 'GET',
                headers: {
                    'auth-token': sessionStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (data.success) {
                return data.carousels;
            } else {
                console.error('Failed to fetch carousels:', data.message);
            }
        } catch (error) {
            console.error('Error fetching carousels:', error);
        }
    };



    // context values to export .
    const contextvalues = {
        allproducts,
        cartItems,
        Adminproducts,
        isLoggedIn,
        fetchUserIP,
        fetchCarousels,
        fnadminproducts,
        fetchUsers,
        fetchOrders,
        confirmDelete,
        handlePaymentSubmit,
        handleShippingSubmit,
        fetchInfo,
        login, signup,
        handleLogout,
        userinfo, myorders,
        addToCart, removeFromCart,
        getTotalCartAmount, gettotalcartitems,
        getdefaultcart
    };

    return (
        <Context.Provider value={contextvalues}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
