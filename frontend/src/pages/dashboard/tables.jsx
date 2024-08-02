import { CardBody, Typography } from "@material-tailwind/react";
import { useState, useEffect, useRef } from 'react';
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
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

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

  useEffect(() => {
    if (window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('address'),
        {
          types: ['geocode'],
        }
      );
      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const addressComponents = place.address_components;
          const address = {
            street: addressComponents.find(ac => ac.types.includes('route'))?.long_name || '',
            village: addressComponents.find(ac => ac.types.includes('locality'))?.long_name || '',
            district: addressComponents.find(ac => ac.types.includes('administrative_area_level_2'))?.long_name || '',
            state: addressComponents.find(ac => ac.types.includes('administrative_area_level_1'))?.long_name || '',
            pincode: addressComponents.find(ac => ac.types.includes('postal_code'))?.long_name || '',
            locateonmap: place.formatted_address || '',
          };

          setFormData({
            ...formData,
            ...address,
            locateonmap: place.formatted_address || '',
          });
          
         
        }
      });
    }
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 p-6 bg-gray-100 rounded-lg shadow-md">
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
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
                {/* Error messages container */}
                {error && (
                  <Typography variant="small" color="red" className='mt-2'>
                    {error}
                  </Typography>
                )}
              </div>
              <div className="flex flex-col w-full sm:w-1/2">
                <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-1">
                  Locate On Map
                </label>
                <input
                  type="text"
                  id="address"
                  name="locateonmap"
                  value={locateonmap}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="street" className="text-sm font-semibold text-gray-700 ml-2">
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
                <label htmlFor="village" className="text-sm font-semibold text-gray-700 ml-2">
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
                <label htmlFor="district" className="text-sm font-semibold text-gray-700 ml-2">
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
                <label htmlFor="state" className="text-sm font-semibold text-gray-700 ml-2">
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
          </div>

          <button
            type="submit"
            disabled={!isFormValid}  // Button is disabled if the form is not valid
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
      <div ref={mapRef} className="w-full h-96 mt-4"></div>
    </div>
  );
}




