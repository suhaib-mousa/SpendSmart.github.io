import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { saveBudgetAnalysis, getBudgetHistory } from '../services/api';
import '../styles/Budget.css';
import { useTranslation } from 'react-i18next';

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
const translateCategory = (category) => {
  const translations = {
    housing: 'السكن',
    transportation: 'المواصلات',
    food: 'الطعام',
    utilities: 'المرافق',
    healthcare: 'الرعاية الصحية',
    education: 'التعليم',
    entertainment: 'الترفيه',
    debt: 'الديون',
    savings: 'التوفير',
    other: 'أخرى'
  };
  return translations[category] || category;
};

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
    const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(preferredLang);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchBudgetHistory();
    }

    if (!hasStartedRef.current) {
      if (!storedUser) {
        addBotMessage(
          <div>
            {preferredLang === 'ar' ? (
              <>
                <span>يرجى </span>
                <a href="/login" className="text-blue-600 underline">تسجيل الدخول</a>
                <span> للبدء في تحليل الميزانية.</span>
              </>
            ) : (
              <>
                <span>Please </span>
                <a href="/login" className="text-blue-600 underline">log in</a>
                <span> to start your budget analysis.</span>
              </>
            )}
          </div>
        );
      } else {
        startConversation();
      }

      hasStartedRef.current = true;
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // تأثير للتمرير إلى أحدث رسالة
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    updateLanguageUI();
  };

  const updateLanguageUI = () => {
    if (userInputRef.current) {
      userInputRef.current.placeholder = currentLanguage === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...';
    }
  };

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

  const addBotMessage = (text, questionIndex = null) => {
    if (typeof text === 'string') {
      setMessages(prev => [...prev, { text, isUser: false, questionIndex }]);
    } else {
      setMessages(prev => [...prev, { component: text, isUser: false }]);
    }
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
        const savedAnalysis = await saveBudgetAnalysis(updatedResponses);
        await fetchBudgetHistory();
        setCurrentQuestion(prev => prev + 1);
        addBotMessage(questions[currentQuestion + 1][currentLanguage]);
        setTimeout(() => {
          analyzeAndDisplayResults(updatedResponses);
          addBotMessage(currentLanguage === 'ar' 
            ? "هل تريد تحليل ميزانيتك مرة أخرى بأرقام مختلفة؟ اكتب 'إعادة' أو قم بتحديث الصفحة."
            : "Would you like to analyze your budget again with different numbers? Type \"restart\" or refresh the page.");
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

    const categoryAdvice = [];
    Object.entries(data.expenses).forEach(([category, amount]) => {
      const recommendedAmount = (recommendedPercentages[category] / 100) * data.totalIncome;
      const difference = amount - recommendedAmount;
      const actualPercentage = (amount / data.totalIncome) * 100;
      
      if (difference > 0) {
        categoryAdvice.push({
          category,
          advice: currentLanguage === 'ar'
            ? `أنت تنفق ${amount.toFixed(2)} دينار (${actualPercentage.toFixed(1)}٪ من دخلك) على ${translateCategory(category)}. النفقات الموصى بها هي ${recommendedAmount.toFixed(2)} دينار (${recommendedPercentages[category]}٪). يمكنك توفير ${difference.toFixed(2)} دينار شهريًا عن طريق تقليل هذا البند.`
            : `You're spending ${amount.toFixed(2)} JOD (${actualPercentage.toFixed(1)}% of your income) on ${category}. Recommended spending is ${recommendedAmount.toFixed(2)} JOD (${recommendedPercentages[category]}%). You could save ${difference.toFixed(2)} JOD monthly by reducing this category.`
        });

      }
    });

    categoryAdvice.sort((a, b) => {
      const aAmount = data.expenses[a.category];
      const bAmount = data.expenses[b.category];
      return bAmount - aAmount;
    });

    const analysisComponent = (
      <div className="analysis-results">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-xl font-bold text-blue-700">
            {currentLanguage === 'ar' ? 'تحليل الميزانية الشخصية' : 'Personal Budget Analysis'}
          </h3>
        </div>

        <div className="analysis-stats">
          <div className="stat">
            <span className="stat-label">
              {currentLanguage === 'ar' ? 'إجمالي الدخل:' : 'Total Income:'}
            </span>
            <span className="stat-value">{data.totalIncome.toFixed(2)} JOD</span>
          </div>
          <div className="stat">
            <span className="stat-label">
              {currentLanguage === 'ar' ? 'إجمالي المصروفات:' : 'Total Expenses:'}
            </span>
            <span className="stat-value">{totalExpenses.toFixed(2)} JOD</span>
          </div>
          <div className={`stat ${remainingMoney >= 0 ? 'positive' : 'negative'}`}>
            <span className="stat-label">
              {currentLanguage === 'ar' ? 'المال المتبقي:' : 'Remaining Money:'}
            </span>
            <span className="stat-value">{remainingMoney.toFixed(2)} JOD</span>
          </div>
        </div>
        
        <div className="savings-advice">
          <p className="text-base">
            {remainingMoney < data.savingsGoal
              ? currentLanguage === 'ar'
                ? `تحتاج إلى تعديل ميزانيتك للوصول إلى هدف التوفير البالغ ${data.savingsGoal.toFixed(2)} دينار. حاليًا، تحتاج إلى توفير ${Math.abs(savingsShortfall).toFixed(2)} دينار إضافي شهريًا.`
                : `You need to adjust your budget to reach your savings goal of ${data.savingsGoal.toFixed(2)} JOD. Currently, you need to save an additional ${Math.abs(savingsShortfall).toFixed(2)} JOD monthly.`
              : currentLanguage === 'ar'
                ? `تهانينا! أنت تحقق هدف التوفير الخاص بك مع ${Math.abs(savingsShortfall).toFixed(2)} دينار إضافي شهريًا.`
                : `Congratulations! You're meeting your savings goal with an extra ${Math.abs(savingsShortfall).toFixed(2)} JOD per month.`}
          </p>
        </div>
        
        <div className="expense-chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
        
        <h4 className="mt-4 mb-2 font-semibold text-lg text-blue-800">
          {currentLanguage === 'ar' ? 'توصيات محددة:' : 'Specific Recommendations:'}
        </h4>
        
        {categoryAdvice.slice(0, 3).map((advice, index) => (
          <div key={index} className="category-advice">
            <h4 className="font-semibold">
              {currentLanguage === 'ar'
                ? translateCategory(advice.category)
                : advice.category.charAt(0).toUpperCase() + advice.category.slice(1)}
            </h4>
            <p>{advice.advice}</p>
          </div>
        ))}
        
        <div className="goal-guidance mt-4">
          <h4 className="font-semibold mb-2 text-blue-800">
            {currentLanguage === 'ar' ? 'خطة تحقيق الهدف:' : 'Goal Achievement Plan:'}
          </h4>
          <p>
            {remainingMoney < data.savingsGoal
              ? currentLanguage === 'ar'
                ? 'لتحقيق هدف التوفير الخاص بك، ستحتاج إلى تخفيضات أكبر في نفقاتك. فكر في مراجعة بنود الميزانية الأخرى أو زيادة دخلك.'
                : 'To achieve your savings goal, you\'ll need larger reductions in your expenses. Consider reviewing other budget items or increasing your income.'
              : currentLanguage === 'ar'
                ? 'واصل العمل الجيد! فكر في استثمار أو ادخار المال الإضافي للأهداف المستقبلية.'
                : 'Keep up the good work! Consider investing or saving the extra money for future goals.'}
          </p>
        </div>
        
        <div className="recommendation-card mt-4">
          <h4 className="font-semibold mb-2">
            {currentLanguage === 'ar' ? 'نصائح قابلة للتنفيذ:' : 'Actionable Tips:'}
          </h4>
          <ul className="list-disc pl-5">
            {categoryAdvice.slice(0, 3).map((advice, index) => (
              <li key={index} className="mb-2">
                {currentLanguage === 'ar'
                  ? `${translateCategory(advice.category)}: قلل الإنفاق بنسبة 50٪ للوصول إلى الميزانية الموصى بها البالغة ${((recommendedPercentages[advice.category] / 100) * data.totalIncome).toFixed(2)} دينار شهريًا.`
                  : `${advice.category.charAt(0).toUpperCase() + advice.category.slice(1)}: Reduce spending by 50% to reach the recommended budget of ${((recommendedPercentages[advice.category] / 100) * data.totalIncome).toFixed(2)} JOD monthly.`}
              </li>
            ))}
            <li className="mb-2">
              {currentLanguage === 'ar'
                ? 'تتبع نفقاتك اليومية لمدة شهر كامل لتحديد مجالات التوفير الإضافية.'
                : 'Track your daily expenses for a full month to identify additional savings areas.'}
            </li>
            <li className="mb-2">
              {currentLanguage === 'ar'
                ? 'حدد يومًا واحدًا "بدون إنفاق" في الأسبوع حيث تتجنب أي مشتريات غير ضرورية.'
                : 'Designate one "no-spend day" per week where you avoid any non-essential purchases.'}
            </li>
          </ul>
        </div>
      </div>
    );

    setMessages(prev => [...prev, { component: analysisComponent }]);
    
    setTimeout(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(data.expenses).map(key => 
              currentLanguage === 'ar'
                ? translateCategory(key)
                : key.charAt(0).toUpperCase() + key.slice(1)
            ),
            datasets: [
              {
                label: currentLanguage === 'ar' ? 'النفقات الفعلية (دينار)' : 'Actual Expenses (JOD)',
                data: Object.values(data.expenses),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: currentLanguage === 'ar' ? 'النفقات الموصى بها (دينار)' : 'Recommended Expenses (JOD)',
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
                  text: currentLanguage === 'ar' ? 'المبلغ (دينار)' : 'Amount (JOD)'
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
                    label += currentLanguage === 'ar'
                      ? ` (${percentage}٪ من الدخل)`
                      : ` (${percentage}% of income)`;
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
      if (input.toLowerCase() === 'restart' || input === 'إعادة') {
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
        <div className="header-controls">
          <div className="language-switcher">
            <button 
              className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button 
              className={`lang-btn ${currentLanguage === 'ar' ? 'active' : ''}`}
              onClick={() => setLanguage('ar')}
            >
              العربية
            </button>
          </div>
          {user && (
            <button 
              className="history-toggle"
              onClick={() => setShowHistory(!showHistory)}
            >
              {currentLanguage === 'ar' ? 'عرض السجل' : 'View History'}
            </button>
          )}
        </div>
      </div>

      {showHistory && budgetHistory.length > 0 && (
        <div className="history-panel">
          <h3>{currentLanguage === 'ar' ? 'التقارير السابقة' : 'Previous Reports'}</h3>
          {budgetHistory.map((report, index) => (
            <div key={report._id} className="history-item">
              <div className="history-date">
                {new Date(report.date).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
              </div>
              <div className="history-stats">
                <div className="history-stat">
                  <span className="history-stat-label">
                    {currentLanguage === 'ar' ? 'الدخل:' : 'Income:'}
                  </span>
                  <span className="history-stat-value">{report.totalIncome.toFixed(2)} JOD</span>
                </div>
                <div className="history-stat">
                  <span className="history-stat-label">
                    {currentLanguage === 'ar' ? 'المصروفات:' : 'Expenses:'}
                  </span>
                  <span className="history-stat-value">{report.analysis.totalExpenses.toFixed(2)} JOD</span>
                </div>
                <div className="history-stat">
                  <span className="history-stat-label">
                    {currentLanguage === 'ar' ? 'المتبقي:' : 'Remaining:'}
                  </span>
                  <span className={`history-stat-value ${report.analysis.remainingMoney >= 0 ? 'positive' : 'negative'}`}>
                    {report.analysis.remainingMoney.toFixed(2)} JOD
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="chat-messages">
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
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          name="message"
          placeholder={currentLanguage === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
          disabled={isTyping || !user}
          ref={userInputRef}
        />
        <button type="submit" disabled={isTyping || !user}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>

    </div>
  );
}

export default Budget;