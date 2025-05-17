import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import html2pdf from 'html2pdf.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Budget.css';

function Budget() {
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
  
  // Chart refs
  const budgetChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const yearlyChartRef = useRef(null);
  
  // Chart canvas refs
  const budgetCanvasRef = useRef(null);
  const comparisonCanvasRef = useRef(null);
  const yearlyCanvasRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
    loadData();

    return () => {
      destroyCharts();
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      updateCharts();
    });
  }, [monthlyIncome, expenses, showAnalysis]);

  const loadData = () => {
    const savedData = JSON.parse(localStorage.getItem('budgetData'));
    if (savedData) {
      setMonthlyIncome(parseFloat(savedData.income) || 0);
      setExpenses(prev => ({
        ...prev,
        ...savedData.expenses
      }));
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

  const updateCharts = () => {
    // Update budget chart
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

    // Update analysis charts if showing analysis
    if (showAnalysis) {
      updateAnalysisCharts();
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

  const saveData = () => {
    localStorage.setItem('budgetData', JSON.stringify({
      income: monthlyIncome,
      expenses
    }));
    alert('Data saved successfully!');
  };

  const downloadPDF = () => {
    const element = document.querySelector('.analysis-container');
    if (!element) return;

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

    html2pdf().set(opt).from(element).save();
  };

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const remainingIncome = monthlyIncome - totalExpenses;

  return (
    <div className="budget-container">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Financial Planner</h1>
        <p className="text-lg text-gray-600">Enter your monthly income and expenses to analyze your spending and make smart financial decisions.</p>
      </div>

      <div className="budget-grid">
        <div className="budget-form" data-aos="fade-right">
          <div className="income-section">
            <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
            <input
              type="number"
              className="budget-input"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter monthly income"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Budget Distribution</h2>
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
                className="budget-input"
                value={value}
                onChange={(e) => handleExpenseChange(category, e.target.value)}
                placeholder={`Enter ${category} expense`}
              />
            </div>
          ))}

          <div className="budget-summary">
            <div>
              <span>Total Expenses:</span>
              <span>{totalExpenses.toFixed(2)} JOD</span>
            </div>
            <div>
              <span>Remaining Income:</span>
              <span>{remainingIncome.toFixed(2)} JOD</span>
            </div>
          </div>

          <button
            onClick={saveData}
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Data
          </button>
        </div>

        <div className="chart-container" data-aos="fade-left">
          <canvas ref={budgetCanvasRef}></canvas>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
        >
          {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
        </button>
      </div>

      {showAnalysis && (
        <div className="analysis-container" data-aos="fade-up">
          <div className="analysis-grid">
            <div className="analysis-section">
              <div className="analysis-header">
                <h2 className="text-2xl font-bold mb-4">Three-Thirds Financial Analysis</h2>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Category Breakdown</h3>
                  <ul className="list-disc pl-6">
                    <li><span className="font-semibold">Obligations (1/3):</span> Housing, Transportation, Debt, Health, Education, Maintenance, Utilities</li>
                    <li><span className="font-semibold">Personal (1/3):</span> Others, Entertainment, Charity, Food</li>
                    <li><span className="font-semibold">Investment (1/3):</span> Savings</li>
                  </ul>
                </div>
              </div>

              <div className="analysis-chart">
                <h3 className="text-xl font-semibold mb-4">Current vs Ideal Distribution</h3>
                <canvas ref={comparisonCanvasRef}></canvas>
              </div>

              <div className="analysis-chart">
                <h3 className="text-xl font-semibold mb-4">5-Year Investment Projection</h3>
                <canvas ref={yearlyCanvasRef}></canvas>
              </div>

              <button
                onClick={downloadPDF}
                className="download-button"
              >
                <i className="fas fa-file-download"></i>
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budget;