import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'
import { connectionDataBase } from './dbConnection/database_connection.js';
import { fileURLToPath } from 'url';
import { app } from './app/app.js';

dotenv.config({});

//Middleware
app.use(cors({ origin: '*' })); 
app.use(express.json());
app.use(urlencoded({extended: false}))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, "../")));

// Home route to send index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

connectionDataBase()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`App is Listening On Url http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed. Server not started:", error);
    });

