import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';
import { savePlannerEntry, getPlannerHistory } from '../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Planner.css';

function Planner() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [plannerHistory, setPlannerHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [expenses, setExpenses] = useState({
    charity: 0,
    food: 0,
    housing: 0,
    utilities: 0,
    maintenance: 0,
    transportation: 0,
    education: 0,
    entertainment: 0,
    debt: 0,
    health: 0,
    savings: 0,
    others: 0
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [insights, setInsights] = useState(null);
  
  // Chart refs
  const budgetChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const yearlyChartRef = useRef(null);
  const downloadBtnRef = useRef(null);
  
  // Chart canvas refs
  const budgetCanvasRef = useRef(null);
  const comparisonCanvasRef = useRef(null);
  const yearlyCanvasRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchPlannerHistory();
    }

    return () => {
      destroyCharts();
    };
  }, []);

  useEffect(() => {
    updateBudgetChart();
  }, [monthlyIncome, expenses]);

  useEffect(() => {
    if (showAnalysis) {
      requestAnimationFrame(() => {
        updateAnalysisCharts();
        generateInsights();
      });
    } else {
      destroyAnalysisCharts();
      setInsights(null);
    }
  }, [showAnalysis]);

  const fetchPlannerHistory = async () => {
    try {
      const data = await getPlannerHistory();
      setPlannerHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load planning history');
    }
  };

  const destroyCharts = () => {
    if (budgetChartRef.current) {
      budgetChartRef.current.destroy();
      budgetChartRef.current = null;
    }
    if (comparisonChartRef.current) {
      comparisonChartRef.current.destroy();
      comparisonChartRef.current = null;
    }
    if (yearlyChartRef.current) {
      yearlyChartRef.current.destroy();
      yearlyChartRef.current = null;
    }
  };

  const generateInsights = () => {
    const obligationsCategories = ['housing', 'transportation', 'debt', 'health', 'education', 'maintenance', 'utilities'];
    const personalCategories = ['others', 'entertainment', 'charity', 'food'];
    const investmentCategories = ['savings'];

    const actual = {
      obligations: obligationsCategories.reduce((sum, cat) => sum + (expenses[cat] || 0), 0),
      personal: personalCategories.reduce((sum, cat) => sum + (expenses[cat] || 0), 0),
      investment: investmentCategories.reduce((sum, cat) => sum + (expenses[cat] || 0), 0)
    };

    const idealPortion = monthlyIncome / 3;
    let ideal = { obligations: 0, personal: 0, investment: 0 };
    let mainMessage = '';

    if (actual.obligations <= idealPortion) {
      ideal = {
        obligations: idealPortion,
        personal: idealPortion,
        investment: idealPortion
      };
      mainMessage = "Your obligations are within one-third of your income. Using 33% for each category.";
    } else if (actual.obligations > idealPortion && actual.obligations <= monthlyIncome / 2) {
      ideal = {
        obligations: monthlyIncome * 0.5,
        personal: monthlyIncome * 0.3,
        investment: monthlyIncome * 0.2
      };
      mainMessage = "Your obligations exceed half of your income. Using 60% Obligations, 25% Personal, 15% Investment rule.";
    }

    let tips = [];

    if (actual.personal > ideal.personal) {
      const extra = actual.personal - ideal.personal;
      tips.push({
        type: 'warning',
        message: `You're overspending on personal expenses by ${extra.toFixed(1)} JOD.`,
        details: [
          'Try saving a portion. Unexpected costs can come any time, so prepare.',
          `Saving this amount monthly can accumulate to ${(extra * 12).toFixed(1)} JOD annually!`
        ]
      });
    }

    if (actual.investment < ideal.investment * 0.9) {
      tips.push({
        type: 'alert',
        message: 'Your savings are below the expected amount.',
        details: [
          'Try allocating at least 1 JOD per day. Consistency builds wealth!'
        ]
      });
    }

    setInsights({
      mainMessage,
      tips
    });
  };

  const updateBudgetChart = () => {
  if (budgetCanvasRef.current) {
    if (budgetChartRef.current) {
      budgetChartRef.current.destroy();
    }

    const ctx = budgetCanvasRef.current.getContext('2d');
    budgetChartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(expenses).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
        datasets: [{
          data: Object.values(expenses),
          backgroundColor: [
            '#52741F', '#00B2F6', '#FF6B6B', '#4ECDC4', '#FF9F43',
            '#F368E0', '#FFD93D', '#6C5CE7', '#E69DB8', '#C599B6',
            '#00B894', '#A569BD'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20
            }
          }
        }
      }
    });
  }
};

