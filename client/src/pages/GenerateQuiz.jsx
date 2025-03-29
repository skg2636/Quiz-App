import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Divider,
  styled,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { GenerateQuizQuestion, ConfirmQuizQuestion } from "../api/restApi";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  maxWidth: "100vw",
  padding: theme.spacing(3),
  overflow: "hidden",
  position: "relative",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "70%",
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  background: "rgba(255, 255, 255, 0.9)",
}));

const AdminQuizCreate = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const location = useLocation();
  const { topic, difficulty } = location.state || {};
  const [quizSettings, setQuizSettings] = useState({
    topic: topic || "",
    difficulty: difficulty || "",
    positiveMarking: 1,
    negativeMarking: 0,
  });
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  const userToken = useAuth().user.token;
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      setCurrentQuestion(questions[currentQuestionIndex]);
      setSelectedAnswer(questions[currentQuestionIndex].correct_answer || "");
    }
  }, [currentQuestionIndex, questions]);

  const handleNext = () => {
    const questionText = document.getElementById("questionText").value;
    const option1 = document.getElementById("option1").value;
    const option2 = document.getElementById("option2").value;
    const option3 = document.getElementById("option3").value;
    const option4 = document.getElementById("option4").value;
    const correctAnswer = document.querySelector(
      "input[name='correctAnswer']:checked"
    )?.value;

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      question: questionText,
      options: [option1, option2, option3, option4],
      correct_answer: correctAnswer,
    };
    setQuestions(updatedQuestions);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === questions.length - 1) {
      setCurrentQuestionIndex(questions.length);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);
      const data = await GenerateQuizQuestion(
        userToken,
        quizSettings.topic,
        quizSettings.difficulty
      );
      if (data.questions) {
        setQuestions(data.questions);
        setCurrentQuestion(data.questions[0]);
      } else {
        setSnackbarOpen({
          open: true,
          message: "No questions found for the given topic and difficulty.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbarOpen({
        open: true,
        message: "Error generating quiz questions.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateQuiz();
  }, []);

  const handleSaveQuiz = async () => {
    try {
      setLoading(true);
      const response = await ConfirmQuizQuestion(
        userToken,
        questions,
        quizSettings.positiveMarking,
        quizSettings.negativeMarking,
        quizSettings.topic,
        quizSettings.difficulty
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
          message: "Quiz saved successfully!, Redirecting to Dashobard...",
          severity: "success",
        });
        // wait for 2 secs
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/dashboard");
      }
    } catch (error) {
      setSnackbarOpen({
        open: true,
        message: "Error saving quiz.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <StyledContainer>
        <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
          Admin Quiz Creator
        </Typography>

        <StyledPaper>
          <AnimatePresence mode="wait">
            {currentQuestionIndex < questions.length ? (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="subtitle2" color="textSecondary" mb={2}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>

                <TextField
                  id="questionText"
                  label="Question"
                  fullWidth
                  defaultValue={currentQuestion.question}
                  variant="outlined"
                  margin="normal"
                />

                <Typography variant="subtitle1" mt={2} mb={1}>
                  Options:
                </Typography>
                <RadioGroup
                  name="correctAnswer"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                  {currentQuestion.options.map((option, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        id={`option${index + 1}`}
                        fullWidth
                        variant="outlined"
                        defaultValue={option}
                      />
                      <FormControlLabel
                        value={option}
                        control={<Radio />}
                        label="Correct"
                      />
                    </Box>
                  ))}
                </RadioGroup>

                <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    disabled={currentQuestionIndex === 0}
                    onClick={handlePrev}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                  >
                    Save & Next
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quiz Settings
                </Typography>

                <Typography variant="subtitle1" mt={2}>
                  Topic:
                </Typography>
                <Select
                  id="quizTopic"
                  fullWidth
                  value={quizSettings.topic}
                  onChange={(e) =>
                    setQuizSettings({ ...quizSettings, topic: e.target.value })
                  }
                  variant="outlined"
                >
                  <MenuItem value="general-knowledge">
                    General Knowledge
                  </MenuItem>
                  <MenuItem value="science-technology">
                    Science & Technology
                  </MenuItem>
                  <MenuItem value="history">History</MenuItem>
                  <MenuItem value="geography">Geography</MenuItem>
                  <MenuItem value="mathematics">Mathematics</MenuItem>
                  <MenuItem value="movies-tv">Movies & TV Shows</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="music">Music</MenuItem>
                  <MenuItem value="literature">Literature</MenuItem>
                  <MenuItem value="brain-teasers">
                    Brain Teasers & Riddles
                  </MenuItem>
                </Select>

                <Typography variant="subtitle1" mt={2}>
                  Difficulty:
                </Typography>
                <Select
                  id="quizDifficulty"
                  fullWidth
                  value={quizSettings.difficulty}
                  onChange={(e) =>
                    setQuizSettings({
                      ...quizSettings,
                      difficulty: e.target.value,
                    })
                  }
                  variant="outlined"
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>

                <Typography variant="subtitle1" mt={2}>
                  Positive Marking:
                </Typography>
                <TextField
                  id="positiveMarking"
                  type="number"
                  fullWidth
                  value={quizSettings.positiveMarking}
                  onChange={(e) =>
                    setQuizSettings({
                      ...quizSettings,
                      positiveMarking: parseFloat(e.target.value),
                    })
                  }
                  variant="outlined"
                  inputProps={{ min: 0, step: 1 }}
                />

                <Typography variant="subtitle1" mt={2}>
                  Negative Marking:
                </Typography>
                <TextField
                  id="negativeMarking"
                  type="number"
                  fullWidth
                  value={quizSettings.negativeMarking}
                  onChange={(e) =>
                    setQuizSettings({
                      ...quizSettings,
                      negativeMarking: parseFloat(e.target.value),
                    })
                  }
                  variant="outlined"
                  inputProps={{ max: 0, step: 0.25 }}
                />

                <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setCurrentQuestionIndex(questions.length - 1)
                    }
                  >
                    Back
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveQuiz}
                  >
                    Final Save
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </StyledPaper>
      </StyledContainer>
      {loading && (
        <Backdrop open={loading} style={{ zIndex: 9999 }}>
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

export default AdminQuizCreate;
