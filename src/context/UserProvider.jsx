import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../Components/Loading/Loading";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.token ? localStorage.token : ""
    );
    const [user, setUser] = useState({});

    const { isLoading, error } = useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const { data, status } = await axios.get(`/rescueTeam/info`, {
                headers: {
                    Authorization: `IAMALIVE__${token}`,
                },
            });
            if (status === 200) {
                setUser(data.rescueTeam);
            }
            return data;
        },
        enabled: !!token,
    });

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    if (error) {
        const errorMessage =
            error.response?.data?.message || "Something went wrong!!";
        toast.error(errorMessage);
    }

    if (isLoading) {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Loading color="black" size={70} />
            </div>
        );
    }

    return (
        <UserContext.Provider
            value={{
                token,
                setToken,
                user,
                setUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
