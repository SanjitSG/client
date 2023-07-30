import React, { useState, useContext } from "react";
import { Button, TextField, Grid, Typography, Paper, styled, useTheme } from "@mui/material";
import { Phone, PhoneDisabled } from "@mui/icons-material";

import { SocketContext } from "../SocketContext";

const OptionsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: "10px 20px",
  border: "2px solid black",
}));

const useStyles = () => {
  const theme = useTheme();
  return {
    video: {
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "550px",
      },
    },
    gridContainer: {
      justifyContent: "center",
    },
    margin: {
      margin: "20px 0",
    },
  };
};

const Options = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");
  const theme = useTheme();
  const classes = useStyles(theme);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(me).then(
      () => {
        console.log("Copied to clipboard:", me);
      },
      (err) => {
        console.error("Failed to copy:", err);
      }
    );
  };

  return (
    <OptionsContainer>
      <PaperStyled elevation={10}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                Account Info
              </Typography>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <Button variant="contained" color="primary" fullWidth startIcon={<Phone fontSize="large" />} className={classes.margin} onClick={handleCopyToClipboard}>
                Copy Your ID
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                Make a call
              </Typography>
              <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
              {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                  Hang Up
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)} className={classes.margin}>
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </PaperStyled>
    </OptionsContainer>
  );
};

export default Options;
