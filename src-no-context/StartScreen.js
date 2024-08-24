function StartScreen({ numQuestion, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to React Quiz</h2>
      <h3>{numQuestion} Questions to test your React Mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => {
          //   console.log("Start button clicked");
          dispatch({ type: "start" });
        }}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
