import React, { useEffect, useState } from 'react';
import { QuestionProps } from '../interfaces/main';

export default function Question(props: QuestionProps) {
  const [options, setOptions] = useState<string[]>(['']);
  const [question, setQuestion] = useState<string>();
  let incorrect = props.question ? props.question.incorrect_answers : [''];

  useEffect(() => {
    props.question ? setQuestion(decode64(props.question.question)) : null;
    mergeArray();
  }, [props.question]);

  function mergeArray(): void {
    // Merges the incorrect answers with the correct and shuffles the array
    // Set options state with the merged array
    let mergedOptions = [...incorrect];
    props.question ? mergedOptions.push(props.question.correct_answer) : null;
    let shuffledQuestions = mergedOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffledQuestions);
  }

  function removeHalf(): void {
    // Randomly removes 2 of the incorrect anwers
    disableButton('removeHalfBtn');
    incorrect.splice(Math.floor(Math.random() * 3), 1);
    incorrect.splice(Math.floor(Math.random() * 2), 1);
    mergeArray();
  }

  function addTenSeconds(): void {
    // Adds 10s extra to the timer and
    disableButton('addSecondsBtn');
    props.addTime ? props.addTime() : null;
  }

  function disableButton(el: string): void {
    // Disables the corresponding button
    let lifelineBtn = document.querySelector(`#${el}`) as HTMLButtonElement;
    lifelineBtn.classList.replace('hover:bg-gray-600', 'opacity-25');
    lifelineBtn.disabled = true;
  }

  return (
    <div className='my-8 space-y-4 '>
      <div className='min-h-[500px] lg:min-h-[420px] relative'>
        <h2 data-testid='mainQuestion' className='text-xl font-bold h-14'>
          {question}
        </h2>

        <div className='space-y-4' data-testid='optionsContainer'>
          {options &&
            options.map((option: string, idx: number) => {
              return (
                <button
                  key={option}
                  onClick={() =>
                    props.handleSubmit(
                      option == props.question.correct_answer
                        ? 'correct'
                        : 'incorrect'
                    )
                  }
                  className='rounded-md my-4 mx-auto block form-check-label min-w-[200px] text-gray-100 hover:font-bold hover:text-gray-800 hover:shadow-2xl  py-4 px-4 bg-gray-800 hover:scale-105 hover:bg-gray-400 cursor-pointer duration-150'
                >
                  {decode64(option)}
                </button>
              );
            })}
        </div>

        <div className='flex justify-center mt-auto absolute bottom-0 left-1/2 -translate-x-[50%]'>
          <button
            data-testid='removeHalfBtn'
            id='removeHalfBtn'
            className='block px-8 py-2 mx-2 font-bold text-gray-100 duration-300 bg-gray-700 rounded-lg hover:bg-gray-600'
            onClick={() => removeHalf()}
          >
            50:50
          </button>
          <button
            data-testid='addSecondsBtn'
            id='addSecondsBtn'
            className='block px-8 py-2 mx-2 font-bold text-gray-100 duration-300 bg-gray-700 rounded-lg hover:bg-gray-600'
            onClick={() => addTenSeconds()}
          >
            +10s
          </button>
        </div>
      </div>
    </div>
  );
}

function decode64(str: string): string {
  return decodeURIComponent(escape(window.atob(str)));
}
