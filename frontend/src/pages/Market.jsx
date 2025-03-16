import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import "../styles/market.css";
import CommonSection from "../components/section/Common-section/CommonSection";
import CarCard from "../components/section/Car_card/CarCard";

function Market() {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10);
    const [allCars, setAllCars] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    async function getAllCars() {
        try {
            const response = await axios.get("http://localhost:8800/cars");
            if (response.data) {
                setCars(response.data);
                setAllCars(response.data);
                setDataFetched(true);
            } else {
                console.log("No cars found.");
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    }

    useEffect(() => {
        if (!dataFetched) getAllCars();
    }, [dataFetched]);

    const handleCategory = (e) => {
        const filterValue = e.target.value;
        if (filterValue === "All Categories" || filterValue === "") {
            setCars(allCars);
            return;
        }
        const filteredData = allCars.filter(
            (item) => item.category.toLowerCase() === filterValue.toLowerCase()
        );
        setCars(filteredData);
    };

    const handleCondition = (e) => {
        const filterValue = e.target.value;
        if (filterValue === "All Condition" || filterValue === "") {
            setCars(allCars);
            return;
        }
        const filteredData = allCars.filter(
            (item) => item.car_condition.toLowerCase() === filterValue.toLowerCase()
        );
        setCars(filteredData);
    };

    const handlePriceRangeChange = (e) => {
        const selectedMaxPrice = parseFloat(e.target.value);
        setMaxPrice(selectedMaxPrice);
        const filteredData = allCars.filter((item) => item.price <= selectedMaxPrice);
        setCars(filteredData);
    };

    const resetFilters = () => {
        setCars(allCars);
        setSearch("");
        setMinPrice(0);
        setMaxPrice(10);
        document.querySelector(".all__category__filter select").value = "All Categories";
        document.querySelector(".filter__right select").value = "All Condition";
    };

    const filteredData = cars.filter((item) =>
        search.toLowerCase() === ""
            ? item
            : item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <CommonSection title="MarketPlace" />
            <section>
                <Container className="mainCon">
                    <Row className="mainRow">
                        <Col lg="12" className="mainCol mb-5">
                            <div className="market__product__filter d-flex align-items-center gap-5">
                                <div className="Search__filter">
                                    <i className="ri-search-line"></i>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="all__category__filter">
                                    <select onChange={handleCategory}>
                                        <option> All Categories </option>
                                        <option value="suv"> SUV </option>
                                        <option value="crossover"> Crossover</option>
                                        <option value="sedan"> Sedan</option>
                                        <option value="pickup_truck"> Pickup Truck </option>
                                        <option value="hatchback"> Hatchback </option>
                                        <option value="convertible"> Convertible</option>
                                        <option value="luxury"> Luxury</option>
                                        <option value="coupe"> Coupe </option>
                                        <option value="hybrid_electric"> Hybrid/Electric </option>
                                        <option value="minivan"> Minivan</option>
                                        <option value="sports_car"> Sports Car</option>
                                        <option value="station_wagon"> Station Wagon </option>
                                    </select>
                                </div>

                                <div className="filter__right">
                                    <select onChange={handleCondition}>
                                        <option> All Condition </option>
                                        <option value="new"> New </option>
                                        <option value="used"> Used </option>
                                    </select>
                                </div>

                                <div className="price-range-filter">
                                    <label>Max Price: {maxPrice} ETH</label>
                                    <div className="range-slider-container">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={maxPrice}
                                            onChange={handlePriceRangeChange}
                                            className="range-slider"
                                        />
                                    </div>
                                </div>

                                <div className="">
                                    <button className="rm_btn" onClick={resetFilters}>
                                        <i className="ri-delete-bin-line"></i> Remove Filter
                                    </button>
                                </div>
                            </div>
                        </Col>

                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <Col lg="3" md="4" sm="6" className="mb-4" key={item.token_id}>
                                    <CarCard item={item} />
                                </Col>
                            ))
                        ) : (
                            <Col lg="12">
                                <p className="text-white text-center">No Cars Available</p>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>
        </>
    );
}

export default Market;
