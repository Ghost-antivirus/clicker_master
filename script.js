let clickCount = 0;
let earnings = 0.00;
const earningsPerClick = 0.01;
let bonusMultiplier = 1;
const bonusMessage = document.getElementById('bonus-message');
const clickSound = document.getElementById('click-sound');
const clickImage = document.getElementById('click-image');
const bonusImage = document.getElementById('bonus-image');

// Загрузка данных из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateDisplay();
});

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('clickerData'));
    if (savedData) {
        clickCount = savedData.clicks;
        earnings = savedData.earnings;
        bonusMultiplier = savedData.bonusMultiplier;
    }
}

function updateDisplay() {
    document.getElementById('click-count').textContent = clickCount;
    document.getElementById('earnings').textContent = earnings.toFixed(2);
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

function saveData() {
    const data = {
        clicks: clickCount,
        earnings: earnings,
        bonusMultiplier: bonusMultiplier
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
