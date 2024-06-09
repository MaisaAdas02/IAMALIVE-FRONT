import React, { useContext } from "react";
import { UserContext } from "../../../context/UserProvider";
import Tabs from '@mui/material/Tabs';


export default function Profile() {
     const { user } = useContext(UserContext);

     return (
          <>
          
          <h2>personal detailes</h2>
          
          <div>
               <p>{user.name}</p>
               <p>{user.email}</p>
               <p>{user.city}</p>
          </div></>
     );
}
