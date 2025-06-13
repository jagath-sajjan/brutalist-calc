// script.js
// Brutalist Calc. with scrollable output, toast roast errors, and clicky animation :)

let currentInput = '';
let resultDisplayed = false;

// Funny roast errors for division by zero and silly math
const roastErrors = [
  "Nice try, but you can't divide by zero. Even Chuck Norris can't.",
  "Division by zero? That's how black holes are made.",
  "Zero division detected. Please consult your math teacher.",
  "Nope. Dividing by zero is illegal in 49 states.",
  "You just tried to break math. Try again.",
  "Infinity? Sorry, this calc is not that deep.",
  "Dividing by zero? That's a hard pass from me.",
  "Error: The universe just glitched.",
  "You can't divide by zero. Not even on a Friday.",
  "Zero division? That's a big nope."
];

// Show toast error at bottom right
function showToast(msg, isRoast = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast' + (isRoast ? ' toast-roast' : '');
  toast.innerHTML = `<span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, isRoast ? 4000 : 2500);
}

// Add value to display
function inputValue(val) {
  if (resultDisplayed && !isNaN(val)) {
    currentInput = '';
    resultDisplayed = false;
  }
  // Prevent multiple decimals in a number
  if (val === '.' && currentInput.split(/[\+\-\*\/]/).pop().includes('.')) {
    showToast('Multiple decimals not allowed');
    return;
  }
  // Prevent two operators in a row
  if (/[+\-*/]$/.test(currentInput) && /[+\-*/]/.test(val)) {
    showToast('Cannot use two operators');
    return;
  }
  // Prevent starting with operator except minus
  if (currentInput === '' && /[+*/]/.test(val)) {
    showToast('Cannot start with operator');
    return;
  }
  // Limit input length
  if (currentInput.length > 60) {
    showToast('Input too long');
    return;
  }
  currentInput += val;
  updateDisplay();
  scrollDisplayToEnd();
}

// Update the calculator display
function updateDisplay() {
  document.getElementById('display').childNodes[0].textContent = currentInput || '0';
  scrollDisplayToEnd();
}

// Scroll output to end (for long expressions)
function scrollDisplayToEnd() {
  const display = document.getElementById('display');
  display.scrollLeft = display.scrollWidth;
}

// Clear the display
function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

// Delete last character
function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// Calculate the result
function calculate() {
  if (!currentInput || /[+\-*/.]$/.test(currentInput)) {
    showToast('Invalid expression');
    return;
  }
  // Check for division by zero
  if (/\/0(?!\d)/.test(currentInput.replace(/\s/g, ''))) {
    showToast(roastErrors[Math.floor(Math.random() * roastErrors.length)], true);
    currentInput = '';
    updateDisplay();
    resultDisplayed = true;
    return;
  }
  try {
    let evalResult = eval(currentInput.replace(/[^-()\d/*+.]/g, ''));
    if (evalResult === undefined || isNaN(evalResult) || !isFinite(evalResult)) {
      showToast(roastErrors[Math.floor(Math.random() * roastErrors.length)], true);
      currentInput = '';
      updateDisplay();
      resultDisplayed = true;
      return;
    }
    currentInput = evalResult.toString();
    updateDisplay();
    resultDisplayed = true;
  } catch {
    showToast("Syntax error. Did you just invent a new math?", true);
    currentInput = '';
    updateDisplay();
    resultDisplayed = true;
  }
}

// Button click animation logic
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    btn.classList.remove('clicked');
    void btn.offsetWidth;
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 250);
  });
});

// Make display scrollable on drag (optional, for mobile)
(function enableDragScroll() {
  const display = document.getElementById('display');
  let isDown = false, startX, scrollLeft;
  display.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - display.offsetLeft;
    scrollLeft = display.scrollLeft;
  });
  display.addEventListener('mouseleave', () => isDown = false);
  display.addEventListener('mouseup', () => isDown = false);
  display.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - display.offsetLeft;
    display.scrollLeft = scrollLeft - (x - startX);
  });
  // Touch support
  display.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - display.offsetLeft;
    scrollLeft = display.scrollLeft;
  });
  display.addEventListener('touchend', () => isDown = false);
  display.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - display.offsetLeft;
    display.scrollLeft = scrollLeft - (x - startX);
  });
})();
