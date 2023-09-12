import Vendeur from '../modals/vendeur.js';

// Create a new Vendeur
export async function createVendeur(req, res) {
  try {
    const { nom, stock } = req.body;
    const vendeur = new Vendeur({ nom, stock });
    console.log(vendeur);
    await vendeur.save();
    res.status(201).send(vendeur);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Get all Vendeurs
export async function getAllVendeurs(req, res) {
  try {
    const vendeurs = await Vendeur.find();
    res.send(vendeurs);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get a specific Vendeur by ID
export async function getVendeurById(req, res) {
  try {
    const vendeur = await Vendeur.findById(req.params.id);
    if (!vendeur) {
      return res.status(404).send();
    }
    res.send(vendeur);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Delete a specific Vendeur by ID
export async function deleteVendeurById(req, res) {
  try {
    const vendeur = await Vendeur.findByIdAndDelete(req.params.id);
    if (!vendeur) {
      return res.status(404).send();
    }
    res.send(vendeur);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Add stock to a Vendeur
export async function addStockToVendeur(req, res) {
  try {
    const { vendeurId, product, quantite } = req.body;
    const vendeur = await Vendeur.findById(vendeurId);
    if (!vendeur) {
      return res.status(404).send({ message: 'Vendeur not found' });
    }
    vendeur.stock.push({ product, quantite });
    await vendeur.save();
    res.status(200).send(vendeur);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Retrieve a Vendeur with their associated products (assuming you have products referenced in your Vendeur schema)
export async function getVendeurWithProducts(req, res) {
  try {
    const vendeur = await Vendeur.findById(req.params.id).populate('stock.product');
    if (!vendeur) {
      return res.status(404).send();
    }
    res.send(vendeur);
  } catch (err) {
    res.status(500).send(err);
  }
}