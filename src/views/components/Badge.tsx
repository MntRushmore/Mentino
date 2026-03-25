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

  // Special verified display for mentor verification
  if (status === "approved") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-emerald-100 text-emerald-700 ${sizeClass}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Verified
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-gray-100 text-gray-500 ${sizeClass}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
        </svg>
        Not Verified
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium capitalize ${colors} ${sizeClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
