import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  styled,
  Paper,
  useTheme,
  useMediaQuery,
  keyframes,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import Timer from "./Timer";
import QuestionStatusDisplay from "./QuestionStatusDisplay";
import QuizSummaryPopup from "./QuizSummaryPopup";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import FlagIcon from "@mui/icons-material/Flag";
import { motion, AnimatePresence } from "framer-motion";
import QuizStart from "./QuizStart";
import { SubmitQuizAnswer } from "../api/restApi";
import { useAuth } from "../context/AuthContext";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  animation: `${fadeIn} 1s ease-in-out`,
  maxWidth: "100vw",
  padding: theme.spacing(2),
  overflow: "hidden",
  position: "relative",
}));

const QuestionSection = styled(Box)(({ theme }) => ({
  flex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  height: "100%",
  padding: theme.spacing(5),
  position: "relative",
}));

const StatusPanel = styled(Paper)(({ theme }) => ({
  width: "280px",
  height: "90vh",
  padding: theme.spacing(2),
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  background: "rgba(255, 255, 255, 0.9)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "12px",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "90%",
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  background: "rgba(255, 255, 255, 0.9)",
  textAlign: "left",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  borderRadius: "8px",
  fontWeight: "600",
  background: `linear-gradient(to right, ${theme.palette.secondary.light}, ${theme.palette.secondary.dark})`,
  color: "white",
  "&:hover": {
    background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light})`,
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(4),
  right: theme.spacing(4),
}));

const QuizQuestion = () => {
  const navigate = useNavigate();
  const [startQuiz, setStartQuiz] = useState(false);
  // question structure is
  // {
  //   question : "",
  //   options: [],
  //   answer : null,
  //   visited : false,
  //   markedForReview : false
  // }
  const [questions, setQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [timeConsumed, setTimeConsumed] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [previousIndex, setPreviousIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizId, setQuizId] = useState(null);
  const [stopTimeConsumption, setStopTimeConsumption] = useState(false);
  const [loading, setLoading] = useState(false);
  const userToken = useAuth().user.token;

  const handleAnswer = (answer) => {
    // set the selected answer here
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answer = answer;
    updatedQuestions[currentQuestionIndex].visited = true;
    setQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setPreviousIndex(currentQuestionIndex);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // also set the question as visited
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].visited = true;
      if (currentQuestionIndex + 1 < updatedQuestions.length) {
        updatedQuestions[currentQuestionIndex + 1].visited = true;
      }
      setQuestions(updatedQuestions);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setPreviousIndex(currentQuestionIndex);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowSummary(true);
    setStopTimeConsumption(true);
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      console.log(userToken);
      const answers = questions.map((question) => ({
        question_id: question.id,
        answer: question.answer,
      }));
      const response = await SubmitQuizAnswer(
        userToken,
        quizId,
        answers,
        timeConsumed
      );
      if (response.message) {
        alert(response.message);
        alert(`You Scored : ${response.score}%`);
        alert(
          "You will be redirected to the dashboaord, you can see the score in past attempts also"
        );
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Error submitting quiz");
      alert(error.message);
      alert("Resubmit Quiz");
      console.error("Error submitting quiz:", error);
    } finally {
      setLoading(false);
    }
  };
  const toggleMarkForReview = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].markedForReview =
      !updatedQuestions[currentQuestionIndex].markedForReview;
    setQuestions(updatedQuestions);
  };

  const handleClearSelection = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answer = null;
    setQuestions(updatedQuestions);
  };

  return (
    <StyledContainer>
      <HeaderContainer>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          sx={{
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            letterSpacing: "0.5px",
            padding: "8px 16px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            display: "inline-block",
          }}
        >
          Quiz
        </Typography>
      </HeaderContainer>

      {startQuiz ? (
        <>
          <QuestionSection>
            <StyledPaper elevation={3}>
              <AnimatePresence mode="wait" custom={currentQuestionIndex}>
                <motion.div
                  key={currentQuestionIndex}
                  initial={{
                    opacity: 0,
                    x: currentQuestionIndex > previousIndex ? 50 : -50,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: currentQuestionIndex > previousIndex ? -50 : 50,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {questions[currentQuestionIndex].question}
                    </Typography>
                    <Tooltip
                      title={
                        questions[currentQuestionIndex].markedForReview
                          ? "Unmark from Review"
                          : "Mark for Review"
                      }
                    >
                      <IconButton onClick={toggleMarkForReview}>
                        {questions[currentQuestionIndex].markedForReview ? (
                          <FlagIcon color="error" />
                        ) : (
                          <OutlinedFlagIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {questions[currentQuestionIndex].options.map(
                      (option, index) => (
                        <StyledButton
                          key={index}
                          variant="outlined"
                          fullWidth
                          sx={{
                            justifyContent: "flex-start",
                            backgroundColor:
                              questions[currentQuestionIndex].answer === option
                                ? "rgba(25, 118, 210, 0.08)"
                                : "transparent",
                            border:
                              questions[currentQuestionIndex].answer === option
                                ? "2px solid #1976d2"
                                : "1px solid rgba(0, 0, 0, 0.23)",
                            color:
                              questions[currentQuestionIndex].answer === option
                                ? "#ffffff"
                                : "inherit",
                            fontWeight:
                              questions[currentQuestionIndex].answer === option
                                ? 600
                                : 400,
                            boxShadow:
                              questions[currentQuestionIndex].answer === option
                                ? "0 2px 4px rgba(25, 118, 210, 0.15)"
                                : "none",
                            transform:
                              questions[currentQuestionIndex].answer === option
                                ? "scale(1.02)"
                                : "scale(1)",
                            "&:hover": {
                              backgroundColor:
                                questions[currentQuestionIndex].answer ===
                                option
                                  ? "rgba(25, 118, 210, 0.12)"
                                  : "rgba(0, 0, 0, 0.04)",
                              transform:
                                questions[currentQuestionIndex].answer ===
                                option
                                  ? "scale(1.02)"
                                  : "scale(1.01)",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                          onClick={() => handleAnswer(option)}
                        >
                          {option}
                        </StyledButton>
                      )
                    )}
                  </Box>{" "}
                </motion.div>
              </AnimatePresence>
              <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePrevQuestion}
                >
                  Previous
                </Button>
                <div>
                  <Button
                    variant="contained"
                    disabled={!questions[currentQuestionIndex]?.answer}
                    onClick={handleClearSelection}
                    sx={{
                      marginRight: "10px",
                    }}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    variant="contained"
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={handleNextQuestion}
                  >
                    Next
                  </Button>
                </div>
              </Box>
            </StyledPaper>
          </QuestionSection>

          <StatusPanel elevation={3}>
            <div>
              <Timer
                timeConsumed={timeConsumed}
                setTimeConsumed={setTimeConsumed}
                stopTimeConsumption={stopTimeConsumption}
              />
              <Divider
                sx={{
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              />
              <QuestionStatusDisplay
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
              />
              <Divider />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <StyledButton
                variant="contained"
                onClick={handleSubmitQuiz}
                style={{ marginTop: "10px" }}
              >
                Review & Submit
              </StyledButton>

              <StyledButton
                variant="contained"
                onClick={() => navigate("/dashboard")}
                style={{ marginTop: "10px" }}
              >
                Exit
              </StyledButton>
            </div>
          </StatusPanel>

          <QuizSummaryPopup
            open={showSummary}
            onClose={() => {
              setShowSummary(false);
              setStopTimeConsumption(false);
            }}
            questions={questions}
            onSubmit={handleFinalSubmit}
            loading={loading}
          />
        </>
      ) : (
        <>
          <QuizStart
            questions={questions}
            setQuestions={setQuestions}
            startQuiz={startQuiz}
            setStartQuiz={setStartQuiz}
            setQuizId={setQuizId}
          />
        </>
      )}
    </StyledContainer>
  );
};

export default QuizQuestion;
