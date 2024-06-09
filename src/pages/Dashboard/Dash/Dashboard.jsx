import React, { useContext } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
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
    ThemeProvider,
    createTheme,
    useTheme,
} from "@mui/material";
import {
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    TableRows as TableRowsIcon,
    Map as MapIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import "./Dashboard.css";
import "../../../App.css";
import iamalive from "../../../assets/iamalive.png";
import { UserContext } from "../../../context/UserProvider";

const drawerWidth = 240;
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function MyApp() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return (
        <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
        >
            {theme.palette.mode === "dark" ? (
                <Brightness4Icon />
            ) : (
                <Brightness7Icon />
            )}
        </IconButton>
    );
}

export default function ToggleColorMode() {
    const [mode, setMode] = React.useState("light");
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === "light" ? "dark" : "light"
                );
            },
        }),
        []
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <Dashboard />
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

function Dashboard(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const navigate = useNavigate();

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
        setUser({});
        navigate("/");
    };

    const menuItems = [
        { text: "Profile", icon: <AccountCircleOutlinedIcon />, path: "" },
        { text: "Victim Data", icon: <TableRowsIcon />, path: "victimData" },
        { text: "Requests", icon: <TableRowsIcon />, path: "requests" },
        { text: "Map", icon: <MapIcon />, path: "map" },
    ];

    if (user && user.role === "SuperAdmin") {
        menuItems.push({
            text: "RescueTeam Requests",
            icon: <TableRowsIcon />,
            path: "rescue-requests",
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
            <Divider />
            <Box sx={{ flexGrow: 1 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={Link} to={item.path}>
                                <ListItemIcon
                                // sx={{ color: "white" }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    // sx={{ color: "white" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "black",
                        color: "#c75151",
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

    const container =
        window !== undefined ? () => window().document.body : undefined;

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
                        src={iamalive}
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
                    <MyApp />
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
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

Dashboard.propTypes = {
    window: PropTypes.func,
};
