class Calculator {
    constructor(previousOperandAndTextElement, currentOperandAndTextElement) {
        this.previousOperandAndTextElement = previousOperandAndTextElement;
        this.currentOperandAndTextElement = currentOperandAndTextElement;
        this.clear();
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = undefined;
    }

    //The getDisplayNumber() function makes the display of current and previous values to insert a delimiter to make it easier to read
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})//will ensure that no decimal places can be added after the first decimal place
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    //Allows for muliple digit numbers to be added
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return; // to ensure the period can only be used once, will return value
        this.currentOperand = this.currentOperand.toString() + number.toString() //sets all inputted numbers to a string to concatenate them instead of add them
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return; // to ensure that it cannot append an empty string
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';

    }

    compute() {
        let computation; //initialising the final computed value
        let prev = parseFloat(this.previousOperand); // this converts the string value of the previous operand to a float
        let current = parseFloat(this.currentOperand);
        if(isNaN(prev) || isNaN(current)) return; // if the previousOperanad or current is not NaN then the operation is cancelled

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default: 
                return
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay() {
        this.currentOperandAndTextElement.innerText = 
        this.getDisplayNumber(this.currentOperand); //The current operand window needs to refresh each time new button is pressed
        if (this.operation != null) {
            this.previousOperandAndTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandAndTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]'); 
//all data-attributes need to be inside brackets
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandAndTextElement = document.querySelector('[data-previous-operand]');
const currentOperandAndTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandAndTextElement, currentOperandAndTextElement);

//Make number buttons appear inside window
numberButtons.forEach(button => {

    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
});

//Make operations appear inside window
operationButtons.forEach(button => {

    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
});


//When the equalsButton is pressed it will call the compute function which will compute the current values and update the display
equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

//To clear the display 
allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})
//To delete the previous number and update the display 
deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})

