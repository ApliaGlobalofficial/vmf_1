// import { useEffect, useState } from "react";

// const RequestedMoney = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [newStatus, setNewStatus] = useState("");

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Authentication token not found.");
//       setLoading(false);
//       return;
//     }

//     fetch(`${import.meta.env.VITE_API_URL}/wallet_request", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setRequests(Array.isArray(data) ? data : []);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Fetch error:", err);
//         setError("Failed to fetch wallet request data.");
//         setLoading(false);
//       });
//   };

//   const handleStatusClick = (id, currentStatus) => {
//     setEditingId(id);
//     setNewStatus(currentStatus);
//   };

//   const handleStatusChange = (e) => {
//     setNewStatus(e.target.value);
//   };

//   const handleStatusUpdate = async (id) => {
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to update status");
//       }

//       setEditingId(null);
//       fetchRequests(); // Refresh list
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update status");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 pl-64 pr-4 pt-8">
//       <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
//         <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
//           Requested Money - Distributor List
//         </h2>

//         {loading && <p className="text-center text-gray-500">Loading data...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {!loading && !error && (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="px-4 py-3 text-left">#</th>
//                   <th className="px-4 py-3 text-left">Account No</th>
//                   <th className="px-4 py-3 text-left">IFSC</th>
//                   <th className="px-4 py-3 text-left">Requested Amount</th>
//                   <th className="px-4 py-3 text-left">Request Date</th>
//                   {/* <th className="px-4 py-3 text-left">Sent Date</th> */}
//                   <th className="px-4 py-3 text-left">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {requests.map((req, index) => (
//                   <tr key={req.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-2">{index + 1}</td>
//                     <td className="px-4 py-2">{req.account_number}</td>
//                     <td className="px-4 py-2">{req.ifsc_code}</td>
//                     <td className="px-4 py-2 font-semibold text-blue-700">₹ {req.requested_amount}</td>
//                     <td className="px-4 py-2">{req.requested_amount_date}</td>
//                     {/* <td className="px-4 py-2">{req.sent_amount_date || "-"}</td> */}
//                     <td className="px-4 py-2">
//                       {editingId === req.id ? (
//                         <div className="flex items-center gap-2">
//                           <select
//                             value={newStatus}
//                             onChange={handleStatusChange}
//                             className="border border-gray-300 rounded px-2 py-1 text-sm"
//                           >
//                             {[
//                               "Pending",
//                               "Approved",
//                               "Rejected",
//                               "Uploaded",
//                               "Completed",
//                               "Sent",
//                               "Received",
//                             ].map((status) => (
//                               <option key={status} value={status}>
//                                 {status}
//                               </option>
//                             ))}
//                           </select>
//                           <button
//                             onClick={() => handleStatusUpdate(req.id)}
//                             className="bg-green-500 text-white px-2 py-1 rounded text-xs"
//                           >
//                             Save
//                           </button>
//                         </div>
//                       ) : (
//                         <span
//                           className="text-blue-600 cursor-pointer hover:underline"
//                           onClick={() => handleStatusClick(req.id, req.status)}
//                         >
//                           {req.status}
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RequestedMoney;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RequestedMoney = () => {
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/wallet_request`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (id, currentStatus) => {
    setEditingId(id);
    setNewStatus(currentStatus);
  };

  const handleStatusChange = (e) => setNewStatus(e.target.value);
  const handleFileChange = (e) => setScreenshotFile(e.target.files[0]);

  const handleStatusUpdate = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/wallet_request/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (screenshotFile) {
        const formData = new FormData();
        formData.append("payment_screenshot", screenshotFile);

        await axios.post(`${import.meta.env.VITE_API_URL}/wallet_request/${id}/upload-screenshot`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setEditingId(null);
      setScreenshotFile(null);
      fetchRequests();
    } catch (err) {
      alert("Failed to update status or upload screenshot.");
    }
  };

  const handleSendMoney = (req) => {
    navigate(`/send-money/${req.id}`, { state: req });
  };

  return (
    <div className="min-h-screen bg-gray-100 pl-64 pr-4 pt-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Requested Money - Distributor List</h2>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-[#F88F2A] text-white">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Account No</th>
                  <th className="px-3 py-2">IFSC</th>
                  <th className="px-3 py-2">UPI ID</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Request Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Payment Screenshot</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req, index) => (
                  <tr key={req.id}>
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{req.account_number}</td>
                    <td className="px-3 py-2">{req.ifsc_code}</td>
                    <td className="px-3 py-2">{req.upi_id}</td>
                    <td className="px-3 py-2">₹ {req.requested_amount}</td>
                    <td className="px-3 py-2">{req.requested_amount_date}</td>
                    <td className="px-3 py-2">
                      {editingId === req.id ? (
                        <select
                          value={newStatus}
                          onChange={handleStatusChange}
                          className="border px-2 py-1 rounded"
                        >
                          {["Pending", "Approved", "Rejected", "Uploaded", "Completed", "Sent", "Received"].map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          onClick={() => handleStatusClick(req.id, req.status)}
                          className="text-blue-600 underline cursor-pointer"
                        >
                          {req.status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {req.payment_screenshot ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${req.payment_screenshot}`}
                          alt="Uploaded Screenshot"
                          className="w-16 h-16 object-contain rounded border"
                        />
                      ) : editingId === req.id ? (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editingId === req.id ? (
                        <button
                          onClick={() => handleStatusUpdate(req.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSendMoney(req)}
                          className="bg-[#F88F2A] text-white px-3 py-1 rounded text-xs hover:bg-orange-600"
                        >
                          Send Money
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedMoney;



