import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: string): string {
  // Parse ISO 8601 duration (e.g., PT1H, PT8H, PT4H30M)
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  return duration;
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = then.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 0) {
    // Past
    if (Math.abs(diffMins) < 60) {
      return `${Math.abs(diffMins)} min ago`;
    } else if (Math.abs(diffHours) < 24) {
      return `${Math.abs(diffHours)} hour${Math.abs(diffHours) > 1 ? "s" : ""} ago`;
    } else {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`;
    }
  } else {
    // Future
    if (diffMins < 60) {
      return `in ${diffMins} min`;
    } else if (diffHours < 24) {
      return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else {
      return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
  }
}

export function getRoleIcon(roleName: string): string {
  const name = roleName.toLowerCase();
  if (name.includes("global admin")) return "👑";
  if (name.includes("security")) return "🛡️";
  if (name.includes("user admin")) return "👥";
  if (name.includes("exchange")) return "📧";
  if (name.includes("sharepoint")) return "📁";
  if (name.includes("teams")) return "💬";
  if (name.includes("intune") || name.includes("device")) return "📱";
  if (name.includes("billing")) return "💳";
  if (name.includes("compliance")) return "✅";
  if (name.includes("helpdesk")) return "🎫";
  return "🔑";
}
