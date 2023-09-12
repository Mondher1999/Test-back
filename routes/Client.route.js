import express from 'express';

import {
  createClient,
  getAllClients,
  getClientById,
  deleteClientById,
  addInvoiceToClient,
  updateClientById,
  getClientWithInvoices
} from '../controllers/Client.controller.js';

const router = express.Router();

// Create a new Client
router.post('/clients', createClient);

// Get all Clients
router.get('/clients', getAllClients);

// Update a specific Client by ID
router.put('/clients/:id', updateClientById);

// Get a specific Client by ID
router.get('/clients/:id', getClientById);

// Get a client with their associated invoices
router.get('/clients/:id/invoices', getClientWithInvoices);

// Delete a specific Client by ID
router.delete('/clients/:id', deleteClientById);

// Add an invoice to a client
router.post('/clients/:clientId/invoices/:invoiceId', addInvoiceToClient);

export default router;
