/**
 * SEO Report PDF Generator
 * Generates a comprehensive, professional PDF report from SEO analysis data
 */

import jsPDF from "jspdf";
import type { SEOAnalysisData } from "@/components/seo/types";

interface PDFOptions {
  title?: string;
  url?: string;
  date?: string;
}

// Professional color palette
const COLORS = {
  primary: [30, 58, 138] as [number, number, number], // Professional blue
  secondary: [71, 85, 105] as [number, number, number], // Slate gray
  text: [30, 41, 59] as [number, number, number], // Dark slate
  textLight: [100, 116, 139] as [number, number, number], // Slate 500
  border: [226, 232, 240] as [number, number, number], // Slate 200
  background: [248, 250, 252] as [number, number, number], // Slate 50
  success: [16, 185, 129] as [number, number, number], // Emerald
  warning: [245, 158, 11] as [number, number, number], // Amber
  error: [239, 68, 68] as [number, number, number], // Red
  info: [59, 130, 246] as [number, number, number], // Blue
};

/**
 * Get professional score color
 */
function getScoreColorRGB(score: number): [number, number, number] {
  if (score >= 90) return COLORS.success;
  if (score >= 70) return COLORS.info;
  if (score >= 50) return COLORS.warning;
  return COLORS.error;
}

/**
 * Format timing for display
 */
function formatTiming(timing: number): string {
  if (timing < 1000) {
    return `${Math.round(timing)}ms`;
  }
  return `${(timing / 1000).toFixed(2)}s`;
}

/**
 * Format bytes to readable size
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Check if we need a new page
 */
function checkPageBreak(doc: jsPDF, y: number, pageHeight: number, requiredSpace: number = 30): number {
  if (y + requiredSpace > pageHeight - 25) {
    doc.addPage();
    return 25;
  }
  return y;
}

/**
 * Add professional section header
 */
function addSectionHeader(doc: jsPDF, title: string, y: number, pageWidth: number): number {
  y = checkPageBreak(doc, y, 297, 20);
  
  // Background bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(20, y - 2, pageWidth - 40, 8, "F");
  
  // Title
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(title, 25, y + 3);
  
  return y + 12;
}

/**
 * Add subsection header
 */
function addSubsectionHeader(doc: jsPDF, title: string, y: number): number {
  y = checkPageBreak(doc, y, 297, 15);
  
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text(title, 25, y);
  
  // Subtle underline
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(25, y + 1, 185, y + 1);
  
  return y + 8;
}

/**
 * Add text with word wrapping
 */
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number = 9,
  color: [number, number, number] = COLORS.text
): number {
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * (fontSize * 0.4) + 3;
}

/**
 * Add key-value pair
 */
function addKeyValue(
  doc: jsPDF,
  key: string,
  value: string | number,
  x: number,
  y: number,
  maxWidth: number = 160
): number {
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textLight);
  doc.setFont("helvetica", "normal");
  doc.text(`${key}:`, x, y);
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  const valueStr = typeof value === "number" ? value.toString() : value;
  const lines = doc.splitTextToSize(valueStr, maxWidth - 30);
  doc.text(lines, x + 30, y);
  
  return y + lines.length * 3.6 + 4;
}

/**
 * Add table row
 */
function addTableRow(
  doc: jsPDF,
  label: string,
  value: string | number,
  y: number,
  pageWidth: number
): number {
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  
  // Background for alternating rows
  const rowIndex = Math.floor((y - 25) / 6);
  if (rowIndex % 2 === 0) {
    doc.setFillColor(...COLORS.background);
    doc.rect(25, y - 4, pageWidth - 50, 6, "F");
  }
  
  doc.text(label, 25, y);
  doc.setFont("helvetica", "bold");
  doc.text(String(value), pageWidth - 25, y, { align: "right" });
  
  return y + 6;
}

/**
 * Add score indicator (professional style)
 */
function addScoreIndicator(
  doc: jsPDF,
  label: string,
  score: number | null,
  x: number,
  y: number,
  width: number = 35
): void {
  if (score === null) {
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textLight);
    doc.setFont("helvetica", "normal");
    doc.text("N/A", x + width / 2, y + 4, { align: "center" });
    return;
  }
  
  const [r, g, b] = getScoreColorRGB(score);
  
  // Subtle background (using lighter color instead of alpha)
  const lightR = Math.min(255, r + (255 - r) * 0.9);
  const lightG = Math.min(255, g + (255 - g) * 0.9);
  const lightB = Math.min(255, b + (255 - b) * 0.9);
  doc.setFillColor(lightR, lightG, lightB);
  doc.roundedRect(x, y - 3, width, 8, 2, 2, "F");
  
  // Border
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y - 3, width, 8, 2, 2, "S");
  
  // Score text
  doc.setFontSize(9);
  doc.setTextColor(r, g, b);
  doc.setFont("helvetica", "bold");
  doc.text(`${score}%`, x + width / 2, y + 2, { align: "center" });
  
  // Label
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textLight);
  doc.setFont("helvetica", "normal");
  doc.text(label, x + width / 2, y - 5, { align: "center" });
}

