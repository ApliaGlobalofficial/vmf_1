import { useEffect, useState } from "react";

const RequestedMoney = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Or sessionStorage.getItem("token")

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/wallet_request", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token here
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error("Invalid response:", data);
          setRequests([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch wallet request data.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pl-64 pr-4 pt-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Requested Money - Distributor List
        </h2>

        {loading && <p className="text-center text-gray-500">Loading data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Account No</th>
                  <th className="px-4 py-3 text-left">IFSC</th>
                  <th className="px-4 py-3 text-left">Requested Amount</th>
                  <th className="px-4 py-3 text-left">Request Date</th>
                  <th className="px-4 py-3 text-left">Sent Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req, index) => (
                  <tr key={req.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{req.id}</td>
                    <td className="px-4 py-2">{req.name || "N/A"}</td>
                    <td className="px-4 py-2">{req.email || "N/A"}</td>
                    <td className="px-4 py-2">{req.phone || "N/A"}</td>
                    <td className="px-4 py-2">{req.account_number}</td>
                    <td className="px-4 py-2">{req.ifsc_code}</td>
                    <td className="px-4 py-2 font-semibold text-blue-700">
                      ₹ {req.requested_amount}
                    </td>
                    <td className="px-4 py-2">{req.requested_amount_date}</td>
                    <td className="px-4 py-2">{req.sent_amount_date || "-"}</td>
                    <td className="px-4 py-2">{req.status}</td>
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
