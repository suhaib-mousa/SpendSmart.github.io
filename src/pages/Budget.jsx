import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import html2pdf from 'html2pdf.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingIncome, setRemainingIncome] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Use refs instead of state for chart instances
  const budgetChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const yearlyChartRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
    loadData();

    // Cleanup function to destroy charts when component unmounts
    return () => {
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
  }, []);

  useEffect(() => {
    updateCalculations();
  }, [monthlyIncome, expenses]);

  const loadData = () => {
    const savedData = JSON.parse(localStorage.getItem('budgetData'));
    if (savedData) {
      setMonthlyIncome(parseFloat(savedData.income) || 0);
      setExpenses(savedData.expenses);
    }
  };

  const updateCalculations = () => {
    const total = Object.values(expenses).reduce((sum, value) => sum + parseFloat(value || 0), 0);
    setTotalExpenses(total);
    setRemainingIncome(monthlyIncome - total);
    requestAnimationFrame(() => {
      updateCharts();
    });
  };

  const updateCharts = () => {
    // Update budget chart
    const ctx = document.getElementById('budget-chart')?.getContext('2d');
    if (ctx) {
      if (budgetChartRef.current) {
        budgetChartRef.current.destroy();
      }
      
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
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // Update analysis charts if showing analysis
    if (showAnalysis) {
      requestAnimationFrame(() => {
        updateAnalysisCharts();
      });
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
    const comparisonCtx = document.getElementById('comparison-chart')?.getContext('2d');
    if (comparisonCtx) {
      if (comparisonChartRef.current) {
        comparisonChartRef.current.destroy();
      }
      
      comparisonChartRef.current = new Chart(comparisonCtx, {
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
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // Update yearly projection chart
    const yearlyCtx = document.getElementById('yearly-chart')?.getContext('2d');
    if (yearlyCtx) {
      if (yearlyChartRef.current) {
        yearlyChartRef.current.destroy();
      }

      const yearlyProjection = {
        current: Array.from({ length: 5 }, (_, i) => actual.investment * (i + 1) * 12),
        ideal: Array.from({ length: 5 }, (_, i) => ideal.investment * (i + 1) * 12)
      };
      
      yearlyChartRef.current = new Chart(yearlyCtx, {
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
          plugins: {
            legend: { position: 'bottom' }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Financial Planner</h1>
        <p className="text-lg text-gray-600">Enter your monthly income and expenses to analyze your spending and make smart financial decisions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-right">
          <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            placeholder="Enter monthly income"
          />

          <h2 className="text-xl font-semibold mt-6 mb-4">Budget Distribution</h2>
          {Object.entries(expenses).map(([category, value]) => (
            <div key={category} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={value}
                onChange={(e) => handleExpenseChange(category, e.target.value)}
                placeholder={`Enter ${category} expense`}
              />
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Total Expenses:</span>
              <span>{totalExpenses.toFixed(2)} JOD</span>
            </div>
            <div className="flex justify-between">
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

        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-left">
          <canvas id="budget-chart"></canvas>
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
        <div className="analysis-container mt-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Three-Thirds Financial Analysis</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Category Breakdown</h3>
                <ul className="list-disc pl-6">
                  <li><span className="font-semibold">Obligations (1/3):</span> Housing, Transportation, Debt, Health, Education, Maintenance, Utilities</li>
                  <li><span className="font-semibold">Personal (1/3):</span> Others, Entertainment, Charity, Food</li>
                  <li><span className="font-semibold">Investment (1/3):</span> Savings</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Current vs Ideal Distribution</h3>
                <canvas id="comparison-chart"></canvas>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">5-Year Investment Projection</h3>
                <canvas id="yearly-chart"></canvas>
              </div>

              <button
                onClick={downloadPDF}
                className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
              >
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