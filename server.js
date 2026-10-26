const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true }));

const users = new Map();

io.on("connection", (socket) => {
  socket.on("join", (rawName) => {
    const name = String(rawName || "").trim().replace(/\s+/g, " ").slice(0, 24);
    if (!name) return;
    users.set(socket.id, name);
    socket.emit("system", { text: `Kamu masuk sebagai ${name}.` });
    io.emit("users", [...users.entries()].map(([id, username]) => ({ id, username })));
    io.emit("system", { text: `${name} bergabung ke chat.` });
  });

  socket.on("chat-message", (rawText) => {
    if (!users.has(socket.id)) return;
    const text = String(rawText || "").trim().slice(0, 1000);
    if (!text) return;
    io.emit("chat-message", {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sender: users.get(socket.id),
      text,
      time: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    const name = users.get(socket.id);
    if (!name) return;
    users.delete(socket.id);
    io.emit("users", [...users.entries()].map(([id, username]) => ({ id, username })));
    io.emit("system", { text: `${name} keluar dari chat.` });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`GlobalChat berjalan di http://localhost:${PORT}`);
});