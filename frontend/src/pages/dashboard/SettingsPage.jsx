// src/components/SettingsPage.jsx

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Avatar } from '@mui/material';

const SettingsPage = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  
  // useEffect(() => {
  //   if (window.google) {
  //     const map = new window.google.maps.Map(mapRef.current, {
  //       center: { lat: -34.397, lng: 150.644 },
  //       zoom: 8,
  //     });

  //     const autocomplete = new window.google.maps.places.Autocomplete(
  //       document.getElementById('address'),
  //       {
  //         types: ['geocode'],
  //       }
  //     );
  //     autocompleteRef.current = autocomplete;

  //     autocomplete.addListener('place_changed', () => {
  //       const place = autocomplete.getPlace();
  //       if (place.geometry) {
  //         const addressComponents = place.address_components;
  //         const address = {
  //           street: addressComponents.find(ac => ac.types.includes('route'))?.long_name || '',
  //           village: addressComponents.find(ac => ac.types.includes('locality'))?.long_name || '',
  //           district: addressComponents.find(ac => ac.types.includes('administrative_area_level_2'))?.long_name || '',
  //           state: addressComponents.find(ac => ac.types.includes('administrative_area_level_1'))?.long_name || '',
  //           pincode: addressComponents.find(ac => ac.types.includes('postal_code'))?.long_name || '',
  //           locateonmap: place.formatted_address || '',
  //         };

  //         setFormData({
  //           ...formData,
  //           ...address,
  //           locateonmap: place.formatted_address || '',
  //         });
          
         
  //       }
  //     });
  //   }
  // }, []);

  const handleSave = () => {
    // Handle the save action
    console.log({
      fullName,
      phoneNumber,
      email,
      username,
      bio,
    });
  };

  const handleCancel = () => {
    // Handle the cancel action
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setUsername('');
    setBio('');
  };

  return (
    <Box className="p-4">
      <Typography variant="h5" className="mb-4">Settings Page</Typography>

      <Box className="mb-4">
        <Typography variant="h6">Personal Information</Typography>
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          className="my-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          className="my-2"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          className="my-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          className="my-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="BIO"
          variant="outlined"
          multiline
          rows={4}
          className="my-2"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Box className="flex justify-end mt-4">
          <Button variant="contained" color="primary" className="mr-2" onClick={handleSave}>Save</Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6">Your Photo</Typography>
        <Box className="flex items-center my-2">
          <Avatar
            alt="Devid Jhon"
            src="https://via.placeholder.com/150"
            className="mr-4"
          />
          <Button variant="outlined" color="primary" className="mr-2">Delete</Button>
          <Button variant="contained" color="primary">Update</Button>
        </Box>
        <Box className="border-dashed border-2 p-4 text-center">
          <Typography>Click to upload or drag and drop</Typography>
          <Typography>SVG, PNG, JPG or GIF (max, 800 X 800px)</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
