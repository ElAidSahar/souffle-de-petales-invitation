const I18N = {
  ar: {
    frBtn: "FR",
    tap: "انقر للفتح",
    saveSub: "سنتزوج",
    mono: "أ · س",
    praise1: "الحمد لله الذي بنعمته تتم الصالحات",
    praise2: "نتشرف بدعوتكم لحضور حفل زفاف",
    and: "و",
    inchallah: "و ذلك بمشيئة الله تعالى",
    when: "يوم الثلاثاء 3 نوفمبر 2026 على الساعة التاسعة مساءً",
    whereLine: "بقصر بلدية تونس",
    joy: "بحضوركم تكتمل فرحتنا",
    countdown: "العدّ التنازلي",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    place: "المكان",
    place1: "يسعدنا أن نستقبلكم",
    place2: "للاحتفال بزفافنا",
    place3: "في مكان استثنائي.",
    city: "قصر بلدية تونس",
    country: "تونس",
    directions: "عرض الاتجاهات",
  },
  fr: {
    frBtn: "عربي",
    tap: "Touchez pour ouvrir",
    saveSub: "Nous nous marions",
    mono: "A · S",
    praise1: "Louange à Allah par la grâce duquel s’accomplissent les bienfaits",
    praise2: "Nous avons l’honneur de vous convier à la célébration de notre mariage",
    and: "&",
    inchallah: "Si Dieu le veut",
    when: "Le mardi 3 novembre 2026 à 21 h",
    whereLine: "Tunis City Hall",
    joy: "Votre présence comblera notre joie",
    countdown: "Compte à rebours",
    days: "Jours",
    hours: "Heures",
    minutes: "Minutes",
    place: "Le lieu",
    place1: "Nous serons heureux de vous accueillir",
    place2: "pour célébrer notre mariage",
    place3: "dans un lieu d’exception.",
    city: "Tunis City Hall El Kasba",
    country: "Tunis",
    directions: "Itinéraire",
  },
};

