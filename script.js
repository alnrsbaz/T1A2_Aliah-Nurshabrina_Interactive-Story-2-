// === DOM ELEMENTS ===
const dmMessageLine = document.getElementById("dmMessageLine");
const dmIcon = document.getElementById("dmIcon");
const notif = document.getElementById("dmNotif");
const dmScene = document.getElementById("dmScene");
const vybz = document.getElementById("vybzScene");
const dmChatBox = document.getElementById("dmChatBox");
const dmOptions = document.getElementById("dmOptions");
const retryBtn = document.getElementById("retryBtn");
const viralMsg = document.getElementById("viralMsg");
const typingIndicator = document.getElementById("typingIndicator");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const intro = document.getElementById("introScreen");
const welcome = document.getElementById("nextScene");
const startBtn = document.getElementById("startBtn");
const enterBtn = document.getElementById("enterBtn");
const likesEl = document.getElementById("likes");
const commentsEl = document.getElementById("comments");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");
const popupOverlay = document.getElementById("popupOverlay");
const closePopup = document.getElementById("closePopup");
const alertOkBtn = document.getElementById("alertOkBtn");
const endScene = document.getElementById("endScene");

let currentIndex = 0;
let previousIndex = 0;
let interval;
let likes = 105;
let comments = 22;
let triggerMiniGame = false;

// === QUESTION DATA ===
const questions = [
  {
    profile: "img/zane_pfp.jpg",
    username: "@zane.exe",
    name: "Zane",
    line: "A stranger DMs you after your viral post.",
    zaneLine: "Hey... you're kinda famous now 🙀",
    question: "What do you do?",
    options: [
      { text: "Reply casually", bad: true },
      { text: "Ask them to stop", good: true },
      { text: "Ignore & report", good: true }
    ],
    tip: "Not all messages are real people. AI can fake trust."
  },
  {
    profile: "/Users/aliahnurshabrina/Downloads/Leonardo_Kino_XL_a_young_adult_man_handsome_0.jpg",
    username: "@jasper.visuals",
    name: "Jasper",
    line: "New friend insists on a selfie or video call.",
    zaneLine: "Can I see your face? Just one pic 😗",
    question: "How do you respond?",
    options: [
      { text: "Send filtered photo", bad: true },
      { text: "Decline", good: true },
      { text: "Share real-time selfie", bad: true }
    ],
    tip: "Photos can be misused. <a href='#' onclick=\"showInfoPopup('imageAbuse')\">Learn about image abuse laws</a>."
  },
  {
    profile: "/Users/aliahnurshabrina/Downloads/Leonardo_Kino_XL_a_young_lady_cool_girl_2.jpg",
    username: "@liya.chats",
    name: "Liya",
    line: "They invite you to meet at a café.",
    zaneLine: "Wanna hang IRL? I know a chill spot ☕",
    question: "What should you do?",
    options: [
      { text: "Meet alone", bad: true },
      { text: "Bring a friend", good: true },
      { text: "Politely decline", good: true }
    ],
    tip: "Meeting strangers carries real-world risks. Stay safe."
  },
  {
    profile: "/Users/aliahnurshabrina/Downloads/Leonardo_Kino_XL_a_middle_age_handsome_man_with_specs_3.jpg",
    username: "@nico.fx",
    name: "Nico",
    line: "They offer to collab on content.",
    zaneLine: "We’d blow up if we filmed together 🔥",
    question: "What's your move?",
    options: [
      { text: "Exchange phone numbers", bad: true },
      { text: "Vet their profile first", good: true },
      { text: "Send your schedule", bad: true }
    ],
    tip: "Be cautious of unsolicited collabs. <a href='#' onclick=\"showInfoPopup('collabSafety')\">Read safe collab tips</a>."
    
  }
];

// === UTILITY FUNCTIONS ===
function fadeOut(el, cb) {
  el.style.opacity = 1;
  el.style.transition = 'opacity 0.5s';
  el.style.opacity = 0;
  setTimeout(() => {
    el.classList.add("hidden");
    if (cb) cb();
  }, 500);
}

function fadeIn(el) {
  el.classList.remove("hidden");
  el.style.opacity = 0;
  el.style.transition = 'opacity 0.5s';
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);
}

function showTypewriterLine(text, el, callback) {
  el.textContent = "";
  el.classList.remove("hidden");
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 35);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function updateUsername(q) {
  const usernameEl = document.getElementById("dmUsername");
  if (usernameEl) usernameEl.textContent = q.username;
}


