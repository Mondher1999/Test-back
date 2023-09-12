import Facture from '../modals/Facture.js';
import Vendeur from '../modals/vendeur.js';
import Client from '../modals/Client.js';  // Assurez-vous d'avoir un modèle Client
import Journal from '../modals/journal.js';
import { getProduitById } from '../controllers/Produit.controller.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import axios from 'axios'


async function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers

  // Convert degrees to radians
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  // Calculate area
  const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  // Calculate the angle (central angle)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance
  return R * c;
}

async function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

async function areLocationsClose(lat1, lon1, lat2, lon2, threshold = 100) {
  const distance = haversineDistance(lat1, lon1, lat2, lon2);
  return distance <= threshold;
}


export async function createFacture(req, res) {
  try {
      const { products = [], nomVendeur, location,clientId } = req.body;

      console.log('Received request data:', req.body);

      

      const client = await Client.findById(clientId);
    

  

     /*

      if (!client.credit) {
          console.warn('Client credit check failed for ID:', clientId);
          return res.status(403).send({ message: 'Credit check failed.' });
      }

      */

      let totalCalculatedAmount = 0;
      const productsForInvoice = [];

      if (!Array.isArray(products)) {
          console.error('Expected products to be an array, received:', products);
          return res.status(400).send({ message: 'Invalid products data.' });
      }

      for (let item of products) {
          const productDetails = await getProduitById(item.productId); 
          console.log('Product Details:', productDetails);

          if (!productDetails) {
              console.error('Product not found for ID:', item.productId);
              return res.status(404).send({ message: 'Produit introuvable.' });
          }

      
          if (item.quantity > productDetails.stock) {
              console.error('Not enough stock for product:', productDetails.nom);
              return res.status(400).send({ message: `Insufficient stock for ${productDetails.nom}` });
          }

          const productTotal = productDetails.prix * item.quantity;
          totalCalculatedAmount += productTotal;

          // Populate productsForInvoice with product details and quantity
          productsForInvoice.push({
              product: productDetails,
              quantity: item.quantity
          });
      }

   

      const newFacture = new Facture({
        client: clientId,
        products: productsForInvoice,
        totalAmount: totalCalculatedAmount,  // Use the calculated amount instead
        nomVendeur,
        location: location,
        
  });





     

      await newFacture.save();
      console.log('Successfully created invoice:', newFacture);


      const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
        const sanitizedClientName = client.name.replace(/[^a-zA-Z0-9]/g, '_'); // replace non-alphanumeric characters with underscores
        const pdfFileName = `${nomVendeur}_${sanitizedClientName}_${formattedDate}.pdf`;


      const pdfFilePath = `./public/${pdfFileName}`;

      function getCurrentFormattedDate() {
        const now = new Date();
      
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
      
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JS
        const year = now.getFullYear();
      
        return `${hours}:${minutes}_${day}/${month}/${year}`;
      }

     
      // Create a new journal entry
      const newJournalEntry = new Journal({
        invoicePDF: `/${pdfFileName}`, // The link to the created invoice PDF.
        vendeurName: nomVendeur,
        clientName: client.name,
        dateHeure: getCurrentFormattedDate(),
        totalAmount : totalCalculatedAmount
      });
        await newJournalEntry.save();

          const doc = new PDFDocument({
            size: 'A4', 
            margin: 20
          });

          const writeStream = fs.createWriteStream(pdfFilePath);
          doc.pipe(writeStream);

          writeStream.on('finish', () => {
            res.status(200).send({
                message: 'Invoice created and saved.',
                invoice: newFacture,
                pdfLink: `/${pdfFileName}`
            });
          });

          // Define colors
          const primaryColor = '#4A90E2';  // A serene shade of blue
          const secondaryColor = '#333333';
          const tertiaryColor = '#F7F7F7';  // Light gray for subtle backgrounds

          // Company Details in Header
          doc.fontSize(24)
            .font("Times-Bold")
            .fillColor(primaryColor)
            .text('ACME Corporation', 50, 40);

          doc.fontSize(10)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text('123 Business St., Big City, Country', 50, 70)
            .text('Phone: (123) 456-7890 | Email: support@acme.com', 50, 85);

          doc.moveTo(50, 110)
          .lineTo(570, 110)
          .strokeColor(tertiaryColor)
          .stroke();

          // Title
          doc.fontSize(36)
            .font("Times-Bold")
            .fillColor(primaryColor)
            .text('Facture', 230, 130);

          // Client Details
          doc.fontSize(20)
          .font("Helvetica")
          .fillColor(secondaryColor)
          .text(`Client: ${client.name}`, 50, 180)
          .text(`Date: ${new Date().toLocaleDateString()}`, 400, 180);

          let yPosition = 230;

          // Table Header
          doc.fontSize(16)
          .font("Helvetica-Bold")
          .rect(50, yPosition, 520, 30)
          .fill(primaryColor)
          .fillColor('white')
          .text(`Produit`, 60, yPosition)
          .text(`Prix Unit.`, 280, yPosition)
          .text(`Quantité`, 400, yPosition)
          .text(`Total`, 500, yPosition);

          yPosition += 35;

          // Table Content
          doc.font("Helvetica")
          .fontSize(14)
          .fillColor(secondaryColor);

          for (let item of productsForInvoice) {
            const total = item.product.prix * item.quantity;
            
            doc.rect(50, yPosition, 520, 25)  // Draw table row
              .fill(tertiaryColor);
            
            doc.fillColor(secondaryColor)
              .text(`${item.product.nom}`, 60, yPosition)
              .text(`${item.product.prix.toFixed(2)} DT`, 280, yPosition, { width: 90, align: 'right' })
              .text(`${item.quantity}`, 400, yPosition, { width: 90, align: 'right' })
              .text(`${total.toFixed(2)} DT`, 500, yPosition, { width: 90, align: 'right' });
            
            yPosition += 30;
          }

          // Total Amount
          yPosition += 10;
          doc.rect(50, yPosition, 520, 30)
          .fill(primaryColor);

          doc.fontSize(20)
          .font("Helvetica-Bold")
          .fillColor('white')
          .text(`Montant Total: ${totalCalculatedAmount.toFixed(2)} DT`, 60, yPosition + 5);

          yPosition += 50;

          // Footer
          doc.moveTo(50, yPosition)
            .lineTo(570, yPosition)
            .strokeColor(tertiaryColor)
            .stroke();

          doc.fontSize(10)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text('Merci de faire affaire avec ACME Corporation.', 50, yPosition + 10)
            .text('Pour des questions, contactez le service client au (123) 456-7890.', 50, yPosition + 25);

          doc.end();



  } catch (err) {
      console.error('Error encountered:', err);
      res.status(500).send(err);
  }
}


// Get all 
export async function getAllFactures(req, res) {
  try {
    const facture = await Facture.find().populate('client products.product');
    res.send(facture);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get a specific  by ID
export async function getFactureById(req, res) {
  try {
    const facture = await Facture.findById(req.params.id).populate('client products.product');
    if (!facture) {
      return res.status(404).send();
    }
    res.send(facture);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Update a specific  by ID
export async function updateFactureById(req, res) {
  try {
    const updates = req.body;
    const facture = await Facture.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('client products.product');
    if (!facture) {
      return res.status(404).send();
    }
    res.send(facture);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Delete a specific  by ID
export async function deleteFactureById(req, res) {
  try {
    const facture = await Facture.findByIdAndDelete(req.params.id);
    if (!facture) {
      return res.status(404).send();
    }
    res.send(facture);
  } catch (err) {
    res.status(500).send(err);
  }
}
