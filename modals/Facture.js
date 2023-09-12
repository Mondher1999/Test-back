import mongoose from "mongoose";

const { Schema, model } = mongoose;

const locationSchema = new Schema({
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  }
});

// Subdocument for products in the invoice
const productStockSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Produit',  // Link to the Produit schema
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: false
  },

  products: [productStockSchema], 

  totalAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: false 
  },

  credit: {
    type: Boolean,
    default: false
  },

  nomVendeur: {
    type: String,
    required: false // Set to false if the seller name is optional
  },

  location: {
    type: locationSchema,
    required: false // Set to true if you always want to include location
  },
  qrCode: {
    type: String, // This can store the QR code data or a URL to the QR code image
    required: false // Set to true if you always want to include a QR code
  }
});

export default model("Facture", invoiceSchema);
