const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Scooter = require('./models/scooter');
const Parking = require('./models/parking');
const User = require('./models/user');
const Failures_type = require('./models/failures_type');

const path = require('path');


const OPEN = "Open"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// serve up production assets
app.use(express.static('build'));

  





const port = process.env.PORT || 3000;

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB', err));

app.get('/allScooters', async (req, res) => {
  try {
    const scooters = await Scooter.find({});
    res.json(scooters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//The client needs the ability to filter all the scooters by a polygon
app.post('/scootersInPolygon', async (req, res) => {
  try {
    const scooters = await Scooter.find({current_location:{$geoWithin:{$geometry:{type:"Polygon",coordinates:req.body.coordinates}}}});
    res.json(scooters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//The client needs the ability to filter out all the scooters available for travel.
app.get('/scootersAvailable', async (req, res) => {
  try {
    const scooters = await Scooter.find({status:'active'}).exec();
    res.json(scooters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// The client needs to see a list of all users in the system.
app.get('/allUsers', async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users)
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//The client needs to see a list of all available parking spots in the city.
app.get('/parkingsAvailable', async (req, res) => {
  try {
    const parkings = await Parking.find({ $where: "this.num_scooters_parked < this.max_scooter_space" });
    res.json(parkings);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
//The client needs the ability to see parking availability in each parking spot.
app.get('/parking/:_id', async (req, res) => {
  try {
    const parkings = await Parking.find({$where: "this._id == " + JSON.stringify(req.params._id) + " && this.num_scooters_parked < this.max_scooter_space"});
    res.json(parkings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//The client needs the ability to see a list of failures opened for each scooter.
app.get('/scooters/:id/failuresOpen', async (req, res) => {
  const failures=[]
  try {
    const failures_id = await Scooter.find({ id: req.params.id });
    if(failures_id[0].failures.length != 0){

      for(var i=0; i< failures_id[0].failures.length;i++){
        
        const res_failures = await Failures_type.find({ _id: failures_id[0].failures[i] });

        if(res_failures[0].status==OPEN){
          failures.push(res_failures[0])
          // failures[i] = res_failures[0]
        }
       
      }
      if(failures.length==0){
        res.json("There is no open fault for this scooter")
      }
    res.json(failures); 
    }
    else{
      res.json("There is no open fault for this scooter")
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// The client needs the ability to know the history of failures for each scooter.
app.get('/scooters/:id/failuresHistory', async (req, res) => {
  const failures=[]
  try {
    const failures_id = await Scooter.find({ id: req.params.id });

    if(failures_id[0].failures.length == 0){
      res.json("There is no failures History for this scooter")
    }
    else{
      for(var i=0; i< failures_id[0].failures.length;i++){
        failures[i] = await Failures_type.find({ _id: failures_id[0].failures[i] });
        }
        res.json(failures);
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// CRUD

// The client needs the ability to see a list of all existing scooters in the system.
// Get all scooters
app.get('/scooters', async (req, res) => {
  try {
    const scooters = await Scooter.find({});
    console.log(scooters)
    res.json(scooters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new scooter
app.post('/scooters', async (req, res) => {
  try {
    const scooter = new Scooter(req.body);
    await scooter.save();
    res.status(201).json(scooter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a scooter
app.put('/scooters/:id', async (req, res) => {
  try {
    const scooter = await Scooter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scooter) {
      res.status(404).json({ message: 'Scooter not found' });
    }
    res.json(scooter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a scooter
app.delete('/scooters/:id', async (req, res) => {
  try {
    const scooter = await Scooter.findByIdAndDelete(req.params.id);
    if (!scooter) {
      res.status(404).json({ message: 'Scooter not found' });
    }
    res.json(scooter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users)
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Create a new user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a user
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a user
app.delete('/users/:id', async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET all parkings
app.get('/parkings', async (req, res) => {
  console.log("DEAN")
  try {
    const parking = await Parking.find({});
    console.log(parking)
    res.json(parking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST create a parking
app.post('/parkings', async (req, res) => {
  const parking = new Parking({
    address: req.body.address,
    num_scooters_parked: req.body.num_scooters_parked,
    max_scooter_space: req.body.max_scooter_space,
    location: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }
  });

  try {
    const newParking = await parking.save();
    res.status(201).json(newParking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a parking
app.put('/parkings/:id', async (req, res) => {
  if (req.body.address != null) {
    res.parking.address = req.body.address;
  }
  if (req.body.num_scooters_parked != null) {
    res.parking.num_scooters_parked = req.body.num_scooters_parked;
  }
  if (req.body.max_scooter_space != null) {
    res.parking.max_scooter_space = req.body.max_scooter_space;
  }
  if (req.body.latitude != null) {
    res.parking.location.latitude = req.body.latitude;
  }
  if (req.body.longitude != null) {
    res.parking.location.longitude = req.body.longitude;
  }

  try {
    const updatedParking = await res.parking.save();
    res.json(updatedParking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a parking
app.delete('/parkings/:id', async (req, res) => {
  try {
    await res.parking.remove();
    res.json({ message: 'Deleted Parking' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Get all FailureTypes
app.get('/failures', async (req, res) => {
  try {
    const failures_type = await Failures_type.find({});
    console.log(failures_type)
    res.json(failures_type);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Create a FailureType
app.post('/failure-types', async (req, res) => {
  const failureType = new FailureType({
    type: req.body.type,
    status: req.body.status,
    opening_time: req.body.opening_time,
    closing_time: req.body.closing_time,
    scooter_id: req.body.scooter_id
  });
  try {
    const newFailureType = await failureType.save();
    res.status(201).json(newFailureType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a FailureType
app.put('/failure-types/:id', async (req, res) => {
  if (req.body.type != null) {
    res.failureType.type = req.body.type;
  }
  if (req.body.status != null) {
    res.failureType.status = req.body.status;
  }
  if (req.body.opening_time != null) {
    res.failureType.opening_time = req.body.opening_time;
  }
  if (req.body.closing_time != null) {
    res.failureType.closing_time = req.body.closing_time;
  }
  if (req.body.scooter_id != null) {
    res.failureType.scooter_id = req.body.scooter_id;
  }
  try {
    const updatedFailureType = await res.failureType.save();
    res.json(updatedFailureType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a FailureType
app.delete('/failure-types/:id', async (req, res) => {
  try {
    await res.failureType.remove();
    res.json({ message: 'FailureType deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post('/login', async (req, res) => {
  console.log("WWWOOOOOOWWW BACK")
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Check if the password is correct
    if (user.password !== password) {
      // Invalid password
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Successful login
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});





// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });






// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
