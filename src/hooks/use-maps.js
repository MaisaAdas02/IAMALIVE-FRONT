import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";

// Custom Hook
export function useGetMapData() {
    const { token } = useContext(UserContext);
    return useQuery({
        queryKey: ["victimsLocations"],
        queryFn: async () => {
            const { data } = await axios.get("/rescueTeam/viewMap", {
                headers: {
                    Authorization: `IAMALIVE__${token}`,
                },
            });
            return data.victims || [];
        },
    });
}
