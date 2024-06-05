import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
     const [token, setToken] = useState(
          localStorage.token ? localStorage.token : ""
     );
     const [user, setUser] = useState({});

     useEffect(() => {
          localStorage.setItem("token", token);
     }, [token]);

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
