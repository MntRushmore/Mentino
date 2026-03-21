import React from "react";

interface BadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-gray-100 text-gray-500",
  accepted: "bg-green-100 text-green-800",
  open: "bg-orange-100 text-orange-800",
  reviewing: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  dismissed: "bg-gray-100 text-gray-500",
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  no_show: "bg-red-100 text-red-800",
  student: "bg-purple-100 text-purple-800",
  mentor: "bg-teal-100 text-teal-800",
  admin: "bg-red-100 text-red-800",
};

export function Badge({ status, size = "sm" }: BadgeProps) {
  const colors = statusColors[status] || "bg-gray-100 text-gray-600";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span className={`inline-flex items-center rounded-full font-medium capitalize ${colors} ${sizeClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
