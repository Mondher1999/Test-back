import mongoose from "mongoose";

const {Schema , model} = mongoose
const transportSchema = new Schema({
             type: {
               type: String,
               required: true,
               enum: ['Bus', 'Metro', 'Train'],
             },
             name: {
               type: String,
               required: true,
             },
             price: {
             type: String,
             required: true,
             },
             destination: {
               type: String,
               required: false,
             },
             schedule: {
               type: String,
               required: true,
             },
             stations: [{
               type: Schema.Types.ObjectId,
               ref: 'Station'
             }]
             
           });

export default model ("transport",transportSchema);