import React, { useState, useEffect, useContext } from 'react';
import Categorydetails from '../handsbags/Categorydetails';
import { Context } from '../../context API/Contextapi';
import './subcategory.css';

const Subcategory = () => {
    const { fetchCarousels } = useContext(Context);
    const [carousels, setCarousels] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track error state

    const baseurl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

    useEffect(() => {
        const loadCarousels = async () => {
            try {
                const fetchedCarousels = await fetchCarousels();
                const filteredCarousels = fetchedCarousels.filter(slide => slide.subcategory !== null);
                setCarousels(filteredCarousels);
            } catch (error) {
                console.error("Error fetching carousels:", error);
                setError("Failed to load carousels.");
            } finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        };
        loadCarousels();
    }, [fetchCarousels]);

    useEffect(() => {
        const loadCategoryProducts = async (category) => {
            const sanitizedCategory = category.replace(/^\//, "");
            try {
                const response = await fetch(`${baseurl}/subcategorys?category=${sanitizedCategory}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategoryProducts((prevProducts) => ({
                        ...prevProducts,
                        [sanitizedCategory]: data.products || []
                    }));
                } else {
                    console.error('Failed to fetch category products:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching category products:', error);
            }
        };

        if (carousels.length > 0) {
            carousels.forEach((carousel) => {
                if (carousel.subcategory) {
                    loadCategoryProducts(carousel.subcategory);
                }
            });
        }
    }, [carousels, baseurl]);

    if (loading) return <div>Loading carousels...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="subcategory">
            {carousels.length > 0 ? (
                carousels.map((carousel) => (
                    <Categorydetails
                        key={carousel._id}
                        heading={carousel.title || 'No Title'}
                        data={categoryProducts[carousel.subcategory.replace(/^\//, "")] || []} // Pass products for each category
                        category={carousel.subcategory}
                        oneliner={carousel.description || 'No Description'}
                        banner={carousel.carousel}
                    />
                ))
            ) : (
                <div className="no-subcategory-carousel">No subcategory carousels available.</div>
            )}
        </div>
    );
};

export default Subcategory;
