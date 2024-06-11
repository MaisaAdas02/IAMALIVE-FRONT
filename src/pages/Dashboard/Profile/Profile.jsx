import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserProvider";
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../../Components/Loading/Loading";
import './Profile.css';
import { toast } from "sonner";

export default function Profile() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const { user, token } = useContext(UserContext);
    const queryClient = useQueryClient();
    const [formInfo, setFormInfo] = useState({
        name: user.name,
        email: user.email,
        city: user.city,
    });
    const [updatePassword, setUpdatePassword] = useState({
        oldPassword: '',
        newPassword: '',
        cNewPassword: '',
    });

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePaswwordChange = (e) => {
        const { value, name } = e.target;
        setUpdatePassword((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateProfileMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axios.put(
                "/rescueTeam/updateInfo",
                {
                    name: formInfo.name,
                    city: formInfo.city,
                },
                {
                    headers: {
                        Authorization: `IAMALIVE__${token}`,
                    },
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            toast.success("Profile updated successfully");
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        updateProfileMutation.mutate();
    };


    const updatePasswordMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axios.patch(
                "/rescueTeam/updatePassword",
                {
                    oldPassword: updatePassword.oldPassword,
                    newPassword: updatePassword.newPassword,
                    cNewPassword: updatePassword.cNewPassword

                },
                {
                    headers: {
                        Authorization: `IAMALIVE__${token}`,
                    },
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            toast.success("Password Reset successfully!");
        },
    });

    function handleSubmit1(e) {
        e.preventDefault()
        if (updatePassword.newPassword !== updatePassword.cNewPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        updatePasswordMutation.mutate()
    }

    return (
        <>
            <Box sx={{ borderBottom: 4, borderColor: '#c75151' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="profile tabs"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'black', // Indicator color
                        },
                        '& .MuiTab-root': {
                            color: 'rgba(199, 81, 81, 0.5)', // Inactive tab color
                            '&.Mui-selected': {
                                color: 'black', // Active tab color
                            },
                        },
                    }}>
                    <Tab label="Profile" sx={{ color: 'black' }} />
                    <Tab label="Update Password" sx={{ color: 'black' }} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <Box>
                    <form className="formInfo" onSubmit={handleSubmit}>
                        <div className="inputBox">
                            <label>
                                <span>Name</span>
                                <input
                                    type="text"
                                    defaultValue={formInfo.name}
                                    onChange={handleChange}
                                    name="name"
                                />
                            </label>
                        </div>
                        <div className="inputBox">
                            <label>
                                <span>Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    disabled
                                    defaultValue={formInfo.email}
                                />
                            </label>
                        </div>
                        <div className="inputBox">
                            <label>
                                <span>City</span>
                                <input
                                    type="text"
                                    defaultValue={formInfo.city}
                                    onChange={handleChange}
                                    name="city"
                                />
                            </label>
                        </div>

                        <button className="updateButton" type="submit">
                            {updateProfileMutation.isPending ? (
                                <Loading color="black" size={20} />
                            ) : (
                                "Update"
                            )}
                        </button>
                    </form>
                </Box>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Box>
                    <form className="formInfo" onSubmit={handleSubmit1}>
                        <div className="inputBox">
                            <label>
                                <span>Enter Old Password</span>
                                <input
                                    type="pasword"
                                    onChange={handlePaswwordChange}
                                    name="oldPassword"
                                />
                            </label>
                        </div>
                        <div className="inputBox">
                            <label>
                                <span>Enter New Password</span>
                                <input
                                    type="password"
                                    name="newPassword"
                                    onChange={handlePaswwordChange}
                                />
                            </label>
                        </div>
                        <div className="inputBox">
                            <label>
                                <span>Confirm Password</span>
                                <input
                                    type="password"
                                    name="cNewPassword"
                                    onChange={handlePaswwordChange}
                                />
                            </label>
                        </div>
                        <button className="updateButton" type="submit">
                            {updatePasswordMutation.isPending ? (
                                <Loading color="black" size={20} />
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>
                </Box>
            </TabPanel>
        </>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

