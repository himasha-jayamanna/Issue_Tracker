import { useState } from "react";
import type { Issue } from "../types/issue";
import { updateIssue, deleteIssue } from "../api/issues";
import EditIssueModal from "./EditIssueModel";

interface Props {
  issue: Issue;
  onUpdated?: () => void;
}

const IssueCard = ({ issue, onUpdated }: Props) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    try {
      await deleteIssue(issue._id);
      onUpdated?.();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Failed to delete issue");
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:scale-102 flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{issue.title}</h3>
          <p className="text-sm text-gray-500">{issue.description}</p>

          {/* Badges */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge text={issue.status} type="status" />
            <Badge text={issue.priority} type="priority" />
            {issue.assignedTo && (
              <span className="text-xs text-gray-500">
                Assigned to: {issue.assignedTo.email}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Status dropdown with professional color */}
          <select
            className="bg-blue-500 text-white px-3 py-1 rounded transition transform hover:scale-105 text-sm font-medium"
            value={issue.status}
            onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
              try {
                await updateIssue(issue._id, { status: e.target.value });
                onUpdated?.();
              } catch (err: unknown) {
                if (err instanceof Error) alert(err.message);
                else alert("Failed to update status");
              }
            }}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Edit button */}
          <button
            onClick={() => setShowEdit(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition transform hover:scale-105 text-sm font-medium"
          >
            Edit
          </button>

          {/* Delete button remains red */}
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition transform hover:scale-105 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {showEdit && (
        <EditIssueModal
          issue={issue}
          onClose={() => setShowEdit(false)}
          onUpdated={onUpdated ?? (() => {})}
        />
      )}
    </>
  );
};

export default IssueCard;

// Badge component for priority and status
const Badge = ({ text, type }: { text: string; type: "status" | "priority" }) => {
  const styles =
    type === "status"
      ? text === "Open"
        ? "bg-blue-100 text-blue-700"
        : text === "In Progress"
        ? "bg-yellow-100 text-yellow-700"
        : text === "Resolved"
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-700" // Closed
      : text === "High"
      ? "bg-red-100 text-red-700"
      : text === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return <span className={`px-2 py-1 text-xs rounded ${styles}`}>{text}</span>;
};
