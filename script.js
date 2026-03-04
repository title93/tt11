const envelope = document.getElementById("envelope");
const song = document.getElementById("song");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const statusBox = document.getElementById("status");
const heartsLayer = document.getElementById("hearts");

function setStatus(msg, type = "info") {
  if (!statusBox) return;

  statusBox.style.display = "block";
  statusBox.textContent = msg;
  statusBox.style.borderColor =
    type === "ok"
      ? "rgba(22,199,132,.5)"
      : type === "err"
      ? "rgba(255,90,95,.5)"
      : "rgba(0,0,0,.15)";
}

function toggleOpen() {
  if (!envelope) return;

  envelope.classList.toggle("open");
  envelope.setAttribute(
    "aria-pressed",
    envelope.classList.contains("open") ? "true" : "false"
  );
}

function startMusicOnce() {
  if (!song) return;
  song.volume = 0.5;
  song.play().catch(() => {});
}

document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("touchstart", startMusicOnce, { once: true });

if (envelope) {
  envelope.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    toggleOpen();
  });

  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  });
}

let heartsTimer = null;

function spawnHeart() {
  if (!envelope || !heartsLayer) return;

  const rect = envelope.getBoundingClientRect();
  const x = rect.left + rect.width * (0.15 + Math.random() * 0.7);

  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.2 ? "💗" : "💖";

  const size = 14 + Math.random() * 18;
  heart.style.left = `${x}px`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${3 + Math.random() * 3.5}s`;

  heartsLayer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8000);
}

function startHearts() {
  if (heartsTimer) return;
  heartsTimer = setInterval(spawnHeart, 180);
}

function stopHearts() {
  clearInterval(heartsTimer);
  heartsTimer = null;
}

if (envelope) {
  envelope.addEventListener("mouseenter", startHearts);
  envelope.addEventListener("mouseleave", stopHearts);
  envelope.addEventListener("touchstart", startHearts, { passive: true });
  envelope.addEventListener("touchend", stopHearts);
}

// --------------------
// Email sending by hidden form
// --------------------
const TO_EMAIL = "titletukta2546@gmail.com";
const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzikYJ_q_76Wd-UTb77dFQ4JZXlGOcWUsch1-2VrBwiMsQ9Uv-jWEQ7WRcDh0TfaFg_/exec";

function sendEmailByForm(answer) {
  if (!GAS_WEBAPP_URL) {
    throw new Error("ยังไม่ได้ใส่ GAS_WEBAPP_URL");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = GAS_WEBAPP_URL;
  form.target = "hidden_iframe";
  form.style.display = "none";

  const fields = {
    to_email: TO_EMAIL,
    answer: answer,
    timestamp: new Date().toLocaleString("th-TH"),
    user_agent: navigator.userAgent
  };

  Object.keys(fields).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = fields[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();

  setTimeout(() => {
    form.remove();
  }, 1000);
}

function handleAnswer(answer) {
  try {
    sendEmailByForm(answer);
    setStatus(`✅ ส่งคำตอบแล้ว: คุณเลือก "${answer}"`, "ok");
  } catch (err) {
    setStatus(`❌ ส่งไม่สำเร็จ: ${err.message}`, "err");
    console.error(err);
  }
}

if (btnYes) {
  btnYes.addEventListener("click", () => handleAnswer("ตกลง"));
}

if (btnNo) {
  btnNo.addEventListener("click", () => handleAnswer("ไม่ตกลง"));
}