import { useState, useEffect } from "react";
import questions from "./questions";

const QUIZ_TIME = 120; // 2 minutes in seconds

export default function App() {
  const [showContent, setShowContent] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);

  const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);
  const finished = current >= questions.length || timeLeft === 0;

  // ⏳ Timer Effect
  useEffect(() => {
    if (!showContent || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showContent, finished]);

  function handleStart() {
    setShowContent(true);
  }

  function handleSelect(answer) {
    setSelectedAnswer(answer);
  }

  function handleNext() {
    if (!selectedAnswer) return;

    const question = questions[current];

    if (selectedAnswer === question.correctAnswer) {
      setScore((s) => s + question.marks);
    }

    setSelectedAnswer(null);
    setCurrent((c) => c + 1);
  }

  function handleRestart() {
    setCurrent(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowContent(false);
    setTimeLeft(QUIZ_TIME);
  }

  // Format time (mm:ss)
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="app">
      <Header />

      {!showContent ? (
        <BeforeContent onStart={handleStart} />
      ) : (
        <div className="content">
          {!finished ? (
            <Question
              question={questions[current]}
              selectedAnswer={selectedAnswer}
              onSelect={handleSelect}
              onNext={handleNext}
              questionNumber={current + 1}
              totalQuestions={questions.length}
            />
          ) : (
            <Result
              score={score}
              totalMarks={totalMarks}
              onRestart={handleRestart}
            />
          )}

          {!finished && <Timer timeLeft={timeLeft} formatTime={formatTime} />}
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ================= Components ================= */

function Header() {
  return (
    <header>
      <h1>✅ Simple Quiz App</h1>
    </header>
  );
}

function Timer({ timeLeft, formatTime }) {
  return (
    <div className="timer">
      ⏳ Time Remaining: <strong>{formatTime(timeLeft)}</strong>
    </div>
  );
}

function Question({
  question,
  selectedAnswer,
  onSelect,
  onNext,
  questionNumber,
  totalQuestions,
}) {
  return (
    <div className="question">
      <h3>
        Question {questionNumber} / {totalQuestions}
      </h3>

      <p>{question.question}</p>

      <ul>
        {question.possibleAnswers.map((answer, idx) => (
          <li key={idx}>
            <label>
              <input
                type="radio"
                name="answer"
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => onSelect(answer)}
              />
              {answer}
            </label>
          </li>
        ))}
      </ul>

      <button disabled={!selectedAnswer} onClick={onNext}>
        Next
      </button>
    </div>
  );
}

function Result({ score, totalMarks, onRestart }) {
  const percentage = Math.round((score / totalMarks) * 100);

  return (
    <div className="result">
      <h2>Quiz Completed 🎉</h2>
      <p>
        You scored <strong>{score}</strong> out of <strong>{totalMarks}</strong>
      </p>
      <h3>Your total percentage is {percentage}%</h3>

      <button onClick={onRestart}>Restart Quiz</button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>Copyright © 2026</p>
    </footer>
  );
}

function BeforeContent({ onStart }) {
  return (
    <div className="before-content">
      <h2>Welcome to the Quiz App!</h2>
      <p>
        Test your knowledge with 20 questions. Click the button below to start.
      </p>
      <button onClick={onStart}>Start Quiz</button>
    </div>
  );
}
