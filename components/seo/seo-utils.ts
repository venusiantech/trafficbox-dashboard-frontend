/**
 * Shared utility functions for SEO components
 * Consolidates duplicate color and status functions
 */

/**
 * Get color class for score-based values (0-100)
 */
export function getScoreColor(score: number, isBg = false): string {
  if (score >= 90) {
    return isBg ? "bg-emerald-500" : "text-emerald-500";
  } else if (score >= 70) {
    return isBg ? "bg-blue-500" : "text-blue-500";
  } else if (score >= 50) {
    return isBg ? "bg-amber-500" : "text-amber-500";
  } else {
    return isBg ? "bg-red-500" : "text-red-500";
  }
}

/**
 * Get background color class for score-based values (solid colors)
 * Use for badges with white text or progress bars
 */
export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 70) return "bg-blue-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

/**
 * Get light background color class for score-based values (transparent)
 * Use for areas with colored text on top
 */
export function getScoreLightBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/10";
  if (score >= 70) return "bg-blue-500/10";
  if (score >= 50) return "bg-amber-500/10";
  return "bg-red-500/10";
}

/**
 * Get text color class for score-based values
 */
export function getScoreTextColor(score: number): string {
  if (score >= 90) return "text-emerald-500";
  if (score >= 70) return "text-blue-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

/**
 * Get stroke color class for score-based values (for SVG circles)
 */
export function getScoreStrokeColor(score: number): string {
  if (score >= 90) return "stroke-emerald-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

/**
 * Get status color class for status strings
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "good":
    case "success":
    case "excellent":
    case "readable":
    case "present":
    case "exists":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "warning":
    case "needs improvement":
    case "not_present":
    case "missing":
    case "not exists":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "error":
    case "poor":
    case "very_difficult":
    case "not readable":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "info":
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
}

/**
 * Get priority color class for recommendation priorities
 */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "critical":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "high":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "medium":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "low":
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
}

/**
 * Get priority border color class for left border indicators
 */
export function getPriorityBorderColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "critical":
      return "border-l-red-500";
    case "high":
      return "border-l-amber-500";
    case "medium":
      return "border-l-blue-500";
    case "low":
    default:
      return "border-l-slate-400";
  }
}

/**
 * Get difficulty color class for readability difficulty
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "fairly_easy":
      return "bg-emerald-500 text-white";
    case "standard":
    case "fairly_difficult":
      return "bg-amber-500 text-white";
    case "difficult":
    case "very_difficult":
      return "bg-red-500 text-white";
    default:
      return "bg-blue-500 text-white";
  }
}

/**
 * Get grade badge color class
 */
export function getGradeBadgeColor(grade: string): string {
  const gradeUpper = grade.toUpperCase();
  if (["A+", "A"].includes(gradeUpper)) return "bg-emerald-500/10 text-emerald-500";
  if (["B+", "B"].includes(gradeUpper)) return "bg-blue-500/10 text-blue-500";
  if (["C+", "C"].includes(gradeUpper)) return "bg-amber-500/10 text-amber-500";
  return "bg-red-500/10 text-red-500";
}

/**
 * Get metric status based on value and thresholds
 */
export function getMetricStatus(
  value: number | null,
  goodThreshold: number,
  needsImprovementThreshold: number
): "good" | "needs-improvement" | "poor" | "N/A" {
  if (value === null) return "N/A";
  if (value <= goodThreshold) return "good";
  if (value <= needsImprovementThreshold) return "needs-improvement";
  return "poor";
}

/**
 * Get metric color class based on status
 */
export function getMetricColorClass(
  value: number | null,
  goodThreshold: number,
  needsImprovementThreshold: number
): string {
  const status = getMetricStatus(value, goodThreshold, needsImprovementThreshold);
  switch (status) {
    case "good":
      return "text-emerald-500";
    case "needs-improvement":
      return "text-amber-500";
    case "poor":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Get status color for boolean values
 */
export function getBooleanStatusColor(value: boolean): string {
  return value
    ? "bg-emerald-500/10 text-emerald-500"
    : "bg-red-500/10 text-red-500";
}

/**
 * Get status color for SEO analysis status
 */
export function getSEOStatusColor(
  status: string
): "success" | "warning" | "destructive" | "secondary" | "default" {
  const colors: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
    completed: "success",
    processing: "warning",
    failed: "destructive",
    pending: "secondary",
  };
  return colors[status.toLowerCase()] || "default";
}
