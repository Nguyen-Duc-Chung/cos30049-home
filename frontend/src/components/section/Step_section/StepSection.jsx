
import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

import './step_section.css'

const STEP_INFOR =[
    {
        title:'Setup your wallet',
        desc: `Connect your crypto wallet to securely manage your 
               transactions and access the Horsepower platform.`,
        icon: 'ri-wallet-line'
    },
    {
        title:'Create your collection',
        desc: `Organize and showcase your cars effortlessly in a 
               personalized collection on our decentralized platform.`,
        icon: 'ri-layout-line'
    },
    {
        title:'Add your Car images',
        desc: `Upload high-quality images of your car to attract potential
               buyers with stunning visuals  on our decentralized platform.`,
        icon: 'ri-image-line'
    },
    {
        title:'List them for sale',
        desc: `Set your desired price and list your car on the marketplace 
               for a global audience to see and decide to buy.`,
        icon: 'ri-list-check'
    },
]

function StepSection(){
    return(
        <>
        <section>
            <Container>
                <Row>
                    <Col lg='12' className='mb-4'>
                    <h3 className="step_title">
                        Create and sell your Cars
                    </h3>
                    </Col>

                    {
                        STEP_INFOR.map((item,index)=>
                        <Col lg='3' md='4' sm='6' key={index} className='mb-4' >
                            <div className="step_card">
                                <span><i class={item.icon}></i></span>
                                <div className="step_content">
                                    <h5>
                                        <Link to='/wallet' >{item.title}</Link>
                                    </h5>
                                    <p className="mb-2" >{item.desc}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        )
                    }

                </Row>
            </Container>
        </section>
        </>
    );
}

export default StepSection