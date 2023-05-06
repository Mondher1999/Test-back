import mongoose from "mongoose";

const {Schema , model} = mongoose
const reclamationSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
             Description: {
             type: String,
             required: true,
             },
             
           });

export default model ("reclamation",reclamationSchema);