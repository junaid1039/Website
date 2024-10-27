import React from 'react'
import Categorydetails from '../handsbags/Categorydetails';
import hbagsBanner from '../../assets/hbagsBanner.jpg';
import handbags from '../../assets/handbags/handbags';
import perfume from '../../assets/perfume/perfume';
import perfumeBanner from '../../assets/perfumeBanner.jpg';
import './subcategory.css';


const Subcategory = () => {
    return (
        <div className="subcategory">
            <Categorydetails heading='Women Handbags' data={handbags} category='bags'
                oneliner="Indulge in our chic, timeless handbags crafted to elevate your every step."
                banner={hbagsBanner} />

            <Categorydetails heading='Perfumes' data={perfume} category='perfumes'
                oneliner="Sprinkle scent magic everywhere you go"
                banner={perfumeBanner} />
</div>
    )
};

export default Subcategory;
