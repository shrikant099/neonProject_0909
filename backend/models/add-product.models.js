import mongoose from "mongoose";;

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    offerOnPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    productImage: {
        type: [String],
        default: []
    }
}, { timestamps: true });

/** @type {import("mongoose").Model} */
const Product = mongoose.model('ProductSchema', productSchema);

export { Product }