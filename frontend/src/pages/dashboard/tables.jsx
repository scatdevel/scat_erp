import { CardBody, Typography } from "@material-tailwind/react";
import { useState, useEffect } from 'react';
import axios from 'axios';

export function Tables() {
  const [formData, setFormData] = useState({
    street: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
    locateonmap: "",
  });

  const [locationDetails, setLocationDetails] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mapUrl, setMapUrl] = useState(""); // URL for Google Maps

  const { street, village, district, state, pincode, locateonmap } = formData;

  // Check if all required fields are filled
  const isFormValid = [street, village, district, state, pincode].every(value => value.length > 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/users/locations', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Data submitted successfully!');
      setError('');
    } catch (err) {
      console.error('Error submitting data:', err);
      setError('Error submitting data.');
      setSuccess('');
    }
  };

  const fetchLocationDetails = async (pincode) => {
    if (!pincode) {
      setError("Pincode is required.");
      setLocationDetails(null);
      return;
    }

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setLocationDetails(postOffice);
        setFormData({
          ...formData,
          village: postOffice.Name || '',
          district: postOffice.District || '',
          state: postOffice.State || '',
          locateonmap: '',
        });

        const mapQuery = `${postOffice.Name || ''}, ${postOffice.District || ''}, ${postOffice.State || ''}`;
        setMapUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`);

        setError('');
        setSuccess('Location details fetched successfully.');
      } else {
        setLocationDetails(null);
        setError('No location found.');
        setSuccess('');
      }
    } catch (err) {
      setLocationDetails(null);
      setError('Error fetching location details.');
      setSuccess('');
    }
  };

  useEffect(() => {
    if (pincode.length === 6) {
      fetchLocationDetails(pincode);
    } else {
      setLocationDetails(null);
      if (pincode.length > 2) {
        setError('Invalid Pincode.');
      }
    }
  }, [pincode]);

  const handleFetchCurrentAddress = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          // Attempt to fetch address from Google Maps API
          const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
              latlng: `${latitude},${longitude}`,
              key: 'AIzaSyAGNioJ2c1RHOlonOZBlyW5-xbPrQSo19s'
            }
          });
  
          const data = response.data;
  
          if (data.status === "OK") {
            const address = data.results[0].formatted_address || '';
            setFormData({
              ...formData,
              locateonmap: address,
            });
            setError('');
            setSuccess('Current address fetched successfully.');
          } else {
            throw new Error(`Google Maps API error: ${data.status}`);
          }
        } catch (err) {
          console.error('Google Maps API error:', err);
          
          // Fallback to another geocoding service if Google Maps fails
          try {
            const fallbackResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
              params: {
                lat: latitude,
                lon: longitude,
                format: 'json',
                addressdetails: 1,
              }
            });
  
            const fallbackData = fallbackResponse.data;
  
            if (fallbackData) {
              const address = fallbackData.display_name || '';
              setFormData({
                ...formData,
                locateonmap: address,
              });
              setError('');
              setSuccess('Current address fetched successfully.');
            } else {
              throw new Error('Fallback service error: No address found.');
            }
          } catch (fallbackErr) {
            setError('Error fetching address details. Please check your API key and network connection.');
            setSuccess('');
            console.error('Fallback geocoding error:', fallbackErr);
          }
        }
      },
      (error) => {
        setError(`Error retrieving location: ${error.message}`);
        console.error('Geolocation error:', error);
      },
      {
        timeout: 10000, // Set a timeout for the geolocation request
        maximumAge: 60000, // Use cached position if available
      }
    );
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 p-6 bg-gray-100 rounded-lg shadow-md">
      <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2 relative">
              <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-1">
                Locate On Map
                <button
                  type="button"
                  onClick={handleFetchCurrentAddress}
                  className="absolute left-2 mt-3 top-1/2 transform -translate-y-1/2 p-1 bg-red-300 text-white rounded-full shadow-md hover:bg-red-400"
                  aria-label="Get Current Address"
                >
                  <i className="fas fa-map-marker-alt"></i>
                </button>
              </label>
              <input
                type="text"
                id="address"
                name="locateonmap"
                value={locateonmap}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full pl-12" // Add padding-left for button space
                readOnly
              />
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="pincode" className="text-sm font-semibold text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={pincode}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Enter pincode To Fetch Details"
              />
              {error && (
                <Typography variant="small" color="red" className='mt-2 ml-1.5'>
                  {error}
                </Typography>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="street" className="text-sm font-semibold text-gray-700 mb-1">
                Street
              </label>
              <input
                id="street"
                name="street"
                value={street}
                onChange={handleChange}
                placeholder="Enter Your Street"
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="village" className="text-sm font-semibold text-gray-700 mb-1">
                Village
              </label>
              <input
                readOnly
                id="village"
                name="village"
                value={village}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Enter Your Village"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="district" className="text-sm font-semibold text-gray-700 mb-1">
                District
              </label>
              <input
                readOnly
                id="district"
                name="district"
                value={district}
                onChange={handleChange}
                placeholder="Enter Your District"
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="state" className="text-sm font-semibold text-gray-700 mb-1">
                State
              </label>
              <input
                readOnly
                id="state"
                name="state"
                value={state}
                onChange={handleChange}
                placeholder="Enter Your State"
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`mt-4 p-3 ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-gray-200'} text-white rounded-lg shadow focus:outline-none`}
          >
            Submit
          </button>

          {success && (
            <div className="-mt-2 p-2 bg-green-100 text-green-800 rounded-lg">
              {success}
            </div>
          )}
        </form>
      </CardBody>
      <div className="w-full h-96 mt-4">
        {mapUrl && <iframe src={mapUrl} className="w-full h-full border-none" title="Location Map"></iframe>}
      </div>
    </div>
  );
}




