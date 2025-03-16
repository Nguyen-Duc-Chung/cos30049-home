import React from 'react';
import { Link } from 'react-router-dom';
import './car_card.css';

function CarCard({ item }) {
    const { title, token_id, price, image_path, owner,imgUrl } = item;

    // Construct the image URL
    const imageUrl = image_path 
    ? `http://localhost:8800${image_path}` 
    : `${imgUrl}`; // Ensure correct full URL format


    return (
        <>
            <div className="main_card_car">
                <div className="car_img">
                    <img src={imageUrl} alt="Car" className="w-100" onError={(e) => e.target.src = "/fallback-image.jpg"} />
                </div>

                <div className="car_bried_info">
                    <h5 className="car_title">
                        <Link to={`/cars/${token_id}`} >{title}</Link>
                    </h5>

                    <div className="creator_container d-flex gap-3">
                        <div className="creator_infor w-100 d-flex align-items-center justify-content-between">
                            <div className='w-50'>
                                <h6>Owner</h6>
                                <p>       
                                   {owner && owner !== "0x" 
                                    ? (owner.substring(0, 5) + '...' + owner.substring(owner.length - 4)) 
                                    : "Unknown Owner"}
                                </p>
                               
                                
                            </div>
                            <div className='w-50'>
                                <h6>Price</h6>
                                <p>{price} ETH</p>
                            </div>
                        </div>
                    </div>

                    <div className="cardBtn mt-3 d-flex align-items-center justify-content-between">
                        <button className="buy_btn d-flex align-items-center gap-1">
                            <i className="ri-shopping-bag-line"></i> Buy
                        </button>

                        <button className="detail_btn">
                            <i className="ri-info-i"></i>
                            <Link to={`/cars/${token_id}`} >View Details</Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CarCard;
