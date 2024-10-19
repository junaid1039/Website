import React, { useContext, useEffect, useState } from 'react';
import './pi.css';
import { Context } from '../../../context API/Contextapi';

const Pi = () => {
    const { userinfo } = useContext(Context);
    const [userData, setUserData] = useState(null); // State to hold user data

    useEffect(() => {
        // Fetch user info when the component mounts
        const UserInfo = async () => {
            const data = await userinfo(); 
            setUserData({ name: data.name, email: data.email }); // Update state with fetched user data
        };

        UserInfo();
    }, [userinfo]); // Dependency array, re-run if userinfo changes

    return (
        <div className="pi">
            <div className="pi-left">
                <h3>Name</h3>
                <h3>Email</h3>
                <h3>Phone</h3>
                <h3>Addresses</h3>
            </div>
            <div className="pi-right">
                {userData ? (
                    <>
                        <h3>{userData.name}</h3> {/* Assuming userData has name property */}
                        <h3>{userData.email}</h3> {/* Assuming userData has email property */}
                        <h3>{userData.phone}</h3> {/* Assuming userData has phone property */}
                        <h3>{userData.address}</h3> {/* Assuming userData has address property */}
                    </>
                ) : (
                    <h3>Loading...</h3> // Display loading state while fetching user data
                )}
            </div>
        </div>
    );
};

export default Pi;
