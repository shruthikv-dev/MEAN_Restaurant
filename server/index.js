//index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://example.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  })
);

app.get('/', (req, res) => {
  res.send('Hello CSP!');
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));

// Add Content-Security-Policy header to allow connections to localhost:4000
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "connect-src 'self' http://localhost:4000; default-src 'self';");
    next();
});

// Connect to MongoDB
// Update the MONGO_URL with your actual password and ensure it is URL-encoded if it contains special characters.

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to database.')).then(() => {
        console.log("Connected to MongoDB");
        seedRestaurantData();
        startServer();
    })
  .catch(err => console.error('Could not connect to database.', err));


// Define the restaurant model
const restaurantSchema = new mongoose.Schema({
    name: String,
    address: String,
    contact: String,
    location: String,
    rating: Number,
    offers: Boolean,
    cuisines: [String],
    image: String,
});
const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);

async function seedRestaurantData() {
    await RestaurantModel.deleteMany({});

    const restaurantData = [
        {
            name: "Tandoor Palace",
            address: "123 Main Street, Hyderabad",
            contact: "123-456-7890",
            location: "Hyderabad",
            rating: 3.5,
            offers: true,
            cuisines: ["North Indian", "Biryani"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
        },
        {
            name: "Sushi Samba",
            address: "456 Oak Avenue, Bangalore",
            contact: "987-654-3210",
            location: "Bangalore",
            rating: 4.8,
            offers: true,
            cuisines: ["Japanese", "Sushi"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
        },
        {
            name: "La Trattoria",
            address: "789 Elm Street, Mumbai",
            contact: "456-789-0123",
            location: "Mumbai",
            rating: 3.2,
            offers: false,
            cuisines: ["Italian", "Pastas", "Pizzas"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/"+
                 "20240110004602/pexels-chan-walrus-958545-(1).jpg",
        },
        {
            name: "Spice Garden",
            address: "321 Oak Road, Delhi",
            contact: "789-012-3456",
            location: "Delhi",
            rating: 2.7,
            offers: true,
            cuisines: ["South Indian", "Vegetarian"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
        },
        {
            name: "Chopsticks",
            address: "654 Maple Lane, Pune",
            contact: "012-345-6789",
            location: "Pune",
            rating: 4.3,
            offers: true,
            cuisines: ["Chinese", "Asian Fusion"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/"+
                "20240110004602/pexels-chan-walrus-958545-(1).jpg",
        },
        {
            name: "Seaside Grill",
            address: "987 Beach Road, Chennai",
            contact: "345-678-9012",
            location: "Chennai",
            rating: 3.6,
            offers: true,
            cuisines: ["Seafood", "Barbecue"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
        },
        {
            name: "Pasta Perfetto",
            address: "159 Elm Avenue, Hyderabad",
            contact: "678-901-2345",
            location: "Hyderabad",
            rating: 2.4,
            offers: false,
            cuisines: ["Italian", "Pastas"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/"+
                "20240110004602/pexels-chan-walrus-958545-(1).jpg",
        },
        {
            name: "Sizzle Steak House",
            address: "753 Oak Street, Bangalore",
            contact: "901-234-5678",
            location: "Bangalore",
            rating: 3.9,
            offers: true,
            cuisines: ["Steak", "American"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
        },
        {
            name: "Dosa Delights",
            address: "369 Main Road, Chennai",
            contact: "234-567-8901",
            location: "Chennai",
            rating: 4.1,
            offers: true,
            cuisines: ["South Indian", "Vegetarian"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/"+
                "20240110004602/pexels-chan-walrus-958545-(1).jpg",
        },
        {
            name: "Bella Napoli",
            address: "852 Pine Avenue, Mumbai",
            contact: "567-890-1234",
            location: "Mumbai",
            rating: 4.6,
            offers: true,
            cuisines: ["Italian", "Pizzas"],
            image:
                "https://media.geeksforgeeks.org/wp-content/uploads/"+
                "20240110004602/pexels-chan-walrus-958545-(1).jpg",
        },
    ];

    await RestaurantModel.insertMany(restaurantData);
    console.log("Restaurant data seeded successfully!");
}

function startServer() {
    app.get("/health", (req, res) => {
        res.status(200)
        .json("Server is up and running");
    });

    app.get("/api/restaurants", async (req, res) => {
        try {
            const restaurants = await RestaurantModel.find({});
            res.status(200).json({ success: true, data: restaurants });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}