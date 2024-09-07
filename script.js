// Перевірка при завантаженні сторінки
window.onload = function() {
    if (localStorage.getItem("butterflyClaimed")) {
        document.getElementById("main-screen").style.display = "none";
        document.getElementById("interface-screen").style.display = "block";
    } else {
        document.getElementById("main-screen").style.display = "block";
    }
};

// Подія на натискання кнопки "Click"
document.getElementById("click-button").addEventListener("click", function() {
    if (!localStorage.getItem("butterflyClaimed")) {
        localStorage.setItem("butterflyClaimed", "true");
        document.getElementById("main-screen").style.display = "none";
        document.getElementById("interface-screen").style.display = "block";
    } else {
        alert("You have already claimed your butterfly!");
    }
});

function openFriends() {
    const referralCode = generateReferralCode();
    document.getElementById("interface-screen").style.display = "none";
    document.getElementById("friends-screen").style.display = "block";
    document.getElementById("referral-link").textContent = `Your referral link: t.me/wellact_bot/ref=${referralCode}`;
    
    const friendsList = JSON.parse(localStorage.getItem("friendsList")) || [];
    if (friendsList.length === 0) {
        document.getElementById("friends-list").textContent = "You haven't invited any users.";
    } else {
        document.getElementById("friends-list").innerHTML = friendsList.map(friend => `<p>${friend.name}</p>`).join("");
    }
}

function openTasks() {
    document.getElementById("interface-screen").style.display = "none";
    document.getElementById("tasks-screen").style.display = "block";
    // Load tasks from localStorage or default tasks
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [
        { id: 1, description: "Complete Task 1", points: 10 },
        { id: 2, description: "Complete Task 2", points: 20 }
    ];
    document.getElementById("tasks-list").innerHTML = tasks.map(task => `<p>${task.description} - ${task.points} points</p>`).join("");
}

function openMarket() {
    document.getElementById("interface-screen").style.display = "none";
    document.getElementById("market-screen").style.display = "block";
}

function generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Example function for tracking referrals
function addFriend(friendName) {
    const friendsList = JSON.parse(localStorage.getItem("friendsList")) || [];
    friendsList.push({ name: friendName });
    localStorage.setItem("friendsList", JSON.stringify(friendsList));
    updatePoints(10); // Add points for referral
}

function updatePoints(points) {
    let currentPoints = parseInt(localStorage.getItem("points")) || 0;
    currentPoints += points;
    localStorage.setItem("points", currentPoints);
}

// Example function for admin to update tasks
function updateTasks(newTasks) {
    localStorage.setItem("tasks", JSON.stringify(newTasks));
}
