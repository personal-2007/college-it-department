import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTests } from '../services/testService';
import { useTest } from '../context/TestContext';

const yearOptions = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const semesterOptions = ['All Semesters', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
const subjectOptions = ['All Subjects', 'Programming in C', 'Mathematics', 'Digital Fundamentals', 'Python Programming', 'Communication Skills', 'Data Structures', 'Java Programming', 'DBMS', 'Operating Systems', 'Computer Organization', 'Web Technology', 'Computer Networks', 'Software Engineering', 'Web Development', 'Cloud Computing', 'Artificial Intelligence', 'Cyber Security', 'Machine Learning', 'Data Science', 'Big Data', 'Advanced Web Technology', 'Project Management', 'Professional Elective'];
const difficultyOptions = ['Mixed', 'Easy', 'Medium', 'Hard'];
const questionCounts = [10, 20, 30, 50, 100];

export default function MCQTest() {
  const { selectedFilters, setSelectedFilters, setActiveTest, setTestQuestions, setAnswers } = useTest();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchTests({
          year: selectedFilters.year,
          semester: selectedFilters.semester,
          subject: selectedFilters.subject,
          unit: selectedFilters.unit,
          difficulty: selectedFilters.difficulty,
          limit: selectedFilters.questionCount,
        });
        setTests(data);
      } catch (err) {
        setError('Unable to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilters]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchTests({
        year: selectedFilters.year,
        semester: selectedFilters.semester,
        subject: selectedFilters.subject,
        unit: selectedFilters.unit,
        difficulty: selectedFilters.difficulty,
        limit: selectedFilters.questionCount,
      });
      setTests(data);
      setError('');
    } catch (err) {
      setError('Unable to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900">MCQ Test</h1>
        <p className="mt-3 text-lg text-slate-600">Practice previous year questions and improve your preparation with subject-wise MCQs.</p>
      </div>

      <div className="panel mb-8 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Select label="Select Year" value={selectedFilters.year} onChange={(value) => setSelectedFilters({ ...selectedFilters, year: value })} options={yearOptions} />
          <Select label="Select Semester" value={selectedFilters.semester} onChange={(value) => setSelectedFilters({ ...selectedFilters, semester: value })} options={semesterOptions} />
          <Select label="Select Subject" value={selectedFilters.subject} onChange={(value) => setSelectedFilters({ ...selectedFilters, subject: value })} options={subjectOptions} />
          <Select label="Select Unit" value={selectedFilters.unit} onChange={(value) => setSelectedFilters({ ...selectedFilters, unit: value })} options={['All Units', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5']} />
          <Select label="Difficulty" value={selectedFilters.difficulty} onChange={(value) => setSelectedFilters({ ...selectedFilters, difficulty: value })} options={difficultyOptions} />
          <Select label="Number of Questions" value={selectedFilters.questionCount} onChange={(value) => setSelectedFilters({ ...selectedFilters, questionCount: Number(value) })} options={questionCounts} />
        </div>
        <div className="mt-5 text-center">
          <button onClick={handleSearch} className="gradient-button">Search Tests</button>
        </div>
      </div>

      {loading ? (
        <div className="panel p-10 text-center text-slate-600">Loading available tests...</div>
      ) : error ? (
        <div className="panel p-10 text-center text-red-600">{error}</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tests.length ? tests.slice(0, 6).map((test) => (
            <div key={test._id} className="panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primaryBlue">{test.year}</p>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{test.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{test.subject} · {test.semester}</p>
              <p className="mt-1 text-sm text-slate-600">{test.questions?.length || 0} questions · {test.duration} minutes</p>
              <Link
                to="/test-instructions"
                onClick={() => {
                  setActiveTest(test);
                  setTestQuestions(test.questions || []);
                  setAnswers({});
                }}
                className="mt-5 inline-flex items-center rounded-full bg-primaryBlue px-4 py-2 text-sm font-semibold text-white"
              >Start Test</Link>
            </div>
          )) : (
            <div className="md:col-span-2 xl:col-span-3 panel p-10 text-center text-slate-600">No tests available for the selected filters.</div>
          )}
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-primaryBlue">
        {options.map((option) => (
          <option key={String(option)} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
