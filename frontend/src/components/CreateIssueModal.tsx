import { useState, useEffect } from "react";
import { createIssue } from "../api/issues";
import { fetchUsers, type User } from "../api/users";
import type { IssuePriority } from "../types/issue";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateIssueModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority | "">(""); 
  const [status, setStatus] = useState<"Open" | "In Progress" | "Resolved" | "Closed" | "">("");
  const [users, setUsers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>(""); 

  useEffect(() => {
    fetchUsers().then(res => setUsers(res.data));
  }, []);

  const submit = async () => {
    if (!title || !description) return alert("Fill all fields");
    try {
      await createIssue({
        title,
        description,
        priority: priority || "Medium", // fallback if user didn't select
        status: status || "Open", // fallback
        assignedTo: assignedTo || undefined,
      });
      onCreated();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      alert("Failed to create issue");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">Create Issue</h2>

        <input
          className="border p-2 w-full rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {/* Priority Select */}
        <select
          className={`border p-2 w-full rounded ${
            priority === "" ? "text-gray-400" : "text-black"
          }`}
          value={priority}
          onChange={e => setPriority(e.target.value as IssuePriority | "")}
        >
          <option value="" disabled>
            Select Priority…
          </option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Status Select */}
        <select
          className={`border p-2 w-full rounded ${
            status === "" ? "text-gray-400" : "text-black"
          }`}
          value={status}
          onChange={e =>
            setStatus(
              e.target.value as "Open" | "In Progress" | "Resolved" | "Closed" | ""
            )
          }
        >

          <option value="" disabled>
            Select Status…
          </option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        {/* Assigned To Select */}
        <select
          className={`border p-2 w-full rounded ${
            assignedTo === "" ? "text-gray-400" : "text-black"
          }`}
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
        >
          <option value="" disabled>
            Assign to…
          </option>
          {users.map(u => (
            <option key={u._id} value={u._id}>
              {u.email}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;
