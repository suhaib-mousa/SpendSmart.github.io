import React, { useState, useEffect } from 'react';
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
  const [expenseChart, setExpenseChart] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchBudgetHistory();
    }
    
    setCurrentLanguage(localStorage.getItem('preferredLanguage') || 'en');
    startConversation();
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
    // Add first bot message
    addMessage(questions[0][currentLanguage]);
  };

  const handleUserInput = async (input) => {
    if (!isWaitingForAnswer) return;

    // Validate input
    if (currentQuestion > 0 && questions[currentQuestion].validation === 'number') {
      if (!validateNumberInput(input)) {
        toast.error(questions[currentQuestion].errorMsg[currentLanguage]);
        return;
      }
    }

    // Add user message
    addMessage(input, true);

    // Process answer
    processAnswer(input);
  };

  const processAnswer = async (answer) => {
    setIsWaitingForAnswer(false);

    // Store answer
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

    // Move to next question or show analysis
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

  // ... (continue with the rest of the component code, including all helper functions and JSX)
}