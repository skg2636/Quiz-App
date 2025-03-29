// Profile.js
import React from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

const Profile = ({ name, email, role }) => {
  const logout = useAuth().logout;
  const token = useAuth().user.token;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" justifyContent="flex-end" width="100%">
        <IconButton onClick={() => {
          logout(token);
        }} >
          <LogoutIcon />
        </IconButton>
      </Box>
      <Avatar
        alt="User Profile"
        sx={{
          width: 80,
          height: 80,
          marginBottom: "10px",
          bgcolor: "#1976d2",
          color: "#fff",
        }}
      >
        {name
          ?.split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()}
      </Avatar>{" "}
      <Typography variant="h6">{name}</Typography>
      <Typography variant="body2">{email}</Typography>
      <Typography variant="body2">{role}</Typography>
    </Box>
  );
};

export default Profile;
