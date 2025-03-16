import React from 'react'
import { Container,Row,Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import './live_auction.css'

import CarCard from "../Car_card/CarCard.jsx";
import {  DATA_CARS } from "../../../assets/data/data.js"


function LiveAuction(){
    return(
    <>
    <section>
        <Container>
            <Row>
                <Col lg='12' className='mb-4' >
                <div className="live_auction_top d-flex align-items-center ">
                    <h3>Live Auction</h3>
                        <button className="more_btn">
                            <i class="ri-arrow-up-double-line"></i>
                            <Link to={`/market`} >See More</Link>
                        </button>
                </div>
                </Col>
                

                {
                     DATA_CARS.slice(0,4).map((item)=>(
                        <Col lg='3' md='4' sm='6' className="mb-4" key={item.id}>
                          <CarCard key={item.id} item={item} />
                        </Col>
                    ))
                }
            </Row>
        </Container>
    </section>
    </>);
}

export default LiveAuction