function createMessageBubble(text, profile, outgoing = false, noAvatar = false) {
  const msg = document.createElement("div");
  msg.className = `dm-message ${outgoing ? "outgoing" : "incoming"}`;
  const avatarSrc = profile || "img/default_avatar.png";
  msg.innerHTML = noAvatar
    ? `<div class="dm-bubble">${text}</div>`
    : `<img src="${avatarSrc}" class="dm-avatar" onerror="this.onerror=null; this.src='default-avatar-icon-of-social-media-user-vector.jpg';" />
       <div class="dm-bubble">${text}</div>`;
  dmChatBox.appendChild(msg);
  dmChatBox.scrollTop = dmChatBox.scrollHeight;
}

// === MAIN GAME LOGIC ===
function showQuestion(index) {
  const q = questions[index];
  previousIndex = currentIndex;
  currentIndex = index;

  updateUsername(q);
  dmChatBox.innerHTML = "";
  dmOptions.innerHTML = "";
  typingIndicator.classList.add("hidden");
  retryBtn.classList.add("hidden");
  dmMessageLine.classList.remove("hidden");

  showTypewriterLine(q.line, dmMessageLine, () => {
    setTimeout(() => {
      typingIndicator.textContent = `${q.name} is typing...`;
      typingIndicator.classList.remove("hidden");

      setTimeout(() => {
        typingIndicator.classList.add("hidden");
        createMessageBubble(q.zaneLine, q.profile);
        setTimeout(() => {
          const questionLine = document.createElement("div");
          questionLine.className = "dm-followup-question";
          questionLine.innerHTML = q.question;
          dmChatBox.appendChild(questionLine);

          q.options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.className = "dm-option";
            btn.textContent = opt.text;
            btn.onclick = () => handleResponse(opt, q.tip);
            dmOptions.appendChild(btn);
          });

          dmOptions.classList.remove("hidden");
        }, 3200);
      }, 1800);
    }, 1000);
  });
}

function handleResponse(option, tip) {
  createMessageBubble(option.text, "", true, true);
  const resultText = option.bad ? "⚠️ That wasn’t safe." : "✅ Smart move!";
  setTimeout(() => {
    createMessageBubble(resultText, "", false, true);
    dmOptions.innerHTML = "";
    retryBtn.classList.remove("hidden");

    const q = questions[currentIndex];
    if (q.name === "Nico" && option.text === "Vet their profile first") {
      triggerMiniGame = true;
      showFullAlert("Let’s inspect Nico’s profile before deciding. Tap OK to continue.");
    } else if (option.bad) {
      showFullAlert(tip);
    } else {
      showNextBtn();
    }
  }, 1500);
}


  setTimeout(() => {
    createMessageBubble(resultText, "", false, true);
    dmOptions.innerHTML = "";
    retryBtn.classList.remove("hidden");

    if (option.bad) {
  showFullAlert(tip);

  // 💡 Launch the mini-game ONLY for Nico's question
  if (questions[currentIndex].name === "Nico") {
    setTimeout(() => {
      launchFakeProfileGame();
    }, 1800);
  }
} else {
  showNextBtn();
}

  }, 1500);


function showNextBtn() {
  if (currentIndex < questions.length - 1) {
    const nextBtnQ = document.createElement("button");
    nextBtnQ.textContent = "Next Question";
    nextBtnQ.className = "next-question-btn";
    nextBtnQ.onclick = () => {
      nextBtnQ.remove();
      showQuestion(currentIndex + 1);
    };
    dmOptions.appendChild(nextBtnQ);
  } else {
    showEndScreen();
  }
}

function showFullAlert(message) {
  alertMessage.innerHTML = message;
  alertBox.classList.remove("hidden");
  alertBox.classList.add("show");

  alertOkBtn.onclick = () => {
    alertBox.classList.remove("show");
    alertBox.classList.add("hidden");

    if (triggerMiniGame) {
      triggerMiniGame = false;
      launchFakeProfileGame();
    } else {
      showNextBtn();
    }
  };
}

function retryDM() {
  showQuestion(currentIndex); // Just reload the current question
}


function showInfoPopup(topic) {
  let content = "";
  switch (topic) {
    case "imageAbuse":
      content = `
        <h3>Image Abuse Laws</h3>
        <ul>
          <li>⚖️ It’s illegal to share or edit photos without consent.</li>
          <li>🚫 Deepfakes or manipulated images can lead to criminal charges.</li>
          <li>🛡️ Report platforms that misuse your image.</li>
        </ul>`;
      break;
    case "collabSafety":
      content = `
        <h3>Safe Collab Tips</h3>
        <ul>
          <li>✔️ Always verify accounts first.</li>
          <li>📄 Use written agreements for boundaries.</li>
          <li>🔒 Avoid giving personal contact info early.</li>
        </ul>`;
      break;
    default:
      content = `<p>Information not found.</p>`;
  }
  popupOverlay.innerHTML = `<div class="popup-content">${content}<button onclick="closeInfoPopup()">Close</button></div>`;
  popupOverlay.classList.remove("hidden");
}

