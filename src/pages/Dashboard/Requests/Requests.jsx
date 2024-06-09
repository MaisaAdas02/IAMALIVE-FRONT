import React, { useContext, useState } from 'react'
import { UserContext } from '../../../context/UserProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../../../Components/Loading/Loading';
import { toast } from 'sonner';

function Requests() {
  const { token } = useContext(UserContext)
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
  const {
    data: sosvictims,
    isLoading,
    error,
} = useQuery({
    queryKey: ['sos-data'],
    queryFn: async () => {
      const { data } = await axios.get('/rescueTeam/sosVictims', {
        headers: {
          Authorization: `IAMALIVE__${token}`
        }
      })
      return data.victims;
    },
  });



  if (isLoading) {
    return (
      <Loading size={30} color="black" />
    )
  }

  if (error) {
    toast.error(error.response.data.message || "Error !")
  }

  if (sosvictims && sosvictims.length == 0) {
    return (
      <p>
        No Victim Requsts!
      </p>
    )
  }

   // Pagination logic
  const totalPages = Math.ceil(sosvictims.length / itemsPerPage);
  const currentRequests = sosvictims.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage )|| [];

  return (
        <div className='sosvictims-data'>
            <div className='headerdiv'>
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
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map(req => (
                            <tr key={req._id}>
                                <td><p>{req.name}</p></td>
                                <td><p>{req.city}</p></td>
                                <td><p>{req.location.longitude}</p></td>
                                <td><p>{req.location.latitude}</p></td>
                                <td><p>{req.heartRate}</p></td>
                                
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
}

export default Requests