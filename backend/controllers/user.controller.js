import { User } from "../models/user.models.js";
import { Product } from "../models/add-product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APiResponse.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config();

export const secretJwtKey = "adminShrikant@12";

const saltRounds = 10;

// hash password function
async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);

};

// Auth Sign Up Controller
async function authSignUpController(req, res) {
    try {
        const { firstName, lastName, email, password, number } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({ firstName, lastName, number, email, password: hashedPassword });

        // Generate token using method
        const token = await user.generateAuthToken();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token, // Return token
            data: {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        console.error(`Error: Registration ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again!",
        });
    }
}

// Login controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate token using method
        const token = await user.generateAuthToken();

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token, // Return token
            user: {
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


// genrate Otp
async function genrateOtp() {
    return crypto.randomInt(1000, 9999);
}

// Forget Password Controller
async function userForgetPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email is Required"
            });
        }

        // Email check karna
        const findEmail = await User.findOne({ email: email });

        if (!findEmail) {
            return res.status(401).json({
                success: false,
                message: "Email Not Found"
            });
        }

        // OTP generate karna
        const otp = await genrateOtp();
        console.log(`Generated OTP: ${otp}`);

        // OTP ko database mein save karna
        findEmail.otp = otp;
        await findEmail.save();

        // Nodemailer se OTP bhejna
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: 'shrikantsoni809@gmail.com',  // Aapka email
                pass: 'kfmp wgjz eqmr jytc'  // Aapka email password
            }
        });

        const mailOptions = {
            from: 'shrikantsoni809@gmail.com',
            to: email,
            subject: `OTP From Your App`,
            text: `Your OTP is: ${otp}`
        };

        // OTP ko email se bhejna
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to send OTP"
                });
            }
            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your email"
            });
        });

    } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// veriy Otp
async function verifyOtp(req, res) {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(401).json({
                success: false,
                message: "Otp is required"
            });
        };

        const fetchOtp = await User.findOne({ otp: otp });

        if (!fetchOtp) {
            return res.status(404).json({
                success: false,
                message: "OTP Not Found"
            });
        };

        return res.status(200).json({
            success: true,
            message: "OTP Verified Succesfull",
            userId: fetchOtp._id
        });

    } catch (error) {
        console.log(`Error Fetching Otp ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error: Fetching Otp internal server Error"
        });
    };
};


// Update Password 
async function resetPassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(401).json({
            success: false,
            message: "new Password is Required"
        });
    };

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(id, { password: hashPassword }, { new: true });

        if (!updatedUser) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Error reset Password Please try again"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "Password Reset Successful"
            }
        );

    } catch (error) {
        console.log(`Error reset Password api ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error reset password internal server Error"
            }
        );
    };
};


// Admin login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === "admin@gmail.com" && password === "3434") {
            return res.status(200).json({ message: "Admin is logged in" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Successful login
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};



// Admin Controllers 
async function adminViewController(req, res) {
    try {
        const fetchAllUser = await User.find({});

        if (!fetchAllUser || fetchAllUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users Fetched Successfully",
            allUsers: fetchAllUser  // Ensure this is sent in the response
        });
    } catch (error) {
        console.log(`Error fetching users ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// admin delete controller
async function adminDeleteUser(req, res) {
    const id = req.params.id;
    try {
        const adminDeleteUser = await User.findByIdAndDelete(id);

        if (!adminDeleteUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Error Delete User"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "User Deleted Succesfull",
                deletedUserData: adminDeleteUser
            }
        );


    } catch (error) {
        console.log(`Error Deleting user ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error Delete User Internal Server Errorr"
            }
        );
    };
};


// Add product admin
async function adminAddProduct(req, res) {
    const { productName, price, offerOnPrice, category } = req.body;

    if (!productName || !price || !offerOnPrice || !category) {
        return res.status(401).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Validate file upload
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Image file is required"
        });
    }

    try {
        const productData = {
            productName,
            price,
            offerOnPrice,
            category,
            productImage: [req.file.filename], 
        };

        const product = await Product.create(productData);

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Error creating product. Internal Server Error"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product added successfully",
            addProductData: product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again"
        });
    }
}


export {
    authSignUpController,
    loginController,
    userForgetPassword,
    verifyOtp,
    resetPassword,
    adminLogin,
    adminViewController,
    adminDeleteUser,
    adminAddProduct
}