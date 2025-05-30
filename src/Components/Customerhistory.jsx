import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFileAlt,
  FaDownload,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const CustomerHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
const token = localStorage.getItem("token");


  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(` ${import.meta.env.VITE_API_URL}/documents/list`, authHeaders)
        .then((response) => {
          const allDocuments = response.data.documents;
          // Filter documents where status is "Completed"
          const filteredDocs = allDocuments
            .filter(
              (doc) => doc.user_id === userId && doc.status === "Completed"
            )
            .reverse(); // Show newest first
          setDocuments(filteredDocs);
        })
        .catch((error) => console.error("Error fetching documents:", error));

      axios
        .get(` ${import.meta.env.VITE_API_URL}/certificates`, authHeaders)
        .then((response) => setCertificates(response.data))
        .catch((error) => console.error("Error fetching certificates:", error));
    }
  }, [userId]);

  const getCertificateByDocumentId = (documentId) => {
    const matchedCertificate = certificates.find(
      (cert) => cert.document_id === documentId
    );
    return matchedCertificate ? matchedCertificate.certificate_id : null;
  };
  const handleDownloadReceipt = async (receiptUrl, documentName) => {
    try {
      const response = await fetch(receiptUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const mimeType = blob.type;

      const safeName = documentName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

      if (mimeType === "application/pdf") {
        // If already PDF, download directly
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `${safeName}_receipt.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
      } else if (mimeType.startsWith("image/")) {
        // Convert image to PDF
        const imageURL = URL.createObjectURL(blob);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        const img = new Image();
        img.src = imageURL;

        img.onload = () => {
          const imgWidth = 400;
          const imgHeight = (img.height * imgWidth) / img.width;

          pdf.addImage(
            img,
            mimeType.includes("png") ? "PNG" : "JPEG",
            40,
            40,
            imgWidth,
            imgHeight
          );
          pdf.save(`${safeName}_receipt.pdf`);
          URL.revokeObjectURL(imageURL);
        };
      } else {
        Swal.fire(
          "Error",
          "Unsupported file type for PDF conversion.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error downloading/converting receipt:", error);
      Swal.fire("Error", "Failed to generate PDF. Try again.", "error");
    }
  };

  const handleViewCertificate = async (
    documentId,
    documentName = "certificate"
  ) => {
    const certificateId = getCertificateByDocumentId(documentId);
    if (!certificateId) {
      alert("Certificate not found.");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/certificates/${certificateId}` , authHeaders
      );

      if (response.data && response.data.file_url) {
        const fileUrl = response.data.file_url;

        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
          throw new Error("Failed to fetch certificate file");
        }

        const blob = await fileResponse.blob();
        const mimeType = blob.type;
        const safeName = documentName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

        if (mimeType === "application/pdf") {
          // Directly download PDF
          const fileURL = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = fileURL;
          link.download = `${safeName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(fileURL);
        } else if (mimeType.startsWith("image/")) {
          // Convert image to PDF
          const imageURL = URL.createObjectURL(blob);
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: "a4",
          });

          const img = new Image();
          img.src = imageURL;

          img.onload = () => {
            const imgWidth = 600;
            const imgHeight = (img.height * imgWidth) / img.width;
            pdf.addImage(
              img,
              mimeType.includes("png") ? "PNG" : "JPEG",
              20,
              20,
              imgWidth,
              imgHeight
            );
            pdf.save(`${safeName}.pdf`);
            URL.revokeObjectURL(imageURL);
          };
        } else {
          alert("Unsupported file type for conversion to PDF.");
        }
      } else {
        alert("Certificate not found.");
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      alert("Failed to download certificate.");
    }
  };

  const handleDownloadCertificate = async (documentId, name) => {
    try {
      const response = await axios.get(
        ` ${import.meta.env.VITE_API_URL}/download-certificate/${documentId}`, authHeaders,
        {
          responseType: "blob", // Important to handle file downloads
        }
      );

      // Create a downloadable link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}.zip`); // Set ZIP file name based on user name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate.");
    }
  };

  const handleGenerateErrorRequest = (
    documentId,
    applicationId,
    distributorId,
    userId,
    categoryId,
    subcategoryId,
    name,
    email
  ) => {
    navigate(`/Adderrorrequest`, {
      state: {
        documentId,
        applicationId,
        distributorId,
        userId,
        categoryId,
        subcategoryId,
        name,
        email,
      },
    });
  };

  return (
    <div className="ml-[250px] flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <div className="w-[100%] max-w-6xl bg-white shadow-lg rounded-lg">
        <div className="relative border-t-4 border-orange-400 bg-[#F4F4F4] p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Completed Applications List
          </h2>
          <button
            onClick={() => {
              setIsAdding(false);
              navigate("/Cdashinner");
            }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 flex justify-end items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-orange-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 w-64"
          />
        </div>

        {/* Table */}
        <div className="table-container border border-gray-300 rounded-lg shadow-md overflow-x-auto p-6">
          <table className="table border-collapse border border-gray-300 min-w-full text-sm">
            <thead className="bg-gray-300">
              <tr>
                {[
                  "S.No",
                  "Application ID",
                  "Datetime",
                  "Category",
                  "Subcategory",
                  "VLE Name",
                  "VLE Email",
                  "VLE Phone No",
                  "Applicants Name",
                  "Verification",
                  "Download Receipt",
                  " Download Certificate",
                  "Error Request",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-4 border border-[#776D6DA8] text-black font-semibold text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <tr
                    key={doc.document_id}
                    className={`${
                      index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F58A3B14]"
                    } hover:bg-orange-100 transition duration-200`}
                  >
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc.application_id}
                    </td>
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {(() => {
                        const date = new Date(doc.uploaded_at);
                        const formattedDate = `${String(
                          date.getDate()
                        ).padStart(2, "0")}-${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}-${date.getFullYear()}`;
                        const formattedTime = date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        });

                        return (
                          <>
                            <div>{formattedDate}</div>
                            <div className="text-sm text-gray-600">
                              {formattedTime}
                            </div>
                          </>
                        );
                      })()}
                    </td>

                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc.category_name}
                    </td>
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc.subcategory_name}
                    </td>
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc.name}
                    </td>
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc.email}
                    </td>
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc.phone}
                    </td>
                    {/* Applicant Name */}
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc?.document_fields ? (
                        Array.isArray(doc.document_fields) ? (
                          doc.document_fields.find(
                            (field) => field.field_name === "APPLICANT NAME"
                          ) ? (
                            <p>
                              {
                                doc.document_fields.find(
                                  (field) =>
                                    field.field_name === "APPLICANT NAME"
                                ).field_value
                              }
                            </p>
                          ) : (
                            <p className="text-gray-500">
                              No applicant name available
                            </p>
                          )
                        ) : doc.document_fields["APPLICANT NAME"] ? (
                          <p>{doc.document_fields["APPLICANT NAME"]}</p>
                        ) : (
                          <p className="text-gray-500">
                            No applicant name available
                          </p>
                        )
                      ) : (
                        <p className="text-gray-500">No fields available</p>
                      )}
                    </td>

                    <td className="border p-2">
                      <div className="flex flex-col gap-1">
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs ${
                            doc.status === "Approved"
                              ? "bg-green-500"
                              : doc.status === "Rejected"
                              ? "bg-red-500"
                              : doc.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {doc.status}
                        </span>

                        {/* Latest Status Date and Time */}
                        {doc.status_history
                          ?.sort(
                            (a, b) =>
                              new Date(b.updated_at) - new Date(a.updated_at)
                          ) // Sort by latest date
                          .slice(0, 1) // Take the first entry (latest status)
                          .map((statusEntry, index) => {
                            const date = new Date(statusEntry.updated_at);
                            const formattedDate = `${String(
                              date.getDate()
                            ).padStart(2, "0")}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${date.getFullYear()}`;
                            const formattedTime = date.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            );

                            return (
                              <div
                                key={index}
                                className="text-xs text-gray-600"
                              >
                                <div>{formattedDate}</div>
                                <div className="text-sm text-gray-600">
                                  {formattedTime}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </td>

                    {/* Download Receipt */}
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {doc.receipt_url ? (
                        <button
                          onClick={() =>
                            handleDownloadReceipt(doc.receipt_url, doc.name)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-blue-600 transition"
                        >
                          <FaDownload className="mr-1" /> Receipt
                        </button>
                      ) : (
                        <span className="text-gray-500 text-center">
                          Not Available
                        </span>
                      )}
                    </td>

                    {/* Certificate */}
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      {getCertificateByDocumentId(doc.document_id) ? (
                        <button
                          onClick={() => handleViewCertificate(doc.document_id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-blue-600 transition"
                        >
                          <FaDownload className="mr-1" /> Certificate
                        </button>
                      ) : (
                        <span className="text-gray-500 text-center">
                          Not Available
                        </span>
                      )}
                    </td>

                    {/* Error Request */}
                    <td className="px-4 py-4 border border-[#776D6DA8] text-center">
                      <button
                        onClick={() =>
                          handleGenerateErrorRequest(
                            doc.document_id,
                            doc.application_id,
                            doc.distributor_id,
                            doc.user_id,
                            doc.category_id,
                            doc.subcategory_id,
                            doc.name,
                            doc.email,
                            doc.phone
                          )
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded flex justify-center items-center hover:bg-yellow-600 transition"
                      >
                        <FaExclamationTriangle className="mr-1" /> Send Error
                        Request
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="px-4 py-4 border border-[#776D6DA8] text-center"
                  >
                    No completed documents found.
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

export default CustomerHistory;
