import express from 'express';

import {
  createProduit,
  getAllProduits,
  getProduitById,
  updateProduitById,
  deleteProduitById,
  allocateMultipleStocksToVendeur,
  validateVendeur,
  getAllJournals,
  deleteJournalById,
  getJournalByVendeurName
  
} from '../controllers/Produit.controller.js';

const router = express.Router();

// get journal by id

router.get('/journals/:vendeurName', getJournalByVendeurName);

// get journal by id
router.delete('/journals/:id', deleteJournalById);




// Create a new Produit
router.post('/produits', createProduit);

// Get all Produits
router.get('/produits', getAllProduits);

router.get('/journals', getAllJournals);

// Get a specific Produit by ID
router.get('/produits/:id', getProduitById);


// Update a specific Produit by ID
router.put('/produits/:id', updateProduitById);

// Delete a specific Produit by ID
router.delete('/produits/:id', deleteProduitById);

// Allocate stock to a vendeur
router.put('/vendeurs/:vendeurId/produits', allocateMultipleStocksToVendeur);



router.put('/vendeurs/:vendeurId/validate', validateVendeur);

export default router;
