import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserProvider";
import Loading from "../../../Components/Loading/Loading";
import { toast } from "sonner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import "./VictimData.css";
import StatusColor from "../../../Components/StatusColor/StatusColor";
import HeartRate from "../../../Components/HeartRate/HeartRate";

const VictimData = () => {
    const { token } = useContext(UserContext);
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const {
        data: victims,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["victimsdata"],
        queryFn: async () => {
            const { data } = await axios.get("/rescueTeam/allVictims", {
                headers: {
                    Authorization: `IAMALIVE__${token}`,
                },
            });
            return data.victims;
        },
    });

    const deleteDeadMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/rescueTeam/deadVictims`, {
                headers: {
                    Authorization: `IAMALIVE__${token}`,
                },
            });
            return data;
        },
        onSuccess: ({ message }) => {
            queryClient.invalidateQueries({
                queryKey: ["victimsdata"],
            });
            toast.success(message || "Dead Users Deleted!");
        },
    });

    const handleDeleteClick = () => {
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure you want to delete these items?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => deleteDeadMutation.mutate(),
                },
                {
                    label: "Cancel",
                    onClick: () => { },
                },
            ],
            overlayClassName: "overlay-custom",
            closeOnClickOutside: true,
            closeOnEscape: true,
        });
    };

    if (isLoading) {
        return <Loading size={30} color="black" />;
    }

    if (victims && victims.length == 0) {
        return <p>No Victims!</p>;
    }

    if (error) {
        toast.error(error.response.data.message || "Error !");
    }
    // Pagination logic
    const totalPages = Math.ceil(victims.length / itemsPerPage);
    const currentRequests =
        victims.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        ) || [];
    
    return (
        <div className="victims-data">
            <div className="headerdiv">
                <h2>Victims Data</h2>
                <button className="deletedead" onClick={handleDeleteClick}>
                    {deleteDeadMutation.isPending ? "Loading..." : "Delete"}
                </button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>City</th>
                            <th>Longitude</th>
                            <th>Latitude</th>
                            <th>HeartRate</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map((req) => (
                            <tr key={req._id}>
                                <td>
                                    <span className="cell-header">Name:</span> {req.name}
                                </td>
                                <td>
                                    <span className="cell-header">City:</span> {req.city}
                                </td>
                                <td>
                                    <span className="cell-header">Longitude:</span> {req.location ? req.location.longitude : "N/A"}
                                </td>
                                <td>
                                    <span className="cell-header">Latitude:</span> {req.location ? req.location.latitude : "N/A"}
                                </td>
                                <td> <span className="cell-header">HeartRate:</span>
                                    {req.heartRate !== 0 ? (
                                        <HeartRate value={req.heartRate} />
                                    ) : (
                                        <p>{req.heartRate}</p>
                                    )}
                                </td>
                                <td>
                                    <span className="cell-header">Status:</span> <StatusColor status={req.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default VictimData;
