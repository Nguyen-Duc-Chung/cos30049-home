import React, { useState, useEffect }  from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import axios from 'axios';
import '../styles/car_details.css'
import CommonSection from '../components/section/Common-section/CommonSection';
import LiveAuction from '../components/section/Live_auction/LiveAuction';
import { ethers } from "ethers";
import CarContract from "../AssestContract.json"; 

function CarDetails() {

    const [carData, setCarData] = useState({});
    const [dataFetched, setDataFetched] = useState(false);
    const [message, setMessage] = useState("");
    const [currAddress, setCurrAddress] = useState("0x");

    // Get token_id from URL parameters
    const { token_id } = useParams();

    
    // Function to fetch car details from MySQL and blockchain
    async function fetchCarData(token_id) {
        try {
            const response = await axios.get(`http://localhost:8800/cars/${token_id}`);
            console.log(response.data); // Debugging log
    
            if (response.data) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                const contract = new ethers.Contract(CarContract.address, CarContract.abi, signer);
                const isListed = await contract.getListedTokenForId(token_id);
    
                setCarData({
                    price: response.data.price,
                    token_id: response.data.token_id,
                    seller: response.data.seller,
                    owner: response.data.owner,
                    image: `http://localhost:8800${response.data.image_path}`,
                    title: response.data.title,
                    description: response.data.description,
                    category: response.data.category,  
                    car_condition: response.data.car_condition,  
                    created_date: new Date(response.data.created_date).toLocaleDateString("en-US"),  
                    currentlyListed: isListed.currentlyListed,
                });
    
                setCurrAddress(userAddress);
                setDataFetched(true);
            } else {
                console.log("Car not found in MySQL.");
            }
        } catch (error) {
            console.error("Error fetching car data:", error);
            alert("Error fetching car details.");
        }
    }
    

    // Function to buy a car
    async function buyCar(token_id) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CarContract.address, CarContract.abi, signer);
    
            if (!carData.price) {
                alert("Error: Price not available. Please try again.");
                return;
            }
    
            const salePrice = ethers.utils.parseUnits(carData.price.toString(), "ether");
    
            setMessage("Processing transaction... Please wait.");
    
            // Execute sale on blockchain
            let transaction = await contract.executeSale(token_id, { value: salePrice });
            await transaction.wait();
    
            alert("Transaction successful! You now own this car.");
    
            // Fetch updated car data from blockchain
            const newOwner = await signer.getAddress();
            await axios.post("http://localhost:8800/buy-car", {
                token_id,
                new_owner: newOwner,
                price_paid: carData.price,
            });
    
            await fetchCarData(token_id); // ✅ Fetch new data to update state
            setCarData((prevData) => ({ ...prevData, owner: newOwner, currentlyListed: false }));
            setMessage("");
        } catch (e) {
            console.error("Error in buyCar:", e);
            alert("Error: " + e.message);
        }
    }
    
    

    // Function to cancel trade/listing
    async function cancelTrade(token_id) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CarContract.address, CarContract.abi, signer);
    
            if (!carData.currentlyListed) {
                alert("Error: This car is not listed for sale.");
                return;
            }
    
            setMessage("Canceling trade... Please Wait");
    
            let transaction = await contract.cancelTrade(token_id);
            await transaction.wait();
    
            alert("Trade canceled! Car returned to the seller.");
            await fetchCarData(token_id);
    
            setCarData((prevData) => ({ ...prevData, currentlyListed: false }));
            setMessage("");
        } catch (e) {
            console.error("Error in cancelTrade:", e);
            alert("Error: " + e.message);
        }
    }
    

    // Function to list the car for sale
    async function listCarForSale(token_id, price) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CarContract.address, CarContract.abi, signer);
    
            if (!price) {
                alert("Error: Price is not defined.");
                return;
            }
    
            const salePrice = ethers.utils.parseUnits(price.toString(), "ether");
            const listingPrice = await contract.getListPrice();
    
            let transaction = await contract.createListedToken(token_id, salePrice, { value: listingPrice });
            await transaction.wait();
    
            await fetchCarData(token_id);
            setCarData((prevData) => ({ ...prevData, currentlyListed: true }));
    
            alert("Car is now listed for sale!");
        } catch (e) {
            console.error("Error in listCarForSale:", e);
            alert("Error: " + e.message);
        }
    }
    

    // Fetch car details on page load
    useEffect(() => {
        if (!dataFetched && token_id) {
            fetchCarData(token_id);
        }
    
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async () => {
                await fetchCarData(token_id);
                setCurrAddress(await new ethers.providers.Web3Provider(window.ethereum).getSigner().getAddress());
            });
        }
    }, [dataFetched, token_id]);
    


    //------------ MAIN RENDER PART ------------//
    return(
        <>
         <CommonSection title={carData.title} /> {/* Common section at the top */}
         
         <section className="Car_Detail_section" >
            <Container>
                <Row>
                    <Col lg='6' md='6' sm='6' >
                       <img src={carData.image} alt={carData.title} className="w-100 carDetail_img " />
                    </Col>

                    <Col lg='6'  md='6' sm='6' >
                        <div className="carDetail_content">

                            <h2>{carData.title}</h2>

                            <div className="carDetail_spec w-100">
                                <div className="car_info ">Price: <span>{carData.price} ETH</span> </div>
                                <div className="car_info ">Category: <span>{carData.category}</span>  </div>
                                <div className="car_info ">Condition: <span>{carData.car_condition}</span>  </div>
                                <div className="car_info ">Created date: <span>{carData.created_date}</span> </div>
                                <div>Current Owner: <span className="text-sm">{carData.owner}</span></div>
                                <div>Seller: <span className="text-sm">{carData.seller}</span></div>
                            </div>

                            <p className="my-4" >{carData.description}</p> {/* Link to the wallet page */}

                            {/* Conditional rendering of buttons */}
                            <div>
                                {currAddress && carData.owner && currAddress.toLowerCase() === carData.owner.toLowerCase() ? (
                                    carData.currentlyListed ? (
                                        <>
                                            <div className="text-green-500">This car is listed for sale.</div>
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                                                onClick={() => cancelTrade(token_id)}
                                            >
                                                Cancel Trade
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-emerald-700">You are the owner of this car</div>
                                            <button
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm"
                                                onClick={() => listCarForSale(token_id, carData.price)}
                                            >
                                                List Car for Sale
                                            </button>
                                        </>
                                    )
                                ) : (
                                    carData.currentlyListed ? (
                                        <>
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                                onClick={() => buyCar(token_id)}
                                            >
                                                Buy
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-gray-500">This car is not for sale.</div>
                                    )
                                )}
                            </div>



                        </div>
                    </Col>
                </Row>
            </Container>
         </section>

         <LiveAuction />
        </>
    );
}
export default CarDetails