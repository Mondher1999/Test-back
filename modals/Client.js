import mongoose from "mongoose";

const { Schema, model } = mongoose;

const locationSchema = new Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
});

const clientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  numeroTel: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },

  credit: {
    type: Boolean,
    required: false

  },

  qrCode: {
    type: String, // This can store the QR code data or a URL to the QR code image
    required: false // Set to true if you always want to include a QR code
  },
  location: {
    type: locationSchema,
    required: false // Set to true if you always want to include location
  },
  facture: [{
    type: Schema.Types.ObjectId,
    ref: 'Facture'
  }]
});

export default model("Client", clientSchema);