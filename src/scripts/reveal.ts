// Adds .is-visible to [data-reveal] / [data-lift] elements when they enter the viewport (once).
// Content stays visible without JS and with prefers-reduced-motion.
// Also: mobile menu toggle and the bottom action bar (shown after the first screen, hidden over #signup).
const items = document.querySelectorAll<HTMLElement>("[data-reveal], [data-lift]");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce || !("IntersectionObserver" in window)) {
  items.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

const burger = document.querySelector<HTMLButtonElement>("[data-burger]");
const nav = document.getElementById("site-nav");
if (burger && nav) {
  const set = (open: boolean) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
    nav.classList.toggle("is-open", open);
  };
  burger.addEventListener("click", () => set(burger.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if ((e.target as HTMLElement).closest("a")) set(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { set(false); burger.focus(); }
  });
}

const bar = document.querySelector<HTMLElement>("[data-actionbar]");
const hero = document.getElementById("hero");
const signup = document.getElementById("signup");
const footer = document.querySelector("footer");
if (bar && hero && "IntersectionObserver" in window) {
  const state = { hero: true, signup: false, footer: false };
  const upd = () => bar.classList.toggle("is-shown", !state.hero && !state.signup && !state.footer);
  const watch = (el: Element | null, key: keyof typeof state) => {
    if (!el) return;
    new IntersectionObserver(([e]) => { state[key] = e.isIntersecting; upd(); }, { threshold: 0.01 }).observe(el);
  };
  watch(hero, "hero"); watch(signup, "signup"); watch(footer, "footer");
}
