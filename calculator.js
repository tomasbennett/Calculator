const buttons = document.querySelectorAll('.buttons');
const cleared = document.querySelector('#AC');
const equals = document.querySelector('#equals');

const displayContainer = document.querySelector('#display-container');
const displayUpper = document.querySelector('.upper-formula bdi');
const displayLower = document.querySelector('.lower-formula bdi');

buttons.forEach(elem => elem.addEventListener('mousedown', print));



let run = convertClosure();
displayUpper.textContent = run.reset();


document.body.addEventListener("keydown", (e) => {
    let str = '';

    switch(e.key){
        case "Enter":
            str = "=";
            break;

        case "Backspace":
            str = "⌫";
            break;

        case "Escape":
            str = "AC";
            break;

        default:
            str = e.key;
    }

    print(str);
});

function print(e){
    let input;
    let inputText;

    if(typeof e == "string"){
        inputText = e;
    }
    else {
        input = e.target;
        inputText = input.textContent;
    }


    if(inputText == "AC"){
        clear();

    } 
    else if(inputText == "⌫"){
        displayUpper.textContent = run.backSpace();
    }
    else if(preventionChecksComplete(inputText)){
        displayUpper.textContent = run.filterInput(inputText);

        if(inputText == "="){
            displayContainer.classList.add('double-line');

            let eval = run.evaluate();

            displayLower.textContent = eval == Infinity ? 
                "Divide by zero ERROR" : 
                eval;

            scrollToLeft();

            buttons.forEach(elem => elem.removeEventListener('mousedown', print));
            buttons.forEach(elem => elem.addEventListener('mousedown', eventListenerCleanUp));
        }
    }

    
    

}

function scrollToLeft(){
    let ansDiv = displayLower.parentElement;
    ansDiv.scrollLeft -= ansDiv.scrollWidth;
}

function eventListenerCleanUp(e){
    clear();
    print(e);
}



function clear(){
    displayUpper.textContent = run.reset();
    displayLower.textContent = '';
    displayContainer.className = '';

    buttons.forEach(elem => elem.removeEventListener('mousedown', eventListenerCleanUp));
    buttons.forEach(elem => elem.addEventListener('mousedown', print));

}


// function isOverflowing(element) {
//     return element.offsetWidth > element.parentElement.offsetWidth;
// }

function preventionChecksComplete(inputText){
    const currentText = displayUpper.textContent;
    const lastChar = [...currentText].pop();
    const operators = [".", "+", "*", "÷", "="];

    switch(true){
        case operators.includes(inputText) && (operators.includes(lastChar) || ["Hello World!", ""].includes(currentText)):
            return false;

        case (inputText == "-" || operators.includes(inputText)) && lastChar == "-":
            return false;

        case inputText == "0" && lastChar == "0" && (currentText == "0" || operators.slice(1).includes(currentText.slice(-2, -1))):
            return false;

        case /[0-9\-]/g.test(inputText) || operators.includes(inputText):
            return true;

        default:
            return false;
    }
}













