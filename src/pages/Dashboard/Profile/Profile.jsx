import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserProvider";
import Tabs from "@mui/material/Tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../../Components/Loading/Loading";

export default function Profile() {
    const { user, token } = useContext(UserContext);
    const queryClient = useQueryClient();
    const [formInfo, setFormInfo] = useState({
        name: user.name,
        email: user.email,
        city: user.city,
    });
    function handleChange(e) {
        const { value, name } = e.target;
        setFormInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
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
            toast.success("profile updated successfully");
        },
    });
    async function handleSubmit(e) {
        e.preventDefault();
        updateProfileMutation.mutate();
    }
    return (
        <>
            <h2>personal detailes</h2>

            <div>
                <form onSubmit={handleSubmit}>
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

                    <button type="submit">
                        {updateProfileMutation.isPending ? (
                            <Loading color="black" size={20} />
                        ) : (
                            "update"
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}
