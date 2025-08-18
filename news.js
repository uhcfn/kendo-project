// Анимация "раскрытия" news-item после завершения AOS-анимации
document.addEventListener("DOMContentLoaded", function () {
  // Сразу после загрузки страницы добавляем .news-reveal всем news-item.aos-fade
  const items = document.querySelectorAll(".news-item.aos-fade");
  setTimeout(function () {
    items.forEach((item) => {
      item.classList.add("news-reveal");
    });
  }, 600); // задержка для синхронизации с основной анимацией
});
// news.js — только для news.html
// Здесь могут быть скрипты, уникальные для страницы "Новости"

// Здесь можно добавить интерактив для новостей
// Например, анимации, фильтрацию, раскрытие подробностей и т.д.
