import React, { useContext } from "react";
import { Button, styled, useTheme } from "@mui/material";
import { Phone } from "@mui/icons-material";

import { SocketContext } from "../SocketContext";

const NotificationsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
}));

const useStyles = () => {
  const theme = useTheme();
  return {
    button: {
      margin: "10px 0",
      [theme.breakpoints.up("sm")]: {
        width: "300px",
      },
    },
  };
};

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  const theme = useTheme();
  const classes = useStyles(theme);

  if (!call.isReceivedCall || callAccepted) {
    return null;
  }

  return (
    <NotificationsContainer>
      <h1>{call.name} is calling:</h1>
      <Button variant="contained" color="primary" onClick={answerCall} className={classes.button}>
        Answer
      </Button>
    </NotificationsContainer>
  );
};

export default Notifications;
