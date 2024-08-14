export type Question = {
  _id: string;
  questionType: 'Multiple Choice' | 'True/False' | 'Fill in Blank';
  title: string;
  points: number;
  questionText: string;
  choices?: string[]; // Optional, used for Multiple Choice
  correctAnswer: string; // For True/False and Fill in Blank
  possibleAnswers?: string[]; // Optional, used for Fill in Blank
};

export type quiz_t = {
  _id?: string;
  title: string;
  description?: string;
  courseId: string;
  createdBy: string;
  quizType: 'Graded Quiz' | 'Practice Quiz' | 'Graded Survey' | 'Ungraded Survey';
  points: number;
  assignmentGroup: 'Quizzes' | 'Exams' | 'Assignments' | 'Project';
  shuffleAnswers: boolean;
  timeLimit: number; // in minutes
  multipleAttempts: boolean;
  numberOfAttempts: number;
  showCorrectAnswers: boolean;
  accessCode?: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: Date;
  availableDate?: Date;
  untilDate?: Date;
  isPublished: boolean;
  questions: Question[];
};
