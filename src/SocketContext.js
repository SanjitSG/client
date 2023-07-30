import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

// Create a context for sharing state across components
const SocketContext = createContext();

const socket = io("https://video-chat-app-9xej.onrender.com");
// const socket = io("http://localhost:5000"); //testing

const ContextProvider = ({ children }) => {
  // State to hold the local stream, call data, and other relevant information
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);

  // References for the local video element, remote video element, and connection
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      console.log("Media Stream obtained:", currentStream);
      setStream(currentStream);

      myVideo.current.srcObject = currentStream;
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    });

    socket.on("me", (id) => setMe(id));
    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    console.log("hello");
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("calluser", { userToCall: id, signalData: data, from: me, name: name });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);

      connectionRef.current = peer;
    });

    setCall(peer); // Store the peer object in the state
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        audioEnabled,
        setAudioEnabled,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
