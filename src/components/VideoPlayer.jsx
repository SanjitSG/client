import React, { useContext, useState } from "react";
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
    width: "550px",
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
  const [userVideoEnabled, setUserVideoEnabled] = useState(true); // Add this state for remote user video
  const [userAudioEnabled, setUserAudioEnabled] = useState(true); // Add this state for remote user audio

  const theme = useTheme();
  const classes = useStyles(theme);

  const handleVideoToggle = () => {
    setVideoEnabled((prev) => !prev);
    myVideo.current.srcObject.getVideoTracks()[0].enabled = !videoEnabled;
  };

  const handleAudioToggle = () => {
    setAudioEnabled((prev) => !prev);
    myVideo.current.srcObject.getAudioTracks()[0].enabled = !audioEnabled;
  };

  const handleUserVideoToggle = () => {
    // Add logic to control the remote user's video here
    setUserVideoEnabled((prev) => !prev);
    userVideo.current.srcObject.getVideoTracks()[0].enabled = !userVideoEnabled;
  };

  const handleUserAudioToggle = () => {
    // Add logic to control the remote user's audio here
    setUserAudioEnabled((prev) => !prev);
    userVideo.current.srcObject.getAudioTracks()[0].enabled = !userAudioEnabled;
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
                  {/* Video toggle for local user */}
                  {videoEnabled ? <Videocam /> : <VideocamOff />}
                </IconButton>
                <IconButton aria-label="toggle audio" color="inherit" onClick={handleAudioToggle}>
                  {/* Audio toggle for local user */}
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
              <div className={classes.controlIcons}>
                <IconButton aria-label="toggle video" color="inherit" onClick={handleUserVideoToggle}>
                  {/* Video toggle for remote user */}
                  {userVideoEnabled ? <Videocam /> : <VideocamOff />}
                </IconButton>
                <IconButton aria-label="toggle audio" color="inherit" onClick={handleUserAudioToggle}>
                  {/* Audio toggle for remote user */}
                  {userAudioEnabled ? <Mic /> : <MicOff />}
                </IconButton>
              </div>
            </Grid>
          </PaperStyled>
        )}
      </Grid>
    </VideoContainer>
  );
};

export default VideoPlayer;
