import React, { useState } from 'react';
import { loginUser } from '../../api';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography, 
  
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignIn() {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // if (username === '' || password === '') {
    //   setError('Username and password are required.');
    // } else {
    //   setError('');
    //   // Add your sign-in logic here
    // }




    try {
      const response = await loginUser(formData);


    setAlertMessage('Login successful!');
    setShowAlert(true);

      console.log(response);
      alert('Login successful');
      // Redirect to another page or take another appropriate action
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="flex justify-center items-center">
          <img src="/img/logo_scat.png" className="width-[30%]" alt="Logo" />
        </div>

        <div className="text-center">
          <Typography variant="h4" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your Email and password to Sign In.
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          {error && <Typography variant="small" color="red" className="mb-4">{error}</Typography>}
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="****"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />

      {error && <ErrorBlock message={error} />}

          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>

          {/* Alert Message */}
      {showAlert && (
        <div className="alert shadow-blue-500/40 hover:shadow-indigo-500/40 mt-6 content-center text-black text-center bg-green-300  rounded-lg">
          {alertMessage}
        </div>
      )}

        
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/farmer.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern"
        />
      </div>
    </section>
  );
}

export default SignIn;