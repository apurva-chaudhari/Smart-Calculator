let display = document.getElementById("display");
let historyList = document.getElementById("historyList");
let history = JSON.parse(localStorage.getItem("history")) || [];

/* -----------------------------
   Load Data
------------------------------*/

displayHistory();

if(localStorage.getItem("theme")=="dark")
{
    document.body.classList.add("dark");
    document.getElementById("themeBtn").innerHTML='<i class="bi bi-sun-fill"></i>';
}

/* -----------------------------
   Add Value
------------------------------*/

function addValue(value)
{
    if(display.value=="Error")
    {
        display.value="";
    }

    let last=display.value.slice(-1);

    let operators=["+","-","*","/"];

    if(operators.includes(last) && operators.includes(value))
    {
        return;
    }

    if(value==".")
    {
        let parts=display.value.split(/[\+\-\*\/]/);

        let current=parts[parts.length-1];

        if(current.includes("."))
        {
            return;
        }
    }

    display.value+=value;
}

/* -----------------------------
   Clear
------------------------------*/

function clearDisplay()
{
    display.value="";
}

/* -----------------------------
   Backspace
------------------------------*/

function backspace()
{
    display.value=display.value.slice(0,-1);
}

/* -----------------------------
   Percentage
------------------------------*/

function percentage()
{
    if(display.value=="")
    {
        return;
    }

    try
    {
        display.value=parseFloat(display.value)/100;
    }

    catch
    {
        display.value="Error";
    }
}

/* -----------------------------
   Calculate
------------------------------*/

function calculateResult()
{
    if(display.value=="")
    {
        return;
    }

    try
    {
        let expression=display.value;

        let result=eval(expression);

        if(!isFinite(result))
        {
            throw new Error();
        }

        addHistory(expression,result);

        display.value=result;
    }

    catch
    {
        display.value="Error";
    }
}

/* -----------------------------
   History
------------------------------*/

function addHistory(exp,result)
{
    history.unshift(exp+" = "+result);

    if(history.length>10)
    {
        history.pop();
    }

    localStorage.setItem("history",JSON.stringify(history));

    displayHistory();
}

function displayHistory()
{
    historyList.innerHTML="";

    history.forEach(function(item){

        let li=document.createElement("li");

        li.textContent=item;

        historyList.appendChild(li);

    });

}

/* -----------------------------
   Clear History
------------------------------*/

document.getElementById("clearHistoryBtn").onclick=function(){

    history=[];

    localStorage.removeItem("history");

    displayHistory();

}

/* -----------------------------
   Copy Answer
------------------------------*/

document.getElementById("copyBtn").onclick=function(){

    if(display.value=="")
    {
        return;
    }

    navigator.clipboard.writeText(display.value);

    alert("Result Copied!");

}

/* -----------------------------
   Theme
------------------------------*/

document.getElementById("themeBtn").onclick=function(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark"))
    {
        localStorage.setItem("theme","dark");

        this.innerHTML='<i class="bi bi-sun-fill"></i>';
    }

    else
    {
        localStorage.setItem("theme","light");

        this.innerHTML='<i class="bi bi-moon-fill"></i>';
    }

}

/* -----------------------------
   Keyboard Support
------------------------------*/

document.addEventListener("keydown",function(e){

    let key=e.key;

    if((key>="0" && key<="9") || key=="+" || key=="-" || key=="*" || key=="/" || key==".")
    {
        addValue(key);
    }

    else if(key=="Enter" || key=="=")
    {
        e.preventDefault();

        calculateResult();
    }

    else if(key=="Backspace")
    {
        backspace();
    }

    else if(key=="Escape")
    {
        clearDisplay();
    }

    else if(key=="%")
    {
        percentage();
    }

});