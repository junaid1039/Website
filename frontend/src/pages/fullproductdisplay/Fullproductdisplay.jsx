import React, { useContext } from 'react';
import './fullproductdisplay.css';
import Productdisplay from '../product-display/Productdisplay';
//import Description from '../../components/description/Description';
import Relatedproducts from '../../components/relatedproducts/Relatedproducts';
import { Context } from '../../context API/Contextapi';
import { useParams } from 'react-router-dom';

const Fullproductdisplay = () => {
    const { allproducts } = useContext(Context);

    const { id } = useParams(); // Get product id from the URL params

    // Check if allproducts is loaded before trying to access it
    if (!allproducts || allproducts.length === 0) {
        return <div>Loading...</div>; // You can show a loading indicator or a placeholder
    }

    // Find the product that matches the URL id
    const product = allproducts.find((e) => e.id === Number(id));
    // Handle the case where no product is found
    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
            <Productdisplay product={product} />
            <Relatedproducts />
        </>
    );
};

export default Fullproductdisplay;