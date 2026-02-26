// ===== AUDIO =====

const sounds = {
  rain: new Audio("./sounds/rain.mp3"),
  storm: new Audio("./sounds/thunder.mp3"),
  click: new Audio("./sounds/click.mp3")
};

let currentBgSound = null;

// налаштування
sounds.rain.loop = true;
sounds.storm.loop = true;

function playClick() {
  sounds.click.currentTime = 0;
  sounds.click.play().catch(() => {});
}

function stopBgSound() {
  if (currentBgSound) {
    currentBgSound.pause();
    currentBgSound.currentTime = 0;
    currentBgSound = null;
  }
}

function playBgSound(type) {
  stopBgSound();

  if (type === "rain") {
    currentBgSound = sounds.rain;
  }

  if (type === "storm") {
    currentBgSound = sounds.storm;
  }

  if (currentBgSound) {
    currentBgSound.volume = 0.4;
    currentBgSound.play().catch(() => {});
  }
}

const aboutBtn = document.querySelector(".aboutBtn");
const screens = {
    home: document.getElementById("home"),
    weather: document.getElementById("weather"),
    about: document.getElementById("about")
};

const weatherData = {
    rain: {
        title: "Дощ",
        facts: "Дощ утворюється внаслідок конденсації водяної пари навколо мікроскопічних частинок пилу або солі в атмосфері. Коли краплі зростають і їх маса перевищує силу опору повітря - вони починають падати. "
    },

    snow: {
        title: "Сніг",
        facts: "Сніг утворюється при кристалізації водяної пари безпосередньо в лід за температури нижче 0°C. Молекули води формують шестикутну кристалічну структуру, тому більшість сніжинок мають шестикутну симетрію."
    },

    rainbow: {
        title: "Веселка",
        facts: "Веселка утворюється внаслідок заломлення, внутрішнього відбиття та дисперсії сонячного світла у краплях води. Кожен колір виходить під певним кутом - приблизно 42 градуси для червоного світла."
    },

    storm: {
        title: "Гроза",
        facts: "Гроза виникає через накопичення електричних зарядів у грозових хмарах. Різниця потенціалів між хмарою та землею може сягати сотень мільйонів вольт."
    }
};

// ===== GAMIFICATION =====
const TOTAL_WEATHERS = 4;
const POINTS_PER_VIEW = 10;

let seen = new Set();
let score = 0;

const scoreValue = document.getElementById("scoreValue");
const seenValue = document.getElementById("seenValue");
const progressFill = document.getElementById("progressFill");
const badgeBox = document.getElementById("badgeBox");

function updateProgressUI(){
  if (!scoreValue) return; 
  scoreValue.textContent = score;
  seenValue.textContent = seen.size;

  const percent = (seen.size / TOTAL_WEATHERS) * 100;
  progressFill.style.width = percent + "%";

  if (seen.size === TOTAL_WEATHERS){
    badgeBox.style.display = "block";
  } else {
    badgeBox.style.display = "none";
  }
}

function awardForViewing(type){
  if (!seen.has(type)){
    seen.add(type);
    score += POINTS_PER_VIEW;

    updateProgressUI();

    if (seen.size === TOTAL_WEATHERS){
      alert("Вітаємо! Ви переглянули всі явища і отримали досягнення: Дослідник погоди !");
    }
  }
}

updateProgressUI();


  { const screens = {
  home: document.getElementById("home"),
  weather: document.getElementById("weather"),
  about: document.getElementById("about")
};



let currentType = null;
let animId = null;

const canvas = document.getElementById("animation");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);

let drops = [];
let flakes = [];
let t = 0;

const intensitySlider = document.getElementById("intensitySlider");

const rand = (min, max) => Math.random() * (max - min) + min;

function openWeather(type) {
  screens.home.classList.remove("active");
  screens.about.classList.remove("active");
  screens.weather.classList.add("active");

  aboutBtn.style.display = "none";

  document.getElementById("weatherTitle").textContent = weatherData[type].title;
  document.getElementById("weatherFacts").textContent = weatherData[type].facts;

  currentType = type;
  playClick();
  playBgSound(type);

  awardForViewing(type);

  resizeCanvas();
  startAnimation(type);
}

