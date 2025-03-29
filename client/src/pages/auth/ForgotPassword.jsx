// ForgotPassword.js
import React, { useState, useEffect } from "react";
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (emailSent && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [emailSent, countdown]);

  const handleSendVerification = () => {
    // Simulate sending verification code (replace with actual API call)
    console.log("Sending verification code to:", email);
    setEmailSent(true);
    setResendDisabled(true);
    setCountdown(60);
  };

  const handleVerifyCode = () => {
    // Simulate verifying code (replace with actual API call)
    console.log("Verifying code:", verificationCode);
    navigate("/reset-password"); // Redirect to reset password page
  };

  const handleResend = () => {
    // Simulate resending code (replace with actual API call)
    console.log("Resending verification code to:", email);
    setResendDisabled(true);
    setCountdown(60);
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
              Forgot Password
            </Typography>
            {!emailSent ? (
              <Box component="form" sx={{ width: "100%" }}>
                <StyledTextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
                <StyledButton onClick={handleSendVerification} variant="contained">
                  Send Verification Code
                </StyledButton>
              </Box>
            ) : (
              <Box component="form" sx={{ width: "100%" }}>
                <StyledTextField
                  label="Verification Code (6 digits)"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
                <StyledButton onClick={handleVerifyCode} variant="contained">
                  Verify Code
                </StyledButton>
                {/* {countdown > 0 && (
                  <Typography variant="body2" style={{ marginTop: "10px", textAlign: 'center'}}>
                    Resend code in {countdown} seconds
                  </Typography>
                )}
                <StyledButton
                  onClick={handleResend}
                  variant="outlined"
                  disabled={resendDisabled}
                  style={{ marginTop: "10px" }}
                >
                  Resend Code
                </StyledButton> */}
              </Box>
            )}
          </StyledPaper>
        </Grid2>
      </Grid2>
    </StyledContainer>
  );
};

export default ForgotPassword;