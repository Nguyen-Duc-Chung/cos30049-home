import React from "react";
import CommonSection from '../components/section/Common-section/CommonSection';
import { Container, Row, Col } from "reactstrap";
import'../styles/trans-history.css'
import { TRANSACTIONS } from "../assets/data/data";

function TransHistory(){
    const shortenHash = (hash, prefixLength = 5, suffixLength = 5) => {
        if (hash.length <= prefixLength + suffixLength) return hash;
        const prefix = hash.slice(0, prefixLength);
        const suffix = hash.slice(-suffixLength);
        return `${prefix}...${suffix}`;
    }; 
    return(
        <>
        <CommonSection title='Transaction History' />

        <Container className="history__container">
                <div className="history__grid">
                    {TRANSACTIONS.map((transaction, index) => (
                        <div key={index} className="history__note">
                            <div className="history__note-item">
                                <strong>From:</strong> {shortenHash(transaction.buyer)}
                            </div>
                            <div className="history__note-item">
                                <strong>To:</strong> {shortenHash(transaction.seller)}
                            </div>
                            <div className="history__note-item">
                                <strong>Amount:</strong> ${transaction.amount}
                            </div>
                            <div className="history__note-item">
                                <strong>Date:</strong> {transaction.date}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>


        
        </>
    )
}

export default TransHistory