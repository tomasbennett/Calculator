const buttons = document.querySelectorAll('.buttons');
const cleared = document.querySelector('#AC');

const displayContainer = document.querySelector('.display-container');
const displayUpper = document.querySelector('.display.upper');
const displayLower = document.querySelector('.display.lower');

buttons.forEach(elem => elem.addEventListener('click', print));

const operators = ["÷", "*", "+", "-"];

// function print2(e){
//     let input = e.target;
//     let inputText = input.textContent;
    
//     let firstNumberCase = convertClosure();
    

// }


// function convertClosure(){
//     let num = 0;
//     let divisor = 1;
//     let isDecimal = false;

//     function convertToNum(str){
//         if(isDecimal){
//             divisor *= 10;
//             num += +str / divisor;
//         } else {
//             num *= 10;
//             num += +str;
//         }
//     }

//     function convertToDecimal(){
//         isDecimal = true;
//     }

//     function removeDecimal(){
//         isDecimal = false;
//     }

//     function backSpace(){
//         if(isDecimal){
//             num *= divisor / 10;
//             num = Math.floor(num);
//             num /= divisor / 10;
//         } else {
//             num /= 10;
//             num = Math.floor(num);
//         }
//     }

//     function returnNumber(){
//         return num;
//     }

//     function getDivisor(){
//         return divisor;
//     }
    
//     return{
//         convertToNum,
//         convertToDecimal,
//         returnNumber,
//         getDivisor,
//         backSpace,
//         removeDecimal
//     }
// }






































function print(e){
    let displayText = (displayUpper.textContent + displayLower.textContent);
    let lastDigit = [...displayText].pop() ?? '';
    
    let input = e.target;
    let inputText = input.textContent;
    

    let returnValue;
    const oneLineCheck = () => returnValue.length >= 16 ? false : true;

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
            if(lastDigitOperator(inputText, lastDigit)) return;
            else if(!!displayText.length){
                displayText = displayText.replace(/--/g, "+");
                displayText = displayText.replace(/^\+/g, "");

                returnValue = evaluation(displayText);
                
            } else {
                returnValue = "0";
                
            }
            displayText += inputText;
            ansStructure(returnValue);
            return;
            
        case input.classList.contains('numbers'):
            returnValue = displayText + inputText;
            break;

        case input.classList.contains('operators'):

            returnValue = lastDigit || inputText === "-" ?
                operations(inputText, displayText, lastDigit) :
                displayText;
            break;

    }

    // expressionFormat(returnValue);
    continuousStructure(returnValue);
    return;

    
    function ansStructure(answer){
        if(oneLineCheck() && answer.length <= 16){
            displayContainer.classList.add('double-line');
            displayUpper.textContent = displayText;
            displayLower.textContent = answer;
    
        } else {
            cleared.click();
            displayUpper.textContent = answer;
    
        }
    }
    
    function continuousStructure(input){
        if(oneLineCheck()){
            displayContainer.classList.remove('double-line');
            displayUpper.textContent = input;
    
        } else {
            displayContainer.classList.add('double-line');
            displayUpper.textContent = input.slice(0, 16);
            displayLower.textContent = input.slice(16);
    
        }
    }
}


const isOperator = (char) => /[-+*÷]/g.test(char);
const isPositiveOperator = (char) => /[+*÷]/g.test(char);
const lastDigitOperator = (inputOperator, lastDigit) => {
    if(["*","÷","+","="].includes(inputOperator) && isOperator(lastDigit) || lastDigit === "."){
        activateError();
        return true;
    }
    return false;
}
function operations(inputOperator, displayText, lastDigit){
    
    return lastDigitOperator(inputOperator, lastDigit) ? displayText : displayText + inputOperator;

}


//const operators = ["÷", "*", "+", "-"];
function evaluation(a){
    for(let val of operators){

        while(a.lastIndexOf(val) !== -1){
            let index = a.indexOf(val);
            if(!index) return a;
            let arr = stringTraversal(a, index);


            // let ans = performFormula(parseFloat(arr[0]), parseFloat(arr[2]), arr[1]);
            let ans = performFormula(convertStrToNum(arr));

            a = a.split(arr.join('')).join(ans);
        }
        
    }
    return a;

}

function convertStrToNum(arr){
    let num1;
    let num2;
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
    if(isPositiveOperator(fullRightSide)){
        for(let i = index + 1; i < str.length; i++){
            if(isPositiveOperator(str[i])) {
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