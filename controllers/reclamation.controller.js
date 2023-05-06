import Reclamation from '../modals/reclamation.js';

// Create a new Reclamation
export async function createReclamation(req, res) {
  try {
    const {  description,userId } = req.body;
    const reclamation = new Reclamation({  userID:userId,Description:description });
    console.log(reclamation);
    await reclamation.save();
    res.status(201).send(reclamation);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Get all Reclamation
export async function getAllReclamations(req, res) {
  try {
    const reclamation = await Reclamation.find();
    res.send(reclamation);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get a specific Reclamation by ID
export async function getReclamationById(req, res) {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).send();
    }
    res.send(reclamation);
  } catch (err) {
    res.status(500).send(err);
  }
}


// Delete a specific Reclamation by ID
export async function deleteReclamationById(req, res) {
  try {
    const reclamation = await Reclamation.findByIdAndDelete(req.params.id);
    if (!reclamation) {
      return res.status(404).send();
    }
    res.send(reclamation);
  } catch (err) {
    res.status(500).send(err);
  }
}


