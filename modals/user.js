import mongoose from "mongoose";
 
const {Schema , model} = mongoose;
const userSchema = new Schema(
    {
     

    fullName: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true

    },
    mobile: {
        type: String,
        required: true

    },
    Adresse: {
        type: String,
        required: true

    },
    date:{
        type:Date,
        default:Date.now
    },
    verified:{
        type: Boolean,
        default: false
    },

    activationCode:{
        type:String,
    } ,
    profilPic:{
        type: String,
        required: false

    },
    role: {
        type: String,
        required: false,
        enum: ['SimpleUser', 'Admin'],
        default: 'SimpleUser'
  
      },

});
export default model ("user",userSchema);