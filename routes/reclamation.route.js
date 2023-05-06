import express from 'express';

import {
  createReclamation,
  getAllReclamations,
  getReclamationById,
  deleteReclamationById,
} from '../controllers/reclamation.controller.js';

const router = express.Router();

// Create a new Reclamation
router.post('/reclamations', createReclamation);

// Get all Reclamation
router.get('/reclamations', getAllReclamations);

// Get a specific Reclamation by ID
router.get('/reclamations/:id', getReclamationById);

// Delete a specific Reclamation by ID
router.delete('/reclamations/:id', deleteReclamationById);




export default router;
