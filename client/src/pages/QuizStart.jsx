// QuizStart.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, LinearProgress, Alert } from '@mui/material';
import { FetchQuizQuestions } from '../api/restApi';
import { useAuth } from "../context/AuthContext";

const QuizStart = ({
  questions,
  setQuestions,
  startQuiz,
  setStartQuiz,
  setQuizId
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userToken = useAuth().user.token;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await FetchQuizQuestions(userToken,topic,difficulty);
      if(response.questions){
        // set status and selected answer for each question to null
        response.questions.forEach((question) => {
          question.visted = false;
          question.markedForReview = false;
          question.answer = null;
        });
        setQuestions(response.questions);
        setStartQuiz(true);
        setQuizId(response.quiz_id);
      } else {
        setQuestions([]);
        setError('No questions found. Please try again.');
      }
    } catch(error) {
      setError('Error fetching questions. Please try again.');
      console.log('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ 
      marginTop: '20px',
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h4" gutterBottom sx={{
        color: '#1976d2',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Confirm Quiz Start
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ margin: '0.5rem 0' }}>Topic: {topic}</Typography>
        <Typography variant="h6" sx={{ margin: '0.5rem 0' }}>Difficulty: {difficulty}</Typography>

        <Typography variant="body1" sx={{ 
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '1.1rem'
        }}>
          Are you sure you want to start the quiz with these settings?
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={loading}
          sx={{ 
            marginTop: '2rem',
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            borderRadius: '25px',
            textTransform: 'none',
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.2s'
            }
          }}
        >
          {loading ? 'Loading...' : 'I Confirm and Start'}
        </Button>
      </Box>
    </Container>
  );
};

export default QuizStart;
