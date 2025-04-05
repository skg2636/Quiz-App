import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  TextField,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import Profile from "./Profile";
import PastAttempts from "./PastAttempts";
import GlobalScoreboard from "./GlobalScoreboard";
import { useAuth } from "../context/AuthContext";
import { FetchPastAttempts, FetchGlobalLeaderboard, QuizAutoGeneration } from "../api/restApi";

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  padding: theme.spacing(4),
  maxWidth: "100%",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledPaper = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  background: "rgba(255, 255, 255, 0.9)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    borderRadius: "12px",
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
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(6),
  justifyContent: "center",
  width: "100%",
  maxWidth: "1300px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Column = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: "320px",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [adminTopic, setAdminTopic] = useState("");
  const [adminDifficulty, setAdminDifficulty] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const username = useAuth().user.username;
  const email = useAuth().user.email;
  const role = useAuth().user.role;
  const usertoken = useAuth().user.token;
  const [pastAttempts, setPastAttempts] = useState([]);
  const [globalScoreCard, setGlobalScoreCard] = useState([]);
  const [globalScoreCardUpdateTime, setGlobalScoreCardUpdateTime] =
    useState(null);

  const handleStartQuiz = () => {
    if (topic && difficulty) {
      navigate("/quiz-start", { state: { topic, difficulty } });
    } else {
      alert("Please select a topic and difficulty.");
    }
  };

  const handleGenerateQuiz = () => {
    if (adminTopic && adminDifficulty) {
      var customInfo = document.getElementById("custom-info").value;
      if (customInfo === "") {
        customInfo = "No custom info provided";
      }
      navigate("/generate-quiz", {
        state: {
          topic: adminTopic,
          difficulty: adminDifficulty,
          customInfo: customInfo,
        },
      });
    } else {
      alert("Please select a topic and difficulty for quiz generation.");
    }
  };

  // Animation variants
  const paperVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  const fetchPastAttempts = async () => {
    try {
      const data = await FetchPastAttempts(usertoken);
      if (data.past_attempts) {
        setPastAttempts(data.past_attempts);
      }
    } catch (error) {
      console.error("Error fetching past attempts:", error);
    }
  };

  const fetchGlobalLeaderboard = async () => {
    try {
      const data = await FetchGlobalLeaderboard(usertoken);
      if (data.leaderboard) {
        setGlobalScoreCard(data.leaderboard);
        setGlobalScoreCardUpdateTime(data.updated_at);
      }
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
    }
  };

  const fetchData = async () => {
    await fetchPastAttempts();
    await fetchGlobalLeaderboard();
  };

  const handleAutoGeneration = async () => {
    try{
      const data = await QuizAutoGeneration(usertoken);
      if(data.success){
        alert(data.success)
      }else{
        alert(data.error || "Something went wrong")
      }
    }catch(error){
      console.error("Error generating quiz:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StyledContainer>
      <ContentWrapper>
        {/* Right Column */}
        <Column>
          <StyledPaper
            elevation={3}
            initial="hidden"
            animate="visible"
            variants={paperVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Profile
              name={username}
              email={email}
              role={role === "admin" ? "Admin" : "User"}
            />
          </StyledPaper>

          <StyledPaper
            elevation={3}
            initial="hidden"
            animate="visible"
            variants={paperVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h2"
              gutterBottom
            >
              Dashboard
            </Typography>
            <Box width="90%" marginTop="10px">
              <Typography variant="h6" gutterBottom>
                Start a Quiz
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="topic-select-label">Topic</InputLabel>
                <Select
                  labelId="topic-select-label"
                  id="topic-select"
                  label="topic"
                  onChange={(e) => setTopic(e.target.value)}
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
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-select-label"
                  id="difficulty-select"
                  label="Difficulty"
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>

              <StyledButton variant="contained" onClick={handleStartQuiz}>
                Start Quiz
              </StyledButton>
            </Box>
          </StyledPaper>

          {role === "admin" && (
            <StyledPaper
              elevation={3}
              initial="hidden"
              animate="visible"
              variants={paperVariants}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" gutterBottom>
                  Generate Quiz (Admin)
                </Typography>
                <Tooltip title="Auto-generate quiz with all topic and difficulty">
                  <Button variant="contained" color="secondary"
                    onClick={handleAutoGeneration}
                  >
                    Auto Generate
                  </Button>
                </Tooltip>
              </Stack>
              <Box width="90%">
                <FormControl fullWidth margin="normal">
                  <InputLabel id="admin-topic-select-label">Topic</InputLabel>
                  <Select
                    labelId="admin-topic-select-label"
                    id="admin-topic-select"
                    label="Topic"
                    value={adminTopic}
                    onChange={(e) => setAdminTopic(e.target.value)}
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
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="admin-difficulty-select-label">
                    Difficulty
                  </InputLabel>
                  <Select
                    labelId="admin-difficulty-select-label"
                    id="admin-difficulty-select"
                    label="Difficulty"
                    value={adminDifficulty}
                    onChange={(e) => setAdminDifficulty(e.target.value)}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    id="custom-info"
                    label="Custom Information(Optional)"
                    multiline
                    rows={4}
                    placeholder="Enter any additional information here, like the standard, classes, syllabus, or any certain topics you want to include in the quiz."
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>

                <StyledButton variant="contained" onClick={handleGenerateQuiz}>
                  Generate Quiz
                </StyledButton>
              </Box>
            </StyledPaper>
          )}
        </Column>
        <Column>
          <StyledPaper
            elevation={3}
            initial="hidden"
            animate="visible"
            variants={paperVariants}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <GlobalScoreboard
              globalScoreCard={globalScoreCard}
              setGlobalScoreCard={setGlobalScoreCard}
              globalScoreCardUpdateTime={globalScoreCardUpdateTime}
              setGlobalScoreCardUpdateTime={setGlobalScoreCardUpdateTime}
            />
          </StyledPaper>
          <StyledPaper
            elevation={3}
            initial="hidden"
            animate="visible"
            variants={paperVariants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PastAttempts
              pastAttemptData={pastAttempts}
              onRefreshClick={fetchPastAttempts}
            />
          </StyledPaper>
        </Column>
      </ContentWrapper>
    </StyledContainer>
  );
};

export default Dashboard;
