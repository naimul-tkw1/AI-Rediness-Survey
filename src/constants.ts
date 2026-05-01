export interface Question {
  id: number;
  text: string;
  description?: string;
  type: 'binary' | 'scale' | 'compliance'; // binary: 1/0, scale: 1-5, compliance: Yes/No
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  questions: Question[];
  maxScore?: number;
}

export const SECTIONS: Section[] = [
  {
    id: 'A',
    title: 'Section A: The Nature of the Task',
    subtitle: '(The "AI Fit" Score)',
    description: 'This section assesses whether the task itself is a good fit for current AI capabilities. For each criterion, please select Yes (1) or No (0).',
    maxScore: 5,
    questions: [
      { id: 1, text: 'Is the task highly repetitive?', description: 'e.g., Recommendation systems, Anomaly detection, Forecasting, or creating summaries.', type: 'binary' },
      { id: 2, text: 'Is the task data-intensive?', description: 'Does it require analyzing large volumes of text, numbers, or images?', type: 'binary' },
      { id: 3, text: 'Does the task rely on finding patterns in data?', description: 'For example, screening resumes, identifying trends.', type: 'binary' },
      { id: 4, text: 'Is the task about generating standardized or templated content?', description: 'For example, drafting first versions of job descriptions, emails.', type: 'binary' },
      { id: 5, text: 'Have you already explored non-AI solutions, and found they are not sufficient?', type: 'binary' },
    ]
  },
  {
    id: 'B',
    title: 'Section B: The Impact of the Problem',
    subtitle: '(The "Pain Point" Score)',
    description: 'This section assesses the severity of the problem. Please rate the impact on a scale from 1 (very low) to 5 (very high).',
    maxScore: 20,
    questions: [
      { id: 6, text: 'What is the resource impact of this friction point?', description: 'For example, time, financial, physical.', type: 'scale' },
      { id: 7, text: 'What is the psychological impact of this friction point on employees?', description: 'For example, stress or frustration.', type: 'scale' },
      { id: 8, text: 'How often does this friction point lead to errors?', description: 'What is the error rate in terms of rework?', type: 'scale' },
      { id: 9, text: 'What is the impact of this friction point on the organization\'s goals?', description: 'What is the strategic cost of doing nothing?', type: 'scale' },
    ]
  },
  {
    id: 'C',
    title: 'Section C: Process Quality',
    subtitle: '("Don\'t Automate Bad Processes")',
    description: 'This section assesses whether the underlying process is stable and well defined enough to support an AI intervention.',
    maxScore: 3,
    questions: [
      { id: 10, text: 'Is the current process well defined and stable?', description: 'In other words, not constantly changing or completely ad hoc.', type: 'binary' },
      { id: 11, text: 'Are the desired outcomes of the process clear and agreed upon?', description: 'Do we know what "good" looks like?', type: 'binary' },
      { id: 12, text: 'Has the process already been simplified as much as possible?', type: 'binary' },
    ]
  },
  {
    id: 'D',
    title: 'Section D: Data Quality',
    subtitle: '("Garbage In, Garbage Out")',
    description: 'This section assesses whether the data required for an AI tool is readily available and of sufficient quality.',
    maxScore: 3,
    questions: [
      { id: 13, text: 'Do we have access to the right data needed for the AI to learn or operate?', description: 'For example, historical records, relevant documents.', type: 'binary' },
      { id: 14, text: 'Is the available data of sufficient quality?', description: 'Is the data accurate, complete, relatively clean and up to date?', type: 'binary' },
      { id: 15, text: 'Is the data structured and in a usable format?', description: 'For example, in a database with appropriate governance.', type: 'binary' },
    ]
  },
  {
    id: 'E',
    title: 'Section E: Compliance and Ethics',
    subtitle: '(Preliminary Check)',
    description: 'Contact experts if you answer "Yes" to any of these. This section identifies mandatory policy requirements.',
    questions: [
      { id: 16, text: 'Does the AI tool process any personally identifiable information (PII)?', description: 'Names, employee numbers, financial info, etc.', type: 'compliance' },
      { id: 17, text: 'Does the AI tool assist or replace a human in making an administrative decision?', description: 'Affecting individuals (e.g., screening resumes, eligibility).', type: 'compliance' },
      { id: 18, text: 'Does the data used carry legal, compliance or accountability implications if errors occur?', description: 'e.g., historical biases in training data.', type: 'compliance' },
    ]
  }
];
