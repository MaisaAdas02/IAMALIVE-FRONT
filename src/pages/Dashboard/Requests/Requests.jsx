import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../../Components/Loading/Loading";
import { toast } from "sonner";
import StatusColor from "../../../Components/StatusColor/StatusColor";
import HeartRate from "../../../Components/HeartRate/HeartRate";
import Loadingcircle from "../../../Components/Loadingcircle/Loadingcircle";
import './Requests.css';
function Requests() {
    const { token } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const {
        data: sosvictims,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["sos-data"],
        queryFn: async () => {
            const { data } = await axios.get("/rescueTeam/sosVictims", {
                headers: {
                    Authorization: `IAMALIVE__${token}`,
                },
            });
            return data.victims;
        },
    });

    if (isLoading) {
        return <Loading size={30} color="black" />;
    }

    if (error) {
        toast.error(error.response.data.message || "Error !");
    }

    if (sosvictims && sosvictims.length === 0) {
        return <p>No Victim Requests!</p>;
    }

    // Pagination logic
    const totalPages = Math.ceil(sosvictims.length / itemsPerPage);
    const currentRequests = sosvictims.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="sosvictims-data">
            <div className="headerdiv">
                <h2>SOSVictims Data</h2>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map((req) => (
                            <RequestRow key={req._id} req={req} />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Requests;

const RequestRow = ({ req }) => {
    const { token } = useContext(UserContext);
    const queryClient = useQueryClient();
    const changeStatusMutation = useMutation({
        mutationFn: async ({ status, userId }) => {
            const { data } = await axios.put(
                `/rescueTeam/victims/${userId}/updateRescueStatus`,
                {
                    status,
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
            queryClient.invalidateQueries({ queryKey: ["sos-data"] });
            queryClient.invalidateQueries({ queryKey: ["victimsdata"] });
            toast.success("Status updated successfully");
        },
    });

    const handleChangeStatus = (e) => {
        changeStatusMutation.mutate({
            status: e.target.value,
            userId: req._id,
        });
    };

    return (
        <tr>
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
            <td>
                <span className="cell-header">HeartRate:</span>
                {req.heartRate !== 0 ? (
                    <HeartRate value={req.heartRate} />
                ) : (
                    <p>{req.heartRate}</p>
                )}
            </td>
            <td>
                <span className="cell-header">Status:</span> <StatusColor status={req.status} />
            </td>
            <td>
                <span className="cell-header">Actions:</span>
                {changeStatusMutation.isPending ? (
                    <Loadingcircle color="black" size={20} />
                ) : (
                    <select className="custom-select" value={req.status} onChange={handleChangeStatus}>
                        <option value="danger">Danger</option>
                        <option value="inProgress">InProgress</option>
                        <option value="safe">Safe</option>
                    </select>
                )}
            </td>
        </tr>
    );
};
