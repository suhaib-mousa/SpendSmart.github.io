import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { saveBudgetAnalysis, getBudgetHistory } from '../services/api';

function Budget() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState([]);
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
  const expenseChartRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchBudgetHistory();
    }
    
    setCurrentLanguage(localStorage.getItem('preferredLanguage') || 'en');
    startConversation();

    return () => {
      if (expenseChartRef.current) {
        expenseChartRef.current.destroy();
      }
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

  const addMessage = (text, isUser = false) => {
    setMessages(prev => [...prev, { text, isUser }]);
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    }, 100);
  };

  const startConversation = () => {
    setIsWaitingForAnswer(true);
    setCurrentQuestion(0);
    addMessage(questions[0][currentLanguage]);
  };

  const handleUserInput = async (input) => {
    if (!isWaitingForAnswer) return;

    if (currentQuestion > 0 && questions[currentQuestion].validation === 'number') {
      if (!validateNumberInput(input)) {
        toast.error(questions[currentQuestion].errorMsg[currentLanguage]);
        return;
      }
    }

    addMessage(input, true);
    processAnswer(input);
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
        analyzeAndDisplayResults();
      } catch (error) {
        console.error('Error saving budget:', error);
        toast.error('Failed to save budget analysis');
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
      setTimeout(() => {
        addMessage(questions[currentQuestion + 1][currentLanguage]);
        setIsWaitingForAnswer(true);
      }, 500);
    }
  };

  return (
    <div className="chatbot-container w-full">
      <div className="chat-header flex justify-between items-center">
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

      <div className="chat-messages flex flex-col" ref={chatMessagesRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user-message' : 'bot-message'} ${
              currentLanguage === 'ar' ? 'text-right' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={currentLanguage === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUserInput(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <button
          className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none"
          onClick={() => {
            const input = document.querySelector('input').value;
            handleUserInput(input);
            document.querySelector('input').value = '';
          }}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

// Questions configuration
const questions = [
  {
    en: "Hello! I'm the SpendSmart Budget Assistant. I'll help you analyze your finances and provide personalized advice. What's your name?",
    ar: "مرحبا! أنا مساعد SpendSmart للميزانية. سأساعدك في تحليل أمورك المالية وتقديم نصائح مخصصة. ما هو اسمك؟",
    validation: null
  },
  {
    en: "Nice to meet you! What's your total monthly income in JOD?",
    ar: "تشرفت بمعرفتك! ما هو إجمالي دخلك الشهري بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your income in JOD.",
      ar: "الرجاء إدخال رقم صحيح لدخلك بالدينار الأردني."
    }
  },
  // ... Add all other questions here
];

export default Budget;