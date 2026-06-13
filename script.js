const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const themeToggle = document.getElementById('themeToggle');

let expression = '';
let shouldResetDisplay = false;
const operators = ['+', '-', '*', '/', '%', '**'];

function updateDisplay(value) {
  display.value = value || '0';
}

function setTheme(theme) {
  const isLight = theme === 'light';

  document.body.classList.toggle('light-mode', isLight);
  themeToggle.textContent = isLight ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  localStorage.setItem('calculator-theme', theme);
}

function isOperator(value) {
  return operators.includes(value);
}

function getExpressionValue() {
  if (!expression) return 0;

  const safeExpression = expression.replace(/π/g, String(Math.PI));

  if (!/^[0-9+\-*/%.()\s]+$/.test(safeExpression)) {
    throw new Error('Unsupported input');
  }

  const result = Function(`'use strict'; return (${safeExpression})`)();

  if (!Number.isFinite(result)) {
    throw new Error('Invalid calculation');
  }

  return result;
}

function formatNumber(number) {
  return String(Number.parseFloat(number.toFixed(10)));
}

function calculate() {
  if (!expression) return;

  try {
    expression = formatNumber(getExpressionValue());
    updateDisplay(expression);
    shouldResetDisplay = true;
  } catch {
    expression = '';
    updateDisplay('Error');
    shouldResetDisplay = true;
  }
}

function appendValue(value) {
  const lastChar = expression.slice(-1);

  if (shouldResetDisplay && !isOperator(value)) {
    expression = '';
    shouldResetDisplay = false;
  }

  if (isOperator(value) && isOperator(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  updateDisplay(expression);
}

function runUnaryOperation(operation) {
  try {
    const value = getExpressionValue();
    let result;

    switch (operation) {
      case 'square':
        result = value ** 2;
        break;
      case 'square-root':
        if (value < 0) throw new Error('Invalid square root');
        result = Math.sqrt(value);
        break;
      case 'reciprocal':
        if (value === 0) throw new Error('Cannot divide by zero');
        result = 1 / value;
        break;
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      default:
        return;
    }

    if (!Number.isFinite(result)) {
      throw new Error('Invalid calculation');
    }

    expression = formatNumber(result);
    updateDisplay(expression);
    shouldResetDisplay = true;
  } catch {
    expression = '';
    updateDisplay('Error');
    shouldResetDisplay = true;
  }
}

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  setTheme(nextTheme);
});

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { value, action } = button.dataset;

    if (action === 'clear') {
      expression = '';
      shouldResetDisplay = false;
      updateDisplay(expression);
      return;
    }

    if (action === 'delete') {
      expression = expression.slice(0, -1);
      shouldResetDisplay = false;
      updateDisplay(expression);
      return;
    }

    if (action === 'calculate') {
      calculate();
      return;
    }

    if (action === 'toggle-sign') {
      if (expression.startsWith('-')) {
        expression = expression.slice(1);
      } else if (expression) {
        expression = `-${expression}`;
      }
      updateDisplay(expression);
      return;
    }

    if (action === 'power') {
      appendValue('**');
      return;
    }

    if (action === 'pi') {
      appendValue('π');
      return;
    }

    if (action) {
      runUnaryOperation(action);
      return;
    }

    appendValue(value);
  });
});

setTheme(localStorage.getItem('calculator-theme') || 'dark');
