// ResetPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
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

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Simulate password reset (replace with actual API call)
      console.log("Resetting password:", password);
      navigate("/login"); // Redirect to login after reset
    } else {
      alert("Passwords do not match.");
    }
  };

  return (
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
            <Typography variant={isMobile ? "h5" : "h4"} component="h2" gutterBottom>
              Reset Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <StyledTextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
              <StyledTextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
              <StyledButton type="submit" variant="contained" >
                Reset Password
              </StyledButton>
            </Box>
          </StyledPaper>
        </Grid2>
      </Grid2>
    </StyledContainer>
  );
};

export default ResetPassword;