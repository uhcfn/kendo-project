// --- Автоматическое управление слоем блюра ---
document.addEventListener('DOMContentLoaded', function() {
  var blurLayer = document.querySelector('.photo-modal-blur');
  var modal = document.getElementById('photo-modal');
  if (!blurLayer || !modal) return;
  function updateBlurLayer() {
    if (modal.classList.contains('open')) {
      blurLayer.style.display = 'block';
    } else {
      blurLayer.style.display = 'none';
    }
  }
  // Следим за открытием/закрытием модалки
  var observer = new MutationObserver(updateBlurLayer);
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  updateBlurLayer();
});
// --- Показ/скрытие галереи по клику на текст ---
document.addEventListener('DOMContentLoaded', function() {
  var gallery = document.getElementById('photo-gallery');
  var showLink = document.getElementById('gallery-toggle-show');
  var hideLink = document.getElementById('gallery-toggle-hide');
  if (gallery && showLink && hideLink) {
    showLink.addEventListener('click', function() {
      gallery.classList.add('visible');
      showLink.style.display = 'none';
      hideLink.style.display = 'block';
      // Скроллим к галерее, если нужно
      gallery.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
    hideLink.addEventListener('click', function() {
      gallery.classList.remove('visible');
      showLink.style.display = 'block';
      hideLink.style.display = 'none';
      // Скроллим к кнопке "Смотреть фотографии..."
      showLink.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  }
});
// Гарантируем инициализацию модального окна даже если window.photoPageInit не вызывается
document.addEventListener('DOMContentLoaded', function() {
  if (typeof setupPhotoModal === 'function') setupPhotoModal();
});
// Модальное окно для просмотра фото
function setupPhotoModal() {
  const gallery = document.querySelector('.photo-gallery');
  const modal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('photo-modal-img');
  const modalClose = document.getElementById('photo-modal-close');
  if (gallery && modal && modalImg && modalClose) {
    const images = Array.from(gallery.querySelectorAll('.gallery-img'));
    let currentIndex = -1;

    function openModalByIndex(idx) {
      if (idx < 0 || idx >= images.length) return;
      currentIndex = idx;
      modal.classList.add('open');
      modalImg.src = images[idx].src;
      modalImg.alt = images[idx].alt;
      document.body.classList.add('photo-modal-blur-active');
    }

    gallery.addEventListener('click', function (e) {
      if (e.target.classList.contains('gallery-img')) {
        const idx = images.indexOf(e.target);
        openModalByIndex(idx);
      }
    });

    // Стрелки
    const prevBtn = document.getElementById('photo-modal-prev');
    const nextBtn = document.getElementById('photo-modal-next');
    function showPrev() {
      if (currentIndex > 0) {
        openModalByIndex(currentIndex - 1);
      } else {
        openModalByIndex(images.length - 1); // Зацикливание
      }
    }
    function showNext() {
      if (currentIndex < images.length - 1) {
        openModalByIndex(currentIndex + 1);
      } else {
        openModalByIndex(0); // Зацикливание
      }
    }
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrev();
      });
      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNext();
      });
    }

    modalClose.addEventListener('click', function () {
      modal.classList.remove('open');
      modalImg.src = '';
      document.body.classList.remove('photo-modal-blur-active');
      currentIndex = -1;
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('open');
        modalImg.src = '';
        document.body.classList.remove('photo-modal-blur-active');
        currentIndex = -1;
      }
    });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') {
        modal.classList.remove('open');
        modalImg.src = '';
        document.body.classList.remove('photo-modal-blur-active');
        currentIndex = -1;
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });
  }
}

// Переопределяем только если не было window.photoPageInit
const oldPhotoPageInit = window.photoPageInit;
window.photoPageInit = function() {
  if (typeof oldPhotoPageInit === 'function') oldPhotoPageInit();
  setupPhotoModal();
};
// Масштабирование активного слайда Embla (Tween Scale)
function setupEmblaTweenScale(emblaApi) {
  const TWEEN_FACTOR_BASE = 0.52;
  let tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  function tween() {
    const scrollProgress = emblaApi.scrollProgress();
    emblaApi.slideNodes().forEach((slide, i) => {
      const diffToTarget = emblaApi.scrollSnapList()[i] - scrollProgress;
      const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor);
      const scale = Math.max(0, Math.min(1, tweenValue));
      const img = slide.querySelector('img');
      if (img) img.style.transform = `scale(${scale})`;
    });
  }
  emblaApi.on('init', tween).on('scroll', tween).on('reInit', tween);
}
// Автоматически сгенерированный список файлов из папки photo/
window.photoFiles = [
  "1.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","19.jpg",
  "2.jpg","20.jpg","21.jpg","22.jpg","23.jpg","24.jpg","25.jpg","26.jpg","27.jpg","28.jpg","29.jpg",
  "3.jpg","30.jpg","31.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg",
  "aboutUs1.jpg","links.jpg","news1.jpg","news2.jpg","news3.jpg"
];

