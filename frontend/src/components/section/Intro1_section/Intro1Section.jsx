import React, { useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import "./intro1_section.css"
import introImg1 from '../../../assets/images/intro/intro-01.jpg'
import introImg2 from '../../../assets/images/intro/intro-02.jpg'
import introImg3 from '../../../assets/images/intro/intro-03.jpg'
import introImg4 from '../../../assets/images/intro/intro-04.jpg'


function IntroSection(){

    useEffect(() => {
        let nextBtn = document.querySelector('.next');
        let prevBtn = document.querySelector('.prev');
        let slider = document.querySelector('.slider');
        let sliderList = slider.querySelector('.slider .list');
        let thumbnail = document.querySelector('.slider .thumbnail');
        let thumbnailItems = thumbnail.querySelectorAll('.item');

        // Append first thumbnail to the end
        thumbnail.appendChild(thumbnailItems[0]);

        // Function for next button
        nextBtn.onclick = function () {
            moveSlider('next');
        };

        // Function for prev button
        prevBtn.onclick = function () {
            moveSlider('prev');
        };

        // Function to handle slider movement
        function moveSlider(direction) {
            let sliderItems = sliderList.querySelectorAll('.item');
            let thumbnailItems = document.querySelectorAll('.thumbnail .item');

            if (direction === 'next') {
                sliderList.appendChild(sliderItems[0]);
                thumbnail.appendChild(thumbnailItems[0]);
                slider.classList.add('next');
            } else {
                sliderList.prepend(sliderItems[sliderItems.length - 1]);
                thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
                slider.classList.add('prev');
            }

            slider.addEventListener('animationend', function () {
                if (direction === 'next') {
                    slider.classList.remove('next');
                } else {
                    slider.classList.remove('prev');
                }
            }, { once: true }); // Remove the event listener after it's triggered once
        }
    }, []); // The effect will run only once after the component mounts

    return(
    <>
        <section className="intro__section">
            <Container className="slider">
                <Row>
                    <Col lg='12' md='12'>

                        <div className="list">
                                <div className="item">
                                    <img src={introImg1} alt="" />
                                    <div className="content">
                                        <div className="title">Horsepower</div>
                                        <div className="description">
                                            Revolutionizing car transactions with blockchain – secure, transparent, 
                                            and zero extra fees.
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <img src={introImg2} alt="" />
                                    <div className="content">
                                        <div className="title">AutoBlock</div>
                                        <div className="description">
                                            Decentralized car trading made simple, fast, and reliable.
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <img src={introImg3} alt="" />
                                    <div className="content">
                                        <div className="title"> CarVault </div>
                                        <div className="description">
                                            The future of car deals – transparent, secure, and fee-free.
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <img src={introImg4} alt="" />
                                    <div className="content">
                                        <div className="title"> Torque </div>
                                        <div className="description">
                                            Empowering car buyers and sellers with Web3 technology.
                                        </div>
                                    </div>
                                </div>
                        </div>

                        <div className="thumbnail">

                            <div className="item">
                                <img src={introImg1} alt="" />
                            </div>
                            <div className="item">
                                <img src={introImg2} alt="" />
                            </div>
                            <div className="item">
                                <img src={introImg3} alt="" />
                            </div>
                            <div className="item">
                                <img src={introImg4} alt="" />
                            </div>
                        </div>

                        <div className="nextPrevArrows">
                            <button className="prev"> &#8592; </button>
                            <button className="next"> &#8594; </button>
                        </div>


                    </Col>
                </Row>
            </Container>
        </section>
    </>);
}

export default IntroSection