import express from 'express';
import {
  createTransport,
  getAllTransports,
  getTransportById,
  updateTransportById,
  deleteTransportById,
  getTransportsByStationId,
  addTransportToStation,
} from '../controllers/transport.controller.js';

const router = express.Router();

// Create a new transport
router.post('/transports', createTransport);

// Get all transports
router.get('/transports', getAllTransports);

// Get a specific transport by ID
router.get('/transports/:id', getTransportById);

// Update a specific transport by ID
router.patch('/transports/:id', updateTransportById);

// Delete a specific transport by ID
router.delete('/transports/:id', deleteTransportById);

// Get all transports by station ID
router.get('/stations/:id/transports', getTransportsByStationId);

// Get add transport by station ID
router.post('/stations/:stationId/transports', addTransportToStation);

export default router;
