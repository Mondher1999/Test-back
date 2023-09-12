import Produit from '../modals/Produit.js' ;
import journal from '../modals/journal.js';
import Vendeur from '../modals/vendeur.js';



// Create a new Produit
export async function createProduit(req, res) {
    try {
      const { nom, description, prix, stock } = req.body;
      const produit = new Produit({ nom, description, prix, stock });
      await produit.save();
      res.status(201).send(produit);
    } catch (err) {
      res.status(400).send(err);
    }
  }
  
  // Get all Produits
  export async function getAllProduits(req, res) {
    try {
      const produits = await Produit.find();
      res.send(produits);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  export async function getAllJournals(req, res) {
    try {
      const journals = await journal.find();
      res.send(journals);
    } catch (err) {
      res.status(500).send(err);
    }
  }

export async function deleteJournalById(req, res) {
  try {
    const journale = await journal.findByIdAndDelete(req.params.id);
    if (!journale) {
      return res.status(404).send();
    }
    res.send(journale);
  } catch (err) {
    res.status(500).send(err);
  }
}
export const getJournalByVendeurName = async (req, res) => {
  const vendeurName = req.params.vendeurName; // assuming you get vendeurName from the route parameter

  try {
    const journalRecords = await journal.find({ vendeurName: vendeurName });

    if (!journalRecords || journalRecords.length === 0) {
      console.warn(`No journal entries found for vendeur: ${vendeurName}`);
      return res.status(404).json({ message: "Journal not found" }); // Sending a 404 status code
    }

    return res.status(200).json(journalRecords); // Sending the found journals as a JSON response

  } catch (error) {
    console.error('An error occurred while fetching the journal:', error);
    return res.status(500).json({ message: "Internal Server Error" }); // Sending a 500 status code
  }
};
  
  
  export async function getProduitById(productId) {
    try {
        const produit = await Produit.findById(productId);
        if (!produit) {
            console.error('Product not found for ID:', productId);
            return null;
        }
        return produit;
    } catch (err) {
        console.error('Error while fetching product:', err);
        return null;
    }
}

  
  // Update a specific Produit by ID
  export async function updateProduitById(req, res) {
    try {
      const updates = req.body;
      const produit = await Produit.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!produit) {
        return res.status(404).send();
      }
      res.send(produit);
    } catch (err) {
      res.status(400).send(err);
    }
  }
  


  // Delete a specific Produit by ID
  export async function deleteProduitById(req, res) {
    try {
      const produit = await Produit.findByIdAndDelete(req.params.id);
      if (!produit) {
        return res.status(404).send();
      }
      res.send(produit);
    } catch (err) {
      res.status(500).send(err);
    }
  }



  export async function allocateMultipleStocksToVendeur(req, res) {
    try {
      console.log('Starting allocation of multiple stocks...');
  
      const { products } = req.body;
      console.log('Products from request:', products);
      
      const { vendeurId } = req.params;
      console.log('Vendeur ID from params:', vendeurId);
  
      const vendeur = await Vendeur.findById(vendeurId);
      if (!vendeur) {
        console.log('Vendeur not found for ID:', vendeurId);
        return res.status(404).send({ message: 'Vendeur not found' });
      }
  
      for (const product of products) {
        const { productId, quantite } = product;
        console.log(`Processing product ID: ${productId} with quantity: ${quantite}`);
  
        const prod = await Produit.findById(productId);
        if (!prod) {
          console.log(`Product not found for ID: ${productId}`);
          return res.status(404).send({ message: `Product with ID ${productId} not found` });
        }
  
        if (prod.stock < quantite) {
          console.log(`Not enough stock for product ID: ${productId}. Available stock: ${prod.stock}, Requested: ${quantite}`);
          return res.status(400).send({ message: `Not enough stock for product with ID ${productId}` });
        }
  
        prod.stock -= quantite;
        
        await prod.save();
        console.log(`Deducted stock for product ID: ${productId}. New stock: ${prod.stock}`);
  
        const existingStock = vendeur.stock.find(item => item.product.toString() === productId);
  
        if (existingStock) {
          console.log(`Product ID: ${productId} already exists in vendeur's stock. Current quantity: ${existingStock.quantite}`);
          existingStock.quantite += quantite;
          console.log(`Updated quantity for product ID: ${productId} in vendeur's stock: ${existingStock.quantite}`);
        } else {
          console.log(`Product ID: ${productId} does not exist in vendeur's stock. Adding new.`);
          vendeur.stock.push({ product: productId, quantite });
        }
      }
      vendeur.validation = false;
      await vendeur.save();
      console.log('Saved vendeur stock changes successfully');
  
      res.status(200).send(vendeur);
    } catch (err) {
      console.error('Error during stock allocation:', err);
      res.status(500).send(err);
    }
  }



  export async function validateVendeur(req, res) {
    try {
      const { vendeurId } = req.params;
  
      // Find the vendeur by ID
      const vendeur = await Vendeur.findById(vendeurId);
      if (!vendeur) {
        return res.status(404).send({ message: 'Vendeur not found' });
      }
  
      for (const item of vendeur.stock) {
        const productId = item.product.toString();
        const quantite = item.quantite;
  
        // Increment the stock for the product
        const prod = await Produit.findById(productId); 
        if (!prod) {
          return res.status(404).send({ message: `Product with ID ${productId} not found` });
        }
  
        prod.stock += quantite;
        await prod.save();
      }
  
      // Optional: Clear the vendeur's stock if needed
      vendeur.stock = [];
      vendeur.validation = true
      await vendeur.save();
  
      res.status(200).send({ message: 'Vendeur validated and stock restored' });
    } catch (err) {
      res.status(500).send(err);
    }
  }
  