const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "COS30049_project_db"
});

app.use(express.json());
app.use(cors());

// API Route: Test Connection
app.get("/", (req,res)=> res.json("Hello this is the backend"));

//------------ File Upload Configuration ------------//
app.use("/uploads", express.static("uploads")); // Serve static files from the 'uploads' folder

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });


// Market.jsx - Fetch all Car from MySQL 
app.get("/cars", (req,res) => { 
    const q = "SELECT * FROM car_table"; 
    db.query(q,(err,data)=>{
        if (err) return res.status(500).json({ success: false, message: err });
        return res.json(data)  
    });
});


// CarDetails.jsx - Fetch a single Car by token_id
// This route is used in the `CarDetails.jsx` to get details of a specific Car using its `token_id`.
app.get("/cars/:token_id", (req,res) => {
    const { token_id } = req.params;
    db.query("SELECT * FROM car_table WHERE token_id = ?", [token_id], (err, data) =>{
        if (err) return res.status(500).json({ success: false, message: err });
        if (data.length === 0) return res.status(404).json({ success: false, message: "Car not found" });
        return res.json(data[0]); // Return the first result since token_id is unique
    })
})


// Create.jsx - Store Car details in MySQL
// This route is used in `Create.jsx` to upload new Car details to the MySQL database when a new Car is listed for sale.
app.post("/cars", upload.single("image_path"), async (req, res) => {
    try {
        // 1️⃣ Debugging logs (check if the backend receives data)
        console.log("Received request to add a car:", req.body);
        console.log("Uploaded file details:", req.file);

        // 2️⃣ Extract form fields
        const { token_id, owner, seller, title, price, category, car_condition, created_date, description } = req.body;

        // 3️⃣ Validate required fields
        if (!token_id || !owner || !seller || !title || 
            !price || !category || !car_condition || !created_date || !description ) {
            return res.status(400).json({ success: false, message: "❌ Missing required fields" });
        }

        // 4️⃣ Process Image Upload
        const image_path = req.file ? `/uploads/${req.file.filename}` : null;  // Handle optional image

        // 5️⃣ Debugging logs (Check values)
        console.log("Final values to insert:", { token_id, owner, seller, title, price, category, car_condition, created_date, image_path, description });

        // 6️⃣ SQL Query (Fixed version)
        const q = `INSERT INTO car_table 
                  (token_id, owner, seller, title, price, category, car_condition, created_date, image_path, description, currently_listed) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [token_id, owner, seller, title, price, category, car_condition, created_date, image_path, description, true];

        // 7️⃣ Execute Query
        db.query(q, values, (err, data) => {
            if (err) {
                console.error("❌ MySQL Error:", err); // Log error details
                return res.status(500).json({ success: false, message: "Internal Server Error", error: err });
            }
            return res.json({ success: true, message: "✅ Car added successfully!" });
        });

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ success: false, message: "Unexpected Server Error", error: error.message });
    }
});


// Create.jsx - Execute Car Sale
// This route is used in `Create.js` to update the MySQL database when an Car is bought and its ownership is transferred.
app.post("/buy-car", (req, res) => {
    const { token_id, new_owner, price_paid } = req.body;
    if (!token_id || !new_owner || !price_paid) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    db.query("SELECT * FROM car_table WHERE token_id = ?", [token_id], (err, data) => {

        // Update Car ownership and mark as sold
        db.query(
            "UPDATE car_table SET owner = ?, seller = ?, currently_listed = ? WHERE token_id = ?",
            [new_owner, new_owner, false, token_id],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ success: false, message: updateErr });
                return res.json({ success: true, message: "Car purchased successfully!" });
            }
        );
    });
});


// Profile.jsx - Fetch Car owned by a specific user
// This route is used in the `Profile.jsx` to fetch Cars owned or sold by a user based on their wallet address.
app.get("/my-cars/:walletAddress", (req, res) => {
    const { walletAddress } = req.params;
    console.log("Fetching cars for wallet address:", walletAddress);
    
    db.query("SELECT * FROM car_table WHERE owner = ? OR seller = ?", [walletAddress, walletAddress], (err, data) => {
        if (err) return res.status(500).json({ success: false, message: err });

        // Ensure token_id is sent as a number
        const formattedData = data.map(car => ({
            ...car,
            token_id: Number(car.token_id)  // ✅ Convert token_id to a proper number
        }));

        console.log("Cars found:", formattedData);
        return res.json(formattedData);
    });
});




// Starting the server and listening on port 8800
app.listen(8800, ()=>{
    console.log("Connected to backend!");
});
