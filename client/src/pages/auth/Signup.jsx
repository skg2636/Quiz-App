// Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  styled,
  keyframes,
  Grid2,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Signup as SignupApi } from "../../api/restApi";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  animation: `${fadeIn} 1s ease-in-out`,
  maxWidth: "100%",
  overflow: "hidden",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "400px",
  width: "100%",
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  background: "rgba(255, 255, 255, 0.9)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    borderRadius: "12px",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(1.5),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  width: "100%",
  borderRadius: "8px",
  fontWeight: "600",
  background: `linear-gradient(to right, ${theme.palette.secondary.light}, ${theme.palette.secondary.dark})`,
  color: "white",
  "&:hover": {
    background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light})`,
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 2),
  },
}));

const MovingTextContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  maxWidth: "400px",
  width: "100%",
  animation: `${slideIn} 1s ease-in-out`,
  color: "white",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const MovingText = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  [theme.breakpoints.down("sm")]: {
    fontSize: "90%",
    marginBottom: theme.spacing(1),
  },
}));

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // password logic validation one capital one lower one special and one number and atleat 8 length
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setSnackbarOpen({
        open: true,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        severity: "error",
      });
      return;
    }

    // Add your signup logic here (e.g., API call)
    if (formData.password !== formData.confirmPassword) {
      setSnackbarOpen({
        open: true,
        message: "Passwords do not match",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await SignupApi(
        formData.name,
        formData.email,
        formData.password
      );
      if (response.error) {
        setSnackbarOpen({
          open: true,
          message: response.error,
          severity: "error",
        });
      } else {
        setSnackbarOpen({
          open: true,
          message: "Signup successful",
          severity: "success",
        });
        // wait here 4-5 seconds
        await new Promise((resolve) => setTimeout(resolve, 4000));
        navigate("/login"); // Redirect to login after signup
      }
      setLoading(false);
    } catch (error) {
      setSnackbarOpen({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledContainer>
        <Grid2
          container
          spacing={isMobile ? 1 : 2}
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh", margin: 0, width: "100%" }}
        >
          <Grid2 item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h2"
                gutterBottom
              >
                Sign Up
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <StyledTextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
                <StyledTextField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
                <StyledTextField
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
                <StyledTextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
                <StyledButton type="submit" variant="contained">
                  Sign Up
                </StyledButton>
                <Grid2
                  container
                  justifyContent="center"
                  marginTop={isMobile ? 1 : 2}
                >
                  <Grid2 item>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <Typography variant="body2" color="primary">
                        Already have an account? Login
                      </Typography>
                    </Link>
                  </Grid2>
                </Grid2>
              </Box>
            </StyledPaper>
          </Grid2>
          {!isMobile && (
            <Grid2 item xs={12} md={6}>
              <MovingTextContainer>
                <MovingText variant="h4">Join the AI Revolution</MovingText>
                <MovingText variant="h6">Create Your Account</MovingText>
                <MovingText variant="subtitle1">
                  Unlock AI-Powered Learning
                </MovingText>
                <MovingText variant="body2">
                  Start your journey into the world of AI quizzes!
                </MovingText>
              </MovingTextContainer>
            </Grid2>
          )}
        </Grid2>
      </StyledContainer>
      {loading && (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: 9999 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Snackbar open={snackbarOpen.open} autoHideDuration={5000}>
        <Alert
          severity={snackbarOpen.severity}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setSnackbarOpen({ ...snackbarOpen, open: false })}
        >
          {snackbarOpen.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;
