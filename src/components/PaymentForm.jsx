import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/payments/create-payment";

export default function PaymentForm() {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(API_URL, {
        trustee_id: "trustee123",
        student_info: {
          name: studentName,
          id: `student_${Date.now()}`, // unique ID
          email: studentEmail,
        },
        gateway_name: "edviron",
        amount: Number(amount),
        callback_url: "http://localhost:3000/payment-success",
      });

      setPaymentLink(res.data.payment_url);
    } catch (err) {
      console.error("Payment create error:", err);
      setError(err.response?.data?.error || "Payment creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Create Payment</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Student Email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Payment"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {paymentLink && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold"
          >
            Pay Now
          </a>
        </div>
      )}
    </div>
  );
}