// Получение мягкого тёплого цвета для фона (приоритет тёплым, fallback — мягкий средний)
function getDominantColors(img, cb) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = 16;
  canvas.width = size; canvas.height = size;
  if (!img.complete) {
    img.onload = () => getDominantColors(img, cb);
    return;
  }
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const pixels = [];
  for (let i = 0; i < size * size; i++) {
    const r = data[i*4], g = data[i*4+1], b = data[i*4+2];
    // Пропускаем почти белые/черные пиксели (фон)
    if ((r+g+b)/3 > 240 || (r+g+b)/3 < 15) continue;
    pixels.push([r, g, b]);
  }
  // Фильтруем тёплые мягкие цвета (r > b, r > g*0.8, g > b*0.7, не слишком насыщенные)
  const warm = pixels.filter(([r,g,b]) => r > b && r > g*0.8 && g > b*0.7 && (r-g) < 100 && (r-b) < 120 && r > 80 && g > 50 && b < 180);
  // Если есть тёплые — усредняем их
  let base;
  if (warm.length > 0) {
    let r=0,g=0,b=0;
    warm.forEach(([rr,gg,bb])=>{r+=rr;g+=gg;b+=bb;});
    r=Math.round(r/warm.length);g=Math.round(g/warm.length);b=Math.round(b/warm.length);
    base = [r,g,b];
  } else if (pixels.length > 0) {
    // fallback: усредняем все мягкие цвета
    let r=0,g=0,b=0;
    pixels.forEach(([rr,gg,bb])=>{r+=rr;g+=gg;b+=bb;});
    r=Math.round(r/pixels.length);g=Math.round(g/pixels.length);b=Math.round(b/pixels.length);
    base = [r,g,b];
  } else {
    base = [200,180,150]; // fallback: бежевый
  }
  // Для градиента делаем второй цвет — осветлённый вариант
  const lighten = ([r,g,b], f=0.25) => [
    Math.round(r+(255-r)*f),
    Math.round(g+(255-g)*f),
    Math.round(b+(255-b)*f)
  ];
  const color1 = `rgb(${base[0]},${base[1]},${base[2]})`;
  const color2 = `rgb(${lighten(base,0.35).join(',')})`;
  cb([color1, color2]);
}

