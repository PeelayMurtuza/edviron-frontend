import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

export default function Transactions() {
  // State
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await axios.get(`${API_URL}/transactions`, { params });
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setTransactions(data);

      const serverTotal = res.data.total ?? data.length;
      setTotal(serverTotal);
      setTotalPages(res.data.totalPages ?? Math.max(1, Math.ceil(serverTotal / limit)));
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to load transactions");
      setTransactions([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on dependency changes
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [page, limit, debouncedSearch, statusFilter, dateFrom, dateTo]);

  // Formatters
  const fmtDate = (d) => (d ? new Date(d).toLocaleString("en-IN") : "-");
  const fmtAmt = (n) => (n == null ? "-" : `₹${Number(n).toLocaleString("en-IN")}`);

  const statusBadge = (s) => {
    const base = "px-2.5 py-1 rounded-full text-xs font-medium inline-block border";
    if (s === "SUCCESS") return <span className={`${base} bg-green-50 text-green-800 border-green-100`}>Success</span>;
    if (s === "PENDING") return <span className={`${base} bg-yellow-50 text-yellow-800 border-yellow-100`}>Pending</span>;
    if (s === "FAILED") return <span className={`${base} bg-red-50 text-red-800 border-red-100`}>Failed</span>;
    return <span className={`${base} bg-gray-50 text-gray-800`}>{s || "-"}</span>;
  };

  // Copy text helper
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    const el = document.createElement("div");
    el.textContent = "Copied";
    el.className = "fixed bottom-6 right-6 bg-black/80 text-white text-xs px-3 py-1 rounded";
    document.body.appendChild(el);
    setTimeout(() => document.body.removeChild(el), 900);
  };

  const rows = useMemo(() => transactions, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
          <h1 className="text-2xl font-semibold text-black">Transactions</h1>
          <div className="text-sm text-gray-700">
            Total: <strong>{total}</strong> • Page {page}/{totalPages}
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-3 items-center">
          <input
            className="border border-gray-200 rounded px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Search (Order ID / custom_order_id)"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="border border-gray-200 rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <input
            type="date"
            className="border border-gray-200 rounded px-3 py-2"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          />
          <input
            type="date"
            className="border border-gray-200 rounded px-3 py-2"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          />
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="border border-gray-200 rounded px-3 py-2 ml-auto"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); setDateFrom(""); setDateTo(""); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded text-sm bg-white hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <div className="bg-white mt-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  {["#", "Order ID", "School", "Order Amt", "Txn Amt", "Method", "Status", "Time", "Actions"].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 border-r border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-gray-500">Loading transactions…</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-red-500">{error}</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-gray-500">No transactions found</td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr
                      key={r.collect_id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transform-gpu transition duration-150 ease-in-out hover:scale-[1.01]"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-100">{(page - 1) * limit + idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono text-black border-r border-gray-100 break-words max-w-xs">{r.collect_id}</td>
                      <td className="px-4 py-3 text-sm text-black border-r border-gray-100">{r.school_id}</td>
                      <td className="px-4 py-3 text-sm text-right text-black border-r border-gray-100">{fmtAmt(r.order_amount)}</td>
                      <td className="px-4 py-3 text-sm text-right text-black border-r border-gray-100">{fmtAmt(r.transaction_amount)}</td>
                      <td className="px-4 py-3 text-sm text-black border-r border-gray-100">{r.gateway}</td>
                      <td className="px-4 py-3 text-sm border-r border-gray-100">{statusBadge(r.status)}</td>
                      <td className="px-4 py-3 text-sm text-black border-r border-gray-100">{fmtDate(r.payment_time)}</td>
                      <td className="px-4 py-3 text-sm text-black flex gap-2">
                        <button onClick={() => copy(r.collect_id)} className="text-indigo-600 hover:underline">Copy</button>
                        <button onClick={() => setSelected(r)} className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Details</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <div className="px-3 py-1 border border-gray-200 rounded bg-white text-sm">{page} / {totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 shadow-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-black">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                <div><strong>Order ID</strong><div className="mt-1 text-gray-900 break-words">{selected.collect_id}</div></div>
                <div><strong>School</strong><div className="mt-1">{selected.school_id}</div></div>
                <div><strong>Order Amount</strong><div className="mt-1">{fmtAmt(selected.order_amount)}</div></div>
                <div><strong>Txn Amount</strong><div className="mt-1">{fmtAmt(selected.transaction_amount)}</div></div>
                <div><strong>Payment Mode</strong><div className="mt-1">{selected.payment_mode || "-"}</div></div>
                <div><strong>Status</strong><div className="mt-1">{statusBadge(selected.status)}</div></div>
                <div className="md:col-span-2"><strong>Payment Time</strong><div className="mt-1">{fmtDate(selected.payment_time)}</div></div>
                <div className="md:col-span-2"><strong>Raw JSON</strong>
                  <pre className="bg-gray-50 p-3 rounded border text-xs max-h-48 overflow-auto mt-1">{JSON.stringify(selected, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
