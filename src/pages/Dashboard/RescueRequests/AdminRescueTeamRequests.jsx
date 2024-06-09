import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../../context/UserProvider';
import Loading from '../../../Components/Loading/Loading';
import { toast } from 'sonner';
import './AdminRescueTeamRequests.css';

const AdminRescueTeamRequests = () => {
    const { token } = useContext(UserContext);
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const {
        data: requests,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['user-requests'],
        queryFn: async () => {
            const { data } = await axios.get(
                `/rescueTeam/pendingRescueTeams`,
                {
                    headers: {
                        Authorization: `IAMALIVE__${token}`,
                    },
                }
            );
            return data.pendingRescueTeams;
        },
    });

    const acceptMutation = useMutation({
        mutationFn: async (userId) => {
            await axios.put(
                `/rescueTeam/approveRescueTeam/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `IAMALIVE__${token}`,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-requests"]
            });
            toast.success("User accepted successfully!");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (userId) => {
            await axios.delete(
                `/rescueTeam/deleteRescueTeam/${userId}`,
                {
                    headers: {
                        Authorization: `IAMALIVE__${token}`,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-requests"]
            });
            toast.success("Request Deleted!");
        },

    });

    if (isLoading) {
        return <Loading size={30} color="black" />;
    }
    if (requests && requests.length === 0) {
        return <p>No requests found</p>;
    }
    if (error) {
        toast.error(error.response.data.message || "Error!");
        return null; // Return null to prevent further rendering
    }

    // Pagination logic
    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const currentRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='rescue-requests'>
            <h2>Rescue Team Requests</h2>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>City</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map(req => (
                            <tr key={req._id}>
                                <td><p>{req.name}</p></td>
                                <td><p>{req.email}</p></td>
                                <td><p>{req.city}</p></td>
                                <td className='actionbuttons'>
                                    <button
                                        className='accept'
                                        onClick={() => acceptMutation.mutate(req._id)}
                                        disabled={acceptMutation.isPending}
                                    >
                                        {acceptMutation.isPending ? "Loading..." : "Accept"}
                                    </button>
                                    <button className='delete'
                                        onClick={() => deleteMutation.mutate(req._id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        {deleteMutation.isPending ? "Loading..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminRescueTeamRequests;
