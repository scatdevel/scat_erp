import React, { useState, useEffect } from 'react';
import { loginUser } from '../../components/api'; // Importing API function to handle login
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react"; // Material-UI components
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation

export function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState(null);
  const [agree, setAgree] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const navigate = useNavigate();

  const isValid = formData.email.length > 0 && formData.password.length > 0 && agree;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Please enter a valid email.');
      } else {
        setEmailError('');
      }
    }
  };

  const handleAgreeChange = () => {
    setAgree(!agree);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError('Please enter a valid email.');
    } else {
      setEmailError('');
    }
  }, [formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email.');
      setError(null);
      setAlertMessage('');
      setShowAlert(true); // Show alert for email error
      return;
    }
  
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setEmailError('');
      setAlertMessage('');
      setShowAlert(true); // Show alert for password error
      return;
    }
  
    try {
      const response = await loginUser(formData);
      if (response) {
        setAlertMessage('Login successful!');
        setError(null);
        setEmailError('');
        setShowAlert(true); // Show success message


        setTimeout(() => {
          navigate('/dashboard/home'); // Redirect to dashboard
        }, 1000); 
      } else {
        throw new Error('Invalid email or password.');
      }
    } catch (err) {
      setError('Invalid email or password.');
      setEmailError('');
      setAlertMessage('');
      setShowAlert(true); // Show error message
      console.log(err);
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
          <div className="mb-1 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email" // Ensure email input type
            />
            {emailError && <Typography variant="small" color="red">{emailError}</Typography>}
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
            checked={agree}
            onChange={handleAgreeChange}
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

          {error && <Typography variant="small" color="red" className="mb-4">{error}</Typography>}

          <Button type="submit" disabled={!isValid} className="mt-6" fullWidth>
            Sign In
          </Button>

          {showAlert && (
  <div className={`alert shadow-blue-500/40 hover:shadow-indigo-500/40 mt-6 content-center text-black text-center rounded-lg ${error ? 'bg-red-300' : 'bg-green-300'}`}>
    {error || alertMessage}
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
          src="/img/Farmer3.jpeg"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern"
        />
      </div>
    </section>
  );
}

export default SignIn;
