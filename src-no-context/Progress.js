function Progress({ index, numQuestion, points, maxPoints, answer }) {
  return (
    <header className="progress">
      <progress max={numQuestion} value={index + Number(answer !== null)} />
      <p>
        Questions {""}
        <strong>
          {index + 1}/{numQuestion}
        </strong>
      </p>
      <p>
        <strong>{points}</strong>/<strong>{maxPoints}</strong>
      </p>
    </header>
  );
}

export default Progress;
