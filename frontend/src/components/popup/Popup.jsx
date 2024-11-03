import React, { useEffect, useState } from 'react';
import './popup.css'; // Import the CSS for the popup

const Popup = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Effect to show the popup after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 4000); // 4000 milliseconds = 4 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    const closePopup = () => {
        setIsVisible(false);
    };

    return (
        <div>
            {isVisible && (
                <div className="popup-overlay">
                    <div className="popup-content">
                    <div className="cls"><button className="close-button" onClick={closePopup}>&times;</button></div>
                        <div className="other-popup"><h2>Popup Title</h2>
                        <p>This is a simple popup message.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popup;
