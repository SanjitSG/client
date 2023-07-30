import React from "react";
import { Typography, AppBar, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Import other components
import VideoPlayer from "./components/VideoPlayer";
import Options from "./components/Options";
import Notifications from "./components/Notifications";

const StyledAppBar = styled(Paper)(({ theme }) => ({
  borderRadius: 15,
  margin: "30px 100px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "600px",
  border: "2px solid black",

  [theme.breakpoints.down("xs")]: {
    width: "90%",
  },
}));

const Wrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
});

const App = () => {
  return (
    <Wrapper>
      <StyledAppBar variant="outlined">
        <Typography variant="h2" align="center">
          Video Chat
        </Typography>
      </StyledAppBar>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </Wrapper>
  );
};

export default App;
