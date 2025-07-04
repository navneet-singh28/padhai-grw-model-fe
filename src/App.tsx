import { useState } from "react";
import "./index.css";

type Metrics = Record<string, number>;

export default function App() {
  const [start, setStart]     = useState("2025-03-01");
  const [end, setEnd]         = useState("2025-04-20");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

  async function run() {
    setLoading(true);
    setMetrics(null);
    try {
      const res = await fetch(`${API}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end, fetch: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMetrics(await res.json());
    } catch (err: any) {
      alert(err.message || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold">Growth-Model Dashboard</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label>Start&nbsp;</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div>
          <label>End&nbsp;</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
        <button onClick={run} disabled={loading} className="btn">
          {loading ? "Computing…" : "Run"}
        </button>
      </div>

      {loading && <div>Loading…</div>}

      {metrics && (
        <table className="table-auto border-collapse">
          <thead>
            <tr><th>Metric</th><th>Value</th></tr>
          </thead>
          <tbody>
            {Object.entries(metrics).map(([k, v]) => (
              <tr key={k}>
                <td className="border px-2 py-1">{k}</td>
                <td className="border px-2 py-1">{v.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}