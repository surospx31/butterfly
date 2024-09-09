// Функції для роботи з базою даних через LocalStorage
function saveToDatabase(data) {
    localStorage.setItem("userData", JSON.stringify(data));
}

function loadFromDatabase() {
    return JSON.parse(localStorage.getItem("userData")) || null;
}

// Авторизація через Telegram
function telegramAuth(userInfo) {
    const user = {
        id: userInfo.id,
        name: userInfo.first_name,
        points: 0,
        level: 1,
        friends: 0,
        tonBalance: 0,
        referralCode: generateReferralCode()
    };
    saveToDatabase(user);
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
}

// Симуляція Telegram авторизації
document.getElementById("auth-button").addEventListener("click", function() {
    const mockTelegramResponse = { id: "123456", first_name: "John" };
    telegramAuth(mockTelegramResponse);
});

// Генерація унікального реферального коду
function generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Функція Claim
document.getElementById("click-button").addEventListener("click", function() {
    document.getElementById("main-screen").style.display = "none";
    document.getElementById("interface-screen").style.display = "block";
});

// Система рівнів і прогрес бару
function updateLevel(points) {
    const userData = loadFromDatabase();
    let requiredPoints = (userData.level) * 5;
    userData.points += points;

    if (userData.points >= requiredPoints) {
        userData.level += 1;
        userData.points = 0;
        requiredPoints = (userData.level) * 5;
    }

    const progressPercentage = (userData.points / requiredPoints) * 100;
    document.querySelector(".progress").style.width = `${progressPercentage}%`;
    document.querySelector(".level").textContent = `${userData.level} LVL`;

    saveToDatabase(userData);
}

// Завдання
function openTasks() {
    document.getElementById("interface-screen").style.display = "none";
    document.getElementById("tasks-screen").style.display = "block";

    const tasks = [
        { id: 1, description: "Subscribe to Telegram Channel", points: 10 }
    ];
    document.getElementById("tasks-list").innerHTML = tasks.map(task => `<p>${task.description} - ${task.points} points</p>`).join("");
}

// Lucky Wheel
function openWheel() {
    document.getElementById("interface-screen").style.display = "none";
    document.getElementById("wheel-screen").style.display = "block";
    setupWheel();
}

function setupWheel() {
    const canvas = document.getElementById("wheel-canvas");
    const ctx = canvas.getContext("2d");
    const segments = ["1 point", "5 points", "10 points", "20 points", "50 points"];
    let angle = 0;

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < segments.length; i++) {
            ctx.beginPath();
            ctx.moveTo(200, 200);
            ctx.arc(200, 200, 200, angle, angle + Math.PI / 3);
            ctx.fillStyle = i % 2 === 0 ? "red" : "blue";
            ctx.fill();
            angle += Math.PI / 3;
        }
    }
    drawWheel();
}

document.getElementById("spin-button").addEventListener("click", function() {
    const points = Math.floor(Math.random() * 50) + 1;
    updateLevel(points);
});

// Функція для повернення до інтерфейсу
function goBack() {
    document.getElementById("friends-screen").style.display = "none";
    document.getElementById("tasks-screen").style.display = "none";
    document.getElementById("market-screen").style.display = "none";
    document.getElementById("wheel-screen").style.display = "none";
    document.getElementById("interface-screen").style.display = "block";
}

// Друзі
function openFriends() {
    document.getElementById("interface-screen").style.display = "none";
    document.getElementById("friends-screen").style.display = "block";

    const userData = loadFromDatabase();
    document.getElementById("referral-link").textContent = `Your referral link: t.me/wellact_bot/ref=${userData.referralCode}`;
}
