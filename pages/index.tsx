import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { fetchQuestions } from '../api/triviaApi';
import Question from '../components/question';
interface ScoreObject {
  correct: number;
  incorrect: number;
  unanswered: number;
}
interface QuestionObject {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export default function Home() {
  const [play, setPlay] = useState<boolean>(false);
  const [showSummary, setshowSummary] = useState<boolean>(false);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<QuestionObject[] | null>(null);
  const [timer, setTimer] = useState<number>(15);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [totalScore, setTotalScore] = useState<ScoreObject>({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
  });

  function handleSubmit(result: boolean): void {
    // Update totalScore and triggers nextQuestion
    nextQuestion();
  }

  function resetTimer(): void {
    clearInterval(timerRef.current);
    setTimer(15);
    startTimer();
  }

  function startTimer(): void {
    timerRef.current = setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
  }

  useEffect(() => {
    if (timer === 0) {
      // If question not answered within time limit
      // Add to "unanswered" score and trigger nextQuestion
      nextQuestion();
      setTotalScore((prevState) => ({
        ...prevState,
        ['unanswered']: totalScore.unanswered + 1,
      }));
    }
  }, [timer]);

  function startGame(): void {
    async function getQuestions() {
      // Fetch 10 random questions from the API
      let res = await fetchQuestions();
      setQuestions(res);
    }

    getQuestions().then(() => {
      // Display game layout, start timer and reset total score to 0
      setPlay(true);
      startTimer();
      setTotalScore({
        correct: 0,
        incorrect: 0,
        unanswered: 0,
      });
    });
  }

  function nextQuestion(): void {
    if (questionIndex < 9) {
      // Reset timer and trigger next question
      resetTimer();
      setQuestionIndex((questionIndex) => questionIndex + 1);
    } else {
      // Reset game and display result
      setPlay(false);
      clearInterval(timerRef.current);
      setQuestionIndex(0);
      setshowSummary(true);
    }
  }

  return (
    <div className=''>
      <Head>
        <title>Quiz App</title>
        <meta name='description' content='Quix App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='content-center max-w-screen-md min-h-screen mx-auto mt-16 text-center'>
        {play ? (
          <>
            <h2 className='my-2 text-lg'>
              Time Left:{' '}
              <span id='timer' className='font-bold'>
                {timer}
              </span>
            </h2>
            {questions ? (
              <Question
                handleSubmit={handleSubmit}
                question={questions[questionIndex]}
              />
            ) : null}
          </>
        ) : (
          <div className='content-center mt-24'>
            <h1 className='my-4 text-3xl border-bold'>Welcome to Trivia</h1>
            <button
              className='block px-8 py-2 mx-auto text-gray-100 rounded-lg bg-cyan-800 hover:scale-105 duration-50'
              onClick={() => startGame()}
            >
              Play
            </button>
            {showSummary ? (
              <ul className='max-w-md p-12 mx-auto mt-16 space-y-4 text-lg text-gray-800 bg-gray-200 rounded-md'>
                <li>
                  Correct:{' '}
                  <span className='font-bold'>{totalScore.correct}</span>
                </li>
                <li>
                  Incorrect:{' '}
                  <span className='font-bold'>{totalScore.incorrect}</span>
                </li>
                <li>
                  Unanswered:{' '}
                  <span className='font-bold'>{totalScore.unanswered}</span>
                </li>
              </ul>
            ) : null}
          </div>
        )}
      </main>

      <footer className='py-8 mt-auto text-center border-t-2 border-gray-300'>
        <a href='https://moltzer.netlify.app/' target='_blank'>
          Developed by Fiilp Moltzer
        </a>
      </footer>
    </div>
  );
}
