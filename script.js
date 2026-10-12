
const result = document.getElementById("result");
const expression = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;
let justCalculated = false;

function updateDisplay() {
    result.textContent = current;
}

function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    waitingForNumber = false;
    justCalculated = false;
    expression.textContent = "";
    updateDisplay();
}

function formatNumber(number) {
    if (!Number.isFinite(number)) return "Error";

    const rounded = Number(number.toPrecision(12));
    return String(rounded);
}

function inputNumber(number) {
    if (current === "Error") clearAll();

    if (waitingForNumber || justCalculated) {
        current = number;
        waitingForNumber = false;
        justCalculated = false;
    } else {
        current = current === "0" ? number : current + number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (current === "Error") clearAll();

    if (waitingForNumber || justCalculated) {
        current = "0.";
        waitingForNumber = false;
        justCalculated = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const input = Number(current);

    if (operator && !waitingForNumber) {
        const answer = calculate(previous, input, operator);

        if (answer === null) {
            showError();
            return;
        }

        current = formatNumber(answer);
    }

    previous = Number(current);
    operator = nextOperator;
    waitingForNumber = true;
    justCalculated = false;

    expression.textContent =
        `${formatNumber(previous)} ${displayOperator(operator)}`;

    updateDisplay();
}

function displayOperator(op) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op];
}

function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? null : a / b;
        default: return b;
    }
}

function showError() {
    current = "Error";
    previous = null;
    operator = null;
    waitingForNumber = true;
    justCalculated = true;
    expression.textContent = "Cannot divide by zero";
    updateDisplay();
}

function calculateResult() {
    if (operator === null || previous === null || current === "Error") {
        return;
    }

    const a = previous;
    const b = Number(current);
    const op = operator;
    const answer = calculate(a, b, op);

    expression.textContent =
        `${formatNumber(a)} ${displayOperator(op)} ${formatNumber(b)} =`;

    if (answer === null) {
        showError();
        return;
    }

    current = formatNumber(answer);
    previous = null;
    operator = null;
    waitingForNumber = false;
    justCalculated = true;

    updateDisplay();
}

function applyPercent() {
    if (current === "Error") return;

    current = formatNumber(Number(current) / 100);
    waitingForNumber = false;
    justCalculated = false;
    updateDisplay();
}

function deleteLast() {
    if (current === "Error" || justCalculated) {
        clearAll();
        return;
    }

    if (waitingForNumber) return;

    current = current.length > 1 ? current.slice(0, -1) : "0";

    if (current === "-" || current === "") current = "0";

    updateDisplay();
}

function doubleZero() {
    inputNumber("00");
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
        if ("0123456789".includes(value) && value.length === 1) {
            inputNumber(value);
        } else if (["+", "-", "*", "/"].includes(value)) {
            chooseOperator(value);
        }
        return;
    }

    switch (action) {
        case "clear":
            clearAll();
            break;
        case "delete":
            deleteLast();
            break;
        case "decimal":
            inputDecimal();
            break;
        case "percent":
            applyPercent();
            break;
        case "double-zero":
            doubleZero();
            break;
        case "calculate":
            calculateResult();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearAll();
    } else if (key === "%") {
        applyPercent();
    }
});

updateDisplay();
