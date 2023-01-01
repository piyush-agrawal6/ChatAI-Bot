import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
const hamburger = document.querySelector(".hamburger");
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
let loadInterval;

hamburger.onclick = function () {
  let navbar = document.querySelector(".navbar");
  navbar.classList.toggle("active");
};

function loader(elem) {
  elem.textContent = "";
  loadInterval = setInterval(() => {
    elem.textContent += ".";
    if (elem.textContent === "....") {
      elem.textContent = "";
    }
  }, 300);
}

function typeText(elem, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      elem.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateId() {
  const id = Date.now();
  const random = Math.random();
  return `id-${id}-${random}`;
}

function chat(isAi, value, id) {
  return `
    <div class="${isAi ? "wrapper ai" : "wrapper"}">
     <div class="${isAi ? "chatAi" : "chat"}">
      <div class="profile">
       <img src="${isAi ? bot : user}" alt="icon"/>
      </div>
      <div class="message" id=${id}>
       ${value}
      </div>
    </div>
   </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  if (!data.get("prompt").trim()) {
    alert("Please write something");
  } else {
    //user chat
    chatContainer.innerHTML += chat(
      false,
      data.get("prompt").trim(),
      Date.now()
    );
    form.reset();

    //bot chat
    const newId = generateId();
    chatContainer.innerHTML += chat(true, " ", newId);
    // to focus scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(newId);
    loader(messageDiv);

    // fetch data
    const response = await fetch("https://vast-plum-codfish-gear.cyclic.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.get("prompt"),
      }),
    });
    clearInterval(loadInterval);
    messageDiv.innerHTML = "";
    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();
      messageDiv.innerHTML = "Something went wrong";
      alert(err);
    }
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
