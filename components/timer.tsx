"use client";
import { ChangeEvent, useEffect, useState } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import TimerRing from "./timerRing";
import { FaPlay } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import { LuTimerReset } from "react-icons/lu";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [title, setTitle] = useState("_________");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);

  useEffect(() => {
    const socketInit = async () => {
      await fetch("http://localhost:3000/api/socketio")
      const socket = io("https://pfqfxhdl-3001.inc1.devtunnels.ms", {
        path: "/api/socketio",
        addTrailingSlash: false,
        transports: ["websocket"],
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
        setInitialTime(newTime);
        setIsRunning(false);
      });

      socket.on("timerStart", () => setIsRunning(true));
      socket.on("timerStop", () => setIsRunning(false));
   
      socket.on("getPlayAudio", (value) =>{
        console.log("getPlayAudio", value);
        
        setPlayAudio(value)
      })

      socket.on("getTitle", (title) => {
        setTitle(title);
      });
    };
    
    socketInit();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

 

  useEffect(() => {
    if (time === 0 && playAudio) {
      const audio = new Audio('/audio.mp3');
      audio.play().catch(error => console.log('Audio playback failed:', error));
      socket?.emit("setPlayAudio", false);
    }
  }, [time, playAudio, socket]);
  

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    socket?.emit("setTitle", e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black space-y-6">
      {/* Editable Title */}
      <div
        className="md:text-7xl text-3xl font-bold text-center uppercase cursor-pointer text-white md:h-[4rem]"
        onClick={() => setIsEditingTitle(true)}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitle(e)}
            onBlur={() => setIsEditingTitle(false)}
            className="md:text-7xl text-3xl font-bold text-center uppercase md:h-[4rem] bg-black rounded  focus:border-none  focus:outline-none  border-solid border-slate-800"
            autoFocus
          />
        ) : (
          title
        )}
      </div>

      {/* Timer Ring */}
      <div
        className="relative md:w-[32rem] md:h-[32rem] w-[20rem] h-[20rem]"
        title="Click to edit time"
      >
        <TimerRing time={time} initialTime={initialTime} />
        <div className="absolute inset-0 flex items-center text-white justify-center md:text-7xl text-3xl font-bold"
         onClick={() => setIsEditing(true)}>
          {isEditing ? (
        <input
          type="text"
          value={formatTime(time)}
          onChange={(e) => {
            const timeStr = e.target.value.replace(/\D/g, '');
            if (timeStr && /^\d+$/.test(timeStr)) {
          const hrs = parseInt(timeStr.slice(0, -4) || "0");
          const mins = parseInt(timeStr.slice(-4, -2) || "0");
          const secs = parseInt(timeStr.slice(-2) || "0");
          const totalSeconds = hrs * 3600 + mins * 60 + secs;
          setTime(totalSeconds);
          setInitialTime(totalSeconds);
          socket?.emit("setTimer", totalSeconds);
            }
          }}
          onBlur={() => setIsEditing(false)}
          className="bg-transparent text-center w-full focus:outline-none"
          autoFocus
        />
          ) : (
        formatTime(time)
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col  justify-center items-center gap-2">
        <button
          className="bg-bg-gray-950 border-2 border-gray-900 text-white px-14 py-2 rounded hover:bg-gray-950 flex items-center justify-center"
          onClick={() => {
            setIsRunning((prev) => !prev);
            if (!isRunning){
              socket?.emit("startTimer");
              socket?.emit("setPlayAudio", true);
            }
              else{ 
                socket?.emit("stopTimer");
            }
          }}
        >
          {isRunning ? <IoIosPause /> : <FaPlay />}
        </button>
        <button
          className="bg-[#000000a2] border-2 border-gray-900 text-white px-14 py-2 rounded hover:bg-gray-950 flex items-center justify-center"
          onClick={() => {
            setTime(initialTime);
            setIsRunning(false);
            socket?.emit("resetTimer", initialTime);
          }}
        >
          <LuTimerReset />
        </button>
      </div>
    </div>
  );
};

export default Timer;
