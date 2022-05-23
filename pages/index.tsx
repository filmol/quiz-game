import Head from 'next/head';
import { useEffect, useReducer, useRef, useState } from 'react';
import { fetchQuestions } from '../api/triviaApi';
import Question from '../components/question';
import { QuestionObject, ReducerAction, ScoreObject } from '../interfaces/main';

function scoreReducer(state: ScoreObject, action: ReducerAction) {
  // Handles the total score state
  switch (action.type) {
    case 'correct':
      return { ...state, correct: state.correct + 1 };
    case 'incorrect':
      return { ...state, incorrect: state.incorrect + 1 };
    case 'unanswered':
      return { ...state, unanswered: state.unanswered + 1 };
    case 'reset':
      return {
        ...state,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
      };
    default:
      throw new Error();
  }
}

export default function Home() {
  const [play, setPlay] = useState<boolean>(false);
  const [showSummary, setshowSummary] = useState<boolean>(false);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<QuestionObject[] | null>(null);
  const [timer, setTimer] = useState<number>(15);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [state, dispatch] = useReducer(scoreReducer, {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
  });

  function handleSubmit(result: string): void {
    // Update total score and triggers nextQuestion
    dispatch({ type: result });
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

  function addTime(): void {
    setTimer((time) => time + 10);
  }

  useEffect(() => {
    if (timer === 0) {
      // If question not answered within time limit
      // Update total "unanswered" score and trigger nextQuestion
      nextQuestion();
      dispatch({ type: 'unanswered' });
    }
  }, [timer]);

  function startGame(): void {
    async function getQuestions() {
      // // Fetch 10 random questions from the API
      // let res = await fetchQuestions();
      // setQuestions(res);

      try {
        let res = await fetchQuestions();
        setQuestions(res);
      } catch (error) {
        console.log(error);
      }
    }

    getQuestions().then(() => {
      // Display game layout, start timer and reset total score to 0
      setPlay(true);
      startTimer();
      dispatch({ type: 'reset' });
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
            <h2 data-testid='timer' className='my-2 text-lg'>
              Time Left:{' '}
              <span id='timer' className='font-bold'>
                {timer}
              </span>
            </h2>
            {questions ? (
              <Question
                handleSubmit={handleSubmit}
                question={questions[questionIndex]}
                addTime={addTime}
              />
            ) : null}
          </>
        ) : (
          <div className='content-center mt-24'>
            <h1 className='my-4 text-3xl border-bold'>Welcome to Trivia</h1>
            <button
              data-testid='playBtn'
              className='block px-8 py-2 mx-auto text-gray-100 rounded-lg bg-cyan-800 hover:scale-105 duration-50'
              onClick={() => startGame()}
            >
              Play
            </button>
            {showSummary ? (
              <ul className='max-w-md p-12 mx-auto mt-16 space-y-4 text-lg text-gray-800 bg-gray-200 rounded-md'>
                <li>
                  Correct: <span className='font-bold'>{state.correct}</span>
                </li>
                <li>
                  Incorrect:{' '}
                  <span className='font-bold'>{state.incorrect}</span>
                </li>
                <li>
                  Unanswered:{' '}
                  <span className='font-bold'>{state.unanswered}</span>
                </li>
              </ul>
            ) : null}
          </div>
        )}
      </main>

      <footer className='py-8 mt-auto text-center border-t-2 border-gray-300'>
        <a href='https://moltzer.netlify.app/' target='_blank' rel='noreferrer'>
          Developed by Fiilp Moltzer
        </a>
      </footer>
    </div>
  );
}
