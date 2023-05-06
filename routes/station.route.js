import express from 'express';

import {
  createStation,
  getAllStations,
  getStationById,
  updateStationById,
  deleteStationById,
 getStationsByTransportId,
  getTransportCountByStationId,
  getStationsByType,
} from '../controllers/station.controller.js';

const router = express.Router();

// Create a new station
router.post('/stations', createStation);

// Get all stations
router.get('/stations', getAllStations);

// Get a specific station by ID
router.get('/stations/:id', getStationById);

// Update a specific station by ID
router.patch('/stations/:id', updateStationById);

// Delete a specific station by ID
router.delete('/stations/:id', deleteStationById);

// Delete a specific station by ID
router.get('/getTransportCountByStationId/:id', getTransportCountByStationId);

router.get('/getStationsByType/:type', getStationsByType);

router.get('/getStationsByTransportId/:id', getStationsByTransportId);



export default router;
