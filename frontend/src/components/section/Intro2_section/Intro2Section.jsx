
import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import "./intro2_section.css"
import buysell from '../../../assets/images/buysell.jpg'


function Intro2Section(){
    return(
        <>
        <section className="intro2_section">
            <Container>
                <Row>
                    <Col lg='6' md='6' >
                        <div className="intro2_content">
                            <h2>
                                 BUY and SELL your car Quickly and Trusted with <span>Hoursepower </span>
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                                Alias molestias quos adipisci, libero cum magnam facilis quam eius, sequi aliquam, 
                            </p>
                            <div className="intro2__btns d-flex align-items-center gap-4 ">

                                <button clasName=" explore_btn d-flex align-items-center gap-2" >
                                    <i className="ri-shopping-cart-line"></i>{" "}
                                    <Link to='/market'>Market</Link>
                                </button>
                                <button clasName=" create_btn d-flex align-items-center gap-2"  >
                                    <i className="ri-ball-pen-line"></i>{" "}
                                    <Link to='/create'>Create</Link>
                                </button>
                            </div>
                        </div>
                    </Col>

                    <Col lg='6' md='6'>
                        <div className=" intro2_img">
                            <img src={buysell} alt="Introduction part 2 Image" className=" . intro2_img w-100" />
                        </div>
                    </Col>

                </Row>
            </Container>
        </section>
        </>
    );
}

export default Intro2Section