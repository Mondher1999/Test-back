import Transport from '../modals/transport.js';
import Station from '../modals/stations.js';

// Create a new transport
export async function createTransport(req, res) {
  try {
    const transport = new Transport(req.body);
    await transport.save();
    res.status(201).send(transport);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Get all transports
export async function getAllTransports(req, res) {
  try {
    const transports = await Transport.find();
    res.send(transports);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get a specific transport by ID
export async function getTransportById(req, res) {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).send();
    }
    res.send(transport);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Update a specific transport by ID
export async function updateTransportById(req, res) {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'name', 'num', 'destination', 'schedule', 'stations','price'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).send();
    }

    updates.forEach(update => transport[update] = req.body[update]);
    await transport.save();

    res.send(transport);
  } catch (err) {
    res.status(400).send(err);
  }
}

// Delete a specific transport by ID
export async function deleteTransportById(req, res) {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) {
      return res.status(404).send();
    }
    res.send(transport);
  } catch (err) {
    res.status(500).send(err);
  }
  
}

// GetTransportsByStationId
export async function getTransportsByStationId(req, res) {
             try {
               const transports = await Transport.find({ stations: req.params.id });
               res.send(transports);
             } catch (err) {
               res.status(500).send(err);
             }
}


// Add a transport to a station
export async function addTransportToStation(req, res) {
  try {
    // Find the station by ID
    const station = await Station.findById(req.params.stationId);

    if (!station) {
      return res.status(404).send({ error: 'Station not found' });
    }

    // Create a new transport object and set the station ID
    const transport = new Transport({
      ...req.body,
      stations: [station._id]
    });

    // Add the transport ID to the station's transport array
    station.transport.push(transport._id);

    // Save the transport and station objects
    await Promise.all([transport.save(), station.save()]);

    // Send the updated station object as response
    res.send(station);
  } catch (err) {
    res.status(500).send(err);
  }
}