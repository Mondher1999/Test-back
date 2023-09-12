import mongoose from "mongoose";

const { Schema, model } = mongoose;

const vendeurStockSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  quantite: {
    type: Number,
    required: true
  }
});

const vendeurSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  validation: {
    type: Boolean,
    default: true
  },
  stock: [vendeurStockSchema]
});

export default model("Vendeur", vendeurSchema);