function showAbout() {
  screens.home.classList.remove("active");
  screens.weather.classList.remove("active");
  screens.about.classList.add("active");

  aboutBtn.style.display = "none";

  stopAnimation();

  stopBgSound();
  playClick();
}

function goHome() {
  screens.weather.classList.remove("active");
  screens.about.classList.remove("active");
  screens.home.classList.add("active");

  aboutBtn.style.display = "block";

  stopAnimation();

  stopBgSound();
  playClick();
}

function stopAnimation() {
  if (animId) cancelAnimationFrame(animId);
  animId = null;
  currentType = null;
}

function startAnimation(type) {
  drops = [];
  flakes = [];
  t = 0;

  if (animId) cancelAnimationFrame(animId);

  seedParticles(type);

  const loop = () => {
    draw(type);
    update(type);
    animId = requestAnimationFrame(loop);
  };
  loop();
}

function seedParticles(type) {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  const intensity = Number(intensitySlider.value);

  if (type === "rain" || type === "storm") {
    const count = Math.floor((intensity / 100) * 500) + 120;
    drops = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(-h, h),
      len: rand(10, 22),
      speed: rand(6, 16),
      wind: rand(-1.5, 1.5),
      alpha: rand(0.25, 0.7)
    }));
  }

  if (type === "snow") {
    const count = Math.floor((intensity / 100) * 260) + 60;
    flakes = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(-h, h),
      r: rand(1, 3.8),
      speed: rand(0.7, 2.3),
      drift: rand(-0.6, 0.6),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.4, 0.95)
    }));
  }
}

intensitySlider.addEventListener("input", () => {
  if (!currentType) return;
  seedParticles(currentType); 
});

