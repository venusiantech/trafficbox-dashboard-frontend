/**
 * SEO Report PDF Generator
 * Generates a comprehensive PDF report by capturing screenshots of actual page components
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import type { SEOAnalysisData } from "@/components/seo/types";

interface PDFOptions {
  title?: string;
  url?: string;
  date?: string;
}

// Professional color palette
const COLORS = {
  primary: [30, 58, 138] as [number, number, number],
  text: [30, 41, 59] as [number, number, number],
  textLight: [100, 116, 139] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
};

/**
 * Load image as base64 from public folder
 */
async function loadImageAsBase64(path: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve("");
        }
      } catch (error) {
        console.error("Error converting image to base64:", error);
        resolve("");
      }
    };
    
    img.onerror = () => {
      console.warn("Could not load logo image:", path);
      resolve("");
    };
    
    img.src = path;
  });
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
 * Capture component screenshot
 */
async function captureComponent(element: HTMLElement): Promise<{ dataUrl: string; width: number; height: number }> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });
    
    return {
      dataUrl: canvas.toDataURL("image/png", 0.95),
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    console.error("Error capturing component:", error);
    throw error;
  }
}


/**
 * Generate comprehensive PDF report from component screenshots
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

  // ========== COVER PAGE ==========
  // Load and add logo
  const logoPath = "/logo/trafficboxes_logo_full.png";
  try {
    const logoData = await loadImageAsBase64(logoPath);
    if (logoData) {
      // Add logo to top left (20mm from left, 15mm from top)
      // Logo size: 40mm width, height will be calculated automatically to maintain aspect ratio
      const logoWidth = 40;
      doc.addImage(logoData, "PNG", 20, 15, logoWidth, 0, undefined, "FAST");
    }
  } catch (error) {
    console.warn("Could not load logo:", error);
  }
  
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
  const urlText = data.url || "N/A";
  const urlLines = doc.splitTextToSize(urlText, pageWidth - 2 * margin - 35);
  doc.text(urlLines, margin + 35, y);
  y += urlLines.length * 4 + 8;
  
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
  
  // ========== CAPTURE COMPONENT SCREENSHOTS ==========
  // Component selectors based on data attributes we'll add to the page
  const componentSelectors = [
    '[data-pdf-component="overall-score"]',
    '[data-pdf-component="lighthouse-scores"]',
    '[data-pdf-component="core-web-vitals"]',
    '[data-pdf-component="performance-details"]',
    '[data-pdf-component="meta-information"]',
    '[data-pdf-component="content-analysis"]',
    '[data-pdf-component="links-images"]',
    '[data-pdf-component="technical-seo"]',
    '[data-pdf-component="security-accessibility"]',
    '[data-pdf-component="mobile-analysis"]',
    '[data-pdf-component="screenshots"]',
    '[data-pdf-component="recommendations"]',
  ];
  
  // Capture each component
  for (const selector of componentSelectors) {
    const element = document.querySelector(selector) as HTMLElement;
    
    if (!element) {
      console.warn(`Component not found: ${selector}`);
      continue;
    }
    
    try {
      // Wait a bit for any animations/transitions to complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Capture screenshot
      const { dataUrl, width, height } = await captureComponent(element);
      
      // Calculate dimensions
      const pxToMm = 0.264583;
      const actualWidth = (width / 2) * pxToMm;
      const actualHeight = (height / 2) * pxToMm;
      const aspectRatio = actualHeight / actualWidth;
      const maxWidth = 170;
      const displayWidth = Math.min(maxWidth, actualWidth);
      const displayHeight = displayWidth * aspectRatio;
      const footerSpace = 20;
      const spacing = 15;
      const requiredSpace = displayHeight + spacing;
      
      // Check if we need a new page (with some buffer)
      const availableSpace = pageHeight - y - footerSpace - 5; // 5mm buffer
      
      if (requiredSpace > availableSpace && y > margin) {
        // Only add new page if current page has content
        doc.addPage();
        currentPage++;
        y = margin;
      }
      
      // Add image to PDF
      const x = (pageWidth - displayWidth) / 2;
      doc.addImage(dataUrl, "PNG", x, y, displayWidth, displayHeight, undefined, "FAST");
      
      // Update y position
      y = y + displayHeight + spacing;
    } catch (error) {
      console.error(`Error capturing component ${selector}:`, error);
      // Continue with next component even if one fails
    }
  }
  
  // Add footer to all pages (only once at the end to avoid duplication)
  const finalPageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= finalPageCount; i++) {
    doc.setPage(i);
    addFooter(doc, pageWidth, pageHeight, i, finalPageCount);
  }
  
  return doc.output("blob");
}
