import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import { saveBudgetAnalysis, getBudgetHistory } from '../services/api';
import '../styles/Budget.css';

function Budget() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [userResponses, setUserResponses] = useState({
    name: '',
    totalIncome: 0,
    savingsGoal: 0,
    expenses: {}
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [budgetHistory, setBudgetHistory] = useState([]);
  const chatMessagesRef = useRef(null);
  const userInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchBudgetHistory();
    }
    
    setCurrentLanguage(localStorage.getItem('preferredLanguage') || 'en');
    startConversation();

    return () => {
      // Cleanup
    };
  }, []);

  const fetchBudgetHistory = async () => {
    try {
      const data = await getBudgetHistory();
      setBudgetHistory(data);
    } catch (error) {
      console.error('Error fetching budget history:', error);
    }
  };

  const startConversation = () => {
    setIsWaitingForAnswer(true);
    setTimeout(() => {
      addMessage(questions[0][currentLanguage]);
    }, 500);
  };

  const addMessage = (text, isUser = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} ${currentLanguage === 'ar' ? 'text-right' : ''}`;
    messageDiv.textContent = text;
    chatMessagesRef.current?.appendChild(messageDiv);
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const showTyping = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessagesRef.current?.appendChild(typingDiv);
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const hideTyping = () => {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
      typingDiv.remove();
    }
  };

  const handleUserInput = async () => {
    if (!isWaitingForAnswer) return;

    const input = userInputRef.current.value.trim();
    if (!input) return;

    const currentQ = questions[currentQuestion];
    if (currentQ.validation === 'number') {
      if (!validateNumberInput(input)) {
        toast.error(currentQ.errorMsg[currentLanguage]);
        return;
      }
    }

    addMessage(input, true);
    userInputRef.current.value = '';
    await processAnswer(input);
  };

  const validateNumberInput = (value) => {
    const numberPattern = /^[0-9]*\.?[0-9]*$/;
    return value === '' || numberPattern.test(value);
  };

  const processAnswer = async (answer) => {
    setIsWaitingForAnswer(false);

    if (currentQuestion === 0) {
      setUserResponses(prev => ({ ...prev, name: answer }));
    } else if (currentQuestion === 1) {
      setUserResponses(prev => ({ ...prev, totalIncome: parseFloat(answer) }));
    } else if (currentQuestion === 2) {
      setUserResponses(prev => ({ ...prev, savingsGoal: parseFloat(answer) }));
    } else if (currentQuestion >= 3 && currentQuestion <= 11) {
      const category = questions[currentQuestion].category;
      setUserResponses(prev => ({
        ...prev,
        expenses: { ...prev.expenses, [category]: parseFloat(answer) }
      }));
    }

    if (currentQuestion === questions.length - 1) {
      if (!user) {
        toast.error('Please log in to save your analysis');
        navigate('/login');
        return;
      }

      try {
        await saveBudgetAnalysis(userResponses);
        await fetchBudgetHistory();
        setShowAnalysis(true);
      } catch (error) {
        console.error('Error saving budget:', error);
        toast.error('Failed to save budget analysis');
      }
    } else {
      showTyping();
      setTimeout(() => {
        hideTyping();
        setCurrentQuestion(prev => prev + 1);
        addMessage(questions[currentQuestion + 1][currentLanguage]);
        setIsWaitingForAnswer(true);
      }, 500);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <div>
          <h1 className="text-xl font-bold">SpendSmart</h1>
          <p className="text-sm">Budget Analysis Assistant</p>
        </div>
        <div className="language-switcher">
          <button 
            className={currentLanguage === 'en' ? 'active' : ''} 
            onClick={() => setCurrentLanguage('en')}
          >
            English
          </button>
          <button 
            className={currentLanguage === 'ar' ? 'active' : ''} 
            onClick={() => setCurrentLanguage('ar')}
          >
            العربية
          </button>
        </div>
      </div>

      <div className="chat-messages" ref={chatMessagesRef}></div>

      <div className="chat-input">
        <input
          ref={userInputRef}
          type="text"
          placeholder={currentLanguage === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUserInput();
            }
          }}
        />
        <button onClick={handleUserInput}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default Budget;