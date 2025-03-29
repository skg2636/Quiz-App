// GlobalScoreboard.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  CircularProgress
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { UpdateGlobalLeaderboard } from "../api/restApi";

const GlobalScoreboard = ({
  globalScoreCard,
  setGlobalScoreCard,
  globalScoreCardUpdateTime,
  setGlobalScoreCardUpdateTime,
}) => {
  const role = useAuth().user.role;
  const userToken = useAuth().user.token;
  const isAdmin = role === "admin";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleUpdateClick = async () => {
    try {
      setLoading(true);
      const data = await UpdateGlobalLeaderboard(userToken);
      if (data.leaderboard) {
        setGlobalScoreCard(data.leaderboard);
        setGlobalScoreCardUpdateTime(data.updated_at);
      }
    } catch (error) {
      console.error("Error updating global leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Global Scoreboard</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            onClick={handleUpdateClick}
            disabled={loading}
            endIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Updating..." : "Update Scores"}
          </Button>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Last updated: {new Date(globalScoreCardUpdateTime).toLocaleString()}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {globalScoreCard
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((score) => (
                <TableRow key={score.user_id}>
                  <TableCell>{score.username}</TableCell>
                  <TableCell align="right">{score.score}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={globalScoreCard.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default GlobalScoreboard;
