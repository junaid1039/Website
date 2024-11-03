import React, { useEffect } from 'react';
import Categorys from '../categorys/Categorys';
import Subcategory from '../sub-category/Subcategory';
import Carousel from '../carousel/Carousel';
import Popup from '../popup/Popup.jsx';

const Body = () => {
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);

    // Effect to show the popup after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPopupVisible(true);
        }, 4000); // 4000 milliseconds = 4 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    return (
        <>
            <Carousel />
            <Categorys />
            <Subcategory />
            <Popup isVisible={isPopupVisible} setIsVisible={setIsPopupVisible} />
        </>
    );
};

export default Body;
