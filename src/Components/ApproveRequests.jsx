import React, { useEffect, useState } from 'react';

const ApproveRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  const fetchRequests = () => {
    fetch(`${import.meta.env.VITE_API_URL}/wallet_request`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setRequests)
      .catch(console.error);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/wallet_request/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'Approved' })
    });
    fetchRequests();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Wallet Requests</h2>
      {requests.map(req => (
        <div key={req.id} className="border p-4 rounded mb-2">
          <p><strong>Account:</strong> {req.account_number}</p>
          <p><strong>IFSC:</strong> {req.ifsc_code}</p>
          <p><strong>Amount:</strong> ₹{req.requested_amount}</p>
          <p><strong>Status:</strong> {req.status}</p>
          {req.status === 'Pending' && (
            <button onClick={() => approve(req.id)} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApproveRequests;