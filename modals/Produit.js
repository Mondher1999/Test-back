import mongoose from "mongoose";

const { Schema, model } = mongoose;

const produitSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  prix: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
});

export default model("Produit", produitSchema);