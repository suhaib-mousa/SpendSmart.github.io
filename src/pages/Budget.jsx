import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { saveBudgetAnalysis, getBudgetHistory } from '../services/api';
import '../styles/Budget.css';

// Questions array
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
  {
    en: "How much would you like to save each month (in JOD)?",
    ar: "كم تود أن توفر كل شهر (بالدينار الأردني)؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your savings goal in JOD.",
      ar: "الرجاء إدخال رقم صحيح لهدف التوفير بالدينار الأردني."
    }
  },
  {
    en: "How much do you spend on housing per month (rent/mortgage) in JOD?",
    ar: "كم تنفق على السكن شهريًا (إيجار/رهن عقاري) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your housing expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح لنفقات السكن بالدينار الأردني."
    },
    category: "housing"
  },
  {
    en: "How much do you spend on transportation per month (car payments, gas, public transport) in JOD?",
    ar: "كم تنفق على المواصلات شهريًا (دفعات السيارة، البنزين، المواصلات العامة) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your transportation expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح لنفقات المواصلات بالدينار الأردني."
    },
    category: "transportation"
  },
  {
    en: "How much do you spend on food per month (groceries, dining out) in JOD?",
    ar: "كم تنفق على الطعام شهريًا (البقالة، تناول الطعام بالخارج) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your food expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح لنفقات الطعام بالدينار الأردني."
    },
    category: "food"
  },
  {
    en: "How much do you spend on utilities per month (electricity, water, internet) in JOD?",
    ar: "كم تنفق على المرافق شهريًا (الكهرباء، الماء، الإنترنت) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your utilities expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح لنفقات المرافق بالدينار الأردني."
    },
    category: "utilities"
  },
  {
    en: "How much do you spend on healthcare per month (insurance, medications) in JOD?",
    ar: "كم تنفق على الرعاية الصحية شهريًا (التأمين، الأدوية) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your healthcare expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح لنفقات الرعاية الصحية بالدينار الأردني."
    },
    category: "healthcare"
  },
  {
    en: "How much do you spend on education per month (tuition, books, courses) in JOD?",
    ar: "كم تنفق على التعليم شهريًا (الرسوم الدراسية، الكتب، الدورات) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your education expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح لنفقات التعليم بالدينار الأردني."
    },
    category: "education"
  },
  {
    en: "How much do you spend on entertainment per month (movies, hobbies, dining out) in JOD?",
    ar: "كم تنفق على الترفيه شهريًا (الأفلام، الهوايات، الخروج) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your entertainment expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح لنفقات الترفيه بالدينار الأردني."
    },
    category: "entertainment"
  },
  {
    en: "How much do you spend on debt repayment per month (credit cards, loans) in JOD?",
    ar: "كم تنفق على سداد الديون شهريًا (بطاقات الائتمان، القروض) بالدينار الأردني؟",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your debt repayment in JOD.",
      ar: "الرجاء إدخال رقم صحيح لسداد الديون بالدينار الأردني."
    },
    category: "debt"
  },
  {
    en: "How much do you spend on other expenses per month in JOD? (clothing, gifts, subscriptions, etc.)",
    ar: "كم تنفق على النفقات الأخرى شهريًا بالدينار الأردني؟ (الملابس، الهدايا، الاشتراكات، إلخ)",
    validation: "number",
    errorMsg: {
      en: "Please enter a valid number for your other expenses in JOD.",
      ar: "الرجاء إدخال رقم صحيح للنفقات الأخرى بالدينار الأردني."
    },
    category: "other"
  },
  {
    en: "That's all I need! I'll analyze your budget now and provide personalized recommendations.",
    ar: "هذا كل ما أحتاجه! سأقوم بتحليل ميزانيتك الآن وتقديم توصيات مخصصة."
  }
];

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
    
    // Only start conversation if it hasn't started yet
    if (currentQuestion === 0 && !isWaitingForAnswer) {
      startConversation();
    }

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

  const handleUserInput = async (input) => {
    if (!isWaitingForAnswer || !input.trim()) return;

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

    if (currentQuestion === questions.length - 1) {
      if (!user) {
        toast.error('Please log in to save your analysis');
        navigate('/login');
        return;
      }

      try {
        showTyping();
        await saveBudgetAnalysis(userResponses);
        await fetchBudgetHistory();
        hideTyping();
        setShowAnalysis(true);
        createExpensesChart();
      } catch (error) {
        hideTyping();
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

export default Budget;