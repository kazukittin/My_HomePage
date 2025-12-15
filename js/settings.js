// =====================================================
// 設定管理
// =====================================================

function getSettings() {
    const defaultSettings = {
        bgUrl: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        lat: "35.6895",
        lon: "139.6917",
        clientId: ""
    };
    const saved = JSON.parse(localStorage.getItem("settings")) || {};
    return { ...defaultSettings, ...saved };
}

function saveSettingsToStorage(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}

function applySettings() {
    const settings = getSettings();
    document.body.style.backgroundImage = `url("${settings.bgUrl}")`;
    if (typeof loadWeather === 'function') loadWeather();
    if (typeof loadWeeklyWeather === 'function') loadWeeklyWeather();
}

// Modal Event Listeners
const modal = document.getElementById("settings-modal");
document.getElementById("open-settings").addEventListener("click", () => {
    const settings = getSettings();
    document.getElementById("bg-url-input").value = settings.bgUrl;
    document.getElementById("lat-input").value = settings.lat;
    document.getElementById("lon-input").value = settings.lon;

    // Client ID入力欄があれば設定
    const clientIdInput = document.getElementById('client-id-input');
    if (clientIdInput) {
        clientIdInput.value = settings.clientId || '';
    }

    // カレンダーログアウトセクションの表示/非表示
    const logoutSection = document.getElementById("calendar-logout-section");
    if (logoutSection && typeof calendarState !== 'undefined') {
        logoutSection.style.display = calendarState.isLoggedIn ? "block" : "none";
    }

    modal.style.display = "flex";
});

// カレンダーログアウトボタン
document.getElementById("calendar-logout-btn")?.addEventListener("click", () => {
    if (typeof handleCalendarLogout === 'function') {
        handleCalendarLogout();
        document.getElementById("calendar-logout-section").style.display = "none";
    }
});

document.getElementById("close-settings").addEventListener("click", () => {
    modal.style.display = "none";
});

document.getElementById("save-settings").addEventListener("click", () => {
    const newSettings = {
        bgUrl: document.getElementById("bg-url-input").value,
        lat: document.getElementById("lat-input").value,
        lon: document.getElementById("lon-input").value
    };

    // Client IDも保存
    const clientIdInput = document.getElementById('client-id-input');
    if (clientIdInput) {
        newSettings.clientId = clientIdInput.value || '';
    }

    saveSettingsToStorage(newSettings);
    applySettings();
    modal.style.display = "none";
});

// Apply settings on load
applySettings();
