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
    const token = localStorage.getItem('jwtToken');
    axios.get('http://localhost:8080/users/location', {
      headers: {
        'Authorization': `Bearer ${token}`
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
        } else if (data && data.error) {
          console.error('Error fetching location details:', data.error);
        }
      })
      .catch(error => console.error('Error fetching location details:', error));
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Land Details
          </Typography>
        </CardHeader>
      </Card>

      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="village" className="text-sm font-bold text-blue-gray-400">
              Village
            </label>
            <input
              type="text"
              id="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
              placeholder="Enter Your Village"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="taluk" className="text-sm font-bold text-blue-gray-400">
              Taluk
            </label>
            <input
              type="text"
              id="taluk"
              name="taluk"
              value={formData.taluk}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
              placeholder="Enter Your Taluk"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="district" className="text-sm font-bold text-blue-gray-400">
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
              placeholder="Enter Your District"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pincode" className="text-sm font-bold text-blue-gray-400">
              Pincode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded flex-grow"
                placeholder="Enter pincode"
              />
              <button
                type="button"
                onClick={fetchLocationDetails}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="locateonmap" className="text-sm font-bold text-blue-gray-400">
              Locate On Map
            </label>
            <input
              type="text"
              id="locateonmap"
              name="locateonmap"
              value={formData.locateonmap}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
              placeholder="Enter Map Location"
            />
          </div>

          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </CardBody>
    </div>
  );
}

export default Tables;
