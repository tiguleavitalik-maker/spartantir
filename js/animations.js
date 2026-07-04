/* ============================================================
   SPARTAN TIR — анимации: Lenis + GSAP + ScrollTrigger
   При reduced-motion или отсутствии библиотек страница
   остаётся полностью статичной и видимой (класс has-anim
   не ставится — стартовые состояния не применяются).
   ============================================================ */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const libsReady = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (reduceMotion || !libsReady) return;

  document.documentElement.classList.add("has-anim");
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // якорные ссылки — через Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60 });
      });
    });
  }

  const EASE = "power3.out";

  /* ---------- Hero: каскадное появление ---------- */
  const heroTl = gsap.timeline({ defaults: { ease: EASE } });
  heroTl
    .fromTo('[data-anim="hero-kicker"]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
    .fromTo(
      ".hero__title-line",
      { y: 90, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.12, onComplete: () => gsap.set('[data-anim="hero-title"]', { opacity: 1 }) },
      "-=0.35"
    )
    .fromTo('[data-anim="hero-sub"]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
    .fromTo('[data-anim="hero-lead"]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
    .fromTo('[data-anim="hero-actions"]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
    .fromTo('[data-anim="hero-stats"]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5");

  // контейнер заголовка делаем видимым сразу — анимируются строки
  gsap.set('[data-anim="hero-title"]', { opacity: 1 });

  /* ---------- Hero: параллакс прицела + медленное вращение ---------- */
  gsap.to(".hero__crosshair", {
    rotation: 360,
    duration: 90,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
  });
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    gsap.to(el, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  });

  /* ---------- Scroll reveal: одиночные блоки ---------- */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 86%" },
      }
    );
  });

  /* ---------- Scroll reveal: группы со stagger ---------- */
  gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
    gsap.fromTo(
      group.children,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: EASE,
        stagger: 0.1,
        scrollTrigger: { trigger: group, start: "top 84%" },
      }
    );
  });

  /* ---------- Счётчики ---------- */
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: "power2.out",
      delay: 0.6,
      onUpdate: () => (el.textContent = Math.round(obj.val)),
    });
  });

  /* ---------- Таймлайн: линия рисуется по скроллу ---------- */
  const lineFill = document.querySelector(".timeline__line-fill");
  if (lineFill) {
    gsap.to(lineFill, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 75%",
        end: "bottom 55%",
        scrub: 0.6,
      },
    });
  }

  /* ---------- Магнитные кнопки (только устройства с курсором) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".btn--magnetic").forEach((btn) => {
      const strength = 18;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        gsap.to(btn, { x, y, duration: 0.4, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
      });
    });
  }
})();
