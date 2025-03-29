// Timer.js
import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const Timer = ({ timeConsumed, setTimeConsumed, stopTimeConsumption }) => {
  const [minutes, setMinutes] = useState(Math.floor(timeConsumed / 60));
  const [seconds, setSeconds] = useState(timeConsumed % 60);

  useEffect(() => {
    if (!stopTimeConsumption) {
      const timer = setInterval(() => {
        setTimeConsumed(timeConsumed + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeConsumed, setTimeConsumed, stopTimeConsumption]);
  useEffect(() => {
    setMinutes(Math.floor(timeConsumed / 60));
    setSeconds(timeConsumed % 60);
  }, [timeConsumed]);

  return (
    <Typography variant="h6">
      Time Consumed: {minutes < 10 ? '0' + minutes : minutes}:
      {seconds < 10 ? '0' + seconds : seconds}
    </Typography>
  );
};

export default Timer;
