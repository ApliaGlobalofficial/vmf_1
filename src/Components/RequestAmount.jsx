import React, { useEffect, useState } from 'react';
import { FaWallet } from 'react-icons/fa';

const RequestAmount = () => {
  const [formData, setFormData] = useState({
    account_number: '',
    ifsc_code: '',
    upi_id: '',
    qr_code: '',
    requested_amount: '',
  });
  const [accountRequests, setAccountRequests] = useState([]);
  const [walletRequests, setWalletRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showAmountForm, setShowAmountForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const token = localStorage.getItem('token');

  const fetchAccountRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wallet_account_requests/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAccountRequests(data);
    } catch (err) {
      setMessage('❌ Failed to load account requests.');
    }
  };

  const fetchWalletRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWalletRequests(data);
    } catch (err) {
      setMessage('❌ Failed to load wallet requests.');
    }
  };

  useEffect(() => {
    fetchAccountRequests();
    fetchWalletRequests();
  }, []);

  const handleAccountInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, qr_code: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const submitNewAccountRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wallet_account_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          upi_id: formData.upi_id,
          qr_code: formData.qr_code,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Account request sent. Please wait for admin approval.');
        setShowAccountForm(false);
        fetchAccountRequests();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage('❌ Error submitting account request.');
    } finally {
      setLoading(false);
    }
  };

  const submitAmountRequest = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return;

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...selectedAccount,
          requested_amount: formData.requested_amount,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Amount sent successfully!');
        setShowAmountForm(false);
        fetchWalletRequests();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage('❌ Failed to send amount.');
    } finally {
      setLoading(false);
    }
  };

  const approvedAccounts = accountRequests.filter((a) => a.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FaWallet className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-blue-700">Wallet Requests</h2>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => {
              setShowAccountForm(true);
              setShowAmountForm(false);
              setFormData({});
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Request New Account
          </button>

          {approvedAccounts.length > 0 && (
            <button
              onClick={() => {
                const last = approvedAccounts[approvedAccounts.length - 1];
                setSelectedAccount(last);
                setFormData({ ...last, requested_amount: '' });
                setShowAmountForm(true);
                setShowAccountForm(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🔁 Send to Last Approved Account
            </button>
          )}
        </div>

        {/* Request New Account Form */}
        {showAccountForm && (
          <form onSubmit={submitNewAccountRequest} className="space-y-4 mb-6">
            <input
              type="text"
              name="account_number"
              placeholder="Account Number"
              required
              onChange={handleAccountInput}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="text"
              name="ifsc_code"
              placeholder="IFSC Code"
              required
              onChange={handleAccountInput}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="text"
              name="upi_id"
              placeholder="UPI ID (Optional)"
              onChange={handleAccountInput}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {formData.qr_code && (
              <img src={formData.qr_code} alt="QR Preview" className="h-24 mx-auto" />
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
            >
              {loading ? 'Submitting...' : 'Submit Account Request'}
            </button>
          </form>
        )}

        {/* Send Amount to Approved Account Form */}
        {showAmountForm && (
          <form onSubmit={submitAmountRequest} className="space-y-4 mb-6">
            <input
              type="text"
              value={formData.account_number || ''}
              readOnly
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
            <input
              type="text"
              value={formData.ifsc_code || ''}
              readOnly
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
            <input
              type="text"
              value={formData.upi_id || ''}
              readOnly
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
            <input
              type="number"
              name="requested_amount"
              placeholder="Enter Amount"
              onChange={handleAccountInput}
              required
              className="w-full border px-4 py-2 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
            >
              {loading ? 'Sending...' : 'Send Amount'}
            </button>
          </form>
        )}

        {message && (
          <p className={`text-center font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestAmount;
