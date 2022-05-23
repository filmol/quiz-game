export interface ScoreObject {
  correct: number;
  incorrect: number;
  unanswered: number;
}
export interface QuestionObject {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export interface QuestionProps {
  handleSubmit(result: string): void;
  question: QuestionObject;
  addTime(): void;
}

export interface ReducerAction {
  type: string;
}
