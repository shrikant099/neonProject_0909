import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { secretJwtKey } from "../controllers/user.controller.js";
dotenv.config({})



const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

// Method to generate JWT token

// Method to generate JWT token
userSchema.methods.generateAuthToken = async function () {
    const user = this;

    // Ensure expired tokens are cleaned before adding a new one
    await user.cleanExpiredTokens();

    // Generate a new token
    const token = jwt.sign({ _id: user._id.toString() }, secretJwtKey, {
        expiresIn: "30d",
    });

    // Add new token to the user's tokens array
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// Method to clean expired tokens
userSchema.methods.cleanExpiredTokens = async function () {
    const user = this;

    const validTokens = user.tokens.filter((tokenObj) => {
        try {
            jwt.verify(tokenObj.token, secretJwtKey);
            return true;
        } catch (error) {
            console.error("Expired token removed:", tokenObj.token);
            return false;
        }
    });

    user.tokens = validTokens;
    await user.save();
};
/** @type {import("mongoose").Model} */
const User = mongoose.model('User', userSchema);
export { User }
