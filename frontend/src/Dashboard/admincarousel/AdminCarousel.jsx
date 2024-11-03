import React, { useEffect, useState, useContext } from 'react';
import './admincarousel.css';
import { Context } from '../../context API/Contextapi';

const AdminCarousel = () => {
    const baseurl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
    const { fetchCarousels } = useContext(Context);
    const [carousels, setCarousels] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [carousellink, setCarousellink] = useState(''); // State for the link input
    const [selectedOption, setSelectedOption] = useState(''); // State for the selected option

    // Fetch carousels on component mount
    useEffect(() => {
        const loadCarousels = async () => {
            const fetchedCarousels = await fetchCarousels();
            setCarousels(fetchedCarousels);
        };
        loadCarousels();
    }, [fetchCarousels]);

    // Handle image upload and carousel entry creation
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageFiles.length === 0) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        imageFiles.forEach((file) => {
            formData.append('image', file);
        });

        setLoading(true);
        try {
            // Upload image to Cloudinary
            const uploadResponse = await fetch(`${baseurl}/uploadcarousel`, {
                method: 'POST',
                headers: {
                    'auth-token': sessionStorage.getItem('auth-token'),
                },
                body: formData,
            });

            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
                const secureUrl = uploadData.data.secure_url;

                // Send secure URL and selected option to backend
                const postResponse = await fetch(`${baseurl}/postcarousel`, {
                    method: 'POST',
                    headers: {
                        'auth-token': sessionStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ carousel: secureUrl, linkto: selectedOption }),
                });

                const postData = await postResponse.json();
                if (postData.success) {
                    setImageFiles([]);
                    setEditId(null);
                    setLoading(false);

                    // Refresh carousel list
                    const fetchedCarousels = await fetchCarousels();
                    setCarousels(fetchedCarousels);
                } else {
                    alert(postData.message);
                    setLoading(false);
                }
            } else {
                alert("Error uploading image:", uploadData.message);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error submitting carousel:', error);
            setLoading(false);
        }
    };

    // Handle deleting a carousel entry
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this carousel entry?')) {
            try {
                const response = await fetch(`${baseurl}/delcarousel`, {
                    method: 'DELETE',
                    headers: {
                        'auth-token': sessionStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });

                const data = await response.json();
                if (data.success) {
                    const fetchedCarousels = await fetchCarousels();
                    setCarousels(fetchedCarousels); // Refresh carousel list
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting carousel:', error);
            }
        }
    };

    return (
        <div className="admin-carousel-container">
            <h1>Admin Carousel Management</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    required
                />
                <select 
                    value={selectedOption} 
                    onChange={(e) => setSelectedOption(e.target.value)} 
                    required
                >
                    <option value="">Select Category</option>
                    <option value="/bags">bags</option>
                    <option value="/belts">belts</option>
                    <option value="/women shoes">Women Shoes</option>
                    <option value="/wallets">wallets</option>
                    <option value="/men shoes">Men Shoes</option>
                    <option value="/horse saddle">Horse saddle</option>
                    <option value="/accessories">accessories</option>
                    <option value="/perfumes">perfumes</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : editId ? 'Update Carousel' : 'Add Carousel'}
                </button>
            </form>

            <h2>Carousel Entries</h2>
            <ul>
                {carousels.map((carousel) => (
                    <li key={carousel._id}>
                        <img src={carousel.carousel} alt={`Carousel ${carousel._id}`} className="carousel-image" />
                        <button onClick={() => handleDelete(carousel._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminCarousel;