function convertClosure(){
    let num = 0;
    let divisor = 1;
    let isDecimal = false;
    let isNegative = false;
    let higherPrec = false;

    let displayFormula = '';
    
    let id = 1;
    let inputText = '';
    let initialArr = [0, "+", 0];
    initialArr.length = 4;
    let obj = {
        0: initialArr
    }
    const operators = { "÷": 3, "*": 2, "+": 1, "-": 1 }

    function filterInput(str) {

        inputText = str;
    
        if (inputText === '-' && negativeNumberNotOperator()){
            convertToNegative();
        }
        else if (inputText in operators){
            // inputText === '-' ? convertToNegative() : convertToPositive();

            newOperators();
        } 
        else if (inputText === '.'){
            inputText = convertToDecimal();
        } 
        else if(!isNaN(inputText)){
            convertToNum();
        }

        displayFormula += inputText;
        return displayFormula;
    }

    function reset(){
        id = 1;
        num = 0;
        divisor = 1;
        isDecimal = false;
        isNegative = false;
        displayFormula = '';

        initialArr = [0, "+", 0,];

        obj = {
            0: initialArr
        }
        return "Hello World!";
    }

    function negativeNumberNotOperator() {
        let lastChar = [...displayFormula].pop();
        return ["*", "÷"].includes(lastChar) || displayFormula == '';
    }

    function newOperators(){

        const prevOperIndex = operators[obj[id - 1][1]];
        const newOperIndex = operators[inputText];
        

        let arr = [];
        arr.length = 4;
        arr[1] = inputText;
        obj[id] = arr;

        if(newOperIndex >= prevOperIndex){
            obj[id][0] = num;
            obj[id - 1][2] = performCalculation.bind(null, id);

        }
        else {
            obj[id][0] = performCalculation.bind(null, id - 1);
            obj[id - 1][2] = num;

        }
        
        id++;

        num = 0;
        divisor = 1;
        isDecimal = false;
        isNegative = false;
    }

    function performCalculation(index){

        if(3 in obj[index]) return obj[index][3];

        const operator = obj[index][1];
        let num1 = obj[index][0];
        let num2 = obj[index][2];
        
        if (typeof num1 === 'function') {
            num1 = num1();
            obj[index][0] = num1;
        }
    
        if (typeof num2 === 'function') {
            num2 = num2();
            obj[index][2] = num2;
        }
        
        switch (operator) {
            case '+':
                obj[index][3] = num1 + num2;
                break;
            case '*':
                obj[index][3] = num1 * num2;
                break;
            case '÷':
                obj[index][3] = num1 / num2;
                break;
            case '-':
                obj[index][3] = num1 - num2;
                break;

        }
        return obj[index][3];

    }
    
    function evaluate(){
        obj[id - 1][2] = num;

        let ans = 0;
        for(let [key, val] of Object.entries(obj)){
            if(key == 0){
                ans = performCalculation(key);

            } 
            else if(!(3 in val) && key != 0){
                obj[key - 1][3] = ans;
                ans = performCalculation(key);

            }
        }
        return ans;

    }

    function convertToNum(){

        if(isDecimal){
            divisor *= 10;
            num += isNegative ? -(+inputText) / divisor : +inputText / divisor;
        } else {
            num *= 10;
            num += isNegative ? -(+inputText) : +inputText;
        }
    }

    function convertToDecimal() {
        if(isDecimal) return '';

        isDecimal = true;
        return '.';
    }

    function convertToNegative(){
        isNegative = true;
    }

    function convertToPositive(){
        isNegative = false;
    }

    function backSpace(){

        let lastChar = [...displayFormula].pop();
        if(lastChar in operators && !isNegative){

            if(typeof obj[id - 1][0] == "function"){
                num = obj[id - 2][2];

            } 
            else {
                num = obj[id - 1][0];

            }
            
            delete obj[id - 1];
            id--;

            if(num < 0) isNegative = true;
            else isNegative = false;
            
            if(!Number.isInteger(num)) isDecimal = true;
            else isDecimal = false;
        }
        else if(lastChar == "-" && isNegative) {
            isNegative = false;
        }
        else if(lastChar == "."){
            isDecimal = false;
        }
        else{
            if(isDecimal){
                num *= divisor / 10;
                num = Math.trunc(num);
                num /= divisor / 10;

            }
            else {
                num /= 10;
                num = Math.trunc(num)
            }
        }

        displayFormula = displayFormula.slice(0, -1);
        return displayFormula;
    }

    function returnObject(){
        obj[id - 1][2] = num;
        return evaluate();
    }

    // function getDivisor(){
    //     return divisor;
    // }

    
    return{
        filterInput,
        returnObject,
        evaluate,
        backSpace,
        reset
    }
}