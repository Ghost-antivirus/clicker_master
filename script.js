let clickCount = 0;
let earnings = 0.00;
const earningsPerClick = 0.01;
let bonusMultiplier = 1;
let passiveIncome = 0;
let passiveIncomeMultiplier = 1;
const bonusMessage = document.getElementById('bonus-message');
const clickSound = document.getElementById('click-sound');
const clickImage = document.getElementById('click-image');
const bonusImage = document.getElementById('bonus-image');

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateDisplay();
    applyPassiveIncome();
    checkWinStatus();
    createPassiveIncomeElement();
});

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('clickerData'));
    if (savedData) {
        clickCount = savedData.clicks;
        earnings = savedData.earnings;
        bonusMultiplier = savedData.bonusMultiplier;
        passiveIncome = savedData.passiveIncome || 0;
        passiveIncomeMultiplier = savedData.passiveIncomeMultiplier || 1;
    }
}

function updateDisplay() {
    document.getElementById('click-count').textContent = clickCount;
    document.getElementById('earnings').textContent = earnings.toFixed(2);
    updatePassiveIncomeDisplay();
}

function updatePassiveIncomeDisplay() {
    const passiveIncomeElement = document.getElementById('passive-income');
    if (passiveIncomeElement) {
        passiveIncomeElement.textContent = `Passive Income: $${(passiveIncome * passiveIncomeMultiplier).toFixed(2)}/min (x${passiveIncomeMultiplier.toFixed(1)})`;
    }
}

function createPassiveIncomeElement() {
    if (!document.getElementById('passive-income')) {
        const passiveIncomeElement = document.createElement('p');
        passiveIncomeElement.id = 'passive-income';
        document.querySelector('.click-area').appendChild(passiveIncomeElement);
        updatePassiveIncomeDisplay();
    }
}

function checkWinStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('win') === 'true') {
        const passiveIncomeElement = document.getElementById('passive-income');
        if (passiveIncomeElement) {
            passiveIncomeElement.style.opacity = '0';
            setTimeout(() => {
                passiveIncomeElement.style.transition = 'opacity 1s';
                passiveIncomeElement.style.opacity = '1';
            }, 500);
        }
    }
}

clickImage.addEventListener('click', () => {
    clickCount++;
    earnings += earningsPerClick * bonusMultiplier;
    updateDisplay();
    animateButton('click-image');
    clickSound.play();
    saveData();
});

document.getElementById('bonus-button').addEventListener('click', () => {
    if (clickCount >= 100) {
        clickCount -= 100;
        bonusMultiplier += 0.5;
        updateDisplay();
        animateButton('bonus-button');
        animateImageChange();
        updateBonusMessage();
        saveData();
    } else {
        alert("Not enough clicks to buy bonus!");
    }
});

bonusImage.addEventListener('click', () => {
    handleClick();
});

function animateButton(elementId) {
    const element = document.getElementById(elementId);
    element.classList.add('clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 200);
}

function handleClick() {
    clickCount++;
    earnings += earningsPerClick * bonusMultiplier;
    updateDisplay();
    animateButton('click-image');
    clickSound.play();
    saveData();
}

function updateBonusMessage() {
    bonusMessage.textContent = `Bonus Multiplier: x${bonusMultiplier.toFixed(1)}`;
    bonusMessage.classList.add('show');
    setTimeout(() => {
        bonusMessage.classList.remove('show');
    }, 3000);
}

function animateImageChange() {
    clickImage.style.opacity = 0;
    setTimeout(() => {
        clickImage.classList.add('hidden');
        bonusImage.classList.remove('hidden');
        bonusImage.style.opacity = 1;
        document.getElementById('next').textContent = ""
        setTimeout(() => {
            bonusImage.style.opacity = 0;
            setTimeout(() => {
                bonusImage.classList.add('hidden');
                clickImage.classList.remove('hidden');
                clickImage.style.opacity = 1;
                document.getElementById('next').textContent = " "
            }, 500);
        }, 3000); // Время показа бонусного изображения
    }, 500);
}

function applyPassiveIncome() {
    setInterval(() => {
        earnings += passiveIncome * passiveIncomeMultiplier;
        updateDisplay();
        saveData();
    }, 60000); // Добавляем пассивный доход каждую минуту
}

function saveData() {
    const data = {
        clicks: clickCount,
        earnings: earnings,
        bonusMultiplier: bonusMultiplier,
        passiveIncome: passiveIncome,
        passiveIncomeMultiplier: passiveIncomeMultiplier
    };
    localStorage.setItem('clickerData', JSON.stringify(data));
}

// Script for withdraw.html
if (window.location.pathname.includes('withdraw.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        loadData();
        document.getElementById('balance').textContent = earnings.toFixed(2);

        document.getElementById('withdraw-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const amount = parseFloat(document.getElementById('amount').value);

            if (amount > 0 && amount <= earnings) {
                earnings -= amount;
                document.getElementById('balance').textContent = earnings.toFixed(2);
                alert(`Successfully withdrawn $${amount.toFixed(2)}!`);
                saveData();
            } else {
                alert('Invalid amount.');
            }
        });
    });
}

window.addEventListener('beforeunload', saveData);

function applyPassiveIncome() {
    setInterval(() => {
        earnings += passiveIncome;
        document.getElementById('earnings').textContent = earnings.toFixed(2);
        saveData();
    }, 60000); // Добавляем пассивный доход каждую минуту
}
