"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import React from "react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#333" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Smart Pantry
        </Typography>
        {session?.user ? (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              Welcome, {session.user.name}
            </Typography>
            <Button
              color="inherit"
              onClick={() => signOut()}
              sx={{ backgroundColor: "red", color: "white" }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Button
            color="inherit"
            onClick={() => signIn("google")}
            sx={{ backgroundColor: "green", color: "white" }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
