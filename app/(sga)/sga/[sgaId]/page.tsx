import { db } from '@/lib/db';
import { useState } from 'react';

type tparams =Promise<{
    sgaId:string;
}>
const SgaForm=async({params}:{params:tparams})=> {
    const {sgaId} = await params;
    const topic ="React"; 
    const sga= await db.sga.findUnique({
        where:{
            id:sgaId,
            topic:topic
        }
    }) 
  const [questions, setQuestions] = useState(Array(10).fill(''));
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [result, setResult] = useState({ score: '', summary: '' });
  const ques =[
    sga?.ques1,
    sga?.ques2,
    sga?.ques3,
    sga?.ques4,
    sga?.ques5,
    sga?.ques6,
    sga?.ques7,
    sga?.ques8,
    sga?.ques9,
    sga?.ques10,
  ]

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/sga', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions, answers, topic }),
    });

    const data = await response.json();
    if (response.ok) {
      setResult(data);
    } else {
      alert(data.error || 'Something went wrong!');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{topic}</label>
        </div>

        {questions.map((question, index) => (
          <div key={index}>
            <label>Question {index + 1}:</label>
            <input
              type="text"
              value={ques[index]}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              required
            />
            <label>Answer {index + 1}:</label>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              required
            />
          </div>
        ))}

        <button type="submit">Analyze</button>
      </form>

      {result.score && (
        <div>
          <h3>Skill Gap Analysis Result</h3>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Summary:</strong> {result.summary}</p>
        </div>
      )}
    </div>
  );
}
export default SgaForm;