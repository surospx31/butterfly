document.getElementById("auth-button").addEventListener("click", function() {
    const initData = window.Telegram.WebApp.initData;
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const referralCode = window.Telegram.WebApp.initDataUnsafe.start_param; // Зчитуємо реферальний код

    if (user) {
        console.log("Ім'я користувача: ", user.first_name);
        const userData = {
            id: user.id,
            name: user.first_name,
            points: 0,
            level: 1,
            friends: 0,
            tonBalance: 0,
            referralCode: generateReferralCode(),
            friendsList: [],
            referredBy: referralCode || null,  // Якщо користувач прийшов за реферальним кодом
        };

        saveToDatabase(userData);

        document.getElementById("auth-screen").style.display = "none";
        document.getElementById("main-screen").style.display = "block";

        if (referralCode) {
            console.log(`Користувача запросив ${referralCode}`);
            processReferral(referralCode, userData.id);
        }
    } else {
        alert("Не вдалося отримати дані користувача.");
    }
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

// Збереження даних користувача
function saveToDatabase(userData) {
    let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    const existingUserIndex = allUsers.findIndex(user => user.id === userData.id);

    if (existingUserIndex >= 0) {
        userData.friendsList = allUsers[existingUserIndex].friendsList || [];
        allUsers[existingUserIndex] = userData;
    } else {
        allUsers.push(userData);
    }

    localStorage.setItem("allUsers", JSON.stringify(allUsers));
}

// Обробка реферального коду
function processReferral(referralCode, newUserId) {
    let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

    const referringUserIndex = allUsers.findIndex(user => user.referralCode === referralCode);

    if (referringUserIndex >= 0) {
        const referringUser = allUsers[referringUserIndex];

        if (!referringUser.friendsList) {
            referringUser.friendsList = [];
        }
        referringUser.friendsList.push(newUserId);

        referringUser.friends += 1;
        referringUser.points += 5;

        allUsers[referringUserIndex] = referringUser;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));

        console.log(`Користувачу ${referringUser.name} додано 5 балів за запрошення.`);
    }
}

// Відображення списку друзів
function showFriendsList(userId) {
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    const currentUser = allUsers.find(user => user.id === userId);

    if (currentUser && currentUser.friendsList && currentUser.friendsList.length > 0) {
        const friendsList = document.getElementById("friends-list");
        friendsList.innerHTML = '';

        currentUser.friendsList.forEach(friendId => {
            const friend = allUsers.find(user => user.id === friendId);
            if (friend) {
                const friendItem = document.createElement('p');
                friendItem.textContent = `${friend.name} (ID: ${friend.id})`;
                friendsList.appendChild(friendItem);
            }
        });
    } else {
        document.getElementById("friends-list").textContent = "У вас поки немає друзів.";
    }
}

// Відображення сторінки друзів
function openFriends() {
    document.getElementById("interface-screen").style.display = "none";
    document.getElementById("friends-screen").style.display = "block";

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
        showFriendsList(userData.id);
        document.getElementById("referral-link").textContent = `Your referral link: https://t.me/YOUR_BOT_USERNAME?start=${userData.referralCode}`;
    }
}

// Повернення назад до основного інтерфейсу
function goBack() {
    document.getElementById("friends-screen").style.display = "none";
    document.getElementById("interface-screen").style.display = "block";
}
