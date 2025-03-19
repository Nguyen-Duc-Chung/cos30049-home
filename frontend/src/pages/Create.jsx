import React, { useState, useEffect } from "react";
import CommonSection from '../components/section/Common-section/CommonSection';
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; // ✏️ Added axios for API requests
import '../styles/create_item.css'
import CarCard from '../components/section/Car_card/CarCard';
import img from '../assets/images/img-02.jpg'
import avatar from '../assets/images/ava-01.png'
import Select from "react-select"; 

// MODIFY - Interact with Blockchain
import AssestContract from "../AssestContract.json";
import { ethers } from "ethers";

// Sample item preview
const item = { id: "04", title: "Porsche 911", imgUrl: img, creator: "0x49c...EfE5", creatorImg: avatar ,
               price: 7.89 }


function Create() {
    
    //------------ FETCHING DATA PART ------------//
    const [car, setCar] = useState({
        title: "", 
        price: "", 
        category: "", 
        car_condition: "", 
        created_date: "", 
        image_path: "", 
        description: ""
    })
    const [file, setFile] = useState(null);  // ✏️ State to hold the file
    const [message, updateMessage] = useState("");
    const navigate = useNavigate();

    //------------ FORM HANDLERS ------------//
    // ✏️ Handle text input changes
    const handleChange = (e) => {
        setCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ✏️ Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Store the selected file
    };


    // MODIFY - Interact with Blockchain
    // Function to list a Car for sale on the marketplace
    const listCar = async (e) => {
        e.preventDefault();

        // ✏️ Validate that the user has uploaded an image
        if (!file) {
            alert("Please upload an image before listing the Car.");
            return;
        }

        // ✏️ Validate price range
        if (car.price < 0.1 || car.price > 100) {
            alert("Price must be between 0.1 and 100 ETH.");
            return; // Stop form submission
        }

        try {
             // 1️⃣ Initialize Ethereum Provider & Contract
             const provider = new ethers.providers.Web3Provider(window.ethereum);
             const signer = provider.getSigner();
             const contract = new ethers.Contract( AssestContract.address, 
                                                   AssestContract.abi, signer );

            updateMessage("Minting Car on blockchain... Please wait.");

            // Convert price to ether
            const priceInEther = ethers.utils.parseUnits(car.price.toString(), "ether");
            const listingPrice = await contract.getListPrice(); // Don't convert it to string!

            console.log("Price in Ether:", priceInEther.toString());

            // 2️⃣ Mint Car on Blockchain
            const transaction = await contract.createToken(priceInEther, {
                value: listingPrice.toString() // Convert BigNumber to string explicitly
            });

            await transaction.wait();

            // 3️⃣ Retrieve `tokenId` after minting
            const generatedTokenId = await contract.getCurrentToken();

            updateMessage("Storing Car data in MySQL...");

            // 4️⃣ Upload Car Data to MySQL
            const formData = new FormData();
            formData.append("title", car.title);
            formData.append("price", car.price);
            formData.append("category", car.category);
            formData.append("car_condition", car.car_condition);
            formData.append("created_date", car.created_date);
            formData.append("image_path", file);
            formData.append("description", car.description);
            formData.append("token_id", generatedTokenId); // Store tokenId from blockchain
            formData.append("owner", await signer.getAddress());
            formData.append("seller", await signer.getAddress());

            try {
                const response = await axios.post("http://localhost:8800/cars", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            
                console.log("Server Response:", response); // Debugging log
            
                if (response && response.data && response.data.success) {
                    alert("Car successfully listed!");
                } else {
                    alert("Error storing Car in MySQL. Response: " + JSON.stringify(response.data));
                }
            } catch (error) {
                console.error("❌ Error sending data:", error);
                alert("❌ Failed to list Car: " + (error.response?.data?.message || error.message));
            }
            

            // 5️⃣ Reset State & Redirect
            updateMessage("");
            setCar({
                title: "", 
                price: "", 
                category: "", 
                car_condition: "", 
                created_date: "", 
                image_path: "", 
                description: ""
            });
            setFile(null);
            navigate("/market");


        } catch (err) {
            console.error("Error listing Car:", err);
            alert("Error: " + err.message);

        }
    };


    //------------ CATEGORY OPTIONS ------------//
    // ✏️ Handle CATEGORY select
    const [selectedOption, setSelectedOption] = useState(null);
    const handleCategoryChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setCar((prev) => ({ ...prev, category: selectedOption.value })); // Update category in state
    };
    const categoryOptions = [
        { value: "SUV", label: "SUV" },
        { value: "Crossover", label: "Crossover" },
        { value: "Sedan", label: "Sedan" },
        { value: "Pickup Truck", label: "Pickup Truck" },
        { value: "Hatchback", label: "Hatchback" },
        { value: "Convertible", label: "Convertible" },
        { value: "Luxury", label: "Luxury" },
        { value: "Coupe", label: "Coupe" },
        { value: "Hybrid/Electric", label: "Hybrid/Electric" },
        { value: "Minivan", label: "Minivan" },
        { value: "Sports Car", label: "Sports Car" },
        { value: "Station Wagon", label: "Station Wagon" }
    ];

    // ✏️ Handle CONDITION select
    const [selectedCondition, setSelectedCondition] = useState(null);
    const handleConditionChange = (selectedOption) => {
        setSelectedCondition(selectedOption);
        setCar((prev) => ({ ...prev, car_condition: selectedOption.value }));
    };
    const conditionOptions = [
        { value: "New", label: "New" },
        { value: "Used", label: "Used" }
    ];

    // MODIFY - Add state to track wallet connection status
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    useEffect(() => {
        // Function to check if the wallet is connected
        async function checkWalletConnection() {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_accounts", []);
                if (accounts.length > 0) {
                    setIsWalletConnected(true); // Set wallet as connected
                } else {
                    setIsWalletConnected(false); // Set wallet as not connected
                }
            } else {
                setIsWalletConnected(false); // If no Ethereum provider, set as not connected
            }
        }
    
        // Check wallet connection on mount
        checkWalletConnection();
    
        // Listen for account changes in the wallet
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", checkWalletConnection);
        }
    
        // Cleanup listener when component unmounts
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", checkWalletConnection);
            }
        };
     }, []);
  
  



    return(
        <>
        <CommonSection title='Create Item' />
            <section>
                <Container>
                    <Row>
                         {/*------------ ITEM PREVIEW ------------*/}
                        <Col lg='3' md='4' sm='6'>
                        <h5 className="prev_item">Preview Item</h5>
                        <CarCard item={item} />
                        </Col>
                         
                         {/*------------ FORM SECTION ------------*/}
                        <Col lg='9' md='8' sm='6' >
                            <div className="create__item">
                                <h3> Upload your Car to the marketplace </h3>
                                <div className="alert">
                                    {isWalletConnected ? "" : "Please connect to your wallet before uploading the Asset!"}
                                </div>

                                <form > {/* ✏️ Added form submit */}
                                    <div className="form__input">
                                        <label htmlFor="title" > Title </label>
                                        <input type="text" placeholder="Enter title" 
                                               name="title" onChange={handleChange} required
                                               value={car.title} />
                                    </div>

                                    <div className="form__input">
                                        <label htmlFor="price" >Price</label>
                                        <input type="number"
                                               placeholder="Enter price (0.1 - 100 ETH)"
                                               name="price"
                                               onChange={handleChange}
                                               min="0.1"
                                               max="100" 
                                               step="0.01"  
                                               required 
                                               value={car.price}
                                        />
                                    </div>

                                    {/* Searchable Category Dropdown */}
                                    <div className="form__select">
                                        <label htmlFor="category">Category</label>
                                        <Select
                                            id="category"
                                            value={selectedOption}
                                            onChange={handleCategoryChange} // ✏️ Updated handler
                                            options={categoryOptions}
                                            placeholder="Choose Car Category"
                                            isSearchable={true}
                                            className="custom-dropdown" 
                                            classNamePrefix="custom-select"
                                            required
                                        />
                                    </div>                

                                    {/* Condition Dropdown */}
                                    <div className="form__select">
                                        <label htmlFor="condition">Condition</label>
                                        <Select
                                            id="car_condition"
                                            value={selectedCondition}
                                            onChange={handleConditionChange}
                                            options={conditionOptions}
                                            placeholder="Choose Car Condition"
                                            isSearchable={true}
                                            className="custom-dropdown" 
                                            classNamePrefix="custom-select"
                                            required
                                        />
                                    </div>

                                    <div className=" d-flex align-items-center justify-content-between ">
                                        <div className="form__input w-50 ">
                                            <label htmlFor="created_date" >Created  Date</label>
                                            <input type="date" name="created_date" onChange={handleChange} 
                                                   required value={car.created_date} />
                                        </div>

                                    </div>

                                    <div className="form__input ">
                                        <label htmlFor="" >Upload File</label>
                                        <input type="file" placeholder="Browse" onChange={handleFileChange}
                                        required />
                                    </div>

                                    <div className="form__input">
                                        <label htmlFor="" > Description </label>
                                        <textarea id="" rows="3" placeholder="Enter description" className="w-100"
                                                  name="description" onChange={handleChange}
                                        required />                     
                                    </div>

                                    <div className="">{message}</div>

                                    <button 
                                           onClick={listCar}
                                           className="add-btn d-flex align-items-center gap-2"
                                           disabled={!isWalletConnected}
                                    >
                                        <i class="ri-shopping-bag-line" ></i> ADD
                                    </button>
                                </form>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}

export default Create;