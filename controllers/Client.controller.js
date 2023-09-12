import Client from '../modals/Client.js';

// Create a new Client
export async function createClient(req, res) {
  try {
    const { name, numeroTel, email,credit, address, qrCode,location } = req.body;
    const client = new Client({ name,credit,location, numeroTel, email, address, qrCode });
    console.log(client);
    await client.save();
    res.status(201).send(client);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Get all Clients
export async function getAllClients(req, res) {
  try {
    const clients = await Client.find();
    res.send(clients);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get a specific Client by ID
export async function getClientById(req, res) {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).send();
    }
    res.send(client);
  } catch (err) {
    res.status(500).send(err);
  }
}

 // Update a specific Produit by ID
 export async function updateClientById(req, res) {
  try {
    const updates = req.body;
    const client = await Client.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!client) {
      return res.status(404).send();
    }
    res.send(client);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Delete a specific Client by ID
export async function deleteClientById(req, res) {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).send();
    }
    res.send(client);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Add an invoice to a client

export async function addInvoiceToClient(req, res) {
    try {
      const { clientId, invoiceId } = req.body;
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).send({ message: 'Client not found' });
      }
      client.invoices.push(invoiceId);
      await client.save();
      res.status(200).send(client);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // Retrieve a client with their associated invoices:

  export async function getClientWithInvoices(req, res) {
    try {
      const client = await Client.findById(req.params.id).populate('invoices');
      if (!client) {
        return res.status(404).send();
      }
      res.send(client);
    } catch (err) {
      res.status(500).send(err);
    }
  }
