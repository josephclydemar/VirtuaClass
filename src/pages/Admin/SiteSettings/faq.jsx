import React, { useState } from 'react';
import './Site.css'; // Import your CSS file for styling
import deleteIcon from './Delete.png'; // Import the delete icon image

const FAQ = () => {
  const [faqItems, setFAQItems] = useState([
    { question: 'What is React?', answer: 'React is a JavaScript library for building user interfaces.' },
    { question: 'How can I install React?', answer: 'You can install React using npm or yarn.' },
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const addFAQItem = () => {
    if (newQuestion && newAnswer) {
      setFAQItems([...faqItems, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const deleteFAQItem = (index) => {
    const updatedFAQItems = [...faqItems];
    updatedFAQItems.splice(index, 1);
    setFAQItems(updatedFAQItems);
  };

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <ul className="faq-list">
        {faqItems.map((item, index) => (
          <li key={index} className="faq-item-container">
            <div className="faq-content">
              <strong className="faq-question">Q: {item.question}</strong>
              <p className="faq-answer">A: {item.answer}</p>
            </div>
            <button onClick={() => deleteFAQItem(index)} className="delete-faq-button">
              <img
                src={deleteIcon} // Use the imported delete icon
                alt="Delete Icon"
                onClick={() => deleteFAQItem(index)}
                className="delete-icon"
              />
            </button>
          </li>
        ))}
      </ul>
      <div className="add-faq">
        <h2>Add a New Question:</h2>
        <input
          type="text"
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="faq-input"
        />
        <textarea
          placeholder="Answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="faq-textarea"
        />
        <button onClick={addFAQItem} className="add-faq-button">Add FAQ</button>
      </div>
    </div>
  );
};

export default FAQ;
    