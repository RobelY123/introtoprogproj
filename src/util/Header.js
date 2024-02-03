import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  useMediaQuery,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logoText from "../images/logoText.svg";
export default function Header({ loggedIn, logout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {(loggedIn
          ? ["Grades", "GPA", "Help", "Logout"]
          : ["Help", "Login"]
        ).map((text, index) => (
          <ListItem
            button
            key={text}
            
            onClick={logout}
            component={RouterLink}
            to={text == "Logout"?window.location.href : "/" + text.toLowerCase()}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="inherit" sx={{ boxShadow: 1,background:'',zIndex:10000000 }}>
      <Toolbar>
        {/* <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1,textDecoration: "none", color: "inherit" }}
        >
          Simeo
        </Typography> */}
        <a href="/">
        <img
          component={RouterLink}
          href="/"
          style={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            maxWidth: "150px",
            padding: "10px",
          }}
          src={logoText}
        />
</a>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor={"right"}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                style={{zIndex:100000000}}
              >
                {list()}
              </Drawer>
            </>
          ) : (
            <>
              {loggedIn ? (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/grades"
                    sx={{ margin: 1 }}
                  >
                    Grades
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/gpa"
                    sx={{ margin: 1 }}
                  >
                    GPA
                  </Button>
                </>
              ) : (
                ""
              )}
              <Button
                color="inherit"
                component={RouterLink}
                to="/help"
                sx={{ margin: 1 }}
              >
                Help
              </Button>
              <Button
                variant="contained"
                color="success"
                component={RouterLink}
                to="/login"
                onClick={logout}
                sx={{ margin: 1 }}
              >
                {loggedIn ? "Logout" : "Login"}
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
