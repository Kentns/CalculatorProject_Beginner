class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {     /*take all the inputs & func.=previous+current textElement*/
     this.previousOperandTextElement = previousOperandTextElement
     this.currentOperandTextElement = currentOperandTextElement
     this.redayToReset = false
     this.clear()
    }  

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1) /*刪去輸入中既context*/
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return /*防止超過1個'.'*/
        this.currentOperand = this.currentOperand.toString() + number.toString() /*防止JS以為連續入11=2*/
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.currentOperand !== '' && this.previousOperand !== '')
        this.compute() /*撳完一個operation就直接計咗,所以最底加咗幾時先calculate*/
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() { /*計算功能*/
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '*':
                computation = prev * current
                break
            case '÷':
                computation = prev / current
                break
            default:
                return
        }
        this.redayToReset =true
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1] /*有1或以上先出小數點*/
        let integerDisplay
        if (isNaN(integerDigits)) {
          integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0}) /*當變咗','就唔會變digits數位*/
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}` /*有小數點既就顯示方式*/
        } else {
            return integerDisplay
        }
    }

    updateDisplay() { /*previousData + currentData + anySelectedOperation*/
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) { /*如果有operation,previous個度都要保持有*/
        this.previousOperandTextElement.innerText = 
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = '' /*當撳'='而無operation,清空previous operand value,只留返current value*/
      }
    }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)


allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        /*再加埋負數*/
        if(calculator.previousOperand === '' && calculator.currentOperand !== '' && calculator.readyToReset) {
            calculator.currentOperand = ''
            calculator.readyToReset = false
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

/*防止提早計算咗，要當我地撳'='先行compute*/
equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

/* numberButtons.forEach(button =>{
    button.addEventListener("key", function(event) {
    console.log(event.number);
 })
})*/