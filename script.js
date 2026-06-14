const display = document.getElementById('display');
const keys = document.querySelector('.keys');
const themeToggle = document.getElementById('themeToggle');

let expression = '';

function updateDisplay(value) {
  display.value = value || '0';
}

function appendValue(value) {
  const lastChar = expression.slice(-1);
  const operators = ['+', '-', '*', '/'];

  if (operators.includes(value) && (expression === '' || operators.includes(lastChar))) {
    return;
  }

  if (value === '.') {
    const currentNumber = expression.split(/[+\-*/]/).pop();
    if (currentNumber.includes('.')) return;
  }

  expression += value;
  updateDisplay(expression);
}

function calculate() {
  if (!expression) return;

  try {
    const result = Function(`'use strict'; return (${expression})`)();
    expression = Number.isFinite(result) ? String(result) : '';
    updateDisplay(expression || 'Error');
  } catch {
    expression = '';
    updateDisplay('Error');
  }
}

function setTheme(theme) {
  const isLight = theme === 'light';

  document.body.classList.toggle('light-mode', isLight);
  themeToggle.textContent = isLight ? '🌙 Dark' : '☀️ Light';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  localStorage.setItem('calculatorTheme', theme);
}

const savedTheme = localStorage.getItem('calculatorTheme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  setTheme(nextTheme);
});

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { value, action } = button.dataset;

  if (value) appendValue(value);
  if (action === 'clear') {
    expression = '';
    updateDisplay(expression);
  }
  if (action === 'backspace') {
    expression = expression.slice(0, -1);
    updateDisplay(expression);
  }
  if (action === 'calculate') calculate();
});

window.addEventListener('keydown', (event) => {
  const allowedKeys = '0123456789.+-*/';

  if (allowedKeys.includes(event.key)) appendValue(event.key);
  if (event.key === 'Enter') calculate();
  if (event.key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay(expression);
  }
  if (event.key === 'Escape') {
    expression = '';
    updateDisplay(expression);
  }
});
