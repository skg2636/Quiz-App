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
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const PastAttempts = ({ pastAttemptData, onRefreshClick }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await onRefreshClick();
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
        <Typography variant="h6">Past Attempts</Typography>
        <Button
          variant="contained"
          onClick={handleRefresh}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell >Topic</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Time Taken</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastAttemptData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attempt) => (
                <TableRow key={attempt.quiz_id}>
                  <TableCell>{attempt.topic.toUpperCase()}</TableCell>
                  <TableCell>{attempt.difficulty.toUpperCase()}</TableCell>
                  <TableCell align="right">{attempt.score_percentage}%</TableCell>
                  <TableCell align="right">{formatTime(attempt.time_taken)}</TableCell>
                  <TableCell align="right">
                    {new Date(attempt.submitted_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={pastAttemptData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default PastAttempts;
