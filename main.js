const allButtonsNumAndOp = document.querySelectorAll(
  ".calculator button:not(.result,.delete,.deleteAll)",
);
const screen = document.querySelector(".parent .screen .text");
const smallScreen = document.querySelector(".parent .small-screen .text");
const deleteBtn = document.querySelector(".calculator .delete");
const deleteAll = document.querySelector(".calculator .deleteAll");
const result = document.querySelector(".calculator .result");
const mode = document.querySelector(".parent img");

if (window.localStorage.getItem("src")) modeFunction();

screen.textContent = "0";
smallScreen.textContent = "0";

// Minus(-) Does Not Exist For This Array Because It Maybe By Specific To The Number (Not Operation)
const arrayOfOperation = ["+", "×", "÷", "%"];

mode.addEventListener("click", function () {
  if (getComputedStyle(document.body).backgroundColor === "rgb(0, 0, 0)") {
    window.localStorage.colorButton = "#f0f0f0";
    window.localStorage.src =
      "imgs/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcGQzNi0xLXBpYTAwMjcxLWpvYjYyM18xLWwxcHFiZnNjLnBuZw.jpeg";
    window.localStorage.color = "black";
    window.localStorage.backgroundColor = "white";
  } else {
    window.localStorage.colorButton = "#3a3a3a";
    window.localStorage.src =
      "imgs/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL3Vwd2s2MjA3NTg4My13aWtpbWVkaWEtaW1hZ2Utam9iMTI2N18xLnBuZw.jpg";
    window.localStorage.color = "#eee";
    window.localStorage.backgroundColor = "black";
  }
  modeFunction();
});

allButtonsNumAndOp.forEach(function (ele) {
  ele.onclick = function () {
    reset();
    if (
      screen.textContent === "Invalid Input" ||
      screen.textContent === "Infinity"
    )
      screen.textContent = "0";
    if (!isNaN(ele.innerHTML)) {
      if (getComputedStyle(screen).opacity === "0.5") screen.textContent = "0";
      if (screen.textContent === "0") screen.textContent = this.textContent;
      else if (
        !(
          screen.textContent.split("").pop() === "0" &&
          (arrayOfOperation.includes(
            screen.textContent[screen.textContent.length - 2],
          ) ||
            screen.textContent[screen.textContent.length - 2] === "-")
        )
      )
        screen.textContent += this.textContent;
    } else if (
      arrayOfOperation.includes(ele.innerHTML) &&
      !arrayOfOperation.includes(screen.textContent.split("").pop()) &&
      screen.textContent.split("").pop() !== "-" &&
      screen.textContent.split("").pop() !== "."
    )
      screen.textContent += this.textContent;
    else if (ele.innerHTML === "-") {
      if (screen.textContent === "0") {
        screen.textContent = this.textContent;
      } else if (
        screen.textContent.split("").pop() !== "-" &&
        screen.textContent.split("").pop() !== "."
      ) {
        screen.textContent += this.textContent;
      }
    } else if (ele.innerHTML === ".") {
      if (
        arrayOfOperation.includes(screen.textContent.split("").pop()) ||
        screen.textContent.split("").pop() === "-"
      ) {
        screen.textContent += "0";
        screen.textContent += this.textContent;
      } else if (
        checkForDot(screen.textContent) &&
        !screen.textContent.includes("e")
      ) {
        screen.textContent += this.textContent;
      }
    }
    calcAndFrag();
  };
});

result.onclick = function () {
  if (screen.textContent === "Infinity") return;
  responsiveWidth(); // 71/70 => over flow width
  screen.textContent = fragmentation(calculate(screen.textContent));
  if (screen.textContent === "Invalid Input")
    smallScreen.textContent = "Invalid Input";
};

deleteAll.onclick = () => {
  reset();
  screen.textContent = "0";
  smallScreen.textContent = "0";
};

deleteBtn.onclick = () => {
  let str = screen.textContent;
  reset();
  if (
    str.length === 1 ||
    str === "Infinity" ||
    str === "Invalid Input" ||
    str.includes("e")
  ) {
    screen.textContent = "0";
  } else screen.textContent = str.slice(0, str.length - 1);
  calcAndFrag();
};