const state = {
  lang: "fr",
  langReady: false,
  opened: false,
  bloomed: false,
  musicOn: false,
  petals: [],
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function applyLang(lang) {
  state.lang = lang;
  const t = I18N[lang];
  const cfg = window.INVITE_CONFIG;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $$("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] != null) el.textContent = t[key];
  });
  const langToggle = $("#langToggle");
  if (langToggle) langToggle.textContent = t.frBtn;
  ["nameMan", "saveMan"].forEach((id) => {
    const el = $("#" + id);
    if (el) el.textContent = cfg.couple.man[lang];
  });
  ["nameWoman", "saveWoman"].forEach((id) => {
    const el = $("#" + id);
    if (el) el.textContent = cfg.couple.woman[lang];
  });
  const andMark = $("#andMark");
  const saveAnd = $("#saveAnd");
  if (andMark) andMark.textContent = t.and;
  if (saveAnd) saveAnd.textContent = t.and;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function tickCountdown() {
  const target = new Date(window.INVITE_CONFIG.weddingAt).getTime();
  const diff = Math.max(0, target - Date.now());
  $("#dDays").textContent = pad(Math.floor(diff / 86400000));
  $("#dHours").textContent = pad(Math.floor((diff % 86400000) / 3600000));
  $("#dMins").textContent = pad(Math.floor((diff % 3600000) / 60000));
}

function spawnLivePetals() {
  const layer = $("#livePetals");
  const spots = [
    { x: "-22%", y: "-10%", size: 200, rot: -28 },
    { x: "68%", y: "-14%", size: 210, rot: 18 },
    { x: "-24%", y: "32%", size: 170, rot: 36 },
    { x: "74%", y: "28%", size: 180, rot: -16 },
    { x: "-20%", y: "70%", size: 180, rot: 12 },
    { x: "70%", y: "74%", size: 200, rot: -32 },
    { x: "28%", y: "-16%", size: 130, rot: 8 },
    { x: "82%", y: "52%", size: 140, rot: 42 },
    { x: "-14%", y: "86%", size: 150, rot: -8 },
    { x: "52%", y: "88%", size: 150, rot: 22 },
  ];
  state.petals = spots.map((s, i) => {
    const wrap = document.createElement("div");
    wrap.className = "live-petal is-edge";
    wrap.style.setProperty("--x", s.x);
    wrap.style.setProperty("--y", s.y);
    wrap.style.setProperty("--size", `${s.size}px`);
    wrap.style.setProperty("--rot", `${s.rot}deg`);
    wrap.style.setProperty("--dur", `${10 + (i % 5) * 2.2}s`);
    wrap.style.setProperty("--delay", `${-i * 1.1}s`);
    const inner = document.createElement("div");
    inner.className = "live-petal-inner";
    wrap.appendChild(inner);
    layer.appendChild(wrap);
    return { el: wrap, depth: 0.35 + (i % 5) * 0.14 };
  });
}

function onStagePointer(e) {
  const stage = $("#stage");
  const r = stage.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  state.petals.forEach((p) => {
    p.el.style.setProperty("--tx", `${px * 18 * p.depth}px`);
    p.el.style.setProperty("--ty", `${py * 14 * p.depth}px`);
  });
}

function startMusic() {
  const audio = $("#bgMusic");
  if (!audio) return;
  audio.volume = 0.55;
  const play = audio.play();
  if (play && play.catch) play.catch(() => {});
  state.musicOn = true;
  syncMusicIcon();
}

function toggleMusic() {
  const audio = $("#bgMusic");
  if (!audio) return;
  if (audio.paused) {
    startMusic();
  } else {
    audio.pause();
    state.musicOn = false;
    syncMusicIcon();
  }
}

function syncMusicIcon() {
  $("#musicBtn").classList.toggle("is-off", !state.musicOn);
}

function openInvitation() {
  if (state.opened) return;
  state.opened = true;
  const cover = $("#cover");
  const opening = $("#vidOpen");
  startMusic();

  let bloomStarted = false;
  const beginBloom = () => {
    if (bloomStarted) return;
    bloomStarted = true;
    if (opening) {
      opening.classList.remove("is-off");
      opening.muted = true;
    }
    cover.classList.add("is-opening");
    setTimeout(() => cover.classList.add("is-revealed"), 900);
  };

  if (opening) {
    opening.muted = true;
    opening.onended = finishOpening;
    let clipStarted = false;
    const playClip = () => {
      if (clipStarted) return;
      clipStarted = true;
      opening.classList.remove("is-off");
      const start = () => {
        try {
          opening.currentTime = 0;
        } catch (err) {
          /* ignore seek before metadata */
        }
        const play = opening.play();
        if (play && play.then) {
          play.then(beginBloom).catch(beginBloom);
        } else {
          beginBloom();
        }
      };
      if (opening.readyState >= 1) start();
      else opening.addEventListener("loadedmetadata", start, { once: true });
    };
    if (opening.readyState >= 2) {
      playClip();
    } else {
      opening.addEventListener("canplay", playClip, { once: true });
      opening.load();
      setTimeout(playClip, 1500);
    }
  } else {
    beginBloom();
  }
  setTimeout(finishOpening, 10000);
}

function finishOpening() {
  if (state.bloomed) return;
  state.bloomed = true;
  const cover = $("#cover");
  $("#stage").classList.add("is-open");
  cover.classList.add("is-leaving");
  $("#introInner").classList.add("casc");
  setTimeout(() => cover.classList.add("is-gone"), 1400);
}

function syncThumb() {
  const thumb = $("#langThumb");
  const on = $(".lang-picker button.is-on");
  const bar = $("#langPicker");
  if (!thumb || !on || !bar) return;
  const barBox = bar.getBoundingClientRect();
  const onBox = on.getBoundingClientRect();
  thumb.style.left = `${onBox.left - barBox.left}px`;
  thumb.style.width = `${onBox.width}px`;
}

function selectLang(lang) {
  applyLang(lang);
  $("#pickFr").classList.toggle("is-on", lang === "fr");
  $("#pickAr").classList.toggle("is-on", lang === "ar");
  requestAnimationFrame(syncThumb);
  $("#langGate").classList.add("is-hidden");
  openInvitation();
}

document.addEventListener("DOMContentLoaded", () => {
  spawnLivePetals();
  tickCountdown();
  setInterval(tickCountdown, 1000);
  requestAnimationFrame(syncThumb);
  setTimeout(syncThumb, 600);
  window.addEventListener("resize", syncThumb);

  const stage = $("#stage");
  stage.addEventListener("pointermove", onStagePointer);
  stage.addEventListener("pointerleave", () => {
    state.petals.forEach((p) => {
      p.el.style.setProperty("--tx", "0px");
      p.el.style.setProperty("--ty", "0px");
    });
  });

  $("#pickFr").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectLang("fr");
  });
  $("#pickAr").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectLang("ar");
  });
  $("#langToggle").addEventListener("click", () => {
    applyLang(state.lang === "ar" ? "fr" : "ar");
  });
  $("#musicBtn").addEventListener("click", toggleMusic);
  $$(".chevron").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.closest(".screen").nextElementSibling;
      if (next) next.scrollIntoView({ behavior: "smooth" });
    });
  });
  $("#mapsLink").href = window.INVITE_CONFIG.mapsUrl;
});
