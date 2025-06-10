import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const SendMoney = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const request = location.state;

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setSending(true);
    setMessage("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wallet_request/send/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: request.requested_amount,
          account_number: request.account_number,
          ifsc_code: request.ifsc_code,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send money.");

      setMessage("✅ Money sent successfully!");
      setTimeout(() => navigate("/requested-money"), 2000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Send Money</h2>

        <div className="text-gray-700 space-y-2">
          <p><strong>Account Number:</strong> {request?.account_number || "N/A"}</p>
          <p><strong>IFSC Code:</strong> {request?.ifsc_code || "N/A"}</p>
          <p><strong>UPI ID:</strong> {request?.upi_id || "N/A"}</p>
          <p><strong>Requested Amount:</strong> ₹ {request?.requested_amount}</p>
          <p><strong>Requested Date:</strong> {request?.requested_amount_date || "N/A"}</p>
          <p><strong>Status:</strong> {request?.status || "Pending"}</p>
          {request?.qr_code && (
            <div>
              <strong>QR Code:</strong>
              <div className="mt-2">
                <img
                  src={request.qr_code}
                  alt="QR Code"
                  className="w-40 h-40 mx-auto border p-1 rounded"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-green-600 text-white w-full py-2 mt-6 rounded hover:bg-green-700"
        >
          {sending ? "Sending..." : "Send Money Now"}
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default SendMoney;
