import express from 'express';

import {
  createVendeur,
  getAllVendeurs,
  getVendeurById,
  deleteVendeurById,
  addStockToVendeur,
  getVendeurWithProducts
} from '../controllers/Vendeur.controller.js';

const router = express.Router();

// Create a new Vendeur
router.post('/vendeurs', createVendeur);

// Get all Vendeurs
router.get('/vendeurs', getAllVendeurs);

// Get a specific Vendeur by ID
router.get('/vendeurs/:id', getVendeurById);

// Get a Vendeur with their associated products
router.get('/vendeurs/:id/products', getVendeurWithProducts);

// Delete a specific Vendeur by ID
router.delete('/vendeurs/:id', deleteVendeurById);

// Add stock to a Vendeur
router.post('/vendeurs/:vendeurId/products/:productId', addStockToVendeur);

export default router;
