import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { saveBudgetAnalysis } from '../services/api';
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
  const chartRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

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

    if (currentQuestion === questions.length - 1) {
      if (!user) {
        toast.error('Please log in to save your analysis');
        navigate('/login');
        return;
      }

      try {
        await saveBudgetAnalysis(updatedResponses);
        analyzeAndDisplayResults(updatedResponses);
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

    // Create analysis component
    const analysisComponent = (
      <div className="analysis-results">
        <div className="budget-summary">
          <div className="summary-item">
            <h3>Total Income</h3>
            <p className="amount">{data.totalIncome.toFixed(2)} JOD</p>
          </div>
          <div className="summary-item">
            <h3>Total Expenses</h3>
            <p className="amount">{totalExpenses.toFixed(2)} JOD</p>
          </div>
          <div className="summary-item">
            <h3>Remaining Money</h3>
            <p className={`amount ${remainingMoney >= 0 ? 'positive' : 'negative'}`}>
              {remainingMoney.toFixed(2)} JOD
            </p>
          </div>
        </div>

        <div className="budget-message">
          {remainingMoney < data.savingsGoal ? (
            <div className="alert alert-warning">
              You need to adjust your budget to reach your savings goal of {data.savingsGoal} JOD. 
              Currently, you need to save an additional {savingsShortfall.toFixed(2)} JOD monthly.
            </div>
          ) : (
            <div className="alert alert-success">
              Congratulations! You're meeting your savings goal with an extra {Math.abs(savingsShortfall).toFixed(2)} JOD per month.
            </div>
          )}
        </div>

        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>

        <div className="recommendations">
          <h3>Specific Recommendations:</h3>
          {Object.entries(data.expenses).map(([category, amount]) => {
            const recommendedAmount = (recommendedPercentages[category] / 100) * data.totalIncome;
            const difference = amount - recommendedAmount;
            
            if (difference > 0) {
              return (
                <div key={category} className="recommendation-item">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                  <p>
                    You're spending {amount.toFixed(2)} JOD ({((amount / data.totalIncome) * 100).toFixed(1)}% of your income) on {category}.
                    Recommended spending is {recommendedAmount.toFixed(2)} JOD ({recommendedPercentages[category]}%).
                    You could save {difference.toFixed(2)} JOD monthly by reducing this category.
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="actionable-tips">
          <h3>Actionable Tips:</h3>
          <ul>
            <li>Track your daily expenses for a full month to identify additional savings areas.</li>
            <li>Consider implementing a "no-spend day" once per week.</li>
            <li>Look for ways to reduce your highest expense categories first.</li>
            <li>Set up automatic transfers for savings on payday.</li>
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
                label: 'Actual Expenses',
                data: Object.values(data.expenses),
                backgroundColor: '#2A4B7C'
              },
              {
                label: 'Recommended Expenses',
                data: Object.keys(data.expenses).map(category => 
                  (recommendedPercentages[category] / 100) * data.totalIncome
                ),
                backgroundColor: '#B7E0FF'
              }
            ]
          },
          options: {
            responsive: true,
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
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.message.value.trim();
    if (!input || isTyping) return;

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
        />
        <button type="submit" disabled={isTyping}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default Budget;

export default Budget