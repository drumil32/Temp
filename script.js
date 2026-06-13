const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

function updateDisplay(value) {
  display.value = value || '0';
}

function appendValue(value) {
  const lastChar = expression.slice(-1);
  const operators = ['+', '-', '*', '/', '%'];

  if (operators.includes(value) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  updateDisplay(expression);
}

function calculate() {
  if (!expression) return;

  try {
    const result = Function(`'use strict'; return (${expression})`)();

    if (!Number.isFinite(result)) {
      throw new Error('Invalid calculation');
    }

    expression = String(Number.parseFloat(result.toFixed(10)));
    updateDisplay(expression);
  } catch {
    expression = '';
    updateDisplay('Error');
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { value, action } = button.dataset;

    if (action === 'clear') {
      expression = '';
      updateDisplay(expression);
      return;
    }

    if (action === 'delete') {
      expression = expression.slice(0, -1);
      updateDisplay(expression);
      return;
    }

    if (action === 'calculate') {
      calculate();
      return;
    }

    appendValue(value);
  });
});
