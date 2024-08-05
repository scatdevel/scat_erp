import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import axios from 'axios';

export function Tables() {
  const [formData, setFormData] = useState({
    village: "",
    taluk: "",
    district: "",
    pincode: "",
    locateonmap: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  };

  const fetchLocationDetails = () => {
    const token = localStorage.getItem('token'); // Get token from local storage
    axios.get(`http://localhost:8080/users/location?pincode=${formData.pincode}`, {
        headers: {
            'Authorization': `Bearer ${token}` // Include the token
        }
    })
    .then(response => {
        const data = response.data;
        if (data) {
            setFormData({
                ...formData,
                village: data.village || "",
                taluk: data.taluk || "",
                district: data.district || "",
            });
        }
    })
    .catch(error => console.error('Error fetching location details:', error));
};


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 p-6 bg-gray-100 rounded-lg shadow-md">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h5" color="white">
            Land Details
          </Typography>
        </CardHeader>
      </Card>

      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="village" className="text-sm font-semibold text-gray-700">
              Village
            </label>
            <input
              type="text"
              id="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Your Village"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="taluk" className="text-sm font-semibold text-gray-700">
              Taluk
            </label>
            <input
              type="text"
              id="taluk"
              name="taluk"
              value={formData.taluk}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Your Taluk"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="district" className="text-sm font-semibold text-gray-700">
              District
            </label>
            <input
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pincode" className="text-sm font-semibold text-gray-700">
              Pincode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 flex-grow"
                placeholder="Enter pincode"
              />
              <button
                type="button"
                onClick={fetchLocationDetails}
                className="p-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="locateonmap" className="text-sm font-semibold text-gray-700">
              Locate On Map
            </label>
            <input
              type="text"
              id="locateonmap"
              name="locateonmap"
              value={formData.locateonmap}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 p-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </CardBody>
    </div>
  );
}

export default Tables;
