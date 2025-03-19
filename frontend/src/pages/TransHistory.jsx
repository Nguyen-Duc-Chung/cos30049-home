import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/section/Common-section/CommonSection";
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import axios from "axios";
import "../styles/trans-history.css";
import { ethers } from "ethers";

function TransHistory() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [address, setAddress] = useState("");

    // Fetch transaction data from the backend based on the wallet address
    async function getTransactionData() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.length > 0) {
                const addr = accounts[0];
                setAddress(addr);

                // Fetch transaction history from backend based on the wallet address
                const response = await axios.get(`http://localhost:8800/transactions?wallet_address=${addr}`);
                const fetchedTransactions = response.data;

                const items = fetchedTransactions.map((transaction) => {
                    return {
                        price: transaction.price,
                        tokenId: transaction.token_id,
                        buyer: transaction.buyer,
                        seller: transaction.seller,
                        transactionDate: new Date(transaction.transaction_date).toLocaleString(),
                    };
                });

                // Set the filtered transactions initially as all transactions
                setTransactions(items);
                setFilteredTransactions(items);
            } else {
                console.log("No wallet connected.");
            }
        } catch (error) {
            console.error("Error fetching transaction data:", error);
        }
    }

    // Filter transactions based on buyer or seller
    useEffect(() => {
        const filtered = transactions.filter((transaction) => {
            return (
                transaction.buyer.toLowerCase().includes(search.toLowerCase()) || 
                transaction.seller.toLowerCase().includes(search.toLowerCase())
            );
        });

        if (startDate && endDate) {
            const dateFiltered = filtered.filter((transaction) => {
                const transactionDate = new Date(transaction.transactionDate);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
            setFilteredTransactions(dateFiltered);
        } else {
            setFilteredTransactions(filtered);
        }
    }, [transactions, search, startDate, endDate]);

    const handleRemoveFilters = () => {
        setSearch("");
        setStartDate(null);
        setEndDate(null);
    };

    useEffect(() => {
        getTransactionData();

        // Update transactions when account changes
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    const addr = accounts[0];
                    setAddress(addr);
                    await getTransactionData();
                }
            });
        }
    }, []);

    return (
        <>
            <CommonSection title="Transaction History" />
            <Container className="history__container">
                <Row className="filter-section">
                    <Col lg="12" md="12" className="d-flex justify-content-start gap-4 align-items-center">
                        {/* Date Filter */}
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Start Date"
                            className="filter-btn"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="End Date"
                            className="filter-btn"
                        />

                        {/* Remove Filter Button */}
                        <button onClick={handleRemoveFilters} className="remove-filter-btn">Remove Filter</button>
                    </Col>
                </Row>

                {/* Transaction Table */}
                <Row>
                    <Col lg="12" md="12">
                        <div className="history-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Buyer</th>
                                        <th>Seller</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{transaction.buyer}</td>
                                                <td>{transaction.seller}</td>
                                                <td>{transaction.transactionDate}</td>
                                                <td>{transaction.price} ETH</td>
                                                <td>
                                                    <button className="details-btn">Details</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No Transactions Available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>

                    {/* Transaction Details Section */}


                    
                    {/* You can add logic to show more details if needed */}
                </Row>
            </Container>
        </>
    );
}

export default TransHistory;
