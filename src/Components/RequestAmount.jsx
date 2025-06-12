// import React, { useState, useEffect } from 'react';
// import { FaWallet } from 'react-icons/fa';

// const RequestAmount = () => {
//   const [formData, setFormData] = useState({
//     account_number: '',
//     ifsc_code: '',
//     requested_amount: '',
//     upi_id: '',
//     qr_code: '',
//   });
//   const [requests, setRequests] = useState([]);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   };

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/wallet_request/my`, { headers })
//       .then(res => res.json())
//       .then(data => setRequests(data || []))
//       .catch(err => console.error(err));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData(prev => ({ ...prev, qr_code: reader.result }));
//     };
//     if (file) reader.readAsDataURL(file);
//   };

//   const handleAddNew = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setMessage('New account request submitted. Wait for admin approval.');
//         setRequests([...requests, result]);
//         setFormData({ account_number: '', ifsc_code: '', requested_amount: '', upi_id: '', qr_code: '' });
//       } else {
//         setMessage(result.message || 'Submission failed.');
//       }
//     } catch (error) {
//       setMessage('An error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async (id) => {
//     const amount = prompt('Enter amount to resend:');
//     if (!amount) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request/${id}`, {
//         method: 'PATCH',
//         headers,
//         body: JSON.stringify({ requested_amount: amount }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setMessage('Amount resend successfully.');
//         setRequests(prev => prev.map(r => (r.id === id ? result : r)));
//       } else {
//         setMessage(result.message || 'Failed to resend.');
//       }
//     } catch (error) {
//       setMessage('Error occurred during resend.');
//     }
//   };

//   const last = requests[requests.length - 1];

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       <div className="bg-white shadow-lg p-6 rounded-xl max-w-xl w-full">
//         <div className="flex items-center justify-center mb-4">
//           <FaWallet className="text-2xl text-blue-600 mr-2" />
//           <h2 className="text-xl font-bold text-blue-700">Wallet Account Request</h2>
//         </div>

//         {last && (
//           <div className="mb-4 bg-blue-50 p-4 rounded-lg text-sm">
//             <p><strong>Account No:</strong> {last.account_number}</p>
//             <p><strong>IFSC:</strong> {last.ifsc_code}</p>
//             <p><strong>Amount:</strong> ₹{last.requested_amount}</p>
//             <p><strong>Status:</strong> {last.status}</p>
//             <div className="flex gap-4 mt-2">
//               <button
//                 onClick={() => handleResend(last.id)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//               >Send Again</button>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleAddNew} className="space-y-3">
//           <input name="account_number" value={formData.account_number} onChange={handleChange} required placeholder="Account Number" className="w-full px-3 py-2 border rounded" />
//           <input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} required placeholder="IFSC Code" className="w-full px-3 py-2 border rounded" />
//           <input name="requested_amount" type="number" value={formData.requested_amount} onChange={handleChange} required placeholder="Requested Amount" className="w-full px-3 py-2 border rounded" />
//           <input name="upi_id" value={formData.upi_id} onChange={handleChange} placeholder="UPI ID (optional)" className="w-full px-3 py-2 border rounded" />
//           <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-3 py-2 border rounded" />
//           <button type="submit" className="w-full py-2 bg-green-600 text-white rounded" disabled={loading}>
//             {loading ? 'Submitting...' : 'Add New Account'}
//           </button>
//         </form>

//         {message && <div className="mt-4 text-center text-blue-700 font-semibold">{message}</div>}
//       </div>
//       {/* Request History */}
//         <div className="bg-white p-6 shadow-xl rounded-2xl">
//           <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Previous Requests</h3>
//           {requests.length === 0 ? (
//             <p className="text-center text-gray-500">No previous requests found.</p>
//           ) : (
//             <div className="space-y-4 max-h-[400px] overflow-y-auto">
//               {requests.map((req) => (
//                 <div
//                   key={req.id}
//                   className="border border-blue-200 bg-blue-50 p-4 rounded-xl shadow-sm"
//                 >
//                   <p><strong>Account No:</strong> {req.account_number}</p>
//                   <p><strong>IFSC Code:</strong> {req.ifsc_code}</p>
//                   <p><strong>Requested:</strong> ₹{req.requested_amount}</p>
//                   <p>
//                     <strong>Status:</strong>{' '}
//                     <span className={`font-semibold ${req.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
//                       {req.status}
//                     </span>
//                   </p>
//                   <div className="mt-3 flex justify-end">
//                     <button
//                       onClick={() => handleResend(req.id)}
//                       className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
//                     >
//                       Send Again
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>


    
//   );
// };

// export default RequestAmount;

// import React, { useState, useEffect } from 'react';
// import { FaWallet } from 'react-icons/fa';

// const RequestAmount = () => {
//   const [formData, setFormData] = useState({
//     account_number: '',
//     ifsc_code: '',
//     requested_amount: '',
//     upi_id: '',
//     qr_code: '',
//   });
//   const [requests, setRequests] = useState([]);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   };

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/wallet_request/my`, { headers })
//       .then(res => res.json())
//       .then(data => setRequests(data || []))
//       .catch(err => console.error(err));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData(prev => ({ ...prev, qr_code: reader.result }));
//     };
//     if (file) reader.readAsDataURL(file);
//   };

//   const handleAddNew = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setMessage('✅ New account request submitted. Wait for admin approval.');
//         setRequests([...requests, result]);
//         setFormData({
//           account_number: '',
//           ifsc_code: '',
//           requested_amount: '',
//           upi_id: '',
//           qr_code: '',
//         });
//       } else {
//         setMessage(result.message || '❌ Submission failed.');
//       }
//     } catch (error) {
//       setMessage('❌ An error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async (id) => {
//     const amount = prompt('Enter amount to resend:');
//     if (!amount) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request/${id}`, {
//         method: 'PATCH',
//         headers,
//         body: JSON.stringify({ requested_amount: amount }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setMessage('✅ Amount resent successfully.');
//         setRequests(prev => prev.map(r => (r.id === id ? result : r)));
//       } else {
//         setMessage(result.message || '❌ Failed to resend.');
//       }
//     } catch (error) {
//       setMessage('❌ Error occurred during resend.');
//     }
//   };

//   const last = requests[requests.length - 1];

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-8">
//       {/* Wallet Request Form */}
//       <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
//         <div className="flex items-center justify-center gap-2 mb-4">
//           <FaWallet className="text-2xl text-blue-600" />
//           <h2 className="text-xl font-bold text-blue-700">Wallet Account Request</h2>
//         </div>

//         {last && (
//           <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
//             <p><strong>Account No:</strong> {last.account_number}</p>
//             <p><strong>IFSC:</strong> {last.ifsc_code}</p>
//             <p><strong>Amount:</strong> ₹{last.requested_amount}</p>
//             <p><strong>Status:</strong> {last.status}</p>
//             <button
//               onClick={() => handleResend(last.id)}
//               className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
//             >
//               Send Again
//             </button>
//           </div>
//         )}

//         <form onSubmit={handleAddNew} className="space-y-4">
//           <input name="account_number" value={formData.account_number} onChange={handleChange} required placeholder="Account Number" className="w-full px-3 py-2 border rounded" />
//           <input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} required placeholder="IFSC Code" className="w-full px-3 py-2 border rounded" />
//           <input name="requested_amount" type="number" value={formData.requested_amount} onChange={handleChange} required placeholder="Requested Amount" className="w-full px-3 py-2 border rounded" />
//           <input name="upi_id" value={formData.upi_id} onChange={handleChange} placeholder="UPI ID (optional)" className="w-full px-3 py-2 border rounded" />
//           <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-3 py-2 border rounded" />

//           {formData.qr_code && (
//             <img src={formData.qr_code} alt="QR Code Preview" className="w-32 h-32 object-cover rounded shadow mx-auto" />
//           )}

//           <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded" disabled={loading}>
//             {loading ? 'Submitting...' : 'Add New Account'}
//           </button>
//         </form>

//         {message && <div className="mt-4 text-center text-blue-700 font-medium">{message}</div>}
//       </div>

//       {/* Request History */}
//       <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
//         <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Previous Requests</h3>
//         {requests.length === 0 ? (
//           <p className="text-center text-gray-500">No previous requests found.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
//             {requests.map((req) => (
//               <div key={req.id} className="p-4 border border-gray-200 rounded-lg bg-blue-50">
//                 <p><strong>Account:</strong> {req.account_number}</p>
//                 <p><strong>IFSC:</strong> {req.ifsc_code}</p>
//                 <p><strong>Amount:</strong> ₹{req.requested_amount}</p>
//                 <p><strong>Status:</strong> <span className={`font-semibold ${req.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>{req.status}</span></p>
//                 <button
//                   onClick={() => handleResend(req.id)}
//                   className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
//                 >
//                   Send Again
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RequestAmount;

import React, { useState, useEffect } from 'react';
import { FaWallet, FaPlusCircle, FaRegEdit, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

const RequestAmount = () => {
  const API = import.meta.env.VITE_API_URL;
  const [width, height] = useWindowSize();

  const [formData, setFormData] = useState({
    account_number: '',
    ifsc_code: '',
    requested_amount: '',
    upi_id: '',
    qr_code: '',
  });
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRequestId, setEditRequestId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const token = localStorage.getItem('token');
  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${API}/wallet_request/my`, authHeaders);
        const sortedRequests = response.data.sort((a, b) =>
          new Date(b.requested_amount_date) - new Date(a.requested_amount_date)
        );
        setRequests(sortedRequests || []);
      } catch (err) {
        console.error("Error fetching wallet requests:", err);
        setMessage("❌ Failed to load previous requests.");
      }
    };
    fetchRequests();
  }, [API, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "requested_amount") {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^0-9.]/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, qr_code: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let response;
      let result;

      if (isEditing) {
        response = await axios.patch(`${API}/wallet_request/${editRequestId}`, {
          requested_amount: formData.requested_amount,
        }, authHeaders);
        result = response.data;
        setMessage('✅ 🎉 Amount successfully updated! 🎈✨');
      } else {
        response = await axios.post(`${API}/wallet_request`, formData, authHeaders);
        result = response.data;
        setMessage('✅ 🎉 Request successfully submitted! 🎈✨');
      }

      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 60000);

      if (isEditing) {
        setRequests(prev => prev.map(r => (r.id === editRequestId ? result : r)));
      } else {
        setRequests(prev => [result, ...prev]);
      }

      handleClearForm();

    } catch (error) {
      console.error("Submission/Update error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`❌ ${error.response.data.message || 'An error occurred.'}`);
      } else {
        setMessage('❌ An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      account_number: '',
      ifsc_code: '',
      requested_amount: '',
      upi_id: '',
      qr_code: '',
    });
    setIsEditing(false);
    setEditRequestId(null);
    setMessage('');
  };

  const handleResend = (req) => {
    setFormData({
      account_number: req.account_number || '',
      ifsc_code: req.ifsc_code || '',
      requested_amount: req.requested_amount || '',
      upi_id: req.upi_id || '',
      qr_code: req.qr_code || '',
    });
    setIsEditing(true);
    setEditRequestId(req.id);
    setMessage('');
  };

  return (
    <div className="ml-[250px] min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center gap-8 relative">

      {/* 🎉 Celebration Overlay */}
      {showCelebration && (
        <>
          <Confetti width={width} height={height} />
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-4xl font-bold mb-4 animate-bounce">🎉 Success!</h1>
            <p className="text-xl mb-6">Your request was processed successfully!</p>
            <p className="text-2xl animate-pulse">🎈✨💥🪔💸</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-6 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </>
      )}

      {/* 💳 Request Form */}
      <div className="bg-white dark:bg-orange-400 shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaWallet className="text-2xl text-orange-400 dark:text-orange-400" />
          <h2 className="text-xl font-bold text-orange-400 dark:text-orange-400">
            {isEditing ? 'Update Wallet Request' : 'New Wallet Request'}
          </h2>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} dark:${message.startsWith('✅') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="account_number" value={formData.account_number} onChange={handleChange}
            required={!isEditing} placeholder="Bank Account Number" disabled={isEditing}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200" />
          <input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange}
            required={!isEditing} placeholder="IFSC Code" disabled={isEditing}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200" />
          <input name="requested_amount" type="number" value={formData.requested_amount} onChange={handleChange}
            required placeholder="Requested Amount (e.g., 500.00)" step="0.01"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200" />
          <input name="upi_id" value={formData.upi_id} onChange={handleChange}
            placeholder="UPI ID (optional)" disabled={isEditing}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200" />

          <div className="flex items-center gap-4">
            <label htmlFor="qr_code_upload" className="block text-gray-700 dark:text-gray-300 font-medium">
              Upload QR Code (optional):
            </label>
            <input type="file" id="qr_code_upload" accept="image/*" onChange={handleImageUpload}
              disabled={isEditing}
              className="flex-grow file:py-2 file:px-4 file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-300" />
          </div>

          {formData.qr_code && (
            <div className="relative w-40 h-40 mx-auto border rounded-md overflow-hidden">
              <img src={formData.qr_code} alt="QR Code Preview" className="w-full h-full object-contain" />
              {!isEditing && (
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, qr_code: '' }))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                  <FaTimesCircle />
                </button>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button type="submit"
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
              disabled={loading}>
              {loading ? 'Processing...' : (isEditing ? 'Update Amount' : 'Add New Account')}
            </button>
            {isEditing && (
              <button type="button" onClick={handleClearForm}
                className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md">
                <FaPlusCircle className="inline-block mr-2" /> Add New
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 📜 Request History */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-3xl">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6">Previous Requests</h3>
        {requests.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No previous requests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {requests.map((req) => (
              <div key={req.id} className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900">
                <div>
                  <p><strong>Account:</strong> {req.account_number}</p>
                  <p><strong>IFSC:</strong> {req.ifsc_code}</p>
                  <p><strong>Amount:</strong> ₹{Number(req.requested_amount).toFixed(2)}</p>
                  {req.upi_id && <p><strong>UPI ID:</strong> {req.upi_id}</p>}
                  <p><strong>Status:</strong>
                    <span className={`ml-1 font-semibold ${
                      req.status === 'Approved' ? 'text-green-600 dark:text-green-400' :
                      req.status === 'Pending' ? 'text-yellow-600 dark:text-yellow-400' :
                      req.status === 'Rejected' ? 'text-red-600 dark:text-red-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {req.status}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Requested on: {new Date(req.requested_amount_date).toLocaleString()}
                  </p>
                  {req.qr_code && (
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">QR Code:</p>
                      <img src={req.qr_code} alt="QR" className="w-24 h-24 mx-auto border rounded" />
                    </div>
                  )}
                </div>
                <button onClick={() => handleResend(req)}
                  className="mt-3 w-full py-1.5 bg-orange-400 hover:bg-orange-300 text-white rounded text-sm flex items-center justify-center gap-2">
                  <FaRegEdit /> Send Again
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestAmount;
