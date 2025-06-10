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

import React, { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';

const RequestAmount = () => {
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

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/wallet_request/my`, { headers })
      .then(res => res.json())
      .then(data => setRequests(data || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, qr_code: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('✅ New account request submitted. Wait for admin approval.');
        setRequests([...requests, result]);
        setFormData({
          account_number: '',
          ifsc_code: '',
          requested_amount: '',
          upi_id: '',
          qr_code: '',
        });
      } else {
        setMessage(result.message || '❌ Submission failed.');
      }
    } catch (error) {
      setMessage('❌ An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (id) => {
    const amount = prompt('Enter amount to resend:');
    if (!amount) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ requested_amount: amount }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Amount resent successfully.');
        setRequests(prev => prev.map(r => (r.id === id ? result : r)));
      } else {
        setMessage(result.message || '❌ Failed to resend.');
      }
    } catch (error) {
      setMessage('❌ Error occurred during resend.');
    }
  };

  const last = requests[requests.length - 1];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-8">
      {/* Wallet Request Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaWallet className="text-2xl text-blue-600" />
          <h2 className="text-xl font-bold text-blue-700">Wallet Account Request</h2>
        </div>

        {last && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p><strong>Account No:</strong> {last.account_number}</p>
            <p><strong>IFSC:</strong> {last.ifsc_code}</p>
            <p><strong>Amount:</strong> ₹{last.requested_amount}</p>
            <p><strong>Status:</strong> {last.status}</p>
            <button
              onClick={() => handleResend(last.id)}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Send Again
            </button>
          </div>
        )}

        <form onSubmit={handleAddNew} className="space-y-4">
          <input name="account_number" value={formData.account_number} onChange={handleChange} required placeholder="Account Number" className="w-full px-3 py-2 border rounded" />
          <input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} required placeholder="IFSC Code" className="w-full px-3 py-2 border rounded" />
          <input name="requested_amount" type="number" value={formData.requested_amount} onChange={handleChange} required placeholder="Requested Amount" className="w-full px-3 py-2 border rounded" />
          <input name="upi_id" value={formData.upi_id} onChange={handleChange} placeholder="UPI ID (optional)" className="w-full px-3 py-2 border rounded" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-3 py-2 border rounded" />

          {formData.qr_code && (
            <img src={formData.qr_code} alt="QR Code Preview" className="w-32 h-32 object-cover rounded shadow mx-auto" />
          )}

          <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded" disabled={loading}>
            {loading ? 'Submitting...' : 'Add New Account'}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-blue-700 font-medium">{message}</div>}
      </div>

      {/* Request History */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Previous Requests</h3>
        {requests.length === 0 ? (
          <p className="text-center text-gray-500">No previous requests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {requests.map((req) => (
              <div key={req.id} className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                <p><strong>Account:</strong> {req.account_number}</p>
                <p><strong>IFSC:</strong> {req.ifsc_code}</p>
                <p><strong>Amount:</strong> ₹{req.requested_amount}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${req.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>{req.status}</span></p>
                <button
                  onClick={() => handleResend(req.id)}
                  className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Send Again
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
