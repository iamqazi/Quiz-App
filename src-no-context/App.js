import { useEffect, useReducer } from "react";

import Loader from "./Loader";
import Header from "./Header";
import Error from "./Error";
import Body from "./Body";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  // "loading","error","ready","active","finished"
  status: "loading",
  index: 0,
  points: 0,
  highScore: 0,
  answer: null,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      // console.log("Changing status to active");
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "restart":
      // console.log("Changing status to active");
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finish",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finish" : state.status,
      };
    default:
      throw new Error("unknown action");
  }
}
export default function App() {
  const [
    { secondsRemaining, highScore, points, status, questions, index, answer },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestion = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
  useEffect(function () {
    fetch("http://localhost:5000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Body className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestion={numQuestion} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              maxPoints={maxPoints}
              answer={answer}
              points={points}
              index={index}
              numQuestion={numQuestion}
            />
            <Questions
              dispatch={dispatch}
              answer={answer}
              questions={questions[index]}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                index={index}
                numQuestion={numQuestion}
                answer={answer}
                dispatch={dispatch}
              />
            </Footer>
          </>
        )}
        {status === "finish" && (
          <FinishedScreen
            highScore={highScore}
            points={points}
            maxPoints={maxPoints}
            dispatch={dispatch}
          />
        )}
      </Body>
    </div>
  );
}
