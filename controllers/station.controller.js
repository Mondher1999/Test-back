import Station from '../modals/stations.js';

// Create a new station
export async function createStation(req, res) {
  try {
    const station = new Station(req.body);
    await station.save();
    res.status(201).send(station);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Get all stations
export async function getAllStations(req, res) {
  try {
    const stations = await Station.find();
    res.send(stations);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get a specific station by ID
export async function getStationById(req, res) {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).send();
    }
    res.send(station);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Update a specific station by ID
export async function updateStationById(req, res) {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'name', 'location', 'transport'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).send();
    }

    updates.forEach(update => station[update] = req.body[update]);
    await station.save();

    res.send(station);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Delete a specific station by ID
export async function deleteStationById(req, res) {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);
    if (!station) {
      return res.status(404).send();
    }
    res.send(station);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get the number of transports for a specific station by ID
export async function getTransportCountByStationId(req, res) {
  try {
    const stationId = req.params.id;
    const transportCount = await Transport.countDocuments({ stations: stationId });
    res.send({ count: transportCount });
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get all stations of a specific type
export async function getStationsByType(req, res) {
  try {
    const type = req.params.type;
    const stations = await Station.find({ type });
    res.send(stations);
  } catch (err) {
    res.status(500).send(err);
  }
}


export async function getStationsByTransportId(req, res) {
  try {
    const transportId = req.params.transportId;
    const stations = await Station.find({ transportId });
    res.send(stations);
  } catch (err) {
    res.status(500).send(err);
  }
}

