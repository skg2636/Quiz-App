export const Signup = async (username, email, password) => {
  try {
    const response = await fetch("api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const Login = async (email, password) => {
  try {
    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const FetchQuizQuestions = async (usertoken, topic, difficulty) => {
  try {
    const response = await fetch(
      `api/quizzes/attempt?topic=${topic}&difficulty=${difficulty}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usertoken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const SubmitQuizAnswer = async (
  usertoken,
  quiz_id,
  answers,
  time_taken
) => {
  try {
    // Check if usertoken exists
    if (!usertoken) {
      return { error: "No authentication token provided" };
    }

    const response = await fetch("api/quizzes/attempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usertoken}`,
      },
      body: JSON.stringify({
        quiz_id,
        answers,
        time_taken,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const GenerateQuizQuestion = async (usertoken, topic, difficulty) => {
  try {
    const response = await fetch(`api/quizzes/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usertoken}`,
      },
      body: JSON.stringify({
        topic,
        difficulty,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ConfirmQuizQuestion = async (
  usertoken,
  questions,
  positive_mark,
  negative_mark,
  topic,
  difficulty
) => {
  try {
    const response = await fetch(`api/quizzes/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usertoken}`,
      },
      body: JSON.stringify({
        questions,
        positive_mark,
        negative_mark,
        topic,
        difficulty,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const FetchPastAttempts = async (usertoken) => {
  try {
    const response = await fetch(`api/quizzes//attempts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usertoken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const FetchGlobalLeaderboard = async (usertoken) => {
  try {
    const response = await fetch(`api/leaderboard/global`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usertoken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const UpdateGlobalLeaderboard = async (usertoken) => {
  try {
    const response = await fetch(`api/leaderboard/global/update`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usertoken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
