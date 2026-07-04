/* ============================================================
   SPARTAN TIR — базовая логика: хедер, меню, пакеты, форма
   ============================================================ */

(() => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  /* ---------- Хедер: фон при скролле ---------- */
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  const closeNav = () => {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });

  /* ---------- Кнопки пакетов: скролл к форме + предвыбор ---------- */
  const packageSelect = document.getElementById("bf-package");
  document.querySelectorAll("[data-package]").forEach((btn) => {
    btn.addEventListener("click", () => {
      packageSelect.value = btn.dataset.package;
      document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Форма записи ----------
     Точка подключения автоматизации: заменить содержимое
     sendBooking() на реальный запрос к endpoint. */
  const form = document.getElementById("booking-form");
  const success = form.querySelector(".booking__success");

  const setInvalid = (input, invalid) => {
    input.closest(".field").classList.toggle("is-invalid", invalid);
  };

  const validPhone = (v) => /^[+\d][\d\s\-()]{7,}$/.test(v.trim());

  const sendBooking = (data) => {
    // TODO: отправка на сервер/CRM. Пока — лог для отладки.
    console.info("[booking] заявка:", data);
    return Promise.resolve();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements.name;
    const phone = form.elements.phone;

    const nameOk = name.value.trim().length >= 2;
    const phoneOk = validPhone(phone.value);
    setInvalid(name, !nameOk);
    setInvalid(phone, !phoneOk);
    if (!nameOk || !phoneOk) {
      (nameOk ? phone : name).focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    sendBooking(data).then(() => {
      success.hidden = false;
      success.focus?.();
    });
  });

  // сброс ошибки при вводе
  form.querySelectorAll(".field__input").forEach((input) => {
    input.addEventListener("input", () => setInvalid(input, false));
  });

  /* ---------- Год в футере ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