/**
 * Add footer to all pages
 */
function addFooter(doc: jsPDF, pageWidth: number, pageHeight: number, pageNum: number, totalPages: number): void {
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textLight);
  doc.setFont("helvetica", "normal");
  
  // Footer line
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
  
  // Page number
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  
  // Company name
  doc.text("TrafficBox SEO Analysis", 25, pageHeight - 10);
  
  // Date
  doc.text(new Date().toLocaleDateString(), pageWidth - 25, pageHeight - 10, { align: "right" });
}

/**
 * Generate comprehensive PDF report
 */
export async function generateSEOPDF(
  data: SEOAnalysisData,
  options: PDFOptions = {}
): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  let y = margin;
  let currentPage = 1;

  const fullReportData = data.data?.fullReportJson?.data;
  const totalScore = 
    data.totalScore || 
    data.overallScore || 
    fullReportData?.overall_score?.total || 
    0;

  // ========== COVER PAGE ==========
  // Header with gradient effect
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 60, "F");
  
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("SEO Analysis Report", pageWidth / 2, 35, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Comprehensive Website Performance Analysis", pageWidth / 2, 45, { align: "center" });
  
  y = 80;
  
  // URL
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("Analyzed URL:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textLight);
  doc.text(data.url || "N/A", margin + 35, y);
  y += 8;
  
  // Analysis Date
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text("Analysis Date:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textLight);
  doc.text(new Date(data.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }), margin + 35, y);
  y += 8;
  
  // Processing Time
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text("Processing Time:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textLight);
  doc.text(`${(data.processingTime / 1000).toFixed(2)}s`, margin + 35, y);
  y += 20;
  
  // Overall Score Circle
  const [r, g, b] = getScoreColorRGB(totalScore);
  const centerX = pageWidth / 2;
  const centerY = y + 30;
  
  // Outer circle (using lighter color instead of alpha)
  const lightR = Math.min(255, r + (255 - r) * 0.9);
  const lightG = Math.min(255, g + (255 - g) * 0.9);
  const lightB = Math.min(255, b + (255 - b) * 0.9);
  doc.setFillColor(lightR, lightG, lightB);
  doc.circle(centerX, centerY, 35, "F");
  
  // Inner circle
  doc.setFillColor(r, g, b);
  doc.circle(centerX, centerY, 25, "F");
  
  // Score text
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalScore}`, centerX, centerY - 5, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("/100", centerX, centerY + 8, { align: "center" });
  
  y = centerY + 40;
  
  // Grade and Status
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text(`Grade: ${data.grade}`, centerX, y, { align: "center" });
  y += 8;
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textLight);
  doc.text(`Status: ${data.scoreStatus.replace(/_/g, " ")}`, centerX, y, { align: "center" });
  
  // Add footer to cover page
  const totalPages = 15; // Will be updated later
  addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  
  // ========== EXECUTIVE SUMMARY ==========
  doc.addPage();
  currentPage++;
  y = margin;
  
  y = addSectionHeader(doc, "Executive Summary", y, pageWidth);
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  
  const summaryText = `This comprehensive SEO analysis evaluates the overall performance, technical implementation, 
content quality, and user experience of ${data.url}. The analysis covers multiple dimensions including 
meta tags, content structure, technical SEO, performance metrics, mobile responsiveness, security, 
and accessibility.`;
  
  y = addWrappedText(doc, summaryText, margin, y, pageWidth - 2 * margin, 9);
  y += 10;
  
  // Key Metrics Grid
  y = addSubsectionHeader(doc, "Key Metrics", y);
  
  const scores = data.scores;
  let xPos = margin;
  const metrics = [
    { label: "Meta", score: scores.meta },
    { label: "Content", score: scores.content },
    { label: "Technical", score: scores.technical },
    { label: "Performance", score: scores.performance },
    { label: "Mobile", score: scores.mobile },
    { label: "Security", score: scores.security },
    { label: "Accessibility", score: scores.accessibility },
  ];
  
  let rowY = y;
  metrics.forEach((metric, index) => {
    if (index % 3 === 0 && index > 0) {
      xPos = margin;
      rowY += 15;
      y = checkPageBreak(doc, rowY, pageHeight, 15);
      rowY = y;
    }
    addScoreIndicator(doc, metric.label, metric.score, xPos, rowY, 55);
    xPos += 60;
  });
  y = rowY + 15;
  
  addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  
  // ========== LIGHTHOUSE SCORES ==========
  doc.addPage();
  currentPage++;
  y = margin;
  
  y = addSectionHeader(doc, "Lighthouse Performance Scores", y, pageWidth);
  
  const lighthouse = data.lighthouseScores;
  const lighthouseMetrics = [
    { label: "Performance", score: lighthouse.performance },
    { label: "Accessibility", score: lighthouse.accessibility },
    { label: "Best Practices", score: lighthouse.bestPractices },
    { label: "SEO", score: lighthouse.seo },
    { label: "PWA", score: lighthouse.pwa },
  ];
  
  xPos = margin;
  rowY = y;
  lighthouseMetrics.forEach((metric, index) => {
    if (index % 2 === 0 && index > 0) {
      xPos = margin;
      rowY += 20;
      y = checkPageBreak(doc, rowY, pageHeight, 20);
      rowY = y;
    }
    addScoreIndicator(doc, metric.label, metric.score, xPos, rowY, 85);
    xPos += 90;
  });
  y = rowY + 25;
  
  addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  
  // ========== CORE WEB VITALS ==========
  doc.addPage();
  currentPage++;
  y = margin;
  
  y = addSectionHeader(doc, "Core Web Vitals", y, pageWidth);
  
  const metrics_data = data.metrics;
  const vitals = [
    { label: "First Contentful Paint", short: "FCP", value: metrics_data.firstContentfulPaint, unit: "ms", threshold: 1800 },
    { label: "Largest Contentful Paint", short: "LCP", value: metrics_data.largestContentfulPaint, unit: "ms", threshold: 2500 },
    { label: "Total Blocking Time", short: "TBT", value: metrics_data.totalBlockingTime, unit: "ms", threshold: 200 },
    { label: "Cumulative Layout Shift", short: "CLS", value: metrics_data.cumulativeLayoutShift, unit: "", threshold: 0.1 },
    { label: "Speed Index", short: "SI", value: metrics_data.speedIndex, unit: "ms", threshold: 3400 },
    { label: "Time to Interactive", short: "TTI", value: metrics_data.timeToInteractive, unit: "ms", threshold: 3800 },
  ];
  
  y = addSubsectionHeader(doc, "Performance Metrics", y);
  
  vitals.forEach((vital) => {
    y = checkPageBreak(doc, y, pageHeight, 12);
    
    const value = vital.value !== null 
      ? `${(vital.value / (vital.unit === "" ? 1 : 1000)).toFixed(2)}${vital.unit || ""}`
      : "N/A";
    
    const isGood = vital.value !== null && vital.value <= vital.threshold;
    const statusColor = isGood ? COLORS.success : vital.value !== null && vital.value <= vital.threshold * 1.5 ? COLORS.warning : COLORS.error;
    
    // Label
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.text(`${vital.short} - ${vital.label}:`, margin, y);
    
    // Value with color
    doc.setFontSize(9);
    doc.setTextColor(...statusColor);
    doc.text(value, pageWidth - margin, y, { align: "right" });
    
    // Threshold info
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textLight);
    doc.setFont("helvetica", "normal");
    doc.text(`Threshold: ${vital.threshold}${vital.unit}`, margin + 5, y + 4);
    
    y += 10;
  });
  
  addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  
  // ========== META INFORMATION ==========
  if (fullReportData?.meta_information) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Meta Information Analysis", y, pageWidth);
    
    const meta = fullReportData.meta_information;
    
    // Title Tag
    y = addSubsectionHeader(doc, "Title Tag", y);
    y = addKeyValue(doc, "Content", meta.title.content, margin, y);
    y = addKeyValue(doc, "Length", `${meta.title.length} characters`, margin, y);
    y = addKeyValue(doc, "Status", meta.title.status, margin, y);
    if (meta.title.recommendations?.length > 0) {
      y += 2;
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.warning);
      doc.setFont("helvetica", "italic");
      meta.title.recommendations.forEach((rec: string) => {
        y = addWrappedText(doc, `• ${rec}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.warning);
      });
    }
    y += 5;
    
    // Meta Description
    y = checkPageBreak(doc, y, pageHeight, 40);
    y = addSubsectionHeader(doc, "Meta Description", y);
    y = addKeyValue(doc, "Content", meta.description.content, margin, y);
    y = addKeyValue(doc, "Length", `${meta.description.length} characters`, margin, y);
    y = addKeyValue(doc, "Status", meta.description.status, margin, y);
    if (meta.description.recommendations?.length > 0) {
      y += 2;
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.warning);
      doc.setFont("helvetica", "italic");
      meta.description.recommendations.forEach((rec: string) => {
        y = addWrappedText(doc, `• ${rec}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.warning);
      });
    }
    y += 5;
    
    // Keywords
    y = checkPageBreak(doc, y, pageHeight, 20);
    y = addSubsectionHeader(doc, "Keywords", y);
    y = addKeyValue(doc, "Content", meta.keywords.content || "Not present", margin, y);
    y = addKeyValue(doc, "Status", meta.keywords.status, margin, y);
    y += 5;
    
    // Robots
    y = checkPageBreak(doc, y, pageHeight, 15);
    y = addSubsectionHeader(doc, "Robots Directive", y);
    y = addKeyValue(doc, "Content", meta.robots.content, margin, y);
    y = addKeyValue(doc, "Status", meta.robots.status, margin, y);
    y += 5;
    
    // Canonical
    y = checkPageBreak(doc, y, pageHeight, 20);
    y = addSubsectionHeader(doc, "Canonical URL", y);
    y = addKeyValue(doc, "URL", meta.canonical.url || "Not present", margin, y);
    y = addKeyValue(doc, "Status", meta.canonical.status, margin, y);
    if (meta.canonical.recommendations?.length > 0) {
      y += 2;
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.warning);
      doc.setFont("helvetica", "italic");
      meta.canonical.recommendations.forEach((rec: string) => {
        y = addWrappedText(doc, `• ${rec}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.warning);
      });
    }
    y += 5;
    
    // Open Graph
    if (meta.open_graph) {
      y = checkPageBreak(doc, y, pageHeight, 25);
      y = addSubsectionHeader(doc, "Open Graph Tags", y);
      y = addKeyValue(doc, "Status", meta.open_graph.status, margin, y);
      if (meta.open_graph.missing_tags?.length > 0) {
        y += 2;
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.warning);
        doc.setFont("helvetica", "normal");
        doc.text("Missing Tags:", margin + 5, y);
        y += 4;
        meta.open_graph.missing_tags.forEach((tag: string) => {
          y = addWrappedText(doc, `• ${tag}`, margin + 10, y, pageWidth - 2 * margin - 10, 8, COLORS.warning);
        });
      }
      y += 5;
    }
    
    // Twitter Card
    if (meta.twitter_card) {
      y = checkPageBreak(doc, y, pageHeight, 25);
      y = addSubsectionHeader(doc, "Twitter Card Tags", y);
      y = addKeyValue(doc, "Status", meta.twitter_card.status, margin, y);
      if (meta.twitter_card.missing_tags?.length > 0) {
        y += 2;
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.warning);
        doc.setFont("helvetica", "normal");
        doc.text("Missing Tags:", margin + 5, y);
        y += 4;
        meta.twitter_card.missing_tags.forEach((tag: string) => {
          y = addWrappedText(doc, `• ${tag}`, margin + 10, y, pageWidth - 2 * margin - 10, 8, COLORS.warning);
        });
      }
      y += 5;
    }
    
    // Viewport
    y = checkPageBreak(doc, y, pageHeight, 15);
    y = addSubsectionHeader(doc, "Viewport Configuration", y);
    y = addKeyValue(doc, "Content", meta.viewport.content, margin, y);
    y = addKeyValue(doc, "Status", meta.viewport.status, margin, y);
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== CONTENT ANALYSIS ==========
  if (fullReportData?.content_analysis) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Content Analysis", y, pageWidth);
    
    const content = fullReportData.content_analysis;
    
    // Basic Stats
    y = addSubsectionHeader(doc, "Content Statistics", y);
    y = addTableRow(doc, "Word Count", content.word_count.toLocaleString(), y, pageWidth);
    y = addTableRow(doc, "Character Count", content.character_count.toLocaleString(), y, pageWidth);
    y = addTableRow(doc, "Reading Time", `${content.reading_time_minutes} minutes`, y, pageWidth);
    y = addTableRow(doc, "Content Score", `${content.score}%`, y, pageWidth);
    y += 5;
    
    // Readability
    y = checkPageBreak(doc, y, pageHeight, 20);
    y = addSubsectionHeader(doc, "Readability Analysis", y);
    y = addTableRow(doc, "Flesch Reading Ease", content.readability.flesch_reading_ease.toFixed(1), y, pageWidth);
    y = addTableRow(doc, "Flesch-Kincaid Grade", content.readability.flesch_kincaid_grade.toFixed(1), y, pageWidth);
    y = addTableRow(doc, "Difficulty Level", content.readability.difficulty.replace(/_/g, " "), y, pageWidth);
    y = addTableRow(doc, "Notes", content.readability.notes, y, pageWidth);
    y += 5;
    
    // Top Keywords
    if (content.top_keywords && content.top_keywords.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 30);
      y = addSubsectionHeader(doc, "Top Keywords", y);
      
      content.top_keywords.slice(0, 10).forEach((keyword: any) => {
        y = checkPageBreak(doc, y, pageHeight, 8);
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.text);
        doc.setFont("helvetica", "normal");
        doc.text(keyword.keyword, margin, y);
        doc.text(`Count: ${keyword.count}`, margin + 60, y);
        doc.text(`Density: ${keyword.density.toFixed(2)}%`, pageWidth - margin, y, { align: "right" });
        y += 6;
      });
    }
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== HEADINGS STRUCTURE ==========
  if (fullReportData?.headings) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Heading Structure", y, pageWidth);
    
    const headings = fullReportData.headings;
    
    // Heading Counts
    y = addSubsectionHeader(doc, "Heading Counts", y);
    y = addTableRow(doc, "H1 Tags", headings.h1_count, y, pageWidth);
    y = addTableRow(doc, "H2 Tags", headings.h2_count, y, pageWidth);
    y = addTableRow(doc, "H3 Tags", headings.h3_count, y, pageWidth);
    y = addTableRow(doc, "H4 Tags", headings.h4_count, y, pageWidth);
    y = addTableRow(doc, "H5 Tags", headings.h5_count, y, pageWidth);
    y = addTableRow(doc, "H6 Tags", headings.h6_count, y, pageWidth);
    y += 5;
    
    // Heading Structure
    if (headings.structure && headings.structure.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 25);
      y = addSubsectionHeader(doc, "Heading Hierarchy", y);
      
      headings.structure.forEach((heading: any) => {
        y = checkPageBreak(doc, y, pageHeight, 10);
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.text);
        doc.setFont("helvetica", "bold");
        doc.text(heading.level.toUpperCase(), margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.textLight);
        y = addWrappedText(doc, heading.text, margin + 15, y, pageWidth - margin - 15, 9, COLORS.textLight);
        y += 2;
      });
    }
    
    // Issues
    if (headings.issues && headings.issues.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 15);
      y = addSubsectionHeader(doc, "Heading Issues", y);
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.error);
      headings.issues.forEach((issue: string) => {
        y = addWrappedText(doc, `• ${issue}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.error);
      });
    }
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== LINKS & IMAGES ==========
  if (fullReportData?.links && fullReportData?.images) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Links & Images Analysis", y, pageWidth);
    
    const links = fullReportData.links;
    const images = fullReportData.images;
    
    // Links
    y = addSubsectionHeader(doc, "Link Analysis", y);
    y = addTableRow(doc, "Total Links", links.total, y, pageWidth);
    y = addTableRow(doc, "Internal Links", links.internal, y, pageWidth);
    y = addTableRow(doc, "External Links", links.external, y, pageWidth);
    y = addTableRow(doc, "NoFollow Links", links.nofollow || 0, y, pageWidth);
    y = addTableRow(doc, "DoFollow Links", links.dofollow || 0, y, pageWidth);
    y = addTableRow(doc, "Broken Links", links.broken || 0, y, pageWidth);
    y += 5;
    
    if (links.issues && links.issues.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 15);
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.error);
      doc.setFont("helvetica", "bold");
      doc.text("Link Issues:", margin, y);
      y += 4;
      links.issues.forEach((issue: string) => {
        y = addWrappedText(doc, `• ${issue}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.error);
      });
      y += 5;
    }
    
    // Images
    y = checkPageBreak(doc, y, pageHeight, 25);
    y = addSubsectionHeader(doc, "Image Analysis", y);
    y = addTableRow(doc, "Total Images", images.total, y, pageWidth);
    y = addTableRow(doc, "With Alt Text", images.with_alt, y, pageWidth);
    y = addTableRow(doc, "Without Alt Text", images.without_alt, y, pageWidth);
    y = addTableRow(doc, "Lazy Loaded", images.lazy_loaded || 0, y, pageWidth);
    y += 5;
    
    if (images.issues && images.issues.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 15);
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.error);
      doc.setFont("helvetica", "bold");
      doc.text("Image Issues:", margin, y);
      y += 4;
      images.issues.forEach((issue: string) => {
        y = addWrappedText(doc, `• ${issue}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.error);
      });
    }
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== TECHNICAL SEO ==========
  if (fullReportData?.technical_seo) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Technical SEO Analysis", y, pageWidth);
    
    const technical = fullReportData.technical_seo;
    
    y = addSubsectionHeader(doc, "SSL & Security", y);
    y = addTableRow(doc, "SSL Enabled", technical.ssl.enabled ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "SSL Status", technical.ssl.status, y, pageWidth);
    y += 5;
    
    y = checkPageBreak(doc, y, pageHeight, 20);
    y = addSubsectionHeader(doc, "Server Configuration", y);
    y = addTableRow(doc, "HTTP Status Code", technical.status_code, y, pageWidth);
    y = addTableRow(doc, "Redirects", technical.redirects, y, pageWidth);
    y += 5;
    
    y = checkPageBreak(doc, y, pageHeight, 20);
    y = addSubsectionHeader(doc, "Structured Data", y);
    y = addTableRow(doc, "Structured Data Exists", technical.structured_data.exists ? "Yes" : "No", y, pageWidth);
    if (technical.structured_data.exists) {
      y = addTableRow(doc, "Schema Types Count", technical.structured_data.count, y, pageWidth);
      if (technical.structured_data.types && technical.structured_data.types.length > 0) {
        y += 2;
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textLight);
        doc.text("Types:", margin + 5, y);
        y += 4;
        technical.structured_data.types.forEach((type: string) => {
          y = addWrappedText(doc, `• ${type}`, margin + 10, y, pageWidth - 2 * margin - 10, 8, COLORS.textLight);
        });
      }
    }
    y += 5;
    
    y = checkPageBreak(doc, y, pageHeight, 20);
    y = addSubsectionHeader(doc, "Crawling Configuration", y);
    y = addTableRow(doc, "Robots.txt Status", technical.robots_txt.status || "Not checked", y, pageWidth);
    y = addTableRow(doc, "Sitemap Status", technical.sitemap.status || "Not checked", y, pageWidth);
    y += 5;
    
    y = checkPageBreak(doc, y, pageHeight, 15);
    y = addSubsectionHeader(doc, "Technical SEO Score", y);
    y = addTableRow(doc, "Overall Score", `${technical.score}%`, y, pageWidth);
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== URL ANALYSIS ==========
  if (fullReportData?.url_analysis) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "URL Analysis", y, pageWidth);
    
    const urlAnalysis = fullReportData.url_analysis;
    
    y = addTableRow(doc, "URL Length", `${urlAnalysis.length} characters`, y, pageWidth);
    y = addTableRow(doc, "Contains Keywords", urlAnalysis.has_keywords ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Is Readable", urlAnalysis.is_readable ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Has Parameters", urlAnalysis.has_parameters ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Uses Hyphens", urlAnalysis.uses_hyphens ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Uses Underscores", urlAnalysis.uses_underscores ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "URL Depth", urlAnalysis.depth, y, pageWidth);
    y = addTableRow(doc, "Status", urlAnalysis.status, y, pageWidth);
    y += 5;
    
    if (urlAnalysis.issues && urlAnalysis.issues.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 15);
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.error);
      doc.setFont("helvetica", "bold");
      doc.text("URL Issues:", margin, y);
      y += 4;
      urlAnalysis.issues.forEach((issue: string) => {
        y = addWrappedText(doc, `• ${issue}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.error);
      });
    }
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== MOBILE ANALYSIS ==========
  if (fullReportData?.mobile) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Mobile Analysis", y, pageWidth);
    
    const mobile = fullReportData.mobile;
    
    y = addTableRow(doc, "Mobile Friendly", mobile.is_mobile_friendly ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Viewport Configured", mobile.viewport_configured ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Responsive Design", mobile.responsive_design ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Media Queries", mobile.media_queries, y, pageWidth);
    y = addTableRow(doc, "Mobile Score", `${mobile.score}%`, y, pageWidth);
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== SECURITY & ACCESSIBILITY ==========
  if (fullReportData?.security && fullReportData?.accessibility) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Security & Accessibility", y, pageWidth);
    
    const security = fullReportData.security;
    const accessibility = fullReportData.accessibility;
    
    // Security
    y = addSubsectionHeader(doc, "Security Analysis", y);
    y = addTableRow(doc, "HTTPS Enabled", security.https ? "Yes" : "No", y, pageWidth);
    y = addTableRow(doc, "Security Score", `${security.score}%`, y, pageWidth);
    y += 5;
    
    if (security.issues && security.issues.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 15);
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.error);
      doc.setFont("helvetica", "bold");
      doc.text("Security Issues:", margin, y);
      y += 4;
      security.issues.forEach((issue: string) => {
        y = addWrappedText(doc, `• ${issue}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.error);
      });
      y += 5;
    }
    
    // Accessibility
    y = checkPageBreak(doc, y, pageHeight, 30);
    y = addSubsectionHeader(doc, "Accessibility Analysis", y);
    y = addTableRow(doc, "ARIA Labels", accessibility.aria_labels, y, pageWidth);
    y = addTableRow(doc, "Alt Text Coverage", `${accessibility.alt_text_coverage}%`, y, pageWidth);
    y = addTableRow(doc, "Form Labels", `${accessibility.form_labels}%`, y, pageWidth);
    y = addTableRow(doc, "Accessibility Score", `${accessibility.score}%`, y, pageWidth);
    y += 5;
    
    if (accessibility.semantic_html) {
      y = checkPageBreak(doc, y, pageHeight, 20);
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.text);
      doc.setFont("helvetica", "bold");
      doc.text("Semantic HTML Elements:", margin, y);
      y += 5;
      const semantic = accessibility.semantic_html;
      y = addTableRow(doc, "Nav", semantic.nav, y, pageWidth);
      y = addTableRow(doc, "Header", semantic.header, y, pageWidth);
      y = addTableRow(doc, "Footer", semantic.footer, y, pageWidth);
      y = addTableRow(doc, "Main", semantic.main, y, pageWidth);
      y = addTableRow(doc, "Article", semantic.article, y, pageWidth);
      y = addTableRow(doc, "Section", semantic.section, y, pageWidth);
      y += 5;
    }
    
    if (accessibility.issues && accessibility.issues.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 15);
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.error);
      doc.setFont("helvetica", "bold");
      doc.text("Accessibility Issues:", margin, y);
      y += 4;
      accessibility.issues.forEach((issue: string) => {
        y = addWrappedText(doc, `• ${issue}`, margin + 5, y, pageWidth - 2 * margin - 5, 8, COLORS.error);
      });
    }
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== PERFORMANCE DETAILS ==========
  if (fullReportData?.performance) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Performance Details", y, pageWidth);
    
    const performance = fullReportData.performance;
    
    y = addSubsectionHeader(doc, "Page Metrics", y);
    y = addTableRow(doc, "Page Load Time", performance.page_load_time_ms ? `${performance.page_load_time_ms}ms` : "N/A", y, pageWidth);
    y = addTableRow(doc, "Page Size", performance.page_size_formatted || formatBytes(performance.page_size_bytes || 0), y, pageWidth);
    y = addTableRow(doc, "Performance Score", `${performance.score}%`, y, pageWidth);
    y += 5;
    
    // Core Web Vitals
    if (performance.lighthouse?.core_web_vitals) {
      y = checkPageBreak(doc, y, pageHeight, 30);
      y = addSubsectionHeader(doc, "Core Web Vitals", y);
      
      const cwv = performance.lighthouse.core_web_vitals;
      const vitals = [
        { key: "first-contentful-paint", label: "First Contentful Paint (FCP)", good: 1800, poor: 3000 },
        { key: "largest-contentful-paint", label: "Largest Contentful Paint (LCP)", good: 2500, poor: 4000 },
        { key: "total-blocking-time", label: "Total Blocking Time (TBT)", good: 200, poor: 600 },
        { key: "cumulative-layout-shift", label: "Cumulative Layout Shift (CLS)", good: 0.1, poor: 0.25 },
        { key: "speed-index", label: "Speed Index", good: 3400, poor: 5800 },
        { key: "interactive", label: "Time to Interactive (TTI)", good: 3800, poor: 7300 },
      ];
      
      vitals.forEach((vital) => {
        const metric = cwv[vital.key];
        if (metric && typeof metric.numericValue === "number") {
          y = checkPageBreak(doc, y, pageHeight, 8);
          const value = metric.numericValue;
          const displayValue = metric.displayValue || formatTiming(value);
          const status = value <= vital.good ? "good" : value <= vital.poor ? "needs-improvement" : "poor";
          const statusColor = status === "good" ? COLORS.success : status === "needs-improvement" ? COLORS.warning : COLORS.error;
          
          doc.setFontSize(9);
          doc.setTextColor(...COLORS.text);
          doc.setFont("helvetica", "normal");
          doc.text(vital.label, margin, y);
          
          doc.setFontSize(9);
          doc.setTextColor(...statusColor);
          doc.setFont("helvetica", "bold");
          doc.text(displayValue, pageWidth - margin - 40, y, { align: "right" });
          
          // Status indicator
          doc.setFillColor(...statusColor);
          doc.circle(pageWidth - margin - 5, y - 1.5, 2, "F");
          
          y += 6;
        }
      });
      y += 3;
    }
    
    // Page Load Timeline (from screenshot data)
    const lighthouseData = performance.lighthouse;
    if (lighthouseData?.core_web_vitals?.["screenshot-thumbnails"]?.details?.items) {
      y = checkPageBreak(doc, y, pageHeight, 40);
      y = addSubsectionHeader(doc, "Page Load Timeline", y);
      
      const screenshots = lighthouseData.core_web_vitals["screenshot-thumbnails"].details.items;
      const maxTime = Math.max(...screenshots.map((s: any) => s.timing || 0), performance.page_load_time_ms || 3000);
      const timelineWidth = pageWidth - 2 * margin;
      const timelineStartX = margin;
      const timelineY = y;
      
      // Timeline axis
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.5);
      doc.line(timelineStartX, timelineY, timelineStartX + timelineWidth, timelineY);
      
      // Timeline markers
      screenshots.forEach((screenshot: any) => {
        const timing = screenshot.timing || 0;
        const x = timelineStartX + (timing / maxTime) * timelineWidth;
        
        // Marker
        doc.setFillColor(...COLORS.primary);
        doc.circle(x, timelineY, 2, "F");
        
        // Timing label
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textLight);
        doc.setFont("helvetica", "normal");
        const labelY = timelineY - 4;
        doc.text(formatTiming(timing), x, labelY, { align: "center" });
      });
      
      // Final load time marker
      if (performance.page_load_time_ms) {
        const finalX = timelineStartX + (performance.page_load_time_ms / maxTime) * timelineWidth;
        doc.setFillColor(...COLORS.success);
        doc.circle(finalX, timelineY, 2.5, "F");
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.success);
        doc.setFont("helvetica", "bold");
        doc.text(`Loaded: ${formatTiming(performance.page_load_time_ms)}`, finalX, timelineY - 4, { align: "center" });
      }
      
      y = timelineY + 15;
      
      // Timeline legend
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textLight);
      doc.setFont("helvetica", "normal");
      doc.text("Note: Screenshot thumbnails are available in the web interface", margin, y);
      y += 5;
    }
    
    if (performance.resources) {
      y = checkPageBreak(doc, y, pageHeight, 20);
      y = addSubsectionHeader(doc, "Resource Breakdown", y);
      y = addTableRow(doc, "Scripts", performance.resources.scripts, y, pageWidth);
      y = addTableRow(doc, "Stylesheets", performance.resources.stylesheets, y, pageWidth);
      y = addTableRow(doc, "Images", performance.resources.images, y, pageWidth);
    }
    
    if (data.fileSizes) {
      y = checkPageBreak(doc, y, pageHeight, 20);
      y = addSubsectionHeader(doc, "File Size Optimization", y);
      y = addTableRow(doc, "Original Size", formatBytes(data.fileSizes.originalResponseBytes), y, pageWidth);
      y = addTableRow(doc, "Optimized Size", formatBytes(data.fileSizes.optimizedResponseBytes), y, pageWidth);
      const savings = data.fileSizes.originalResponseBytes - data.fileSizes.optimizedResponseBytes;
      const savingsPercent = ((savings / data.fileSizes.originalResponseBytes) * 100).toFixed(1);
      y = addTableRow(doc, "Potential Savings", `${formatBytes(savings)} (${savingsPercent}%)`, y, pageWidth);
    }
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== RECOMMENDATIONS ==========
  if (fullReportData?.recommendations && fullReportData.recommendations.length > 0) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Recommendations", y, pageWidth);
    
    const recommendations = fullReportData.recommendations;
    
    recommendations.forEach((rec: any, index: number) => {
      y = checkPageBreak(doc, y, pageHeight, 35);
      
      // Priority indicator
      const priorityColors: Record<string, [number, number, number]> = {
        critical: [239, 68, 68] as [number, number, number],
        high: [245, 158, 11] as [number, number, number],
        medium: [59, 130, 246] as [number, number, number],
        low: [100, 116, 139] as [number, number, number],
      };
      
      const [pr, pg, pb] = priorityColors[rec.priority.toLowerCase()] || COLORS.textLight;
      
      // Priority badge (using lighter color instead of alpha)
      const lightPr = Math.min(255, pr + (255 - pr) * 0.8);
      const lightPg = Math.min(255, pg + (255 - pg) * 0.8);
      const lightPb = Math.min(255, pb + (255 - pb) * 0.8);
      doc.setFillColor(lightPr, lightPg, lightPb);
      doc.roundedRect(margin, y - 4, 15, 6, 1, 1, "F");
      doc.setDrawColor(pr, pg, pb);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y - 4, 15, 6, 1, 1, "S");
      
      doc.setFontSize(7);
      doc.setTextColor(pr, pg, pb);
      doc.setFont("helvetica", "bold");
      doc.text(rec.priority.toUpperCase(), margin + 7.5, y, { align: "center" });
      
      // Category
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textLight);
      doc.setFont("helvetica", "normal");
      doc.text(`[${rec.category}]`, margin + 18, y);
      
      // Issue
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);
      doc.setFont("helvetica", "bold");
      y = addWrappedText(doc, rec.issue, margin + 18, y + 6, pageWidth - margin - 18, 10);
      
      // Impact
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textLight);
      doc.setFont("helvetica", "italic");
      y = addWrappedText(doc, `Impact: ${rec.impact}`, margin + 18, y, pageWidth - margin - 18, 8, COLORS.textLight);
      
      // Recommendation
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.text);
      doc.setFont("helvetica", "normal");
      y = addWrappedText(doc, rec.recommendation, margin + 18, y, pageWidth - margin - 18, 9);
      
      y += 5;
    });
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // ========== ISSUES SUMMARY ==========
  if (fullReportData?.issues) {
    doc.addPage();
    currentPage++;
    y = margin;
    
    y = addSectionHeader(doc, "Issues Summary", y, pageWidth);
    
    const issues = fullReportData.issues;
    
    // Critical Issues
    if (issues.critical && issues.critical.length > 0) {
      y = addSubsectionHeader(doc, "Critical Issues", y);
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.error);
      issues.critical.forEach((issue: any) => {
        y = checkPageBreak(doc, y, pageHeight, 10);
        const message = typeof issue === "string" ? issue : issue.message;
        y = addWrappedText(doc, `• ${message}`, margin + 5, y, pageWidth - 2 * margin - 5, 9, COLORS.error);
      });
      y += 5;
    }
    
    // Warnings
    if (issues.warnings && issues.warnings.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 20);
      y = addSubsectionHeader(doc, "Warnings", y);
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.warning);
      issues.warnings.forEach((warning: any) => {
        y = checkPageBreak(doc, y, pageHeight, 10);
        const message = typeof warning === "string" ? warning : warning.message;
        const type = warning.type ? `[${warning.type}] ` : "";
        y = addWrappedText(doc, `• ${type}${message}`, margin + 5, y, pageWidth - 2 * margin - 5, 9, COLORS.warning);
      });
      y += 5;
    }
    
    // Notices
    if (issues.notices && issues.notices.length > 0) {
      y = checkPageBreak(doc, y, pageHeight, 20);
      y = addSubsectionHeader(doc, "Notices", y);
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.info);
      issues.notices.forEach((notice: any) => {
        y = checkPageBreak(doc, y, pageHeight, 10);
        const message = typeof notice === "string" ? notice : notice.message;
        const type = notice.type ? `[${notice.type}] ` : "";
        y = addWrappedText(doc, `• ${type}${message}`, margin + 5, y, pageWidth - 2 * margin - 5, 9, COLORS.info);
      });
    }
    
    addFooter(doc, pageWidth, pageHeight, currentPage, totalPages);
  }
  
  // Update total pages and add footer to all pages
  const finalPageCount = (doc as any).internal?.getNumberOfPages() || currentPage;
  for (let i = 1; i <= finalPageCount; i++) {
    doc.setPage(i);
    addFooter(doc, pageWidth, pageHeight, i, finalPageCount);
  }
  
  return doc.output("blob");
}
