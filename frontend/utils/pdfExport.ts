import jsPDF from "jspdf";
import { Post, FolderType } from "@/types";

interface ExportOptions {
  folderId: string | null;
  posts: Post[];
  folders: FolderType[];
}

export const generatePostsPDF = ({
  folderId,
  posts,
  folders,
}: ExportOptions) => {
  const doc = new jsPDF();

  // Filter posts based on selected folder
  const filteredPosts = folderId
    ? posts.filter((post) => post.folderId === folderId)
    : posts;

  // Get folder name
  const folderName = folderId
    ? folders.find((f) => f.id === folderId)?.name || "Unknown Folder"
    : "All Posts";

  // PDF Setup
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * (fontSize * 0.352778); // Convert points to mm
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Social Media Posts Export", margin, yPosition);
  yPosition += 10;

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`Folder: ${folderName}`, margin, yPosition);
  yPosition += 5;

  doc.setFontSize(12);
  doc.text(`Total Posts: ${filteredPosts.length}`, margin, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    margin,
    yPosition
  );
  yPosition += 15;

  // Add line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Export each post
  filteredPosts.forEach((post, index) => {
    checkNewPage(60); // Estimate space needed for a post

    // Post header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Post ${index + 1}`, margin, yPosition);
    yPosition += 8;

    // Post metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Platform and status
    doc.text(
      `Platform: ${post.platform || "All Platforms"}`,
      margin,
      yPosition
    );
    doc.text(`Status: ${post.status.toUpperCase()}`, margin + 80, yPosition);
    yPosition += 5;

    // Dates
    doc.text(
      `Created: ${new Date(post.createdAt).toLocaleDateString()}`,
      margin,
      yPosition
    );
    if (post.scheduledAt) {
      doc.text(
        `Scheduled: ${new Date(post.scheduledAt).toLocaleDateString()}`,
        margin + 80,
        yPosition
      );
    }
    yPosition += 8;

    // Caption
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Caption:", margin, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    yPosition = addWrappedText(
      post.caption || "No caption",
      margin,
      yPosition,
      contentWidth,
      10
    );
    yPosition += 5;

    // Hashtags
    if (post.hashtags) {
      doc.setFont("helvetica", "bold");
      doc.text("Hashtags:", margin, yPosition);
      yPosition += 5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(59, 130, 246); // Blue color for hashtags
      yPosition = addWrappedText(
        post.hashtags,
        margin,
        yPosition,
        contentWidth,
        10
      );
      doc.setTextColor(0, 0, 0); // Reset to black
      yPosition += 5;
    }

    // Image prompt
    if (post.imagePrompt) {
      doc.setFont("helvetica", "bold");
      doc.text("Image Idea:", margin, yPosition);
      yPosition += 5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(102, 102, 102); // Gray color
      yPosition = addWrappedText(
        post.imagePrompt,
        margin,
        yPosition,
        contentWidth,
        9
      );
      doc.setTextColor(0, 0, 0); // Reset to black
      yPosition += 5;
    }

    // Separator line
    yPosition += 5;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  });

  // Add footer on last page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `AutoContent Studio - Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    );
  }

  // Generate filename
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `posts-${folderName
    .toLowerCase()
    .replace(/\s+/g, "-")}-${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
};
