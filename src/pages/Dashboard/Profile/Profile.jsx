import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserProvider";
import { Tabs, Tab, Box } from '@mui/material';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loadingcircle from "../../../Components/Loadingcircle/Loadingcircle";
import { toast } from "sonner";
import noUserImage from '../../../assets/nouser.png';
import { MdAddAPhoto } from "react-icons/md";
import './Profile.css';

export default function Profile() {
    const [tabIndex, setTabIndex] = useState(0);
    const { user, token } = useContext(UserContext);
    const queryClient = useQueryClient();

    const [formInfo, setFormInfo] = useState({
        name: user?.name || "",
        email: user?.email || "",
        city: user?.city || "",
        image: null
    });

    const [updatePassword, setUpdatePassword] = useState({
        oldPassword: '',
        newPassword: '',
        cNewPassword: '',
    });

    useEffect(() => {
        if (user) {
            setFormInfo({
                name: user.name,
                email: user.email,
                city: user.city,
                image: null
            });
        }
    }, [user]);

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
        setFormInfo(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const updateProfileMutation = useMutation({
        mutationFn: async (formdata) => {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `IAMALIVE__${token}`,
                },
            };

            const { data } = await axios.put(
                "/rescueTeam/updateInfo",
                formdata,
                config
            );

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            toast.success("Profile updated successfully :)");
        },
        onError: (error) => {
            console.error("Error updating profile:", error.response || error.message);
            toast.error("Failed to update profile. Please try again.");
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('name', formInfo.name);
        formdata.append('email', formInfo.email);
        formdata.append('city', formInfo.city);
        if (formInfo.image) {
            formdata.append('image', formInfo.image);
        }
        updateProfileMutation.mutate(formdata);
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
        e.preventDefault();
        if (updatePassword.newPassword !== updatePassword.cNewPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        updatePasswordMutation.mutate();
    }

    if (user)
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
                            <label style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div className="image-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={
                                            (user.profileImage?.secure_url && !formInfo.image) ? user.profileImage.secure_url : formInfo.image ? URL.createObjectURL(formInfo.image) : noUserImage
                                        }
                                        alt="img"
                                        style={{
                                            width: '150px',
                                            aspectRatio: '1/1',
                                            objectFit: 'cover',
                                            objectPosition: "top",
                                            borderRadius: "50%",
                                            boxShadow: "1px 2px 6px 2px rgba(0, 0, 0, 0.2)",
                                            marginBlock: "1rem"
                                        }}

                                    />
                                    <MdAddAPhoto
                                        style={{
                                            position: 'absolute',
                                            bottom: '19px',
                                            right: '30px',
                                            backgroundColor: "gray",
                                            padding:"5px",
                                            width:"20%",
                                            height:"15%",
                                            borderRadius: '50%',
                                            boxShadow: "1px 2px 6px 2px rgba(0, 0, 0, 0.2)",
                                            color:"black"
                                        }} />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                            <div className="inputBox">
                                <label>
                                    <span>Name</span>
                                    <input
                                        type="text"
                                        value={formInfo.name}
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
                                        value={formInfo.email}
                                    />
                                </label>
                            </div>
                            <div className="inputBox">
                                <label>
                                    <span>City</span>
                                    <input
                                        type="text"
                                        value={formInfo.city}
                                        onChange={handleChange}
                                        name="city"
                                    />
                                </label>
                            </div>
                            <button className="updateButton" type="submit">
                                {updateProfileMutation.isPending ? (
                                    <Loadingcircle color="black" size={20} />
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
                                    <Loadingcircle color="black" size={20} />
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