function setDynamicGradient(imgEl) {
  // Отключено: фон всегда фиксированный акцентный градиент
  // Для смены направления используйте классы gradient-horizontal, gradient-diagonal, gradient-vertical
  // blurBg.style.background = '';
}
// Инициализация страницы Фото
window.photoPageInit = function() {
  // Получаем список файлов
  const photoList = (window.photoFiles && Array.isArray(window.photoFiles)) ? window.photoFiles : [];
  // Вставляем слайды в Embla
  const emblaContainer = document.getElementById('embla-slides');
  if (emblaContainer) {
    emblaContainer.innerHTML = photoList.map((name, idx) => `
      <div class="embla__slide"><img src="photo/${name}" alt="Фото ${idx+1}" class="embla__slide__number" loading="lazy"></div>
    `).join('');
  }
  // Инициализация Embla
  const emblaNode = document.querySelector('.embla');
  const viewportNode = emblaNode.querySelector('.embla__viewport');
  const prevBtn = emblaNode.querySelector('.embla__button--prev');
  const nextBtn = emblaNode.querySelector('.embla__button--next');
  // const dotsNode = emblaNode.querySelector('.embla__dots');
  const emblaApi = window.EmblaCarousel(viewportNode, { loop: true });
  // Сохраняем ссылку на emblaApi глобально для updateActiveThumb
  window._emblaApi = emblaApi;
  // После инициализации Embla сразу обновить галерею
  if (window.updateActiveThumb) window.updateActiveThumb();
  // Кнопки
  function togglePrevNextBtns() {
    prevBtn.disabled = !emblaApi.canScrollPrev();
    nextBtn.disabled = !emblaApi.canScrollNext();
  }
  prevBtn.addEventListener('click', () => emblaApi.scrollPrev());
  nextBtn.addEventListener('click', () => emblaApi.scrollNext());
  emblaApi.on('select', togglePrevNextBtns).on('init', togglePrevNextBtns);
  // ВАЖНО: обновлять галерею при смене слайда Embla
  if (window.updateActiveThumb) {
    emblaApi.on('select', window.updateActiveThumb);
    emblaApi.on('init', window.updateActiveThumb);
    emblaApi.on('reInit', window.updateActiveThumb);
  }
  // Точки отключены: ничего не делаем
  // Эффект масштабирования активного слайда
  setupEmblaTweenScale(emblaApi);
  // ...галерея удалена...

  // === Крайние картинки как стрелки на мобильных (<900px) ===
  function handleEdgeSlideClick(e) {
    if (window.innerWidth >= 900) return;
    const slides = Array.from(emblaApi.slideNodes());
    const clickedSlide = e.target.closest('.embla__slide');
    if (!clickedSlide) return;
    const idx = slides.indexOf(clickedSlide);
    // Определяем видимые слайды
    const selectedIdx = emblaApi.selectedScrollSnap();
    const visibleCount = emblaApi.slideNodes().length >= 3 ? 3 : emblaApi.slideNodes().length;
    // Индексы видимых слайдов
    let visible = [];
    for (let i = 0; i < visibleCount; ++i) {
      visible.push((selectedIdx + i - 1 + slides.length) % slides.length);
    }
    if (idx === visible[0]) {
      emblaApi.scrollPrev();
    } else if (idx === visible[visible.length-1]) {
      emblaApi.scrollNext();
    }
  }
  emblaContainer.addEventListener('click', handleEdgeSlideClick);
  // === Автопролистывание Embla ===
  let emblaAutoplay = true;
  let emblaTimer = null;
  function startEmblaAutoplay() {
    if (emblaTimer) clearInterval(emblaTimer);
    emblaTimer = setInterval(() => {
      if (emblaAutoplay && emblaApi.canScrollNext()) emblaApi.scrollNext();
    }, 2500);
  }
  function pauseEmblaAutoplay() {
    emblaAutoplay = false;
    if (emblaTimer) clearInterval(emblaTimer);
  }
  function resumeEmblaAutoplay() {
    emblaAutoplay = true;
    startEmblaAutoplay();
  }
  // Остановка автопролистывания при наведении/тапе
  emblaNode.addEventListener('mouseenter', pauseEmblaAutoplay);
  emblaNode.addEventListener('mouseleave', resumeEmblaAutoplay);
  emblaNode.addEventListener('touchstart', pauseEmblaAutoplay);
  emblaNode.addEventListener('touchend', resumeEmblaAutoplay);
  // Остановка автопролистывания, если Embla вне экрана
  const emblaObserver = new window.IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      resumeEmblaAutoplay();
    } else {
      pauseEmblaAutoplay();
    }
  }, { threshold: 0.2 });
  emblaObserver.observe(emblaNode);
  startEmblaAutoplay();
}

// Список файлов для слайдера (только slider_*.jpg из photo/slider/)
function getSliderList() {
  // Используем все jpg-файлы из photo/ для слайдера (можно фильтровать по желанию)
  if (window.photoFiles && Array.isArray(window.photoFiles)) {
    return window.photoFiles.map(f => 'photo/' + f);
  }
  return [];
}