function closeInfoPopup() {
  popupOverlay.classList.add("hidden");
}

function showEndScreen() {
  fadeOut(dmScene, () => {
    fadeIn(endScene);
  });
}

function restartGame() {
  location.reload();
}


function launchFakeProfileGame() {
  const gameEl = document.getElementById("fakeProfileGame");
  gameEl.innerHTML = `
    <div class="popup-content game-box">
      <h3>Vet Nico’s Profile</h3>
      <p>Which of these details makes Nico's account suspicious?</p>
      <div class="profile-grid">
        <div class="profile-option" onclick="handleGameAnswer('wrong')">
          <img src="/Users/aliahnurshabrina/Downloads/Leonardo_Kino_XL_a_middle_age_handsome_man_with_specs_3.jpg" alt="Profile 1">
          <p>@nico.fx • 104 posts • Follows: 789</p>
        </div>
        <div class="profile-option" onclick="handleGameAnswer('right')">
          <img src="/Users/aliahnurshabrina/Downloads/Leonardo_Kino_XL_a_middle_age_handsome_man_with_specs_suspicio_3.jpg" alt="Profile 2">
          <p>@nico_collab_$$ • 0 posts • Follows: 2,130</p>
        </div>
        <div class="profile-option" onclick="handleGameAnswer('wrong')">
          <img src="/Users/aliahnurshabrina/Downloads/Leonardo_Kino_XL_a_middle_age_handsome_man_with_specs_suspicio_1.jpg">
          <p>@n.fx.official • 312 posts • Verified</p>
        </div>
      </div>
      <div class="game-feedback" id="gameFeedback"></div>
      <button onclick="closeFakeProfileGame()">Close</button>
    </div>`;
  gameEl.classList.remove("hidden");
}

function handleGameAnswer(result) {
  const feedback = document.getElementById("gameFeedback");
  if (result === 'right') {
    feedback.textContent = "✅ Good catch! Suspicious username, no posts, and high following count.";
    feedback.style.color = "#5CFF5C";
    setTimeout(() => {
      closeFakeProfileGame();
      showEndScreen();
    }, 1800);
  } else {
    feedback.textContent = "⚠️ Look closer. That account seems more legit.";
    feedback.style.color = "#FF6666";
  }
}

function closeFakeProfileGame() {
  document.getElementById("fakeProfileGame").classList.add("hidden");
  document.getElementById("gameFeedback").textContent = "";
}

document.addEventListener("DOMContentLoaded", function () {
  startBtn.addEventListener("click", () => {
    fadeOut(intro, () => fadeIn(welcome));
  });

  enterBtn.addEventListener("click", () => {
    fadeOut(welcome, () => {
      fadeIn(vybz);
      backBtn.classList.add("hidden");
      nextBtn.classList.remove("hidden");
      likesEl.textContent = `♥ ${likes}`;
      commentsEl.textContent = `💬 ${comments}`;
      viralMsg.classList.remove("hidden");
      notif.classList.add("hidden");

      interval = setInterval(() => {
        likes += Math.floor(Math.random() * 5);
        comments += Math.floor(Math.random() * 2);
        likesEl.textContent = `♥ ${likes}`;
        commentsEl.textContent = `💬 ${comments}`;
        if (likes > 500) clearInterval(interval);
      }, 100);
    });
  });

  nextBtn.addEventListener("click", () => {
    viralMsg.classList.add("hidden");
    document.getElementById("dmAlert").classList.remove("hidden");
    notif.classList.remove("hidden");
    notif.style.display = "inline-block";
    notif.textContent = "1";
    dmIcon.classList.add("pop-jiggle-glow");
    backBtn.classList.remove("hidden");
    nextBtn.classList.add("hidden");
    if (interval) clearInterval(interval);
  });

  backBtn.addEventListener("click", () => {
    if (interval) clearInterval(interval);
    fadeOut(vybz, () => fadeIn(welcome));
  });

  dmIcon.addEventListener("animationend", () => dmIcon.classList.remove("pop-jiggle-glow"));

  dmIcon.addEventListener("click", () => {
    notif.style.display = "none";
    fadeOut(vybz, () => {
      fadeIn(dmScene);
      showQuestion(currentIndex);
    });
  });

  closePopup.addEventListener("click", () => popupOverlay.classList.add("hidden"));
});
