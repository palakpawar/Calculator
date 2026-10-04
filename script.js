// PREMIUM CALCULATOR
const currentOperand = document.getElementById("currentOperand");
const previousOperand = document.getElementById("previousOperand");

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");

const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const equalsButton = document.querySelector('[data-action="equals"]');
let currentValue = "";
let previousValue = "";
let operation = null;
// DISPLAY
function updateDisplay() {
    currentOperand.textContent = currentValue || "0";
    if (operation && previousValue !== "") {
        previousOperand.textContent =
            `${previousValue} ${getOperationSymbol(operation)}`;
    } else {
        previousOperand.textContent = "";
    }
}
// OPERATION SYMBOLS
function getOperationSymbol(operator) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };
    return symbols[operator] || operator;
}
// ADD NUMBER
function appendNumber(number) {
    if (number === "." && currentValue.includes(".")) {
        return;
    }
    if (number === "." && currentValue === "") {
        currentValue = "0.";
    } else {
        currentValue += number;
    }
    updateDisplay();
}
// CHOOSE OPERATION
function chooseOperation(selectedOperation) {

    // Percentage button
    if (selectedOperation === "%") {

        // Example: 200 + 10%
        if (previousValue !== "" && currentValue !== "" && operation) {
            const previous = parseFloat(previousValue);
            const current = parseFloat(currentValue);

            currentValue = formatResult((previous * current) / 100);

            updateDisplay();
            return;
        }

        return;
    }

    if (currentValue === "" && previousValue === "") {
        return;
    }

    if (currentValue === "" && previousValue !== "") {
        operation = selectedOperation;
        updateDisplay();
        return;
    }

    if (previousValue !== "" && operation) {
        calculate();
    }

    previousValue = currentValue;
    currentValue = "";
    operation = selectedOperation;

    updateDisplay();
}
// CALCULATE
function calculate() {
    if (
        previousValue === "" ||
        currentValue === "" ||
        !operation
    ) {
        return;
    }
    const previous = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;
    switch (operation) {
        case "+":
            result = previous + current;
            break;
        case "-":
            result = previous - current;
            break;
        case "*":
            result = previous * current;
            break;
        case "/":
            if (current === 0) {
                currentValue = "Error";
                previousValue = "";
                operation = null;
                updateDisplay();
                return;
            }
            result = previous / current;
            break;
        // case "%":
        //     result = previous % current;
        //     break;
        default:
            return;
    }
    currentValue = formatResult(result);
    previousValue = "";
    operation = null;
    updateDisplay();
}
// FORMAT RESULT
function formatResult(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }
    const rounded = Math.round(number * 100000000) / 100000000;
    return rounded.toString();
}
// DELETE
function deleteNumber() {
    if (currentValue === "Error") {
        clearCalculator();
        return;
    }
    currentValue = currentValue.slice(0, -1);
    updateDisplay();
}
// CLEAR
function clearCalculator() {
    currentValue = "";
    previousValue = "";
    operation = null;
    updateDisplay();
}
// NUMBER BUTTON EVENTS
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});
// OPERATION BUTTON EVENTS
operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
    });
});
// EQUAL BUTTON
equalsButton.addEventListener("click", () => {
    calculate();
});
// CLEAR BUTTON
clearButton.addEventListener("click", () => {
    clearCalculator();
});
// DELETE BUTTON
deleteButton.addEventListener("click", () => {
    deleteNumber();
});
// KEYBOARD SUPPORT
document.addEventListener("keydown", event => {
    const key = event.key;
    // Numbers
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        appendNumber(key);
    }
    // Operators
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        chooseOperation(key);
    }
    // Percentage
    if (key === "%") {
        chooseOperation("%");
    }
    // Enter or =
    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }
    // Backspace
    if (key === "Backspace") {
        deleteNumber();
    }
    // Escape
    if (key === "Escape") {
        clearCalculator();
    }
});
//  INITIAL DISPLAY
updateDisplay();

function toggleTheme() {
    document.body.classList.toggle("light");
}