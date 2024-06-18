import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserProvider";
import { Tabs, Tab, Box } from '@mui/material';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../../Components/Loading/Loading";
import './Profile.css';
import { toast } from "sonner";

export default function Profile() {
    const [tabIndex, setTabIndex] = useState(0);
    const { user, token, setUser } = useContext(UserContext);
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

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profileImage ? user.profileImage.secure_url : "nouser.png");

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { value, name } = e.target;
        setUpdatePassword((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(user.profileImage ? user.profileImage.secure_url : '../../../assets/nouser.png');
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('fileInput').click();
    };

    const updateProfileMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append('name', formInfo.name);
            formData.append('city', formInfo.city);
            if (profilePhoto) {
                formData.append('image', profilePhoto);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `IAMALIVE__${token}`,
                },
            };

            const { data } = await axios.put(
                "/rescueTeam/updateInfo",
                formData,
                config
            );

            return data;
        },
        onError: (error) => {
            console.error("Error updating profile:", error.response || error.message);
            toast.error("Failed to update profile. Please try again.");
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            setUser((prevUser) => ({
                ...prevUser,
                name: formInfo.name,
                city: formInfo.city,
                profileImage: data.rescueTeam.profileImage || prevUser.profileImage,
            }));
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
        onError: (error) => {
            console.error("Error updating password:", error.response || error.message);
            toast.error("Failed to update password. Please try again.");
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
                        <div className="avatarBox" onClick={handleAvatarClick}>
                            <img src={previewUrl} alt="Profile Avatar" className="profileAvatar"  />
                        </div>
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: "none" }}
                        />
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
                                    type="password"
                                    onChange={handlePasswordChange}
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
                                    onChange={handlePasswordChange}
                                />
                            </label>
                        </div>
                        <div className="inputBox">
                            <label>
                                <span>Confirm Password</span>
                                <input
                                    type="password"
                                    name="cNewPassword"
                                    onChange={handlePasswordChange}
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
