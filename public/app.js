const socket = io();
const loginOverlay = document.getElementById("login-overlay");
const loginForm = document.getElementById("login-form");
const nameInput = document.getElementById("name-input");
const myName = document.getElementById("my-name");
const usersList = document.getElementById("users");
const userCount = document.getElementById("user-count");
const messages = document.getElementById("messages");
const statusText = document.getElementById("status");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
let username = "";

function timeLabel(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function addSystem(text) {
  const row = document.createElement("div");
  row.className = "system-message";
  row.textContent = text;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}
function clearEmpty() {
  const empty = messages.querySelector(".empty");
  if (empty) empty.remove();
}
function addMessage(message) {
  clearEmpty();
  const row = document.createElement("article");
  row.className = "message" + (message.sender === username ? " mine" : "");
  if (message.sender !== username) {
    const sender = document.createElement("div");
    sender.className = "sender";
    sender.textContent = message.sender;
    row.appendChild(sender);
  }
  const body = document.createElement("div");
  body.className = "body";
  body.textContent = message.text;
  const time = document.createElement("div");
  time.className = "time";
  time.textContent = timeLabel(message.time);
  row.append(body, time);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim().replace(/\s+/g, " ").slice(0, 24);
  if (!name) return;
  username = name;
  myName.textContent = username;
  socket.emit("join", username);
  loginOverlay.classList.add("hidden");
  messageInput.disabled = false;
  sendButton.disabled = false;
  messageInput.focus();
});
messageInput.addEventListener("input", () => {
  sendButton.disabled = !messageInput.value.trim();
});
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !username) return;
  socket.emit("chat-message", text);
  messageInput.value = "";
  sendButton.disabled = true;
  messageInput.focus();
});
socket.on("connect", () => { statusText.textContent = "Terhubung ke server"; });
socket.on("disconnect", () => { statusText.textContent = "Koneksi terputus, mencoba menyambung..."; });
socket.on("users", (users) => {
  userCount.textContent = users.length;
  usersList.replaceChildren();
  if (!users.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "Belum ada pengguna online.";
    usersList.appendChild(li);
    return;
  }
  users.forEach((user) => {
    const li = document.createElement("li");
    li.className = "person";
    const avatar = document.createElement("span");
    avatar.className = "person-avatar";
    avatar.textContent = user.username.slice(0, 1).toUpperCase();
    const label = document.createElement("span");
    label.textContent = user.username;
    li.append(avatar, label);
    usersList.appendChild(li);
  });
});
socket.on("system", (data) => addSystem(data.text));
socket.on("chat-message", addMessage);