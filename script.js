const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownTitleEl = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('#countdown-list span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

const countdownTitleError = document.getElementById('title-error');
const countdownDateError = document.getElementById('date-error');
let formValid = true;

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown = {};

// Conversions to milliseconds
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
    let distance = countdownValue - now;

    const days = Math.floor(distance / day);
    distance -= days * day; 
    const hours = Math.floor(distance / hour);
    distance -= hours * hour;
    const minutes = Math.floor(distance / minute);
    distance -= minutes * minute;
    const seconds = Math.floor(distance / second);

     // Hide Input
    inputContainer.hidden = true;
    
    // If the countdown has ended, show complete
    if (distance < 0 ) {
        countdownEl.hidden = true;
        clearInterval(countdownActive);
        completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        completeEl.hidden = false;
    } else {
        // Else, show the countdown in progress
        // Populate Countdown
        countdownTitleEl.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        completeEl.hidden = true;
        countdownEl.hidden = false;
    }

    }, second);
}

// Take Values from Form Input
function updateCountdown(e) {
    e.preventDefault();
    formValid = true;
    checkTitleValidation(e);
    checkDateValidation(e);
    countdownTitle = e.target[0].value;
    countdownDate = e.target[1].value;

    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };

    if (formValid) {
        localStorage.setItem('countdown', JSON.stringify(savedCountdown));
        // Get number version of current date
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();

    }
}

// TODO: refactor 3 functions into an abstracted function that takes elements and messages as args
function checkTitleValidation(e) {
    if (e.target[0].validity.valueMissing) {
        formValid = false;
        showError(countdownTitleError, 'Enter a title.');
    } else {
        countdownTitleError.textContent = "";
    }
}

function checkDateValidation(e) {
    if (e.target[1].validity.valueMissing) {
        formValid = false;
        showError(countdownDateError, 'Choose a date.');
    } else {
        countdownDateError.textContent = "";
    }
}

function showError(element, message) {
    element.textContent = message;
    element.className = "error active";
}

// Reset All Values
function reset() {
    // Hide countdowns, show Input
    countdownEl.hidden = true;
    inputContainer.hidden = false;
    completeEl.hidden = true;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset Values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

// Get countdown from localStorage if available
function restorePreviousCountdown(){
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check localStorage
restorePreviousCountdown();