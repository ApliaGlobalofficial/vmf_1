// import React, { useState, useEffect } from "react";
// import { FaTag, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
// import Swal from "sweetalert2";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const CustomerList = () => {
//   const [customers, setCustomers] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [updatedPassword, setUpdatedPassword] = useState("");
//   const [isAdding, setIsAdding] = useState(false);
//   const navigate = useNavigate();
//   const apiUrl = `${import.meta.env.VITE_API_URL}/users/customers`;

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(apiUrl);
//       setCustomers(response.data.reverse());
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   const handleEditCustomer = (id, password) => {
//     setEditingId(id);
//     setUpdatedPassword(password);
//   };

//   const handleUpdateCustomer = async (id) => {
//     try {
//       if (updatedPassword) {
//         await axios.patch(`${import.meta.env.VITE_API_URL}/users/password/${id}`, {
//           newPassword: updatedPassword,
//         });
//       }
//       setCustomers((prev) =>
//         prev.map((cust) =>
//           cust.user_id === id ? { ...cust, password: updatedPassword } : cust
//         )
//       );
//       setEditingId(null);
//       setUpdatedPassword("");
//       Swal.fire("Updated!", "Customer password updated!", "success");
//     } catch (error) {
//       console.error("Error updating customer:", error);
//       Swal.fire("Error", "Failed to update password", "error");
//     }
//   };

//   const handleDeleteCustomer = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Enter Deletion Code",
//       input: "text",
//       inputPlaceholder: "0000",
//       showCancelButton: true,
//       preConfirm: (val) =>
//         val === "0000" || Swal.showValidationMessage("Wrong code"),
//     });

//     if (confirm.isConfirmed) {
//       try {
//         await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete/${id}`);
//         setCustomers((prev) => prev.filter((c) => c.user_id !== id));
//         Swal.fire("Deleted!", "Customer removed.", "success");
//       } catch (error) {
//         console.error("Delete failed", error);
//         Swal.fire("Error", "Failed to delete", "error");
//       }
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const customer = customers.find((c) => c.user_id === id);
//       if (!customer) throw new Error("Customer not found");

//       // Step 1: Update backend status
//       await axios.patch(`${import.meta.env.VITE_API_URL}/users/status/${id}`, {
//         status: newStatus,
//       });

//       // Step 2: Update local state
//       setCustomers((prev) =>
//         prev.map((c) =>
//           c.user_id === id ? { ...c, user_login_status: newStatus } : c
//         )
//       );

//       // Step 3: Prepare SMS
//       const rawPhone = customer.phone?.replace(/^0+/, "") || "";
//       const phoneE164 = rawPhone.startsWith("91") ? rawPhone : "91" + rawPhone;

//       const SMS_URL = `${import.meta.env.VITE_API_URL}/sms/send`;
//       const SMS_SENDER = "918308178738";

//       const message =
//         newStatus === "Active"
//           ? `Hello ${customer.name}, your login status has been updated to *Active*. You're free to login the website.`
//           : `Hello ${customer.name}, your login status has been updated to *Inactive*. Contact Admin for more details or questions.`;

//       // Step 4: Send SMS
//       await fetch(SMS_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sender: SMS_SENDER,
//           number: phoneE164,
//           message,
//         }),
//       });

//       Swal.fire("Success", `Status set to ${newStatus}`, "success");
//     } catch (error) {
//       console.error("Status update error", error);
//       Swal.fire("Error", "Could not change status", "error");
//     }
//   };

//   const updateEditRequestStatus = async (id, newStatus) => {
//     try {
//       await axios.patch(`${import.meta.env.VITE_API_URL}/users/request-edit/${id}`, {
//         status: newStatus,
//       });
//       setCustomers((prev) =>
//         prev.map((c) =>
//           c.user_id === id ? { ...c, edit_request_status: newStatus } : c
//         )
//       );
//       Swal.fire(
//         "Success",
//         `Edit request ${newStatus.toLowerCase()}!`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Edit request error", error);
//       Swal.fire("Error", "Failed to update edit request", "error");
//     }
//   };
//   return (
//     <div className="ml-[300px] mt-[80px] p-6 w-[calc(100%-260px)] overflow-x-hidden">
//       <div className="relative bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
//         {/* Header */}
//         <div className="relative border-t-4 border-orange-400 bg-[#F4F4F4] p-4 rounded-t-lg">
//           <h2 className="text-2xl font-bold text-gray-800 text-center">
//             VLE Credentials List
//           </h2>
//           <button
//             onClick={() => {
//               setIsAdding(false);
//               navigate("/Adashinner");
//             }}
//             className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
//           >
//             <FaTimes size={20} />
//           </button>
//         </div>

//         <table className="w-full text-sm border">
//           <thead className="bg-[#F58A3B14]">
//             <tr>
//               {[
//                 "Name",
//                 "Email",
//                 "Password",
//                 "District",
//                 "Taluka",
//                 "Documents",
//                 "Profile Photo",
//                 "Status",
//                 "Edit Request",
//                 "Update",
//                 "Actions",
//               ].map((h, i) => (
//                 <th key={i} className="px-3 py-2 border text-black">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer) => (
//               <tr key={customer.user_id} className="border hover:bg-orange-100">
//                 <td className="text-center border">{customer.name}</td>
//                 <td className="text-center border">{customer.email}</td>
//                 <td className="text-center border">
//                   {editingId === customer.user_id ? (
//                     <input
//                       value={updatedPassword}
//                       onChange={(e) => setUpdatedPassword(e.target.value)}
//                       className="border p-1 rounded w-full"
//                     />
//                   ) : (
//                     customer.password
//                   )}
//                 </td>
//                 <td className="text-center border">{customer.district}</td>
//                 <td className="text-center border">{customer.taluka}</td>
//                 <td className="text-center border">
//                   {customer.user_documents?.length > 0 ? (
//                     customer.user_documents.map((doc, i) => (
//                       <div key={i}>
//                         <a
//                           href={doc.file_path}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           {doc.document_type}
//                         </a>
//                       </div>
//                     ))
//                   ) : (
//                     <span className="italic text-gray-400">No docs</span>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 border border-[#776D6DA8] text-center">
//                   {customer.profile_picture ? (
//                     <img
//                       src={customer.profile_picture}
//                       alt="Profile"
//                       className="h-10 w-10 rounded-full object-cover mx-auto"
//                     />
//                   ) : (
//                     <span className="text-gray-400 italic">No Image</span>
//                   )}
//                 </td>
//                 <td className="text-center border">
//                   <button
//                     onClick={() =>
//                       handleStatusChange(customer.user_id, "Active")
//                     }
//                     className={`px-2 py-1 rounded text-white mr-2 ${
//                       customer.user_login_status === "Active"
//                         ? "bg-green-500"
//                         : "bg-gray-500 hover:bg-green-600"
//                     }`}
//                   >
//                     Active
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleStatusChange(customer.user_id, "Inactive")
//                     }
//                     className={`px-2 py-1 rounded text-white ${
//                       customer.user_login_status === "Inactive"
//                         ? "bg-red-500"
//                         : "bg-gray-500 hover:bg-red-600"
//                     }`}
//                   >
//                     Inactive
//                   </button>
//                 </td>
//                 <td className="text-center border">
//                   <div className="text-sm font-semibold">
//                     {customer.edit_request_status}
//                   </div>
//                   <div className="flex gap-1 justify-center mt-1">
//                     <button
//                       onClick={() =>
//                         updateEditRequestStatus(customer.user_id, "Approved")
//                       }
//                       className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() =>
//                         updateEditRequestStatus(customer.user_id, "Rejected")
//                       }
//                       className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </td>
//                 <td className="text-center border">
//                   {editingId === customer.user_id ? (
//                     <button
//                       onClick={() => handleUpdateCustomer(customer.user_id)}
//                       className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         handleEditCustomer(customer.user_id, customer.password)
//                       }
//                       className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
//                     >
//                       <FaEdit />
//                     </button>
//                   )}
//                 </td>
//                 <td className="text-center border">
//                   <button
//                     onClick={() => handleDeleteCustomer(customer.user_id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CustomerList;

// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// import Swal from "sweetalert2";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const CustomerList = () => {
//   const [customers, setCustomers] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [updatedPassword, setUpdatedPassword] = useState("");
//   const [activeTab, setActiveTab] = useState("all"); // "all" or "editRequests"
//   const navigate = useNavigate();
//   const apiUrl = `${import.meta.env.VITE_API_URL}/users/customers`;

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(apiUrl);
//       setCustomers(response.data.reverse());
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   const handleEditCustomer = (id, password) => {
//     setEditingId(id);
//     setUpdatedPassword(password);
//   };

//   const handleUpdateCustomer = async (id) => {
//     try {
//       if (updatedPassword) {
//         await axios.patch(
//           `${import.meta.env.VITE_API_URL}/users/password/${id}`,
//           {
//             newPassword: updatedPassword,
//           }
//         );
//       }
//       setCustomers((prev) =>
//         prev.map((cust) =>
//           cust.user_id === id ? { ...cust, password: updatedPassword } : cust
//         )
//       );
//       setEditingId(null);
//       setUpdatedPassword("");
//       Swal.fire("Updated!", "Customer password updated!", "success");
//     } catch (error) {
//       console.error("Error updating customer:", error);
//       Swal.fire("Error", "Failed to update password", "error");
//     }
//   };

//   const handleDeleteCustomer = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Enter Deletion Code",
//       input: "text",
//       inputPlaceholder: "0000",
//       showCancelButton: true,
//       preConfirm: (val) =>
//         val === "0000" || Swal.showValidationMessage("Wrong code"),
//     });

//     if (confirm.isConfirmed) {
//       try {
//         await axios.delete(
//           `${import.meta.env.VITE_API_URL}/users/delete/${id}`
//         );
//         setCustomers((prev) => prev.filter((c) => c.user_id !== id));
//         Swal.fire("Deleted!", "Customer removed.", "success");
//       } catch (error) {
//         console.error("Delete failed", error);
//         Swal.fire("Error", "Failed to delete", "error");
//       }
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const customer = customers.find((c) => c.user_id === id);
//       if (!customer) throw new Error("Customer not found");

//       // 1. Update backend
//       await axios.patch(
//         `${import.meta.env.VITE_API_URL}/users/status/${id}`,
//         { status: newStatus }
//       );

//       // 2. Update local state
//       setCustomers((prev) =>
//         prev.map((c) =>
//           c.user_id === id ? { ...c, user_login_status: newStatus } : c
//         )
//       );

//       // 3. Prepare SMS
//       const rawPhone = customer.phone?.replace(/^0+/, "") || "";
//       const phoneE164 = rawPhone.startsWith("91") ? rawPhone : "91" + rawPhone;
//       const SMS_URL = `${import.meta.env.VITE_API_URL}/sms/send`;
//       const SMS_SENDER = "918308178738";

//       const message =
//         newStatus === "Active"
//           ? `Hello ${customer.name}, your login status has been updated to *Active*. You're free to login the website.`
//           : `Hello ${customer.name}, your login status has been updated to *Inactive*. Contact Admin for more details or questions.`;

//       // 4. Send SMS
//       await fetch(SMS_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sender: SMS_SENDER,
//           number: phoneE164,
//           message,
//         }),
//       });

//       Swal.fire("Success", `Status set to ${newStatus}`, "success");
//     } catch (error) {
//       console.error("Status update error", error);
//       Swal.fire("Error", "Could not change status", "error");
//     }
//   };

//   const updateEditRequestStatus = async (id, newStatus) => {
//     try {
//       await axios.patch(
//         `${import.meta.env.VITE_API_URL}/users/request-edit/${id}`,
//         { status: newStatus }
//       );
//       setCustomers((prev) =>
//         prev.map((c) =>
//           c.user_id === id ? { ...c, edit_request_status: newStatus } : c
//         )
//       );
//       Swal.fire("Success", `Edit request ${newStatus.toLowerCase()}!`, "success");
//     } catch (error) {
//       console.error("Edit request error", error);
//       Swal.fire("Error", "Failed to update edit request", "error");
//     }
//   };

//   // Filter customers based on which tab is active
//   const visibleCustomers =
//     activeTab === "all"
//       ? customers
//       : customers.filter(
//           (c) => c.edit_request_status && c.edit_request_status !== ""
//         );

//   return (
//     <div className="ml-[300px] mt-[80px] p-6 w-[calc(100%-260px)] overflow-x-hidden">
//       <div className="relative bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
//         {/* Header */}
//         <div className="relative border-t-4 border-orange-400 bg-[#F4F4F4] p-4 rounded-t-lg">
//           <h2 className="text-2xl font-bold text-gray-800 text-center">
//             VLE Credential Management
//           </h2>
//           <button
//             onClick={() => {
//               setActiveTab("all");
//               setEditingId(null);
//               navigate("/Adashinner");
//             }}
//             className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
//           >
//             <FaTimes size={20} />
//           </button>
//         </div>

//         {/* Tab Buttons */}
//         <div className="flex border-b border-gray-200 bg-gray-50">
//           <button
//             onClick={() => {
//               setActiveTab("all");
//               setEditingId(null);
//             }}
//             className={`flex-1 py-2 text-center ${
//               activeTab === "all"
//                 ? "border-b-4 border-orange-400 bg-white font-semibold"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             All Credentials
//           </button>
//           <button
//             onClick={() => {
//               setActiveTab("editRequests");
//               setEditingId(null);
//             }}
//             className={`flex-1 py-2 text-center ${
//               activeTab === "editRequests"
//                 ? "border-b-4 border-orange-400 bg-white font-semibold"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             Edit Requests
//           </button>
//         </div>

//         {/* Table */}
//         <table className="w-full text-sm border-collapse">
//           <thead className="bg-[#F58A3B14]">
//             <tr>
//               {[
//                 "Name",
//                 "Email",
//                 "Password",
//                 "District",
//                 "Taluka",
//                 "Documents",
//                 "Profile Photo",
//                 "Status",
//                 "Edit Request",
//                 "Update",
//                 "Actions",
//               ].map((h, i) => (
//                 <th key={i} className="px-3 py-2 border text-black">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {visibleCustomers.map((customer) => {
//               const isEditingRow = editingId === customer.user_id;

//               // Highlight entire row if:
//               //  • we are in Edit Requests tab → light yellow
//               //  • OR this row is currently being edited → light blue
//               const rowHighlight = isEditingRow
//                 ? "bg-blue-50"
//                 : activeTab === "editRequests"
//                 ? "bg-yellow-50 hover:bg-yellow-100"
//                 : "hover:bg-orange-100";

//               // Highlight only the password cell with a ring if editing that row
//               const passwordCellHighlight = isEditingRow
//                 ? "ring-2 ring-blue-400"
//                 : activeTab === "editRequests"
//                 ? "bg-yellow-100"
//                 : "";

//               return (
//                 <tr key={customer.user_id} className={`${rowHighlight} border`}>
//                   <td className="text-center border px-2 py-1">{customer.name}</td>
//                   <td className="text-center border px-2 py-1">{customer.email}</td>
//                   <td
//                     className={`
//                       text-center border px-2 py-1 
//                       ${passwordCellHighlight}
//                     `}
//                   >
//                     {isEditingRow ? (
//                       <input
//                         value={updatedPassword}
//                         onChange={(e) => setUpdatedPassword(e.target.value)}
//                         className="border p-1 rounded w-full"
//                       />
//                     ) : (
//                       customer.password
//                     )}
//                   </td>
//                   <td className="text-center border px-2 py-1">{customer.district}</td>
//                   <td className="text-center border px-2 py-1">{customer.taluka}</td>
//                   <td className="text-center border px-2 py-1">
//                     {customer.user_documents?.length > 0 ? (
//                       customer.user_documents.map((doc, idx) => (
//                         <div key={idx}>
//                           <a
//                             href={doc.file_path}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="text-blue-600 hover:underline"
//                           >
//                             {doc.document_type}
//                           </a>
//                         </div>
//                       ))
//                     ) : (
//                       <span className="italic text-gray-400">No docs</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-3 border border-[#776D6DA8] text-center">
//                     {customer.profile_picture ? (
//                       <img
//                         src={customer.profile_picture}
//                         alt="Profile"
//                         className="h-10 w-10 rounded-full object-cover mx-auto"
//                       />
//                     ) : (
//                       <span className="text-gray-400 italic">No Image</span>
//                     )}
//                   </td>
//                   <td className="text-center border px-2 py-1">
//                     <button
//                       onClick={() =>
//                         handleStatusChange(customer.user_id, "Active")
//                       }
//                       className={`px-2 py-1 rounded text-white mr-2 ${
//                         customer.user_login_status === "Active"
//                           ? "bg-green-500"
//                           : "bg-gray-500 hover:bg-green-600"
//                       }`}
//                     >
//                       Active
//                     </button>
//                     <button
//                       onClick={() =>
//                         handleStatusChange(customer.user_id, "Inactive")
//                       }
//                       className={`px-2 py-1 rounded text-white ${
//                         customer.user_login_status === "Inactive"
//                           ? "bg-red-500"
//                           : "bg-gray-500 hover:bg-red-600"
//                       }`}
//                     >
//                       Inactive
//                     </button>
//                   </td>
//                   <td className="text-center border px-2 py-1">
//                     <div className="text-sm font-semibold">
//                       {customer.edit_request_status || "—"}
//                     </div>
//                     <div className="flex gap-1 justify-center mt-1">
//                       <button
//                         onClick={() =>
//                           updateEditRequestStatus(customer.user_id, "Approved")
//                         }
//                         className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
//                       >
//                         Approve
//                       </button>
//                       <button
//                         onClick={() =>
//                           updateEditRequestStatus(customer.user_id, "Rejected")
//                         }
//                         className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   </td>
//                   <td className="text-center border px-2 py-1">
//                     {isEditingRow ? (
//                       <button
//                         onClick={() => handleUpdateCustomer(customer.user_id)}
//                         className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
//                       >
//                         Save
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() =>
//                           handleEditCustomer(customer.user_id, customer.password)
//                         }
//                         className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
//                       >
//                         <FaEdit />
//                       </button>
//                     )}
//                   </td>
//                   <td className="text-center border px-2 py-1">
//                     <button
//                       onClick={() => handleDeleteCustomer(customer.user_id)}
//                       className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//             {visibleCustomers.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={11}
//                   className="text-center py-6 text-gray-500 italic"
//                 >
//                   {activeTab === "all"
//                     ? "No customers found."
//                     : "No edit requests at the moment."}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CustomerList;

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes, FaUserCircle, FaExclamationTriangle, FaCheckCircle, FaBan } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const apiUrl = `${import.meta.env.VITE_API_URL}/users/customers`;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setCustomers(response.data.reverse()); // Reverse to show newest first
    } catch (error) {
      console.error("Error fetching customers:", error);
      Swal.fire("Error", "Failed to fetch customer data.", "error");
    }
  };

  const handleEditCustomer = (id, password) => {
    setEditingId(id);
    setUpdatedPassword(password);
  };

  const handleUpdateCustomer = async (id) => {
    try {
      if (updatedPassword) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/users/password/${id}`,
          {
            newPassword: updatedPassword,
          }
        );
        setCustomers((prev) =>
          prev.map((cust) =>
            cust.user_id === id ? { ...cust, password: updatedPassword } : cust
          )
        );
        setEditingId(null);
        setUpdatedPassword("");
        Swal.fire("Success!", "Customer password updated!", "success");
      } else {
        Swal.fire("Warning", "Password cannot be empty.", "warning");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      Swal.fire("Error", "Failed to update password. Please try again.", "error");
    }
  };

  const handleDeleteCustomer = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirm Deletion",
      html: 'Are you sure you want to delete this VLE?<br><br><b>Enter "0000" to confirm.</b>',
      input: "text",
      inputPlaceholder: "0000",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      customClass: {
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button',
        input: 'swal2-input'
      },
      preConfirm: (val) => {
        if (val === "0000") {
          return true;
        } else if (!val) {
          Swal.showValidationMessage("Please enter the code.");
          return false;
        } else {
          Swal.showValidationMessage("Wrong code.");
          return false;
        }
      },
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/users/delete/${id}`
        );
        setCustomers((prev) => prev.filter((c) => c.user_id !== id));
        Swal.fire("Deleted!", "VLE removed successfully.", "success");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error", "Failed to delete VLE. Please try again.", "error");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const customer = customers.find((c) => c.user_id === id);
      if (!customer) throw new Error("Customer not found");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/status/${id}`,
        { status: newStatus }
      );

      setCustomers((prev) =>
        prev.map((c) =>
          c.user_id === id ? { ...c, user_login_status: newStatus } : c
        )
      );

      const rawPhone = customer.phone?.replace(/^0+/, "") || "";
      const phoneE164 = rawPhone.startsWith("91") ? rawPhone : "91" + rawPhone;
      const SMS_URL = `${import.meta.env.VITE_API_URL}/sms/send`;
      const SMS_SENDER = "918308178738"; // Ensure this is your correct sender ID

      const message =
        newStatus === "Active"
          ? `Hello ${customer.name}, your login status has been updated to *Active*. You're now free to login to the website. Regards 🌐`
          : `Hello ${customer.name}, your login status has been updated to *Inactive*. Please contact Admin for more details or questions. Regards 🚫`;

      if (phoneE164.length === 12) { // Basic validation for E.164 format
        await fetch(SMS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: SMS_SENDER,
            number: phoneE164,
            message,
          }),
        });
      } else {
        console.warn("Invalid phone number for SMS:", customer.phone);
        Swal.fire("Warning", "Could not send SMS: Invalid phone number format.", "warning");
      }

      Swal.fire("Success", `Login status set to ${newStatus}.`, "success");
    } catch (error) {
      console.error("Status update error", error);
      Swal.fire("Error", "Could not change status. Please try again.", "error");
    }
  };

  const updateEditRequestStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/request-edit/${id}`,
        { status: newStatus }
      );
      setCustomers((prev) =>
        prev.map((c) =>
          c.user_id === id ? { ...c, edit_request_status: newStatus } : c
        )
      );
      Swal.fire("Success", `Edit request ${newStatus.toLowerCase()}!`, "success");
    } catch (error) {
      console.error("Edit request error", error);
      Swal.fire("Error", "Failed to update edit request status. Please try again.", "error");
    }
  };

  // Filter customers based on the active tab
  const visibleCustomers =
    activeTab === "all"
      ? customers
      : customers.filter(
          (c) => c.edit_request_status && c.edit_request_status !== "None"
        );

  return (
    <div className="ml-[300px] mt-[80px] p-6 w-[calc(100%-260px)] overflow-x-hidden min-h-[calc(100vh-80px)] bg-gray-100">
      <div className="relative bg-white shadow-xl rounded-lg border border-gray-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-t-lg shadow-md flex items-center justify-center">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <FaUserCircle className="text-3xl" /> VLE Credential Management
          </h2>
          <button
            onClick={() => {
              setActiveTab("all");
              setEditingId(null);
              navigate("/Adashinner");
            }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              setActiveTab("all");
              setEditingId(null);
            }}
            className={`flex-1 py-3 text-center text-lg font-medium outline-none
              ${activeTab === "all"
                ? "border-b-4 border-orange-500 bg-white text-orange-600 shadow-inner"
                : "text-gray-700 hover:bg-gray-100 hover:text-orange-500"
              }`}
          >
            All Credentials
          </button>
          <button
            onClick={() => {
              setActiveTab("editRequests");
              setEditingId(null);
            }}
            className={`flex-1 py-3 text-center text-lg font-medium outline-none
              ${activeTab === "editRequests"
                ? "border-b-4 border-orange-500 bg-white text-orange-600 shadow-inner"
                : "text-gray-700 hover:bg-gray-100 hover:text-orange-500"
              }`}
          >
            Edit Requests
            {customers.filter(c => c.edit_request_status && c.edit_request_status !== 'None').length > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {customers.filter(c => c.edit_request_status && c.edit_request_status !== 'None').length}
              </span>
            )}
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto shadow-md rounded-b-lg">
          <table className="min-w-full text-sm border-collapse table-fixed">
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr>
                <th className="w-[10%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Name</th>
                <th className="w-[15%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Email</th>
                <th className="w-[10%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Password</th>
                <th className="w-[8%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">District</th>
                <th className="w-[8%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Taluka</th>
                <th className="w-[10%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Documents</th>
                <th className="w-[8%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Profile Photo</th>
                <th className="w-[10%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Status</th>
                {activeTab === "editRequests" && (
                  <th className="w-[10%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Edit Request</th>
                )}
                <th className="w-[6%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Update</th>
                <th className="w-[5%] px-4 py-3 border-b-2 border-gray-300 text-left text-black font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.map((customer) => {
                const isEditingRow = editingId === customer.user_id;

                const rowHighlight = isEditingRow
                  ? "bg-blue-50"
                  : activeTab === "editRequests" && customer.edit_request_status && customer.edit_request_status !== 'None'
                  ? "bg-yellow-50"
                  : "hover:bg-gray-50";

                const passwordCellHighlight = isEditingRow
                  ? "ring-2 ring-blue-400 bg-blue-100"
                  : activeTab === "editRequests" && customer.edit_request_status && customer.edit_request_status !== 'None'
                  ? "bg-yellow-100"
                  : "";

                return (
                  <tr key={customer.user_id} className={`${rowHighlight} border-b border-gray-200`}>
                    <td className="px-4 py-3 align-middle text-center overflow-hidden text-ellipsis whitespace-nowrap">{customer.name}</td>
                    <td className="px-4 py-3 align-middle text-center overflow-hidden text-ellipsis whitespace-nowrap">{customer.email}</td>
                    <td
                      className={`
                        px-4 py-3 align-middle
                        ${passwordCellHighlight}
                      `}
                    >
                      {isEditingRow ? (
                        <input
                          type="text"
                          value={updatedPassword}
                          onChange={(e) => setUpdatedPassword(e.target.value)}
                          className="border border-gray-300 p-1 rounded-md w-full text-center focus:ring-blue-400 focus:border-blue-400 outline-none"
                        />
                      ) : (
                        <span className="font-mono text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap block text-center">{customer.password}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-center overflow-hidden text-ellipsis whitespace-nowrap">{customer.district}</td>
                    <td className="px-4 py-3 align-middle text-center overflow-hidden text-ellipsis whitespace-nowrap">{customer.taluka}</td>
                    <td className="px-4 py-3 align-middle text-center">
                      {customer.user_documents?.length > 0 ? (
                        <div className="flex flex-col flex-wrap justify-center items-center gap-1"> {/* Changed to flex-col for better wrapping */}
                          {customer.user_documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.file_path}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium break-all" // Added break-all
                            >
                              {doc.document_type}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-gray-400">No docs</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      {customer.profile_picture ? (
                        <img
                          src={customer.profile_picture}
                          alt="Profile"
                          className="h-12 w-12 rounded-full object-cover mx-auto border border-gray-300 shadow-sm"
                        />
                      ) : (
                        <FaUserCircle className="h-12 w-12 text-gray-400 mx-auto" title="No Image" />
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`font-semibold text-sm ${customer.user_login_status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                          {customer.user_login_status || 'N/A'}
                        </span>
                        <button
                          onClick={() => handleStatusChange(customer.user_id, "Active")}
                          className={`px-3 py-1 rounded-full text-white text-xs flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-opacity-50
                            ${customer.user_login_status === "Active"
                              ? "bg-green-500 cursor-not-allowed focus:ring-green-300"
                              : "bg-gray-400 hover:bg-green-500 focus:ring-green-300"
                            }`}
                          disabled={customer.user_login_status === "Active"}
                        >
                          <FaCheckCircle className="text-sm" /> Active
                        </button>
                        <button
                          onClick={() => handleStatusChange(customer.user_id, "Inactive")}
                          className={`px-3 py-1 rounded-full text-white text-xs flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-opacity-50
                            ${customer.user_login_status === "Inactive"
                              ? "bg-red-500 cursor-not-allowed focus:ring-red-300"
                              : "bg-gray-400 hover:bg-red-500 focus:ring-red-300"
                            }`}
                          disabled={customer.user_login_status === "Inactive"}
                        >
                          <FaBan className="text-sm" /> Inactive
                        </button>
                      </div>
                    </td>
                    {activeTab === "editRequests" && (
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="text-sm font-semibold mb-1">
                          {customer.edit_request_status === 'Approved' && <span className="text-green-600 flex items-center justify-center"><FaCheckCircle className="mr-1"/>Approved</span>}
                          {customer.edit_request_status === 'Rejected' && <span className="text-red-600 flex items-center justify-center"><FaTimes className="mr-1"/>Rejected</span>}
                          {customer.edit_request_status === 'Pending' && <span className="text-yellow-600 flex items-center justify-center"><FaExclamationTriangle className="mr-1"/>Pending</span>}
                          {!customer.edit_request_status || customer.edit_request_status === 'None' && <span className="text-gray-500">—</span>}
                        </div>
                        {customer.edit_request_status && customer.edit_request_status !== 'None' && (
                          <div className="flex flex-col gap-1 justify-center mt-2">
                            <button
                              onClick={() => updateEditRequestStatus(customer.user_id, "Approved")}
                              className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateEditRequestStatus(customer.user_id, "Rejected")}
                              className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3 align-middle text-center">
                      {isEditingRow ? (
                        <button
                          onClick={() => handleUpdateCustomer(customer.user_id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center mx-auto shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                          <FaCheckCircle className="mr-1" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleEditCustomer(customer.user_id, customer.password)
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center mx-auto shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <button
                        onClick={() => handleDeleteCustomer(customer.user_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center justify-center mx-auto shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {visibleCustomers.length === 0 && (
                <tr>
                  <td colSpan={activeTab === "editRequests" ? 11 : 10} className="text-center py-6 text-gray-500 italic text-lg">
                    {activeTab === "all"
                      ? "No VLEs found."
                      : "No edit requests at the moment."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;