import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../../context/UserProvider';
import Loading from '../../../Components/Loading/Loading';
import { toast } from 'sonner';
import './AdminRescueTeamData.css';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';


const AdminRescueTeamData = () => {
  const { token } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRescueData = async () => {
    const { data } = await axios.get("/rescueTeam/getAllRescueTeamProfiles", {
      headers: {
        Authorization: `IAMALIVE__${token}`,
      },
    });
    return data.rescueTeams || [];
  };
  console.log(fetchRescueData())
  const {
    data: rescueData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rescue-Data"],
    queryFn: fetchRescueData,
  });

  const deleteRescueMutation = useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`/rescueTeam/deleteRescueTeam/${userId}`, {
        headers: {
          Authorization: `IAMALIVE__${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rescue-Data"],
      });
      toast.success("User deleted successfully!");
    },
  });

  const handleDelete = (userId) => {
    confirmAlert({
      title: "Confirm to delete ",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteRescueMutation.mutate(userId),
        },
        {
          label: "cancel",
          onClick: () => { },
        },
      ],
      overlayClassName: "overlay-custom",
      closeOnClickOutside: true,
      closeOnEscape: true,
    });
  };
  if (isLoading) {
    return <Loading size={30} color="black" />
  }
  if (error) {
    toast.error(error.response?.data?.message || error.message || "Error!")
    return null; // Return null to prevent further rendering
  }

  if (!Array.isArray(rescueData) || rescueData.length === 0) {
    return <p>No users found</p>;
  }

  // Pagination logic
  const totalPages = Math.ceil(rescueData.length / itemsPerPage);
  const currentData = rescueData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];



  return (
    <div className='rescue-requests'>
      <h2>Rescue Team Data</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(req => (
              <tr key={req._id}>
                <td><span className="cell-header">Name:</span> {req.name}</td>
                <td><span className="cell-header">Email:</span> {req.email}</td>
                <td><span className="cell-header">City:</span> {req.city}</td>
                <td className='actionbuttons'>
                  <PersonRemoveIcon className='deleteIcon'
                    onClick={() => handleDelete(req._id)}
                    disabled={deleteRescueMutation.isLoading}
                    color='error' />
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

export default AdminRescueTeamData