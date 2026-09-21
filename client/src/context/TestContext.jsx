import { createContext, useContext, useMemo, useState } from 'react';

const TestContext = createContext(null);

export function TestProvider({ children }) {
  const [selectedFilters, setSelectedFilters] = useState({
    year: 'All Years',
    semester: 'All Semesters',
    subject: 'All Subjects',
    unit: 'All Units',
    difficulty: 'Mixed',
    questionCount: 10,
  });

  const [activeTest, setActiveTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const value = useMemo(() => ({
    selectedFilters,
    setSelectedFilters,
    activeTest,
    setActiveTest,
    testQuestions,
    setTestQuestions,
    answers,
    setAnswers,
    result,
    setResult,
  }), [selectedFilters, activeTest, testQuestions, answers, result]);

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) throw new Error('useTest must be used within TestProvider');
  return context;
}
