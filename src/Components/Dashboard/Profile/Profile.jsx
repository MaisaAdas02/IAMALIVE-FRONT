import React, { useContext } from "react";
import { UserContext } from "../../../context/UserProvider";

export default function Profile() {
     const { user } = useContext(UserContext);

     return (
          <div>
               <p>{user.name}</p>
               <p>{user.email}</p>
          </div>
     );
}
