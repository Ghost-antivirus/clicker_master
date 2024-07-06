document.addEventListener('DOMContentLoaded', () => {
    const correctNumber = Math.floor(Math.random() * 10) + 1;
    const gameMessage = document.getElementById('game-message');
    const guessButtons = document.querySelectorAll('.guess-button');
    const lastPlayedTime = localStorage.getItem('lastPlayedTime');
    const currentTime = new Date().getTime();

    if (lastPlayedTime && currentTime - lastPlayedTime < 3600000) {
        disableButtons(guessButtons);
        gameMessage.textContent = `You can play again in ${Math.ceil((3600000 - (currentTime - lastPlayedTime)) / 60000)} minutes.`;
        return;
    }

    guessButtons.forEach(button => {
        button.addEventListener('click', () => {
            const guess = parseInt(button.getAttribute('data-number'));
            if (guess === correctNumber) {
                gameMessage.textContent = 'Congratulations! You guessed the correct number!';
                addPassiveIncome();
                localStorage.setItem('lastPlayedTime', currentTime);
                disableButtons(guessButtons);
                setTimeout(() => {
                    window.location.href = 'index.html?win=true';
                }, 2000);
            } else {
                gameMessage.textContent = 'Sorry, try again!';
            }
            animateButton(button);
        });
    });
});

function disableButtons(buttons) {
    buttons.forEach(button => {
        button.disabled = true;
        button.style.transition = 'opacity 0.5s';
        button.style.opacity = '0.5';
    });
}

function addPassiveIncome() {
    let savedData = JSON.parse(localStorage.getItem('clickerData')) || {
        clicks: 0,
        earnings: 0.00,
        bonusMultiplier: 1,
        passiveIncome: 0,
        passiveIncomeMultiplier: 1
    };
    savedData.passiveIncome = (savedData.passiveIncome || 0) + 0.05;
    savedData.passiveIncomeMultiplier = (savedData.passiveIncomeMultiplier || 1) + 0.5;
    localStorage.setItem('clickerData', JSON.stringify(savedData));
}

function animateButton(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200);
}