import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <ConnectWithoutContactIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 2, height: 55 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Social Feed
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography sx={{ textAlign: "center", display: "block" }}>
                  <NavLink
                    to="/home"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    Home
                  </NavLink>
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography sx={{ textAlign: "center", display: "block" }}>
                  <NavLink
                    to="/profile"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    Profile
                  </NavLink>
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "0rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Social Feed
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              <NavLink
                to="/home"
                style={{ color: "white", textDecoration: "none" }}
              >
                Home
              </NavLink>
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              <NavLink
                to="/profile"
                style={{ color: "white", textDecoration: "none" }}
              >
                Profile
              </NavLink>
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Button
              onClick={handleLogOut}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
