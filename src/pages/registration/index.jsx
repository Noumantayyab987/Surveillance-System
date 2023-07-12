import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled, {  } from 'styled-components';
import {
  
  DialogContent,
  DialogContentText,
  
} from "@mui/material";



const backgroundImage = require('../../assets/CSS.png');


const SuccessMessage = styled.p`
  color: green;
`;

const ErrorMessage = styled.p`
  color: red;
`;


function SignInSide() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail) ? '' : 'Invalid email format');
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword) ? '' : 'Password must be at least 8 characters');
  };

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setUsernameError(validateUsername(newUsername) ? '' : 'Username must be at least 4 characters');
  };

  const handleSwitchMode = () => {
    setIsLogin((prevMode) => !prevMode);
    setEmail('');
    setUsername('');
    setPassword('');
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      // Login logic
      if (validateEmail(email) && validatePassword(password)) {
        try {
          const response = await fetch('http://34.170.11.146/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              accept: 'application/json',
            },
            body: `grant_type=&username=${encodeURIComponent(email)}&password=${encodeURIComponent(
              password
            )}&scope=&client_id=&client_secret=`,
          });
          const data = await response.json();
          console.log(data);

          if (response.status === 200) {
            document.cookie = `access_token=${data.access_token}; Secure`;
            document.cookie = `token_type=${data.token_type}; Secure`;

            // Redirect to the dashboard or desired page
            window.location.href = 'http://localhost:3000/dashboard';
          } else if (response.status === 404) {
            // Show error message for invalid email or password
            setErrorMessage('Invalid email or password.');
          } else {
            // Show generic error message for login failure
            setErrorMessage('Error logging in!');
          }
        } catch (error) {
          console.error(error);
          // Show generic error message for login failure
          setErrorMessage('Error logging in!');
        }
      }
    } else {
      // Registration logic
      if (validateEmail(email) && validatePassword(password) && validateUsername(username)) {
        try {
          const response = await fetch('http://34.170.11.146/user/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, email, password }),

          });
          const data = await response.json();
          console.log(data);

          if (response.status === 201) {
            // Show success message for user registration
            setSuccessMessage('User created successfully!');
            setErrorMessage('');
            // Reload the page or perform any other desired action
            window.location.reload();
          } else if (response.status === 406) {
            // Show error message for invalid email
            setErrorMessage('Email is invalid');
          } else {
            // Show error message for user already exists
            setErrorMessage('User already exists!');
          }
        } catch (error) {
          console.error(error);
          // Show generic error message for user registration failure
          setErrorMessage('Error creating user!');
        }
      }
    }
  };

  const validateEmail = (email) => {
    // Basic email format validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 6 characters validation
    return password.length >= 8;
  };

  const validateUsername = (username) => {
    // Minimum 4 characters validation
    return username.length >= 4;
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`, // Use the imported image as the background image
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#F25041' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Typography>
            {errorMessage && (
                <DialogContent>
                  <DialogContentText color="error">{successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}</DialogContentText>
                  <DialogContentText color="error">{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}</DialogContentText>
                </DialogContent>
              )}

            
            
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {!isLogin && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus={isLogin}
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameChange}
                  error={usernameError !== ''}
                  helperText={usernameError}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus={!isLogin}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailChange}
                error={emailError !== ''}
                helperText={emailError}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordChange}
                error={passwordError !== ''}
                helperText={passwordError}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: '#F25041' }}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" 
                  sx={{
                    color: '#F25041',
                    
                  }} >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2"
                  sx={{
                    color: '#F25041',
                    '&:hover': {
                      color: '#F25041', // Change the hover color if desired
                    },
                  }}
                  onClick={handleSwitchMode}>
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;