// Проверка: ландшафтное ли фото (асинхронно)
function renderHero(heroList, parent) {
  const heroWrap = document.createElement('div');
  heroWrap.className = 'photo-hero-wrap';
  const hero = document.createElement('section');
  hero.className = 'photo-hero';
  hero.innerHTML = `
    <div class="photo-hero-bg">
      <div class="photo-hero-bg-blur left"></div>
      <div class="photo-hero-bg-blur right"></div>
    </div>
    <img src="photo/${heroList[0]}" alt="Фото" class="photo-hero-img current" loading="lazy">
    <img src="" alt="Фото" class="photo-hero-img next" style="display:none" loading="lazy">
    <div class="photo-hero-arrows">
      <button class="photo-hero-arrow left" aria-label="Назад">
        <svg viewBox="0 0 32 32"><path d="M20 26l-8-10 8-10" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="photo-hero-arrow right" aria-label="Вперёд">
        <svg viewBox="0 0 32 32"><path d="M12 6l8 10-8 10" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `;
  heroWrap.appendChild(hero);
  (parent || document.querySelector('main')).appendChild(heroWrap);

  const imgCurrent = hero.querySelector('.photo-hero-img.current');
  const imgNext = hero.querySelector('.photo-hero-img.next');
  const arrows = hero.querySelector('.photo-hero-arrows');
  const leftBtn = hero.querySelector('.photo-hero-arrow.left');
  const rightBtn = hero.querySelector('.photo-hero-arrow.right');
  let idx = 0;
  let autoplay = true;
  let timer = null;
  let pausedByUser = false;

  function slideTo(newIdx, direction) {
    imgNext.style.display = '';
    imgNext.src = 'photo/' + heroList[(newIdx + heroList.length) % heroList.length];
    imgNext.alt = `Фото ${((newIdx + heroList.length) % heroList.length)+1}`;
    imgNext.className = 'photo-hero-img next animate__animated ' + (direction === 'left' ? 'animate__slideInRight' : 'animate__slideInRight');
    imgCurrent.className = 'photo-hero-img current animate__animated ' + (direction === 'left' ? 'animate__slideOutLeft' : 'animate__slideOutLeft');
    setTimeout(() => {
      imgCurrent.src = imgNext.src;
      imgCurrent.alt = imgNext.alt;
      imgCurrent.className = 'photo-hero-img current';
      imgNext.className = 'photo-hero-img next';
      imgNext.style.display = 'none';
      idx = (newIdx + heroList.length) % heroList.length;
      if (window.updateActiveThumb) window.updateActiveThumb();
    }, 500);
  }

  function show(n, direction) {
    slideTo(n, direction);
  }
  function next() { show(idx+1, 'right'); }
  function prev() { show(idx-1, 'left'); }

  function startAutoplay() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => { if (autoplay) next(); }, 2500);
  }
  function pauseAutoplay() { autoplay = false; if (timer) clearInterval(timer); }
  function resumeAutoplay() { autoplay = true; startAutoplay(); }

  // Desktop: mouseenter/leave
  hero.addEventListener('mouseenter', () => { pauseAutoplay(); arrows.style.opacity = 1; });
  hero.addEventListener('mouseleave', () => { if (!pausedByUser) { resumeAutoplay(); arrows.style.opacity = 0; } });
  // Mobile: tap pause/resume
  let touchPaused = false;
  hero.addEventListener('touchstart', e => {
    if (!touchPaused) {
      pauseAutoplay();
      arrows.style.opacity = 1;
      touchPaused = true;
    }
  });
  document.body.addEventListener('touchstart', e => {
    if (touchPaused && !hero.contains(e.target)) {
      resumeAutoplay();
      arrows.style.opacity = 0;
      touchPaused = false;
    }
  });

  leftBtn.addEventListener('click', () => { prev(); });
  rightBtn.addEventListener('click', () => { next(); });

  show(0, 'right');
  startAutoplay();
}

function renderMasonry(list, parent) {
  const masonryWrap = document.createElement('div');
  masonryWrap.className = 'photo-masonry-wrap';

  const masonry = document.createElement('section');
  masonry.className = 'photo-masonry';
  masonry.innerHTML = list.map(name =>
    `<img src="photo/${name}" alt="Фото" class="photo-thumb" loading="lazy">`
  ).join('');
  masonryWrap.appendChild(masonry);
  (parent || document.querySelector('main')).appendChild(masonryWrap);


  // Клик по thumbnail — открыть модалку
  masonry.addEventListener('click', e => {
    if (e.target.classList.contains('photo-thumb')) {
      if (window.openModal) window.openModal(e.target.src, e.target.alt);
    }
  });
}

function setupModal() {
  window.openModal = function(src, alt) {
    if (document.querySelector('.photo-modal-backdrop')) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'photo-modal-backdrop';
    backdrop.innerHTML = `
      <img src="${src}" alt="${alt}" class="photo-modal-img" loading="lazy">
      <button class="photo-modal-close" aria-label="Закрыть">×</button>
    `;
    document.body.appendChild(backdrop);
    function close() {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    backdrop.querySelector('.photo-modal-close').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
  };
}
