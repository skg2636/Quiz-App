import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  CircularProgress
} from "@mui/material";

const QuizSummaryPopup = ({ open, onClose, questions, onSubmit, loading }) => {
  // Counting different statuses based on the new question structure
  const attempted = questions.filter((q) => q.answer !== null).length;
  const unanswered = questions.length - attempted;
  const visited = questions.filter((q) => q.visited).length;
  const notVisited = questions.length - visited;

  const summaryData = [
    { label: 'Total Questions', value: questions.length },
    { label: 'Attempted', value: attempted },
    { label: 'Unanswered', value: unanswered },
    { label: 'Visited', value: visited },
    { label: 'Not Visited', value: notVisited }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: '#f3e5f5',
          borderRadius: '12px',
          width: "450px"
        }
      }}
    >
      <DialogTitle sx={{ color: '#4a148c', fontWeight: 'bold' }}>
        Quiz Summary
      </DialogTitle>
      <Divider  />
      <DialogContent>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableBody>
              {summaryData.map((row, index) => (
                <>
                  <TableRow key={row.label}>
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        color: '#4a148c',
                        border: 'none',
                        padding: '8px 16px 8px 0'
                      }}
                    >
                      {row.label}:
                    </TableCell>
                    <TableCell 
                      align="left"
                      sx={{ 
                        color: '#000',
                        border: 'none',
                        padding: '8px 0',
                        fontWeight: 'bold'
                      }}
                    >
                      {row.value}
                    </TableCell>
                  </TableRow>
                  {index !== summaryData.length - 1 && (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ padding: '0' }}>
                        <Divider sx={{ backgroundColor: '#4a148c', opacity: 0.3 }} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Divider  />
      <DialogActions sx={{ padding: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#4a148c',
            '&:hover': {
              backgroundColor: '#e1bee7'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={loading}
          variant="contained" 
          sx={{
            backgroundColor: '#4a148c',
            '&:hover': {
              backgroundColor: '#6a1b9a'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : (
            'Confirm Submit'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizSummaryPopup;
