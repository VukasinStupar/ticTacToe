import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// poveži se na backend (http://localhost:5000)
const socket = io("http://localhost:5000");

export default function TestSocket() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // konekcija
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      setMessages(prev => [...prev, `Connected: ${socket.id}`]);

      // pošalji odmah ping serveru
      socket.emit("pingServer", "Hello server 🚀");
    });

    // welcome poruka
    socket.on("welcome", (msg) => {
      console.log("📢 Server says:", msg);
      setMessages(prev => [...prev, `Server: ${msg}`]);
    });

    // odgovor na ping
    socket.on("pongClient", (msg) => {
      console.log("🔄 Server replied:", msg);
      setMessages(prev => [...prev, `Server: ${msg}`]);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setMessages(prev => [...prev, "Disconnected"]);
    });

    return () => {
      socket.off();
    };
  }, []);

  // dugme za slanje poruke
  const sendMessage = () => {
    socket.emit("pingServer", "Button clicked 💡");
  };

  return (
    <div style={{ padding: "20px", color: "white", background: "#222" }}>
      <h2>Socket.IO Test</h2>
      <button onClick={sendMessage}>Send message to server</button>
      <div style={{ marginTop: "20px" }}>
        <h3>Messages:</h3>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
