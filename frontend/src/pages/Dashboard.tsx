import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import CreateIssueModal from "../components/CreateIssueModal";
import { fetchIssues } from "../api/issues";
import type { Issue } from "../types/issue";

const Dashboard = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Open" | "In Progress" | "Resolved" | "Closed">("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");

  // Load issues from backend
  const loadIssues = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetchIssues();
      setIssues(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Failed to load issues:", err.message);
      else console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  // Stats counts
  const openCount = issues.filter(i => i.status === "Open").length;
  const progressCount = issues.filter(i => i.status === "In Progress").length;
  const resolvedCount = issues.filter(i => i.status === "Resolved").length;

  // Filtered issues
  const filteredIssues = issues.filter(issue => {
    const matchesTitle = issue.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || issue.priority === priorityFilter;
    return matchesTitle && matchesStatus && matchesPriority;
  });

  // Export issues
  const exportIssues = async (format: "csv" | "json") => {
    try {
      const res = await fetchIssues(); // fetch fresh data from backend
      const exportData = res.data;

      if (!exportData.length) return alert("No issues to export");

      if (format === "json") {
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "issues.json";
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === "csv") {
        const headers = ["Title", "Description", "Status", "Priority", "Assigned To", "Created At"];
        const rows = exportData.map(i => [
          `"${i.title}"`,
          `"${i.description}"`,
          i.status,
          i.priority,
          i.assignedTo?.email || "",
          new Date(i.createdAt).toLocaleString(),
        ]);
        const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "issues.csv";
        link.click();
        URL.revokeObjectURL(url);
      }

      setExportOpen(false); // close dropdown after export
    } catch (err) {
      console.error(err);
      alert("Failed to export issues");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Top Header */}
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          + New Issue
        </button>
      </div>

      {/* Stats */}
      <section className="px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard title="Open" count={openCount} color="blue" />
        <StatCard title="In Progress" count={progressCount} color="yellow" />
        <StatCard title="Resolved" count={resolvedCount} color="green" />
      </section>

      {/* Search & Filters */}
      <div className="px-6 flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-3 rounded-xl w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
        />
        <select
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatusFilter(e.target.value as "All" | "Open" | "In Progress" | "Resolved" | "Closed")
          }
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={priorityFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setPriorityFilter(e.target.value as "All" | "Low" | "Medium" | "High")
          }
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Issue List */}
      <section className="p-6 space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading issues...</p>
        ) : filteredIssues.length === 0 ? (
          <p className="text-gray-500">No issues match the filter</p>
        ) : (
          filteredIssues.map(issue => (
            <IssueCard key={issue._id} issue={issue} onUpdated={loadIssues} />
          ))
        )}
      </section>

      {/* Export Button */}
      <div className="px-6 mt-6 mb-6 flex justify-end relative">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
          >
            Export
          </button>

          {exportOpen && (
            <div className="absolute bottom-full mb-2 right-0 w-44 bg-white shadow-lg rounded-lg border z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                onClick={() => exportIssues("csv")}
              >
                Export as CSV
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                onClick={() => exportIssues("json")}
              >
                Export as JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Issue Modal */}
      {showCreate && (
        <CreateIssueModal onClose={() => setShowCreate(false)} onCreated={loadIssues} />
      )}
    </div>
  );
};

export default Dashboard;
