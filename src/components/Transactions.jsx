import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

export default function Transactions() {
  // data + pagination
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // default 10 rows/page
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // single-select for simplicity
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // modal / details
  const [selected, setSelected] = useState(null);

  // small debounce for search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // helpers (above return)
  const fmtDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString("en-IN");
    } catch {
      return d;
    }
  };
  const fmtAmt = (n) => (n == null ? "-" : `₹${Number(n).toLocaleString()}`);
  const statusBadge = (s) => {
    if (!s) return <span className="px-2 py-1 rounded-full text-xs bg-gray-100">-</span>;
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    if (s === "SUCCESS") return <span className={`${base} bg-green-100 text-green-800`}>Success</span>;
    if (s === "PENDING") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    if (s === "FAILED") return <span className={`${base} bg-red-100 text-red-800`}>Failed</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{s}</span>;
  };

  // fetcher
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, statusFilter, dateFrom, dateTo]);

  async function fetchTransactions() {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await axios.get(`${API_URL}/transactions`, { params });
      // expected shape: { page, limit, total, totalPages, data: [...] }
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setTransactions(data);
      const serverTotal = res.data.total ?? res.data.totalRecords ?? data.length;
      const serverTotalPages = res.data.totalPages ?? Math.max(1, Math.ceil(serverTotal / limit));
      setTotal(serverTotal);
      setTotalPages(serverTotalPages);
    } catch (err) {
      console.error("fetchTransactions error:", err);
      setError("Failed to load transactions");
      setTransactions([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  // copy helper
  const copy = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  // derived visible rows (no client slicing — backend handles pagination)
  const rows = useMemo(() => transactions, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <div className="text-sm text-gray-600">
            Total: <strong>{total}</strong> • Page {page}/{totalPages}
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white p-4 rounded-md shadow-sm mb-4 flex flex-wrap gap-3 items-center">
          <input
            className="border rounded px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search collect_id, custom_order_id..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />

          <select
            className="border rounded px-3 py-2 focus:outline-none"
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
            className="border rounded px-3 py-2"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            title="From date"
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            title="To date"
          />

          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="border rounded px-3 py-2 ml-auto"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <button
            onClick={() => { setSearch(""); setStatusFilter(""); setDateFrom(""); setDateTo(""); setPage(1); }}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-100"
            title="Reset filters"
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md shadow overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-4 py-3 text-left text-xs text-gray-600 w-12">#</th>
                <th className="border px-4 py-3 text-left text-xs text-gray-600">Order ID</th>
                <th className="border px-4 py-3 text-left text-xs text-gray-600">School</th>
                <th className="border px-4 py-3 text-right text-xs text-gray-600">Order Amt</th>
                <th className="border px-4 py-3 text-right text-xs text-gray-600">Txn Amt</th>
                <th className="border px-4 py-3 text-left text-xs text-gray-600">Method</th>
                <th className="border px-4 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="border px-4 py-3 text-left text-xs text-gray-600">Time</th>
                <th className="border px-4 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500">Loading...</td>
                </tr>
              ) : error ? (
                <tr><td colSpan="9" className="p-6 text-center text-red-500">{error}</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="9" className="p-6 text-center text-gray-500">No transactions found</td></tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={r.collect_id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                    <td className="border px-4 py-3 text-sm text-gray-700">{(page - 1) * limit + idx + 1}</td>
                    <td className="border px-4 py-3 text-sm font-mono text-gray-800 break-words max-w-sm">{r.collect_id}</td>
                    <td className="border px-4 py-3 text-sm text-gray-700">{r.school_id}</td>
                    <td className="border px-4 py-3 text-sm text-right text-gray-700">{fmtAmt(r.order_amount)}</td>
                    <td className="border px-4 py-3 text-sm text-right text-gray-700">{fmtAmt(r.transaction_amount)}</td>
                    <td className="border px-4 py-3 text-sm text-gray-700">{r.gateway}</td>
                    <td className="border px-4 py-3 text-sm">{statusBadge(r.status)}</td>
                    <td className="border px-4 py-3 text-sm text-gray-700">{fmtDate(r.payment_time)}</td>
                    <td className="border px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copy(r.collect_id)}
                          className="text-blue-600 text-sm hover:underline"
                          title="Copy order id"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setSelected(r)}
                          className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <div className="px-3 py-1 border rounded text-sm">
              {page} / {totalPages}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Details modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-md w-11/12 md:w-2/3 lg:w-1/2 p-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Transaction Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-600">Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><strong>Order ID</strong><div className="text-gray-700 break-words">{selected.collect_id}</div></div>
                <div><strong>School</strong><div className="text-gray-700">{selected.school_id}</div></div>
                <div><strong>Order Amount</strong><div className="text-gray-700">{fmtAmt(selected.order_amount)}</div></div>
                <div><strong>Txn Amount</strong><div className="text-gray-700">{fmtAmt(selected.transaction_amount)}</div></div>
                <div><strong>Payment Mode</strong><div className="text-gray-700">{selected.payment_mode || "-"}</div></div>
                <div><strong>Status</strong><div className="text-gray-700">{selected.status}</div></div>
                <div className="md:col-span-2"><strong>Payment Time</strong><div className="text-gray-700">{fmtDate(selected.payment_time)}</div></div>
                <div className="md:col-span-2"><strong>Raw JSON</strong>
                  <pre className="bg-gray-50 p-2 rounded text-xs max-h-40 overflow-auto">{JSON.stringify(selected, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
