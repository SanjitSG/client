import React, { useContext, useState, useEffect } from "react";
import { Grid, Typography, Paper, styled, useTheme, IconButton } from "@mui/material";
import { Videocam, VideocamOff, Mic, MicOff } from "@mui/icons-material";

import { SocketContext } from "../SocketContext";

const VideoContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: "10px",
  border: "2px solid black",
  margin: "10px",
}));

const useStyles = (theme) => ({
  video: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  controlIcons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
  },
});

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const theme = useTheme();
  const classes = useStyles(theme);

  useEffect(() => {
    // To fix the video frame on mobile devices
    if (myVideo.current && window.innerWidth <= 600) {
      myVideo.current.classList.add("mobile-video-frame");
    }
    if (userVideo.current && window.innerWidth <= 600) {
      userVideo.current.classList.add("mobile-video-frame");
    }
  }, []);

  const handleVideoToggle = () => {
    setVideoEnabled((prev) => !prev);
    myVideo.current.srcObject.getVideoTracks()[0].enabled = !videoEnabled;
  };

  const handleAudioToggle = () => {
    setAudioEnabled((prev) => !prev);
    myVideo.current.srcObject.getAudioTracks()[0].enabled = !audioEnabled;
  };

  return (
    <VideoContainer>
      {/* Own video */}
      <Grid container justifyContent="center" className={classes.gridContainer}>
        {stream && (
          <PaperStyled>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {name || "Name"}
              </Typography>
              <video playInline muted ref={myVideo} autoPlay className={classes.video}></video>
              <div className={classes.controlIcons}>
                <IconButton aria-label="toggle video" color="inherit" onClick={handleVideoToggle}>
                  {videoEnabled ? <Videocam /> : <VideocamOff />}
                </IconButton>
                <IconButton aria-label="toggle audio" color="inherit" onClick={handleAudioToggle}>
                  {audioEnabled ? <Mic /> : <MicOff />}
                </IconButton>
              </div>
            </Grid>
          </PaperStyled>
        )}
        {/* Users video */}
        {callAccepted && !callEnded && (
          <PaperStyled>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {call.name || "Name"}
              </Typography>
              <video playInline ref={userVideo} autoPlay className={classes.video}></video>
            </Grid>
          </PaperStyled>
        )}
      </Grid>
    </VideoContainer>
  );
};

export default VideoPlayer;
