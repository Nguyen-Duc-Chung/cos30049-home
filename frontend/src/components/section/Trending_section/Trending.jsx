
import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import {  DATA_CARS } from '../../../assets/data/data'
import CarCard from '../Car_card/CarCard';
import './trending.css'

function Trending(){
    return(
        <>
        <section>
            <Container>
                <Row>
                    <Col lg='12 ' className='mb-5' >
                        <h3 className="trending_title">Trending</h3>
                    </Col>
                    {
                         DATA_CARS.slice(0,8).map(item=>(
                            <Col lg='3' md='4' sm='6' key={item.id} className='mb-4' >
                              <CarCard item={item} />
                            </Col>
                        ))
                    }
                </Row>
            </Container>
        </section>
        </>
    );
}

export default Trending