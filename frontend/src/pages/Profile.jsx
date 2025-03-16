import React, { useState, useEffect } from 'react';
import CommonSection from '../components/section/Common-section/CommonSection';
import '../styles/profile.css';
import { Container, Row, Col } from 'reactstrap';
import CarContract from "../AssestContract.json";
import { ethers } from "ethers";
import axios from 'axios';
import { Link } from 'react-router-dom';
import blockies from 'ethereum-blockies';  // Added for wallet avatar generation

function Profile() {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");
    const [avatar, setAvatar] = useState(null);  // Added state for avatar

    async function getCarData() {
        try {
            let sumPrice = 0;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
    
            if (accounts.length > 0) {
                const addr = accounts[0];
                updateAddress(addr);
    
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CarContract.address, CarContract.abi, signer);
    
                // Fetch user's assets from blockchain
                let transaction = await contract.fetchUserAssest();
    
                const items = await Promise.all(
                    transaction.map(async (i) => {
                        // console.log("Contract Response:", i);
    
                        try {
                            const tokenId = i.tokenId ? i.tokenId.toNumber() : i[0].toNumber();
                            const priceBigNumber = i.price || i[3];
                            const priceInEther = ethers.utils.formatUnits(priceBigNumber, "ether");
    
                            // Fetch metadata from MySQL
                            const response = await axios.get(`http://localhost:8800/cars/${tokenId}`);
                            const meta = response.data;
    
                            // console.log("Backend Response:", meta);
    
                            sumPrice += parseFloat(priceInEther);
    
                            return {
                                price: priceInEther,
                                tokenId,
                                seller: i.seller || i[1],
                                owner: i.owner || i[2],
                                imagePath: meta.image_path,  // MySQL image URL
                                name: meta.title,        // MySQL name
                                description: meta.description,  // MySQL description
                            };
                        } catch (err) {
                            console.error("Error fetching data for a token:", err);
                            return null;
                        }
                    })
                );
    
                updateData(items.filter(item => item !== null));
                updateFetched(true);
                updateTotalPrice(sumPrice.toFixed(2));
            } else {
                console.log("No wallet connected.");
            }
        } catch (error) {
            console.error("Error fetching Car data:", error);
        }
    }    

    // Function to generate Ethereum blockies avatar
    function generateAvatar(address) {
        if (!address || address === "0x") {
            setAvatar(null); // Clear avatar if no address is connected
            return;
        }
        const imgSrc = blockies.create({ seed: address.toLowerCase(), size: 8, scale: 4 }).toDataURL();
        setAvatar(imgSrc);
    }
  

    useEffect(() => {
        async function initializeProfile() {
            if (!window.ethereum) {
                console.log("MetaMask is not installed.");
                return;
            }
    
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const addr = accounts[0];
                updateAddress(addr);
                generateAvatar(addr); // ✅ Generate avatar when Profile.jsx loads
            }
    
            if (!dataFetched) {
                getCarData();
            }
        }
    
        initializeProfile();
    
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts) => {
                if (accounts.length > 0) {
                    updateAddress(accounts[0]);
                    updateFetched(false);
                    await getCarData();
                    generateAvatar(accounts[0]); // ✅ Generate avatar on account switch
                } else {
                    updateData([]);
                    updateTotalPrice("0");
                    setAvatar(null);
                }
            });
        }
    
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, [dataFetched]);
    

    return (
        <>
            <CommonSection title={"Profile"} />

            <section className="profile-section">
                <Container>
                    <Row>
                        <Col lg="12">
                            <div className="profile-header">
                                <div className="profile-info">
                                    <div className="profile-avatar">
                                        <img src={avatar || "/fallback-avatar.png"} alt="User Avatar" />
                                    </div>
                                    <div className="profile-user">
                                        <h2>{address}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="profile_container">
                                <div className="profile-user-info">
                                    <h3 className="my-Assets">My Assets <span>{data.length}</span></h3>
                                    <h3 className='totalValue'>Total Value: {totalPrice} ETH</h3>
                                </div>

                                <Row> 
                                    {data.length > 0 ? (
                                      data.map((item) => {
                                          const { title, tokenId, price, imagePath, owner, imgUrl } = item;

                                          // Ensure that imagePath or imgUrl has a valid fallback
                                          const imageUrl = imagePath ? `http://localhost:8800${imagePath}` : imgUrl || "/fallback-image.jpg"; 

                                          return (
                                              <Col lg="3" md="4" sm="6" className="mb-4" key={tokenId}>
                                                  <div className="main_card_car">
                                                      <div className="car_img">
                                                          <img
                                                              src={imageUrl}
                                                              alt="Car"
                                                              className="w-100"
                                                              onError={(e) => e.target.src = "/fallback-image.jpg"}
                                                          />
                                                      </div>

                                                      <div className="car_bried_info">
                                                          <h5 className="car_title">
                                                              <Link to={`/cars/${tokenId}`}>{title}</Link>
                                                          </h5>

                                                          <div className="creator_container d-flex gap-3">
                                                              <div className="creator_infor w-100 d-flex align-items-center justify-content-between">
                                                                  <div className="w-50">
                                                                      <h6>Owner</h6>
                                                                      <p>
                                                                          {owner && owner !== "0x"
                                                                              ? owner.substring(0, 5) + '...' + owner.substring(owner.length - 4)
                                                                              : "Unknown Owner"}
                                                                      </p>
                                                                  </div>
                                                                  <div className="w-50">
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
                                                                  <Link to={`/cars/${tokenId}`}>View Details</Link>
                                                              </button>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </Col>
                                          );
                                      })
                                  ) : (
                                      <Col lg="12">
                                          <p className="text-white text-center">No Assets Available</p>
                                      </Col>
                                  )}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}

export default Profile;
