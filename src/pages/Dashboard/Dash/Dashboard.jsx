import React, { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    Avatar,
} from "@mui/material";
import {
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    TableRows as TableRowsIcon,
    Map as MapIcon,
} from "@mui/icons-material";

import "./Dashboard.css";
import "../../../App.css";
import iamalive from "../../../assets/iamalive.png";
import { UserContext } from "../../../context/UserProvider";

const drawerWidth = 240;

export default function Dashboard() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
   
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const { setToken, setUser, user } = useContext(UserContext);

    const handleLogout = () => {
        setToken("");
        setUser(null);
        navigate("/");
    };

    const menuItems = [
        { text: "Profile", icon: <AccountCircleOutlinedIcon />, path: "/dashboard" },
        { text: "Victim Data", icon: <TableRowsIcon />, path: "/dashboard/victimData" },
        { text: "Requests", icon: <TableRowsIcon />, path: "/dashboard/requests" },
        { text: "Map", icon: <MapIcon />, path: "/dashboard/map" },
    ];

    if (user && user.role === "SuperAdmin") {
        menuItems.push({
            text: "RescueTeam Requests",
            icon: <TableRowsIcon />,
            path: "/dashboard/rescue-requests",
        });
        menuItems.push({
            text: "RescueTeam data",
            icon: <TableRowsIcon />,
            path: "/dashboard/rescue-data",
        });
    }

    const drawer = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#c75151",
            }}
        >
            <Toolbar />

            <Box sx={{ flexGrow: 1 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{
                            background: pathname === item.path && "#bd3333",
                        }}>
                            <ListItemButton component={Link} to={item.path}>
                                <ListItemIcon sx={{ color: "white" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ color: "white" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ backgroundColor: '#00000061', p: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#c75151",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#b04141",
                            color: "black",
                        },
                    }}
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    fullWidth
                >
                    LogOut
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }} className="dashboard">
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "#c75151",
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Avatar
                        src={user && user.profileImage ? user.profileImage.secure_url : iamalive}
                        alt="Iamalive"
                        sx={{ mr: 2, width: 40, height: 40 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        color="white"
                    >
                        I Am Alive
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
