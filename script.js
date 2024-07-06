let clickCount = 0;
let earnings = 0.00;
const earningsPerClick = 0.01;
let bonusMultiplier = 1;
const bonusMessage = document.getElementById('bonus-message');
const clickSound = document.getElementById('click-sound');

// Загрузка данных из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedData = JSON.parse(localStorage.getItem('clickerData'));
    if (savedData) {
        clickCount = savedData.clicks;
        earnings = savedData.earnings;
        bonusMultiplier = savedData.bonusMultiplier;
        document.getElementById('click-count').textContent = clickCount;
        document.getElementById('earnings').textContent = earnings.toFixed(2);
        if (bonusMultiplier > 1) {
            updateBonusMessage();
        }
    }
});

document.getElementById('click-image').addEventListener('click', () => {
    clickCount++;
    earnings += earningsPerClick * bonusMultiplier;

    document.getElementById('click-count').textContent = clickCount;
    document.getElementById('earnings').textContent = earnings.toFixed(2);
    animateButton('click-image');
    clickSound.play(); // Воспроизводим звук при клике

    saveData(); // Сохраняем данные
});

document.getElementById('bonus-button').addEventListener('click', () => {
    if (clickCount >= 100) {
        clickCount -= 100;
        bonusMultiplier += 0.5;
        document.getElementById('click-count').textContent = clickCount;
        updateBonusMessage();
        animateButton('bonus-button');
        saveData(); // Сохраняем данные
    } else {
        alert("Not enough clicks to buy bonus!");
    }
});

function animateButton(elementId) {
    const element = document.getElementById(elementId);
    element.classList.add('clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 200);
}

function updateBonusMessage() {
    bonusMessage.textContent = `Bonus Multiplier: x${bonusMultiplier.toFixed(1)}`;
    bonusMessage.classList.add('show');
    setTimeout(() => {
        bonusMessage.classList.remove('show');
    }, 3000); // Скрываем сообщение через 3 секунды
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
        const savedData = JSON.parse(localStorage.getItem('clickerData'));
        if (savedData) {
            document.getElementById('balance').textContent = savedData.earnings.toFixed(2);
        }

        document.getElementById('withdraw-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const amount = parseFloat(document.getElementById('amount').value);

            if (amount > 0 && amount <= parseFloat(document.getElementById('balance').textContent)) {
                earnings -= amount;
                document.getElementById('balance').textContent = earnings.toFixed(2);
                alert(`Successfully withdrawn $${amount.toFixed(2)}!`);
                saveData(); // Сохраняем данные после вывода средств
            } else {
                alert('Invalid amount.');
            }
        });
    });
}

window.addEventListener('beforeunload', saveData);
