const buttons = document.querySelectorAll('.buttons');
const cleared = document.querySelector('#AC');

const displayContainer = document.querySelector('.display-container');
const displayUpper = document.querySelector('.display.upper');
const displayLower = document.querySelector('.display.lower');

buttons.forEach(elem => {
    elem.addEventListener('click', print)
});

function print(e){
    let displayText = (displayUpper.textContent + displayLower.textContent);
    let input = e.target;
    let inputText = input.textContent;

    let returnValue;

    switch(true){
        case input.classList.contains('movements'):
            if(input.id === 'AC'){
                let displayLines = Array.from(displayContainer.children);
                displayLines.forEach(elem => elem.textContent = "");
                displayContainer.classList.remove('double-line');

                return;
        
            }
            returnValue = displayText.slice(0, -1);
            break;

        case input.id === "equals":
            if(!!displayText.length){
                returnValue = evaluation(displayText);
                
            } else {
                returnValue = "0";
                
            }
            displayText += "=";
            ansStructure(returnValue);
            
            return;
            
        case input.classList.contains('numbers'):
            returnValue = displayText + inputText;
            break;

        case input.classList.contains('operators'):
            returnValue = operations(inputText);
            break;

    }

    // expressionFormat(returnValue);
    continuousStructure(returnValue);
    return;

}

const oneLineCheck = () => displayText.length >= 16 ? false : true;
function ansStructure(answer){
    if(oneLineCheck && answer.length <= 16){
        displayContainer.classList.add('double-line');
        displayUpper.textContent = displayText;
        displayLower.textContent = answer;

    } else {
        cleared.click();
        displayUpper.textContent = answer;

    }
}

function continuousStructure(input){
    if(oneLineCheck){
        displayContainer.classList.remove('double-line');
        displayUpper.textContent = input;

    } else {
        displayContainer.classList.add('double-line');
        displayUpper.textContent = input.slice(0, 16);
        displayLower.textContent = input.slice(17);

    }
}

const isOperator = (char) => /[-+*÷]/g.test(char);
function operations(inputOperator){
    
    let lastDigit = [...displayText].pop();
    if(["*","÷","+"].includes(inputOperator) && isOperator(lastDigit) || lastDigit === "."){
        activateError();
        return displayText;
    }

    return displayText + inputOperator;
}


function evaluation(a){
    const operators = ["÷", "*", "+", "-"];
    for(let val of operators){

        while(a.indexOf(val) !== -1){
            let index = a.indexOf(val);
            let arr = stringTraversal(a, index);
            let ans = performFormula(parseFloat(arr[0]), parseFloat(arr[2]), arr[1]);

            a = a.split(arr[0] + arr[1] + arr[2]).join(ans);
        }
        
    }
    return a;

}

function stringTraversal(str, index){
    let leftSide = '';
    let rightSide = '';

    let fullLeftSide = str.slice(0, index);
    let fullRightSide = str.slice(index + 1);

    //Checking the left side of the string until we find an operator
    if(isOperator(fullLeftSide)){
        for(let i = index - 1; i >= 0; i--){
            if(isOperator(fullLeftSide[i])) {
                leftSide = fullLeftSide.slice(i + 1, index);
                break;
            }
        }
        
    } else {
        leftSide = fullLeftSide;
    }

    //Checking the right side of the string until we find an operator
    if(isOperator(fullRightSide)){
        for(let i = index + 1; i < str.length; i++){
            if(isOperator(str[i])) {
                rightSide = str.slice(index + 1, i);
                break;
            }
        }

    } else {
        rightSide = fullRightSide;
    }
    return[leftSide, str[index], rightSide];

}

function performFormula(num1, num2, operator){
    switch(operator){
        case "*":
            return num1 * num2;

        case "-":
            return num1 - num2;

        case "+":
            return num1 + num2;

        case "÷":
            return num1 / num2;

    }

}

function activateError(){
    return;
}