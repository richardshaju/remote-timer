"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./Timer.module.css";
 import { Socket } from "socket.io-client";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
   
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // components/Timer.tsx - Update socket initialization
    const socketInit = async () => {
        const socket = io('https://remote-timer-five.vercel.app', {
            path: '/api/socketio',
            addTrailingSlash: false,
          });

      setSocket(socket);

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.on("updateTimer", (newTime: number) => {
        setTime(newTime);
        setIsRunning(false);
      });

      socket.on("timerStart", () => setIsRunning(true));
      socket.on("timerStop", () => setIsRunning(false));
    };
    socketInit();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) setIsRunning(false);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.display}>{formatTime(time)}</h1>
      <div className={styles.controls}>
        <input
          type="number"
          value={time}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setTime(value);
            socket?.emit("setTimer", value);
          }}
          min="0"
        />
        <button
          onClick={() => {
            setIsRunning(true);
            socket?.emit("startTimer");
          }}
          disabled={isRunning || time === 0}
        >
          Start
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            socket?.emit("stopTimer");
          }}
          disabled={!isRunning}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Timer;
