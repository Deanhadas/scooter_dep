import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ParkingSpot {
  _id: string;
  address: string;
  num_scooters_parked: number;
  max_scooter_space: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

const Home: React.FC = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

  const [formData, setFormData] = useState({
    address: '',
    num_scooters_parked: 0,
    max_scooter_space: 0,
    latitude: 0,
    longitude: 0,
  });



  useEffect(() => {
    // Fetch existing parking spots from the backend
    const fetchParkingSpots = async () => {
      try {
        const response = await axios.get('http://localhost:3000/parkings');
        console.log(response)
        const data = response.data;
        setParkingSpots(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchParkingSpots();
  }, []);



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const response = await axios.post('http://localhost:3000/parkings', formData);
        const newParkingSpot = response.data;
        setParkingSpots([...parkingSpots, newParkingSpot]);
        setFormData({
          address: '',
          num_scooters_parked: 0,
          max_scooter_space: 0,
          latitude: 0,
          longitude: 0,
        });
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };


return (
    
    <div className="home-container">

      

      <div className="add-parking-form">
        <h2>Add Parking Spot</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="num_scooters_parked">Number of Scooters Parked:</label>
            <input
              type="number"
              id="num_scooters_parked"
              name="num_scooters_parked"
              value={0}
            />
          </div>
          <div>
            <label htmlFor="max_scooter_space">Maximum Scooter Space:</label>
            <input
              type="number"
              id="max_scooter_space"
              name="max_scooter_space"
              value={formData.max_scooter_space}
              onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="latitude">Latitude:</label>
                <input
                            type="number"
                            id="latitude"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                        />
              </div>
              <div>
                <label htmlFor="longitude">Longitude:</label>
                <input
                            type="number"
                            id="longitude"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                        />
              </div>
              <button type="submit">Add Parking Spot</button>
              </form>
        </div>

        <div className="parking-spots">
        <h2>Existing Parking Spots</h2>
        {parkingSpots.map((spot) => (
          <div key={spot._id}>
            <p>Address: {spot.address}</p>
            <p>Number of Scooters Parked: {spot.num_scooters_parked}</p>
            <p>Maximum Scooter Space: {spot.max_scooter_space}</p>
            <p>
              Location: Latitude {spot.location.latitude}, Longitude {spot.location.longitude}
            </p>
            <hr />
          </div>
        ))}
      </div>


    </div>
    );



};

export default Home;