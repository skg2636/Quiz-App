import React from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";

const QuestionStatusDisplay = ({ questions, currentQuestionIndex }) => {
  const getStatusColor = (question) => {
    if (question.markedForReview) return "#D50000"; // Red for Marked For Review
    if (question.answer !== null) return "#00C853"; // Green for Answered
    if (question.visited && question.answer === null) return "#FF6D00"; // Orange for Visited
    return "#757575"; // Gray for Not Visited
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Question Status
      </Typography>
      <Grid container spacing={1}>
        {questions.map((question, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: `2px solid ${getStatusColor(question)}`,
                backgroundColor:
                  index === currentQuestionIndex ? "#B3E5FC" : "transparent", // Highlight current question
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              <Typography fontSize="0.9rem">{index + 1}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Legend Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Legend:
        </Typography>
        <Stack direction="row" spacing={3}>
          {[
            { label: "Answered", color: "#00C853" },
            { label: "Visited and Unanswered", color: "#FF6D00" },
          ].map(({ label, color }) => (
            <Stack key={label} direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />
              <Typography variant="caption">{label}</Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
          {[
            { label: "Not Visited", color: "#757575" },
            { label: "Marked For Review", color: "#D50000" },
          ].map(({ label, color }) => (
            <Stack key={label} direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />
              <Typography variant="caption">{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default QuestionStatusDisplay;
