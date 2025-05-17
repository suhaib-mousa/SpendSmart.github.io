import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { saveBudgetAnalysis, getBudgetHistory } from '../services/api';
import '../styles/Budget.css';

// Standard expense percentages based on financial planning guidelines
const recommendedPercentages = {
  housing: 30,
  transportation: 15,
  food: 15,
  utilities: 10,
  healthcare: 5,
  education: 5,
  entertainment: 5,
  debt: 10,
  savings: 10,
  other: 5
};

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
  const [messages, setMessages] = useState([]);
  const [userResponses, setUserResponses] = useState({
    name: '',
    totalIncome: 0,
    savingsGoal: 0,
    expenses: {}
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [budgetHistory, setBudgetHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const chartRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasStartedRef = useRef(false);
  const userInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchBudgetHistory();
    }

    const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(preferredLang);
    document.body.dir = preferredLang === 'ar' ? 'rtl' : 'ltr';

    if (!hasStartedRef.current) {
      startConversation();
      hasStartedRef.current = true;
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const fetchBudgetHistory = async () => {
    try {
      const history = await getBudgetHistory();
      setBudgetHistory(history);
    } catch (error) {
      console.error('Error fetching budget history:', error);
      toast.error('Failed to load budget history');
    }
  };

  const startConversation = () => {
    addBotMessage(questions[0][currentLanguage]);
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { text, isUser: false }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { text, isUser: true }]);
  };

  const processAnswer = async (answer) => {
    const updatedResponses = { ...userResponses };
    
    if (currentQuestion === 0) updatedResponses.name = answer;
    else if (currentQuestion === 1) updatedResponses.totalIncome = parseFloat(answer);
    else if (currentQuestion === 2) updatedResponses.savingsGoal = parseFloat(answer);
    else if (currentQuestion >= 3 && currentQuestion <= 11) {
      const category = questions[currentQuestion].category;
      updatedResponses.expenses[category] = parseFloat(answer);
    }
    
    setUserResponses(updatedResponses);

    if (currentQuestion === questions.length - 2) {
      if (!user) {
        toast.error('Please log in to save your analysis');
        navigate('/login');
        return;
      }

      try {
        await saveBudgetAnalysis(updatedResponses);
        setCurrentQuestion(prev => prev + 1);
        addBotMessage(questions[currentQuestion + 1][currentLanguage]);
        setTimeout(() => {
          analyzeAndDisplayResults(updatedResponses);
          addBotMessage("Would you like to analyze your budget again with different numbers? Type \"restart\" or refresh the page.");
        }, 1000);
      } catch (error) {
        toast.error('Failed to save budget analysis');
      }
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentQuestion(prev => prev + 1);
        addBotMessage(questions[currentQuestion + 1][currentLanguage]);
      }, 1000);
    }
  };

  const analyzeAndDisplayResults = (data) => {
    const totalExpenses = Object.values(data.expenses).reduce((sum, value) => sum + value, 0);
    const remainingMoney = data.totalIncome - totalExpenses;
    const savingsShortfall = data.savingsGoal - remainingMoney;

    // Calculate category-specific advice
    const categoryAdvice = [];
    Object.entries(data.expenses).forEach(([category, amount]) => {
      const recommendedAmount = (recommendedPercentages[category] / 100) * data.totalIncome;
      const difference = amount - recommendedAmount;
      const actualPercentage = (amount / data.totalIncome) * 100;
      
      if (difference > 0) {
        categoryAdvice.push({
          category,
          advice: `You're spending ${amount.toFixed(2)} JOD (${actualPercentage.toFixed(1)}% of your income) on ${category}. Recommended spending is ${recommendedAmount.toFixed(2)} JOD (${recommendedPercentages[category]}%). You could save ${difference.toFixed(2)} JOD monthly by reducing this category.`
        });
      }
    });

    // Sort by highest overspending
    categoryAdvice.sort((a, b) => {
      const aAmount = data.expenses[a.category];
      const bAmount = data.expenses[b.category];
      return bAmount - aAmount;
    });

    // Create analysis component
    const analysisComponent = (
      <div className="analysis-results">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-xl font-bold text-blue-700">Personal Budget Analysis</h3>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Hide History' : 'View History'}
          </button>
        </div>

        {showHistory && budgetHistory.length > 0 && (
          <div className="budget-history mb-4">
            <h4 className="font-semibold mb-3">Previous Reports</h4>
            <div className="history-list">
              {budgetHistory.map((report, index) => (
                <div key={index} className="history-item p-3 bg-light rounded mb-2">
                  <div className="d-flex justify-content-between">
                    <span className="font-semibold">Report {index + 1}</span>
                    <span className="text-muted">{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <div>Income: {report.totalIncome.toFixed(2)} JOD</div>
                    <div>Expenses: {report.analysis.totalExpenses.toFixed(2)} JOD</div>
                    <div>Remaining: {report.analysis.remainingMoney.toFixed(2)} JOD</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="analysis-stats">
          <div className="stat">
            <span className="stat-label">Total Income:</span>
            <span className="stat-value">{data.totalIncome.toFixed(2)} JOD</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Expenses:</span>
            <span className="stat-value">{totalExpenses.toFixed(2)} JOD</span>
          </div>
          <div className={`stat ${remainingMoney >= 0 ? 'positive' : 'negative'}`}>
            <span className="stat-label">Remaining Money:</span>
            <span className="stat-value">{remainingMoney.toFixed(2)} JOD</span>
          </div>
        </div>
        
        <div className="savings-advice">
          <p className="text-base">
            {remainingMoney < data.savingsGoal
              ? `You need to adjust your budget to reach your savings goal of ${data.savingsGoal.toFixed(2)} JOD. Currently, you need to save an additional ${Math.abs(savingsShortfall).toFixed(2)} JOD monthly.`
              : `Congratulations! You're meeting your savings goal with an extra ${Math.abs(savingsShortfall).toFixed(2)} JOD per month.`}
          </p>
        </div>
        
        <div className="expense-chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
        
        <h4 className="mt-4 mb-2 font-semibold text-lg text-blue-800">Specific Recommendations:</h4>
        
        {categoryAdvice.slice(0, 3).map((advice, index) => (
          <div key={index} className="category-advice">
            <h4 className="font-semibold">{advice.category.charAt(0).toUpperCase() + advice.category.slice(1)}</h4>
            <p>{advice.advice}</p>
          </div>
        ))}
        
        <div className="goal-guidance mt-4">
          <h4 className="font-semibold mb-2 text-blue-800">Goal Achievement Plan:</h4>
          <p>
            {remainingMoney < data.savingsGoal
              ? `To achieve your savings goal, you'll need larger reductions in your expenses. Consider reviewing other budget items or increasing your income.`
              : `Keep up the good work! Consider investing or saving the extra money for future goals.`}
          </p>
        </div>
        
        <div className="recommendation-card mt-4">
          <h4 className="font-semibold mb-2">Actionable Tips:</h4>
          <ul className="list-disc pl-5">
            {categoryAdvice.slice(0, 3).map((advice, index) => (
              <li key={index} className="mb-2">
                {`${advice.category.charAt(0).toUpperCase() + advice.category.slice(1)}: Reduce spending by 50% to reach the recommended budget of ${((recommendedPercentages[advice.category] / 100) * data.totalIncome).toFixed(2)} JOD monthly.`}
              </li>
            ))}
            <li className="mb-2">Track your daily expenses for a full month to identify additional savings areas.</li>
            <li className="mb-2">Designate one "no-spend day" per week where you avoid any non-essential purchases.</li>
          </ul>
        </div>
      </div>
    );

    // Add analysis to messages
    setMessages(prev => [...prev, { component: analysisComponent }]);
    
    // Create chart
    setTimeout(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(data.expenses).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
            datasets: [
              {
                label: 'Actual Expenses (JOD)',
                data: Object.values(data.expenses),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: 'Recommended Expenses (JOD)',
                data: Object.keys(data.expenses).map(category => 
                  (recommendedPercentages[category] / 100) * data.totalIncome
                ),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount (JOD)'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += parseFloat(context.raw).toFixed(2) + ' JOD';
                    const percentage = (context.raw / data.totalIncome * 100).toFixed(1);
                    label += ` (${percentage}% of income)`;
                    return label;
                  }
                }
              }
            }
          }
        });
      }
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.message.value.trim();
    if (!input || isTyping) return;

    if (currentQuestion === questions.length - 1) {
      if (input.toLowerCase() === 'restart') {
        window.location.reload();
        return;
      }
    }

    const currentQ = questions[currentQuestion];
    if (currentQ.validation === 'number' && !/^\d*\.?\d+$/.test(input)) {
      toast.error(currentQ.errorMsg[currentLanguage]);
      return;
    }

    addUserMessage(input);
    e.target.reset();
    processAnswer(input);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <div>
          <h1 className="text-xl font-bold">SpendSmart</h1>
          <p className="text-sm" id="header-subtitle">
            {currentLanguage === 'ar' ? 'مساعد تحليل الميزانية' : 'Budget Analysis Assistant'}
          </p>
        </div>
      </div>

      <div className="chat-messages" ref={messagesEndRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
          >
            {msg.component || msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          name="message"
          placeholder={currentLanguage === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
          disabled={isTyping}
          ref={userInputRef}
        />
        <button type="submit" disabled={isTyping}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default Budget;