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

export default function Header() {
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
        {["Grades", "GPA", "AP", "Login"].map((text, index) => (
          <ListItem
            button
            key={text}
            component={RouterLink}
            to={"/" + text.toLowerCase()}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="inherit" sx={{ boxShadow: 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Intro to Prog
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor={"right"}
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {list()}
            </Drawer>
          </>
        ) : (
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
            <Button
              color="inherit"
              component={RouterLink}
              to="/ap"
              sx={{ margin: 1 }}
            >
              AP
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/login"
              sx={{ margin: 1 }}
            >
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
