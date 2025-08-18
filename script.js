// === AOS-анимация появления контента при скролле и обновлении ===
document.addEventListener("DOMContentLoaded", function () {
  // Анимируем .aos-fade и .aos-fade-right при попадании в зону видимости (IntersectionObserver)
  var elements = Array.prototype.slice
    .call(document.querySelectorAll(".aos-fade, .aos-fade-right"))
    .filter(function (el) {
      return (
        !el.closest("footer") &&
        !el.closest(".navbar") &&
        !el.closest(".navbar-wrap")
      );
    });
  elements.forEach(function (el) {
    var delay = parseInt(el.getAttribute("data-aos-delay")) || 0;
    setTimeout(function () {
      el.classList.add("aos-animate");
    }, delay);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      navBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });
});
