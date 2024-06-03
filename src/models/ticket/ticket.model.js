import mongoose from 'mongoose';

const collection = 'tickets';

const schema = new mongoose.Schema({
    code: String,
    purchase_datetime: String,
    amount: Number,
    purchaser: String
})

export const ticketModel = mongoose.model(collection, schema);