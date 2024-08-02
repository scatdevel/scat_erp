import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from 'axios';

export function Tables() {
  const [formData, setFormData] = useState({
    village: "",
    district: "",
    pincode: "",
    address: "",
    locateonmap: "",
    state: "",
  });
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
  };

  const fetchLocationDetails = async () => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${formData.pincode}`);
      const data = response.data;
      if (data && data[0] && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prevState) => ({
          ...prevState,
          village: postOffice.Name || "",
          district: postOffice.District || "",
          state: postOffice.State || "",
        }));
        setIsFieldsDisabled(true);
        setError(null);
      } else {
        setError('Invalid Pincode.');
        setFormData((prevState) => ({
          ...prevState,
          village: "",
          district: "",
          state: "",
        }));
        setIsFieldsDisabled(false);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
      setError('Failed to fetch location details. Please try again.');
      setFormData((prevState) => ({
        ...prevState,
        village: "",
        district: "",
        state: "",
      }));
      setIsFieldsDisabled(false);
    }
  };

  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetchLocationDetails();
    }
  }, [formData.pincode]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFormData((prevState) => ({
          ...prevState,
          locateonmap: `${lat},${lng}`,
        }));

        // Use reverse geocoding to get the address from lat and lng
        try {
          const geocodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBlvXBISfsHw8e6zLp-RGqI6xhKSw2KmuM`);
          if (geocodeResponse.data && geocodeResponse.data.results[0]) {
            const result = geocodeResponse.data.results[0];
            const address = result.formatted_address;
            setFormData((prevState) => ({
              ...prevState,
              address: address,
            }));
            setError(null);
          } else {
            setError('Unable to retrieve address from location. Please try again.');
            setFormData((prevState) => ({
              ...prevState,
              address: "",
            }));
          }
        } catch (error) {
          console.error('Error reverse geocoding location:', error);
          setError('Failed to retrieve address from location. Please check your network connection.');
        }
      }, (error) => {
        console.error('Error getting current location:', error);
        setError('Failed to get current location. Please allow location access.');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pincode) {
      setError('Pincode is required.');
      return;
    }
    if (!formData.village || !formData.district || !formData.address || !formData.locateonmap) {
      setError('Please provide all location details.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/users/land-details/submit', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        setSuccessMessage('Form submitted successfully!');
        setError(null);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="relative mt-12 mb-8 flex flex-col gap-12 p-6 bg-gray-20 rounded-lg shadow-lg h-screen">
      <CardBody className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm relative">
              <i className="text-gray-500 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#FF7E8B" width="40" height="20" viewBox="0 0 20 20" aria-labelledby="icon-svg-title- icon-svg-desc-" role="img" className="iRDDBk">
                  <title>location-fill</title>
                  <path d="M10.2 0.42c-4.5 0-8.2 3.7-8.2 8.3 0 6.2 7.5 11.3 7.8 11.6 0.2 0.1 0.3 0.1 0.4 0.1s0.3 0 0.4-0.1c0.3-0.2 7.8-5.3 7.8-11.6 0.1-4.6-3.6-8.3-8.2-8.3zM10.2 11.42c-1.7 0-3-1.3-3-3s1.3-3 3-3c1.7 0 3 1.3 3 3s-1.3 3-3 3z"></path>
                </svg>
              </i>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="p-3 border-0 bg-white text-gray-800 placeholder-gray-500 flex-1 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address"
                disabled={isFieldsDisabled}
              />
              <i className="text-gray-500 p-2 cursor-pointer" onClick={getCurrentLocation}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#4F4F4F"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    aria-labelledby="location-icon-title"
    role="img"
    className="iRDDBk"
  >
    <title id="location-icon-title">location-pin</title>
    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 11.68 7.19 11.87.12.12.28.13.41.13s.29-.02.41-.13C12 20.68 19 14.25 19 9c0-3.86-3.14-7-7-7zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
  </svg>
</i>


              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-4 cursor-pointer flex items-center" onClick={getCurrentLocation}>
                    <i className="text-red-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#EF4F5F" width="14" height="14" viewBox="0 0 20 20" aria-labelledby="icon-svg-title- icon-svg-desc-" role="img" className="kyPUnV">
                        <title>current-location</title>
                        <path d="M13.58 10c0 1.977-1.603 3.58-3.58 3.58s-3.58-1.603-3.58-3.58c0-1.977 1.603-3.58 3.58-3.58v0c1.977 0 3.58 1.603 3.58 3.58v0zM20 9.52v0.96c0 0.265-0.215 0.48-0.48 0.48v0h-1.72c-0.447 3.584-3.256 6.393-6.84 6.84v1.72c0 0.265-0.215 0.48-0.48 0.48v0h-0.96c-0.265 0-0.48-0.215-0.48-0.48v0-1.72c-3.584-0.447-6.393-3.256-6.84-6.84h-1.72c-0.265 0-0.48-0.215-0.48-0.48v0-0.96c0-0.265 0.215-0.48 0.48-0.48v0h1.72c0.447-3.584 3.256-6.393 6.84-6.84v-1.72c0-0.265 0.215-0.48 0.48-0.48v0h0.96c0.265 0 0.48 0.215 0.48 0.48v0 1.72c3.584 0.447 6.393 3.256 6.84 6.84h1.72c0.265 0 0.48 0.215 0.48 0.48v0zM12.52 10c0-1.38-1.14-2.52-2.52-2.52v0c-1.38 0-2.52 1.14-2.52 2.52v0c0 1.38 1.14 2.52 2.52 2.52v0c1.38 0 2.52-1.14 2.52-2.52v0z"></path>
                      </svg>
                    </i>
                    <span className="text-gray-800">Current Location</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <input
            type="text"
            id="village"
            name="village"
            value={formData.village}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter village"
            disabled={isFieldsDisabled}
          />
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter district"
            disabled={isFieldsDisabled}
          />
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter state"
            disabled={isFieldsDisabled}
          />
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pincode"
          />
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm mt-2">{successMessage}</div>
          )}
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </CardBody>
    </div>
  );
}

export default Tables;
