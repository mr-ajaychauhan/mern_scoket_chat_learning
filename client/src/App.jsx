import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
const App = () => {
  const socket = useMemo(() => {
    return io("http://localhost:3005", {});
  }, []);

  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const handleClick = () => {
    if (message === "") return;
    if (room) {
      socket.emit("send_message", { message, room });
    } else {
      socket.emit("send_message", { message });
    }
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    socket.on("recive_message", (message) => {
      console.log(message);
      setData((prev) => [...prev, message]);
    });
  }, [socket]);

  return (
    <>
      <div>
        <h1>Socket.io</h1>

        <h1>Join Room</h1>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>

        <h1>Send Message</h1>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      <div>
        <h1>Messages</h1>
        <ul style={{ listStyle: "none" }}>
          {data.map((item, index) => (
            <li key={index}>{item.message}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
