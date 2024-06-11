import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
    const { token } = useContext(UserContext);
    if (!token) {
        return <Navigate to="/" />;
    }
    return children;
};

export const PublicRoutes = () => {
    const { token } = useContext(UserContext);
    if (token) {
        return <Navigate to="/dashboard" />;
    }
    return <Outlet />;
};
