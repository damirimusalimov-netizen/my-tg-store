document.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram && window.Telegram.WebApp) {
    alert("✅ Telegram WebApp API найден!");
    window.Telegram.WebApp.ready();
  } else {
    alert("❌ Telegram WebApp API не найден");
  }
  alert("mail.js подключен!");
});
