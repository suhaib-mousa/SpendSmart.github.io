import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
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
  const expenseChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchBudgetHistory();
    }
    
    setCurrentLanguage(localStorage.getItem('preferredLanguage') || 'en');
    startConversation();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
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

  const startConversation = () => {
    setIsWaitingForAnswer(true);
    setCurrentQuestion(0);
    addMessage(questions[0][currentLanguage]);
  };

  const addMessage = (text, isUser = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} ${currentLanguage === 'ar' ? 'text-right' : ''}`;
    messageDiv.innerHTML = text;
    chatMessagesRef.current?.appendChild(messageDiv);
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const handleUserInput = async (input) => {
    if (!isWaitingForAnswer) return;

    // Validate input if needed
    const currentQ = questions[currentQuestion];
    if (currentQ.validation === 'number') {
      if (!validateNumberInput(input)) {
        toast.error(currentQ.errorMsg[currentLanguage]);
        return;
      }
    }

    addMessage(input, true);
    await processAnswer(input);
  };

  const validateNumberInput = (value) => {
    const numberPattern = /^[0-9]*\.?[0-9]*$/;
    return value === '' || numberPattern.test(value);
  };

  const processAnswer = async (answer) => {
    setIsWaitingForAnswer(false);

    setUserResponses(prev => {
      const newResponses = { ...prev };
      if (currentQuestion === 0) {
        newResponses.name = answer;
      } else if (currentQuestion === 1) {
        newResponses.totalIncome = parseFloat(answer);
      } else if (currentQuestion === 2) {
        newResponses.savingsGoal = parseFloat(answer);
      } else if (currentQuestion >= 3 && currentQuestion <= 11) {
        const category = questions[currentQuestion].category;
        newResponses.expenses = {
          ...newResponses.expenses,
          [category]: parseFloat(answer)
        };
      }
      return newResponses;
    });

    setCurrentQuestion(prev => prev + 1);

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
        createExpensesChart();
      } catch (error) {
        console.error('Error saving budget:', error);
        toast.error('Failed to save budget analysis');
      }
    } else {
      setTimeout(() => {
        addMessage(questions[currentQuestion + 1][currentLanguage]);
        setIsWaitingForAnswer(true);
      }, 500);
    }
  };

  const createExpensesChart = () => {
    if (!expenseChartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = expenseChartRef.current.getContext('2d');
    const categories = Object.keys(userResponses.expenses);
    const values = Object.values(userResponses.expenses);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories.map(cat => getCategoryName(cat, currentLanguage)),
        datasets: [
          {
            label: currentLanguage === 'ar' ? 'النفقات الفعلية' : 'Actual Expenses',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  };

  const getCategoryName = (category, lang) => {
    const translations = {
      ar: {
        housing: 'السكن',
        transportation: 'المواصلات',
        food: 'الطعام',
        utilities: 'المرافق',
        healthcare: 'الرعاية الصحية',
        education: 'التعليم',
        entertainment: 'الترفيه',
        debt: 'الديون',
        other: 'نفقات أخرى'
      },
      en: {
        housing: 'Housing',
        transportation: 'Transportation',
        food: 'Food',
        utilities: 'Utilities',
        healthcare: 'Healthcare',
        education: 'Education',
        entertainment: 'Entertainment',
        debt: 'Debt',
        other: 'Other'
      }
    };

    return translations[lang][category] || category;
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

      {showAnalysis && (
        <div className="analysis-container">
          <canvas ref={expenseChartRef}></canvas>
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder={currentLanguage === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUserInput(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <button
          className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2"
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

// Questions array
const questions = [
  {
    en: "Hello! I'm the SpendSmart Budget Assistant. I'll help you analyze your finances and provide personalized advice. What's your name?",
    ar: "مرحبا! أنا مساعد SpendSmart للميزانية. سأساعدك في تحليل أمورك المالية وتقديم نصائح مخصصة. ما هو اسمك؟"
  },
  // Add all questions here...
];

export default Budget;