const destroyAnalysisCharts = () => {
  if (comparisonChartRef.current) {
    comparisonChartRef.current.destroy();
    comparisonChartRef.current = null;
  }
  if (yearlyChartRef.current) {
    yearlyChartRef.current.destroy();
    yearlyChartRef.current = null;
  }
};

  const updateAnalysisCharts = () => {
    const obligationsCategories = ['housing', 'transportation', 'debt', 'health', 'education', 'maintenance', 'utilities'];
    const personalCategories = ['others', 'entertainment', 'charity', 'food'];
    const investmentCategories = ['savings'];

    const actual = {
      obligations: obligationsCategories.reduce((sum, cat) => sum + (parseFloat(expenses[cat]) || 0), 0),
      personal: personalCategories.reduce((sum, cat) => sum + (parseFloat(expenses[cat]) || 0), 0),
      investment: investmentCategories.reduce((sum, cat) => sum + (parseFloat(expenses[cat]) || 0), 0)
    };

    const idealPortion = monthlyIncome / 3;
    let ideal = { obligations: 0, personal: 0, investment: 0 };

    if (actual.obligations <= idealPortion) {
      ideal = {
        obligations: idealPortion,
        personal: idealPortion,
        investment: idealPortion
      };
    } else if (actual.obligations > idealPortion && actual.obligations <= monthlyIncome / 2) {
      ideal = {
        obligations: monthlyIncome * 0.5,
        personal: monthlyIncome * 0.3,
        investment: monthlyIncome * 0.2
      };
    } else {
      ideal = {
        obligations: monthlyIncome * 0.6,
        personal: monthlyIncome * 0.25,
        investment: monthlyIncome * 0.15
      };
    }

    // Update comparison chart
    if (comparisonCanvasRef.current) {
      if (comparisonChartRef.current) {
        comparisonChartRef.current.destroy();
      }

      const ctx = comparisonCanvasRef.current.getContext('2d');
      comparisonChartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Obligations', 'Personal', 'Investment'],
          datasets: [
            {
              label: 'Your Spending',
              data: [actual.obligations, actual.personal, actual.investment],
              backgroundColor: '#2A4B7C'
            },
            {
              label: 'Ideal Distribution',
              data: [ideal.obligations, ideal.personal, ideal.investment],
              backgroundColor: '#00B894'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Update yearly projection chart
    if (yearlyCanvasRef.current) {
      if (yearlyChartRef.current) {
        yearlyChartRef.current.destroy();
      }

      const yearlyProjection = {
        current: Array.from({ length: 5 }, (_, i) => actual.investment * (i + 1) * 12),
        ideal: Array.from({ length: 5 }, (_, i) => ideal.investment * (i + 1) * 12)
      };

      const ctx = yearlyCanvasRef.current.getContext('2d');
      yearlyChartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Your Investment (Current)',
              data: yearlyProjection.current,
              borderColor: '#2A4B7C',
              fill: false
            },
            {
              label: 'Ideal Investment',
              data: yearlyProjection.ideal,
              borderColor: '#00B894',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  };

  const handleExpenseChange = (category, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0
    }));
  };

  const handleStartAnalysis = async () => {
    if (!user) {
      toast.error('Please log in to view analysis');
      navigate('/login');
      return;
    }

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      // Check if there's already an entry with the same values
      const hasMatchingEntry = plannerHistory.some(entry => {
        return entry.monthlyIncome === monthlyIncome &&
          Object.entries(entry.expenses).every(([key, value]) => 
            Math.abs(value - expenses[key]) < 0.01
          );
      });

      if (!hasMatchingEntry) {
        // Only save if there's no matching entry
        await savePlannerEntry({
          monthlyIncome,
          expenses
        });
        await fetchPlannerHistory();
        toast.success('Data saved successfully!');
      }
      
      setShowAnalysis(!showAnalysis);
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save financial plan');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = () => {
    const element = document.querySelector('.analysis-container');
    if (!element) return;

    if (downloadBtnRef.current) {
      downloadBtnRef.current.style.display = 'none';
    }

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'Financial_Analysis_Report.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        scrollY: 0
      },
      jsPDF: {
        unit: 'cm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        if (downloadBtnRef.current) {
          downloadBtnRef.current.style.display = '';
        }
      });
  };

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const remainingIncome = monthlyIncome - totalExpenses;

  return (
    <div className="budget-container">
      <div className="main-container">
        <h1 className="page-title">Financial Planner</h1>
        <p className="subheading">Enter your monthly income and expenses to analyze your spending and make smart financial decisions.</p>
        
        <div className="left-content">
          <div className="budget-section income-box">
            <h2 className="section-title">Monthly Income</h2>
            <input
              type="number"
              className="amount-input"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
              placeholder="Amount in JOD"
            />
          </div>

          <div className="budget-section">
            <h2 className="section-title">Budget Distribution</h2>
            {Object.entries(expenses).map(([category, value]) => (
              <div key={category} className="budget-item">
                <div 
                  className="category-color"
                  style={{ 
                    backgroundColor: {
                      charity: '#52741F',
                      food: '#00B2F6',
                      housing: '#FF6B6B',
                      utilities: '#4ECDC4',
                      maintenance: '#FF9F43',
                      transportation: '#F368E0',
                      education: '#FFD93D',
                      entertainment: '#6C5CE7',
                      debt: '#E69DB8',
                      health: '#C599B6',
                      savings: '#00B894',
                      others: '#A569BD'
                    }[category]
                  }}
                />
                <span className="capitalize">{category}</span>
                <input
                  type="number"
                  className="amount-input"
                  value={value}
                  onChange={(e) => handleExpenseChange(category, e.target.value)}
                  placeholder={`Enter ${category} expense`}
                />
                <span className="percentage">
                  {((value / monthlyIncome) * 100 || 0).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          <div className="total-section">
            <span>Total Expenses:</span>
            <span>{totalExpenses.toFixed(2)} JOD</span>
          </div>

          <div className="remaining-income">
            <span>Remaining Income:</span>
            <span>{remainingIncome.toFixed(2)} JOD</span>
          </div>

          {user && showHistory && plannerHistory.length > 0 && (
            <div className="history-section budget-section">
              <h2 className="section-title">Planning History</h2>
              {plannerHistory.map((entry, index) => (
                <div key={entry._id} className="history-item">
                  <h3>Plan {index + 1} - {new Date(entry.date).toLocaleDateString()}</h3>
                  <div className="history-details">
                    <p>Monthly Income: {entry.monthlyIncome.toFixed(2)} JOD</p>
                    <p>Total Expenses: {entry.analysis.totalExpenses.toFixed(2)} JOD</p>
                    <p>Savings Rate: {entry.analysis.savingsRate.toFixed(1)}%</p>
                    <p>Debt to Income Ratio: {entry.analysis.debtToIncomeRatio.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky-wrapper">
          <div className="chart-container">
            <canvas ref={budgetCanvasRef}></canvas>
          </div>  
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Analyze?</h2>
            <p>{user ? 'View detailed insights to optimize your budget.' : 'Log in to save your data and view detailed insights.'}</p>
            <div className="cta-buttons">
              <button 
                className="save-button" 
                onClick={handleStartAnalysis}
                disabled={isSaving}
              >
                <i className="fas fa-chart-pie"></i> 
                {isSaving ? 'Processing...' : showAnalysis ? 'Hide Analysis' : 'Start Analysis'}
              </button>
              {user && (
                <button className="save-button" onClick={() => setShowHistory(!showHistory)}>
                  <i className="fas fa-history"></i> {showHistory ? 'Hide History' : 'View History'}
                </button>
              )}
            </div>
          </div>
        </div>

        {showAnalysis && user && (
          <div className="analysis-container">
            <div className="analysis-header">
              <h2>Three-Thirds Financial Analysis</h2>
              <div className="analysis-section">
                <h3>Category Breakdown</h3>
                <ul>
                  <li><span className="font-bold">Obligations (1/3):</span> Housing, Transportation, Debt, Health, Education, Maintenance, Utilities</li>
                  <li><span className="font-bold">Personal (1/3):</span> Others, Entertainment, Charity, Food</li>
                  <li><span className="font-bold">Investment (1/3):</span> Savings</li>
                </ul>
              </div>
            </div>

            {insights && (
              <div className="insights-box">
                <h3>Financial Insights</h3>
                <div className="insights-content">
                  <p className="main-message">{insights.mainMessage}</p>
                  {insights.tips.map((tip, index) => (
                    <div key={index} className={`tip-box ${tip.type}`}>
                      <p className="tip-message">{tip.message}</p>
                      {tip.details.map((detail, i) => (
                        <p key={i} className="tip-detail">- {detail}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="analysis-chart">
              <h3>Current vs Ideal Distribution</h3>
              <canvas ref={comparisonCanvasRef}></canvas>
            </div>

            <div className="analysis-chart">
              <h3>5-Year Investment Projection</h3>
              <canvas ref={yearlyCanvasRef}></canvas>
            </div>

            <button className="save-button" onClick={downloadPDF} ref={downloadBtnRef}>
              <i className="fas fa-file-download"></i> Download PDF Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Planner;