function calculate(str) {
  str = str.replaceAll(",", "");
  if (str.includes("×") || str.includes("÷") || str.includes("%")) {
    for (let i = 0; i < str.length; ++i) {
      if (str[i] === "×" || str[i] === "÷" || str[i] === "%") {
        let operation = str[i];
        let num2 = numberResult(str.slice(i + 1), 0, true);
        let num1 = numberResult(str, i - 1, false);
        let start = i - num1.length;
        let end = i + num2.length;
        let result = calc(new Decimal(num1), new Decimal(num2), operation);
        str = `${str.slice(0, start)}${result}${str.slice(end + 1)}`;
        i = start + result.toString().length - 1;
      }
    }
  }
  while (isNaN(str)) {
    let num1 = numberResult(str, 0, true);
    let operation = str[num1.length];
    let num2 = numberResult(str.slice(num1.length + 1), 0, true);
    let del = num1.length + num2.length + 1;
    num1 = new Decimal(num1);
    num2 = new Decimal(num2);
    str = calc(num1, num2, operation).toString().concat(str.slice(del));
  }
  if (str === "") return "Invalid Input";
  if (str === "-Infinity") return "Infinity";
  return new Decimal(str).toString();
}

function calc(num1, num2, op) {
  switch (op) {
    case "+":
      return num1.plus(num2);
    case "-":
      return num1.minus(num2);
    case "×":
      return num1.times(num2);
    case "÷":
      return num1.div(num2);
    case "%":
      return num1.times(num2).div(100);
    default:
      return "";
  }
}

function calcAndFrag() {
  if (isNaN(calculate(screen.textContent))) smallScreen.textContent = "";
  else {
    smallScreen.textContent = fragmentation(calculate(screen.textContent));
    screen.textContent = fragmentation(screen.textContent);
  }
}

function reset() {
  smallScreen.style.opacity = ".5";
  screen.style.opacity = "1";
  smallScreen.style.fontSize = "20px";
  screen.style.fontSize = "37px";
  smallScreen.style.paddingRight = "4px";
  screen.style.paddingRight = "0";
}

function checkForDot(str) {
  for (let i = str.length - 1; i >= 0; --i) {
    if (str[i] === ".") return false;
    else if (arrayOfOperation.includes(str[i]) || str[i] === "-") break;
  }
  return true;
}

function fragmentation(str) {
  str = str.replaceAll(",", "");
  let result = "";
  for (let i = 0; i < str.length; ++i) {
    if (isNaN(str[i]) && str[i] !== ".") result += str[i];
    else {
      str = str.slice(i);
      let count = 3;
      let lengthInt = calcInt(str);
      let lengthFloat = numberResult(str, 0, true).length;
      while (lengthInt > count) {
        str = str
          .slice(0, lengthInt - count)
          .concat(",", str.slice(lengthInt - count));
        count += 3;
      }
      count -= count > 3 ? 3 : 0;
      i = lengthFloat - 1 + Math.floor(lengthInt / count);
      result += str.slice(0, i + 1);
    }
  }
  return result;
}

function calcInt(num) {
  let res = "";
  for (let i = 0; i < num.length; ++i) {
    if (!isNaN(num[i]) || (num[i] === "-" && (i === 0 || isNaN(num[i - 1]))))
      res += num[i];
    else break;
  }
  return res.length;
}

function numberResult(str, i, incOrDec) {
  let result = "";
  while (
    !isNaN(str[i]) ||
    str[i] === "." ||
    (str[i] === "e" && str[i + 1] === "+") ||
    (str[i] === "+" && str[i - 1] === "e") ||
    (str[i] === "-" && (i === 0 || isNaN(str[i - 1])))
  ) {
    if (incOrDec) {
      result += str[i];
      i++;
    } else {
      result = str[i] + result;
      i--;
    }
  }
  return isNaN(result) || result === "" ? "NaN" : result;
}

function responsiveWidth() {
  smallScreen.style.opacity = "1";
  screen.style.opacity = ".5";
  smallScreen.style.paddingRight = "0";
  screen.style.paddingRight = "4px";
  screen.style.fontSize = "20px";
  let str = smallScreen.textContent;
  smallScreen.style.fontSize =
    str.length > 13 &&
    (innerWidth < 580 || (innerWidth >= 767 && innerWidth < 1160))
      ? `${40 - str.length * 0.7 < 14 ? 14 : 40 - str.length * 0.7}px`
      : "37px";
}

function modeFunction() {
  mode.setAttribute("src", window.localStorage.getItem("src"));
  screen.style.color = window.localStorage.getItem("color");
  smallScreen.style.color = window.localStorage.getItem("color");
  document.body.style.backgroundColor =
    window.localStorage.getItem("backgroundColor");
  document
    .querySelectorAll(".calculator button:not(.result)")
    .forEach((ele) => {
      ele.style.backgroundColor = window.localStorage.getItem("colorButton");
      if (!isNaN(ele.textContent) || ele.textContent === ".")
        ele.style.color = window.localStorage.getItem("color");
    });
}
