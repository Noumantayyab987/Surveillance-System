import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';




const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.6), 0 0 20px rgba(74, 144, 226, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(74, 144, 226, 0.6), 0 0 50px rgba(74, 144, 226, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.6), 0 0 20px rgba(74, 144, 226, 0.6);
  }
`;


const Container = styled.div`
  overflow: hidden;
  background-image: url('https://www.hdwallpapers.in/thumbs/2021/plant_leaves_water_drops_dark_background_4k_hd_nature-t2.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #141b2d;

  @keyframes dropletAnim {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.8;
    }
    50% {
      transform: translateY(10px) scale(1.2);
      opacity: 0.4;
    }
    100% {
      transform: translateY(20px) scale(1);
      opacity: 0.8;
    }
  }
`;

const SignUpContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 20px;
  backdrop-filter: blur(15px);
  border-radius: 10px;
  margin: 2% 2% 20px 2%;
  background: rgba(74, 144, 226, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 10px;
  /* Add border animation */ 

  background: #1F2A40;
  color:#70d8bd;

  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid transparent;
    border-radius: 20px;
    animation: ${glowAnimation} 2s linear infinite alternate;


    
  }
`;
const SignInContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 20px;
  backdrop-filter: blur(15px);
  border-radius: 10px;
  margin: 2% 2% 20px 2%;
  background: rgba(74, 144, 226, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 10px;
  background: #1F2A40;
  color:#70d8bd;
  /* Add border animation */
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid transparent;
    border-radius: 10px;
    animation: ${glowAnimation} 2s linear infinite alternate;
  }
`;


const Title = styled.h2`
font-size: 24px;
margin-bottom: 20px;
display: flex;
justify-content: center;
align-items: center;
text-align: center;

`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  font-size: 1.2rem;
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  border-radius: 0.4rem;
  color: white;
  transition: all 0.3s ease-in-out;
  background: rgba(74, 144, 226, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 10px;
  border: 0.1px solid rgba(255, 255, 255, 0.18);
  border-color: #1e88e5;
  
  &:hover {
    cursor: pointer;
  color:#70d8bd;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: #1e88e5; /* Add blue border color */
    box-shadow: 0px 0px 3px 2px rgba(30, 136, 229, 0.6); /* Optional: Add a subtle box shadow */
  }
`;


const Button = styled.button`
  font-size: 1.2rem;
  padding: 0.3rem 0.5rem;
  border: none;
  border-radius: 0.4rem;
  color: #ffff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  background: rgba(74, 144, 226, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin-top: 10%;
  border: 2px solid rgba(255, 255, 255, 0.18);
  background: rgb(20, 27, 45)   
  color: #70d8bd;

  &:hover {
    cursor: pointer;
    color: #70d8bd;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  }
`;

const SuccessMessage = styled.p`
  color: green;
`;

const ErrorMessage = styled.p`
  color: red;
`;


function Registration() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const registerUser = async (name, email, password) => {
    try {
      const response = await fetch('https://34.30.143.245/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 201) {
        setSuccessMessage('User created successfully!');
        setErrorMessage('');
        window.location.reload();
      }else if (response.status === 406) {
        setSuccessMessage('');
        setErrorMessage('Email is invalid');
      }else {
        setSuccessMessage('');
        setErrorMessage('User already exists!');
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage('');
      setErrorMessage('Error creating user!');
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await fetch('https://34.30.143.245/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
        body: `grant_type=&username=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`,
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        document.cookie = `access_token=${data.access_token}; Secure`;
        document.cookie = `token_type=${data.token_type}; Secure`;

        setSuccessMessage('Successfully logged in!');
        setErrorMessage('');

        setIsLoggedIn(true); // Set login status to true

        window.location.href = 'http://localhost:3000/dashboard';
      } else if (response.status === 404) {
        setSuccessMessage('');
        setErrorMessage('Invalid email or password.');
      } else {
        setSuccessMessage('');
        setErrorMessage('Error logging in!');
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage('');
      setErrorMessage('Error logging in!');
    }
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    registerUser(name, email, password);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    loginUser(email, password);
  };

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

 

  useEffect(() => {
    const handleLogout = () => {
      if (isLoggedIn) {
        logout();
      }
    };

    

    const logout = () => {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'token_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
      setIsLoggedIn(false); // Set login status to false
  
      window.location.href = 'https://gregarious-pothos-f687f0.netlify.app/';
    };
  
    window.addEventListener('beforeunload', handleLogout);
  
    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, [isLoggedIn]);

  return (
    <Container>
      {isSignIn ? (
        <SignInContainer>

        <Form onSubmit={handleLogin}>
          <Title>Sign In</Title>
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Input type="email" name="email" placeholder="Email" required />
          <Input type="password" name="password" placeholder="Password" required />
          <Button type="submit">Sign In</Button>
          <p>
            Don't have an account?{' '}
            <Button type="button" onClick={toggleSignIn}>
              Sign Up
            </Button>
          </p>
        </Form>
        </SignInContainer>
      ) : (
        <SignUpContainer>
          <Form onSubmit={handleRegistration}>
            <Title>Sign Up</Title>
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Input type="text" name="name" placeholder="Name" required />
            <Input type="email" name="email" placeholder="Email" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Button type="submit">Sign Up</Button>
            <p>
              Already have an account?{' '}
              <Button type="button" onClick={toggleSignIn}>
                Sign In
              </Button>
            </p>
          </Form>
        </SignUpContainer>
      )}
    </Container>
  );
}

export default Registration;