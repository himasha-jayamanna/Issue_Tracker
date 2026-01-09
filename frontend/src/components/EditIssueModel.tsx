import { useState, useEffect } from "react";
import { updateIssue } from "../api/issues";
import { fetchUsers, type User } from "../api/users";
import type { Issue, IssuePriority } from "../types/issue";

interface Props {
  issue: Issue;
  onClose: () => void;
  onUpdated: () => void;
}

const EditIssueModal: React.FC<Props> = ({ issue, onClose, onUpdated }) => {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);
  const [status, setStatus] = useState<"Open" | "In Progress" | "Resolved" | "Closed">(issue.status);
  const [users, setUsers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(issue.assignedTo?._id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers();
        setUsers(res.data);
      } catch (err: unknown) {
        console.error("Failed to load users", err);
      }
    };
    loadUsers();
  }, []);

  const handleUpdate = async (): Promise<void> => {
    if (!title.trim() || !description.trim()) return alert("Please fill all fields");
    try {
      setLoading(true);
      await updateIssue(issue._id, { title, description, priority, status, assignedTo: assignedTo || undefined });
      onUpdated();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to update issue");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-lg font-semibold">Edit Issue</h2>
        <input className="border p-3 w-full rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea className="border p-3 w-full rounded-xl" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <select className="border p-3 w-full rounded-xl" value={priority} onChange={(e) => setPriority(e.target.value as IssuePriority)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select className="border p-3 w-full rounded-xl" value={status} onChange={(e) => setStatus(e.target.value as "Open" | "In Progress" | "Resolved" | "Closed")}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select className="border p-3 w-full rounded-xl" value={assignedTo || ""} onChange={(e) => setAssignedTo(e.target.value || undefined)}>
          <option value="">Assign to…</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.email}</option>)}
        </select>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 rounded hover:bg-gray-100 transition">Cancel</button>
          <button onClick={handleUpdate} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditIssueModal;
