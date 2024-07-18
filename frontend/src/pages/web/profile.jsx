import React, { useState } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import { Box, TextField, Button as MUIButton, Avatar as MUIAvatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from 'axios';

const useStyles = makeStyles(() => ({
  input: {
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #d1d1d1',
    backgroundColor: '#f5f5f5',
    padding: '12px 48px',
    fontWeight: '500',
    color: '#000',
    '&:focus': {
      borderColor: '#3f51b5',
    },
    '&::placeholder': {
      color: '#000',
    },
    '&.dark': {
      borderColor: '#333',
      backgroundColor: '#444',
      color: '#fff',
      '&::placeholder': {
        color: '#fff',
      },
      '&:focus': {
        borderColor: '#3f51b5',
      },
    },
  },
}));

const PhotoUpload = ({ username }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(/users/upload/profile-picture/${username}, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      setPreview(response.data.profilePictureUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box className="p-4 flex flex-col items-center">
      <Typography variant="h6" className="mb-4 text-center">Your Photo</Typography>
      <Box className="flex items-center justify-center my-4">
        {preview ? (
          <MUIAvatar
            src={preview}
            className="mr-4"
            sx={{ width: 100, height: 100 }}
          />
        ) : (
          <MUIAvatar
            src="https://via.placeholder.com/150"
            className="mr-4"
            sx={{ width: 100, height: 100 }}
          />
        )}
      </Box>
      <Box className="flex space-x-2 mb-4">
        <MUIButton variant="outlined" color="primary" onClick={() => setPreview(null)}>Delete</MUIButton>
        <MUIButton variant="contained" color="primary" onClick={() => document.getElementById('fileInput').click()}>Update</MUIButton>
      </Box>
      <form onSubmit={handleSubmit} className="w-full flex justify-between">
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".svg, .png, .jpg, .gif"
        />
        <Box
          className="border-dashed border-2 p-2 text-center cursor-pointer flex-1 mr-2"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <Typography variant="body1">Click to upload or drag and drop</Typography>
          <Typography variant="body2">SVG, PNG, JPG or GIF (max, 800 X 800px)</Typography>
        </Box>
        <MUIButton 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ padding: '4px 6px', fontSize: '0.75rem', minWidth: '80px' ,height:'40px' }}
        >
          Save
        </MUIButton>
      </form>
    </Box>
  );
};

export function Profile() {
  const classes = useStyles();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const handleSave = async () => {
    try {
      const response = await axios.post('/users/update', {
        username,
        fullName,
        phoneNumber,
        email,
        bio
      });
      console.log('User data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleCancel = () => {
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setUsername('');
    setBio('');
  };

  return (
    <>
      <div className="relative mt-6 h-32 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-700/75 flex items-center justify-center">
          <Typography variant="h3" className="text-white"> </Typography>
        </div>
      </div>
      <Card className="mx-1 -mt-6 mb-2 lg:mx-2 shadow-lg">
        <CardBody className="p-1">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
            <div className="w-64 flex items-center">
              <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
              <Typography variant="h6" className="inline-block">App</Typography>
            </div>
          </div>
          <PhotoUpload username={username} />
        </CardBody>
      </Card>
      <Box className="p-2">
        <Typography variant="h5" className="mb-6">Settings Page</Typography>
        <Box className="mb-4">
          <Typography variant="h6" className="mb-2">Personal Information</Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              className="my-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                classes: {
                  input: classes.input,
                },
              }}
            />
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              className="my-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputProps={{
                classes: {
                  input: classes.input,
                },
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              className="my-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              InputProps={{
                classes: {
                  input: classes.input,
                },
              }}
            />
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              className="my-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                classes: {
                  input: classes.input,
                },
              }}
            />
          </Box>

          <div>
            <Typography variant="h6" className="mb-2">Bio</Typography>
            <TextField
              fullWidth
              label="Bio"
              variant="outlined"
              multiline
              rows={4}
              className="my-2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              InputProps={{
                classes: {
                  input: classes.input,
                },
              }}
              placeholder="Write your bio here"
            />
          </div>

          <Box className="flex justify-end mt-6">
            <MUIButton variant="contained" color="primary" className="mr-2" onClick={handleSave}>Save</MUIButton>
            <MUIButton variant="outlined" color="secondary" onClick={handleCancel}>Cancel</MUIButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Profile;