function draw(type) {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  if (type === "rain") {
    ctx.fillStyle = "#1b2735";
    ctx.fillRect(0, 0, w, h);
  } else if (type === "snow") {
    ctx.fillStyle = "#0b1d2a";
    ctx.fillRect(0, 0, w, h);
  } else if (type === "storm") {
    ctx.fillStyle = "#07090f";
    ctx.fillRect(0, 0, w, h);
  } else if (type === "rainbow") {

    ctx.fillStyle = "#87b9ff";
    ctx.fillRect(0, 0, w, h);
  }

  ctx.globalAlpha = 0.25;
  const grd = ctx.createRadialGradient(w * 0.5, h * 0.3, 20, w * 0.5, h * 0.4, Math.max(w, h));
  grd.addColorStop(0, "rgba(255,255,255,0.08)");
  grd.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;

  if (type === "rain" || type === "storm") {
    // rain
    ctx.lineWidth = 1;
    for (const d of drops) {
      ctx.strokeStyle = `rgba(180,210,255,${d.alpha})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.wind * 2, d.y + d.len);
      ctx.stroke();
    }
  }

  if (type === "snow") {
    for (const f of flakes) {
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === "storm") {
  const flash = lightningFlash(w, h);

  if (boltPath && flash > 0) {
    drawLightning(boltPath, flash);
  }

  if (flash > 0.2) {
    ctx.fillStyle = `rgba(255,255,255,${flash * 0.35})`;
    ctx.fillRect(0, 0, w, h);
  }
}

  if (type === "rainbow") {
    drawRainbow(w, h);
  }
}

function update(type) {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  t += 1;

  if (type === "rain" || type === "storm") {
    const windBase = Math.sin(t / 60) * 0.6;

    for (const d of drops) {
      d.y += d.speed;
      d.x += (d.wind + windBase);

      if (d.y > h + 20) {
        d.y = rand(-60, -10);
        d.x = rand(0, w);
      }
      if (d.x < -50) d.x = w + 50;
      if (d.x > w + 50) d.x = -50;
    }
  }

  if (type === "snow") {
    for (const f of flakes) {
      f.y += f.speed;
      f.x += Math.sin(t / 35 + f.phase) * 0.6 + f.drift;

      if (f.y > h + 10) {
        f.y = rand(-40, -10);
        f.x = rand(0, w);
      }
      if (f.x < -20) f.x = w + 20;
      if (f.x > w + 20) f.x = -20;
    }
  }
}

let flashTimer = 0;
let boltTimer = 0;
let boltPath = null;
function lightningFlash(w, h) {
  if (boltTimer <= 0 && Math.random() < 0.02) {
    boltTimer = Math.floor(rand(10, 18));
    boltPath = generateLightningPath(w, h);
  }

  if (boltTimer > 0) {
    boltTimer--;
    return Math.min(0.9, (boltTimer / 18));
  }

  boltPath = null;
  return 0;
}

function generateLightningPath(w, h) {
  const points = [];

  let x = rand(w * 0.2, w * 0.8);
  let y = 0;

  points.push({ x, y });

  const steps = Math.floor(rand(12, 18));
  const stepY = (h * 0.9) / steps;

  for (let i = 0; i < steps; i++) {
    x += rand(-35, 35);
    y += stepY;

    x = Math.max(10, Math.min(w - 10, x));

    points.push({ x, y });
  }

  const branches = [];
  if (Math.random() < 0.5) {
    const branchStart = Math.floor(rand(3, steps - 3));
    let bx = points[branchStart].x;
    let by = points[branchStart].y;
    const bSteps = Math.floor(rand(4, 7));

    const b = [{ x: bx, y: by }];
    for (let i = 0; i < bSteps; i++) {
      bx += rand(-40, 40);
      by += stepY * rand(0.6, 1.0);
      bx = Math.max(10, Math.min(w - 10, bx));
      b.push({ x: bx, y: by });
    }
    branches.push(b);
  }

  return { main: points, branches };
}

function drawLightning(path, alpha) {
  if (!path) return;

  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha + 0.15);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 18;
  ctx.shadowColor = "rgba(200,220,255,0.9)";

  ctx.strokeStyle = "rgba(180,210,255,0.55)";
  ctx.lineWidth = 6;
  strokePath(path.main);

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 2.2;
  strokePath(path.main);

  for (const br of path.branches) {
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 1.4;
    strokePath(br);
  }

  ctx.restore();
}

function strokePath(points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawRainbow(w, h) {
  const intensity = Number(intensitySlider.value) / 100;

  // небо
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#7ec0ff");
  sky.addColorStop(1, "#cfe9ff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h * 1.05;
  const baseR = Math.min(w, h) * 0.9;

  const gradient = ctx.createRadialGradient(cx, cy, baseR * 0.6, cx, cy, baseR);

  gradient.addColorStop(0.0, `rgba(255,0,0,${0.8 * intensity})`);
  gradient.addColorStop(0.15, `rgba(255,165,0,${0.8 * intensity})`);
  gradient.addColorStop(0.3, `rgba(255,255,0,${0.8 * intensity})`);
  gradient.addColorStop(0.45, `rgba(0,255,0,${0.8 * intensity})`);
  gradient.addColorStop(0.6, `rgba(0,0,255,${0.8 * intensity})`);
  gradient.addColorStop(0.75, `rgba(75,0,130,${0.8 * intensity})`);
  gradient.addColorStop(0.9, `rgba(238,130,238,${0.8 * intensity})`);
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, baseR, Math.PI, 2 * Math.PI);
  ctx.lineTo(cx + baseR, cy);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.2 * intensity;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;
}
}
const homeSection = document.getElementById("home");
const homeBg = document.querySelector(".home-bg");
const clouds = document.querySelectorAll(".cloud");

const BG_STRENGTH = 10;   
const CLOUD_STRENGTH = 25;  

homeSection.addEventListener("mousemove", (e) => {
  const rect = homeSection.getBoundingClientRect();

  const nx = (e.clientX - rect.left) / rect.width - 0.5;
  const ny = (e.clientY - rect.top) / rect.height - 0.5;

  homeBg.style.transform = `translate(${nx * BG_STRENGTH}px, ${ny * BG_STRENGTH}px)`;

  clouds.forEach((c, i) => {
    const k = (i + 1) / clouds.length; 
    c.style.transform = `translate(${nx * CLOUD_STRENGTH * k}px, ${ny * CLOUD_STRENGTH * k}px)`;
  });
});

homeSection.addEventListener("mouseleave", () => {
  homeBg.style.transform = "translate(0px, 0px)";
  clouds.forEach(c => (c.style.transform = "translate(0px, 0px)"));
});