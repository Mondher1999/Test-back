import mongoose from "mongoose";
 
const {Schema , model} = mongoose
const stationSchema = new Schema({
             type: {
               type: String,
               required: true,
               enum: ['Bus', 'Metro', 'Train'],
             },
             name: {
               type: String,
               required: true,
             },
             location: {
               type: {
                 type: String,
                 enum: ['Point'],
                 required: true
             },
             coordinates: {
             type: [Number],
             required: true
             }
             },
             transport: [{
             type: Schema.Types.ObjectId,
             ref: 'Transport'
             }]

           });

export default model ("station",stationSchema);