import React from "react";
import { Badge } from "./Badge";

interface MentorCardProps {
  mentor: any;
  user: any;
  showActions?: boolean;
}

export function MentorCard({ mentor, user, showActions = false }: MentorCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
          {user.first_name?.[0]}
          {user.last_name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{user.first_name} {user.last_name}</h3>
            <Badge status={mentor.verification_status} />
          </div>
          <p className="text-sm text-gray-600">{mentor.job_title} at {mentor.company || "N/A"}</p>
          <p className="text-sm text-gray-500">{mentor.career_field} &middot; {mentor.years_experience} years</p>
          {user.bio && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{user.bio}</p>}
          <div className="flex flex-wrap gap-1 mt-2">
            {mentor.topics?.slice(0, 4).map((topic: string) => (
              <span key={topic} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
      {showActions && (
        <div className="mt-4 flex gap-2">
          <a href={`/profile/${user.id}`} className="text-blue-600 hover:underline text-sm font-medium">
            View Profile
          </a>
        </div>
      )}
    </div>
  );
}

interface MatchCardProps {
  match: any;
  otherUser: any;
  role: string;
}

export function MatchCard({ match, otherUser, role }: MatchCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
          {otherUser.first_name?.[0]}{otherUser.last_name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 text-sm">{otherUser.first_name} {otherUser.last_name}</h4>
            <Badge status={match.status} />
            {match.match_score && (
              <span className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                {match.match_score}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {role === "student" ? "Your mentor" : "Your mentee"}
            {match.started_at && ` · Since ${new Date(match.started_at).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {match.status === "active" && (
            <>
              <a href={`/messages/${match.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                Message
              </a>
              <a href={`/sessions?match_id=${match.id}`} className="text-gray-500 hover:text-gray-700 text-xs font-medium">
                Schedule
              </a>
            </>
          )}
          {match.status === "pending" && role === "student" && (
            <span className="text-xs text-yellow-600 font-medium">Awaiting response</span>
          )}
        </div>
      </div>
    </div>
  );
}
