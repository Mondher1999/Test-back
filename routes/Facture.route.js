import express from 'express';

import {
  createFacture,
  getAllFactures,
  getFactureById,
  updateFactureById,
  deleteFactureById
} from '../controllers/Facture.controller.js';

const router = express.Router();

// Create a new Facture
router.post('/factures', createFacture);

// Get all Factures
router.get('/factures', getAllFactures);

// Get a specific Facture by ID
router.get('/factures/:id', getFactureById);

// Update a specific Facture by ID
router.put('/factures/:id', updateFactureById);

// Delete a specific Facture by ID
router.delete('/factures/:id', deleteFactureById);

export default router;
