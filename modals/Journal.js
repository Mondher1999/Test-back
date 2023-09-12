import mongoose from "mongoose";

const { Schema, model } = mongoose;

const journalSchema = new Schema({
  invoicePDF: {
    type: String,  // Ceci peut être un chemin vers le fichier PDF stocké ou un lien vers le stockage cloud
    required: true
  },
  vendeurName: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  dateHeure: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date
  }
});

export default model("Journal", journalSchema);