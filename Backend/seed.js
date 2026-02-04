const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
    {
        name: "6 CTS Precious Royal Blue sapphire",
        price: 4500,
        description: "Shape: Cushion, Weight: 6.00 cts, Color: Royal Blue, Clarity: Eye Clean, Origin: Ceylon (Sri Lanka), Treatment: Natural Unheated",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/1.jpeg"]
    },
    {
        name: "3 CTS Royal Blue Sapphire",
        price: 3000,
        description: "Shape: Oval, Weight: 3.00 cts, Color: Royal Blue, Origin: Ceylon (Sri Lanka), Treatment: Unheated",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/2.jpeg"]
    },
    {
        name: "4 Cts Cornflower Blue Sapphire",
        price: 3500,
        description: "Cornflower Blue Sapphire available.",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/3.jpeg"]
    },
    {
        name: "2.5 Cts Royal Blue Sapphire",
        price: 2500,
        description: "Royal Blue Sapphire, 2.5 Cts.",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/4.jpeg"]
    },
    {
        name: "2 Cts Vivid Blue Sapphire",
        price: 1500,
        description: "Vivid Blue Sapphire, 2 Cts.",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/5.jpeg"]
    },
    {
        name: "1 Cts Royal Blue Sapphire",
        price: 1000,
        description: "Royal Blue Sapphire, 1 Cts.",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/6.jpeg"]
    },
    {
        name: "2.57 Cts Royal Vivid Blue Sapphire",
        price: 2000,
        description: "Royal Vivid Blue Sapphire, 2.57 Cts.",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/7.jpeg"]
    },
    {
        name: "1.53 Cts Cornflower Blue Sapphire",
        price: 1300,
        description: "Cornflower Blue Sapphire, 1.53 Cts.",
        category: "Gemstone",
        stock: 1,
        images: ["Assets/8.jpeg"]
    },
    {
        name: "15 Pcs (1 Cts/Per) Royal Blue Sapphire",
        price: 10000,
        description: "Lot of 15 Royal Blue Sapphires, 1 Cts each.",
        category: "Gemstone",
        stock: 15,
        images: ["Assets/9.jpeg"]
    },
    {
        name: "18 Pcs (1.2 Cts/Per) Cornflower Blue Sapphire",
        price: 12500,
        description: "Lot of 18 Cornflower Blue Sapphires, 1.2 Cts each.",
        category: "Gemstone",
        stock: 18,
        images: ["Assets/10.jpeg"]
    },
    {
        name: "30 Pcs (1 Cts/Per) Cornflower Blue Sapphire",
        price: 15000,
        description: "Lot of 30 Cornflower Blue Sapphires, 1 Cts each.",
        category: "Gemstone",
        stock: 30,
        images: ["Assets/11.jpeg"]
    },
    {
        name: "13 Pcs (1.2 Cts/Per) Cornflower Blue Sapphire",
        price: 9000,
        description: "Lot of 13 Cornflower Blue Sapphires, 1.2 Cts each.",
        category: "Gemstone",
        stock: 13,
        images: ["Assets/12.jpeg"]
    }
];

const importData = async () => {
    try {
        await Product.deleteMany();

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
