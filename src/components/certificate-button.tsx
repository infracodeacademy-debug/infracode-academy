"use client";

import { useState } from "react";
import { Download, Loader2, Lock } from "lucide-react";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";

interface CertificateButtonProps {
  courseName: string;
  studentName: string;
  isLocked?: boolean;
}

export const CertificateButton = ({
  courseName,
  studentName,
  isLocked = false,
}: CertificateButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async () => {
    try {
      setIsGenerating(true);

      const safeStudentName = studentName || "Estudiante";
      const safeCourseName = courseName || "Curso de InfraCode";

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();  // 297
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210
      const centerX = pageWidth / 2;

      const date = format(new Date(), "dd/MM/yyyy", { locale: es });

      // === BACKGROUND ===
      pdf.setFillColor(250, 252, 255); // Very light blue/white
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // === DECORATIVE SHAPES (BIU Inspired) ===
      
      // Top Right Blue Accent
      pdf.setFillColor(37, 99, 235); // blue-600
      pdf.triangle(pageWidth - 60, 0, pageWidth, 0, pageWidth, 60, "F");
      
      pdf.setFillColor(29, 78, 216); // blue-700
      pdf.triangle(pageWidth - 90, 0, pageWidth, 0, pageWidth, 90, "F");
      
      pdf.setFillColor(59, 130, 246); // blue-500
      pdf.triangle(pageWidth, 20, pageWidth, 120, pageWidth - 100, 20, "F");

      // Bottom Left Blue Accent
      pdf.setFillColor(30, 58, 138); // blue-900
      pdf.triangle(0, pageHeight - 100, 0, pageHeight, 100, pageHeight, "F");
      
      pdf.setFillColor(29, 78, 216); // blue-700
      pdf.triangle(0, pageHeight - 130, 0, pageHeight, 130, pageHeight, "F");

      pdf.setFillColor(37, 99, 235); // blue-600
      pdf.triangle(0, pageHeight - 40, 0, pageHeight - 150, 110, pageHeight - 40, "F");

      // === LOGO TEXT ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.setTextColor(30, 58, 138); // blue-900
      pdf.text("InfraCode", 25, 30);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138); // blue-900
      pdf.text("ACADEMY", 25, 37);

      // === HEADER TEXT ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(51, 65, 85); // slate-700
      pdf.text("PARTICIPATION", centerX, 55, { align: "center", charSpace: 4 });

      // Teal lines
      pdf.setDrawColor(20, 184, 166); // teal-500
      pdf.setLineWidth(1.5);
      pdf.line(centerX - 80, 58, centerX - 10, 58); // Left teal line
      pdf.line(centerX + 10, 58, centerX + 80, 58); // Right teal line

      // === TITLE ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(44);
      pdf.setTextColor(30, 58, 138); // blue-900
      pdf.text("CERTIFICATE", centerX, 75, { align: "center", charSpace: 8 });

      // === SUBTITLE ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(51, 65, 85); // slate-700
      pdf.text("AWARDED WITH HONOR TO:", centerX, 95, { align: "center", charSpace: 1 });

      // === STUDENT NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42); // slate-900
      pdf.text(safeStudentName, 40, 115, { align: "left" });
      
      // Line under name
      pdf.setDrawColor(148, 163, 184); // slate-400
      pdf.setLineWidth(0.5);
      pdf.line(40, 120, pageWidth - 40, 120);

      // === COURSE LABEL ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text("FOR HAVING PASSED THE CERTIFICATION:", 40, 130, { align: "left" });

      // === COURSE NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      pdf.text(safeCourseName, 40, 140, { align: "left" });

      // === COMPETENCE ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(15, 23, 42);
      pdf.text("Competence: Technology", 40, 150, { align: "left" });

      // === BOTTOM SECTION ===
      // Signature Graphic (Simulated with cursive-like text for now)
      pdf.setFont("times", "italic");
      pdf.setFontSize(32);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text("InfraCode Academy", pageWidth - 100, 155, { align: "center" });

      // Signature Details
      pdf.setDrawColor(148, 163, 184);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth - 160, 160, pageWidth - 40, 160);
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(30, 58, 138); // blue-900
      pdf.text("LUIS DIEGO FERNÁNDEZ", pageWidth - 100, 166, { align: "center" });
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(30, 58, 138); // blue-900
      pdf.text("DIRECTOR DE DESARROLLO ACADÉMICO", pageWidth - 100, 172, { align: "center" });

      // Date
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      pdf.text(date, pageWidth - 100, 182, { align: "center" });
      
      pdf.setDrawColor(148, 163, 184);
      pdf.line(pageWidth - 140, 185, pageWidth - 60, 185);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text("DATE", pageWidth - 100, 190, { align: "center", charSpace: 2 });

      // Footer disclaimer
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      const disclaimer = "This self-management virtual certificate is not intended to qualify its participants and graduates for employment. It is intended solely\nfor vocational development, personal and professional enrichment.";
      pdf.text(disclaimer, pageWidth - 140, 198, { align: "left" });

      // Slogan
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Be Limitless. Be Successful.", 15, pageHeight - 15);

      // === SAVE ===
      pdf.save(`Certificado_${safeCourseName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error al generar el certificado. Revisa la consola o intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (isLocked) {
    return (
      <Button
        disabled
        className="w-full bg-slate-800 text-slate-500 border border-slate-700 justify-start"
        variant="outline"
      >
        <Lock className="h-4 w-4 mr-2" />
        Certificado Bloqueado
      </Button>
    )
  }

  return (
    <Button
      onClick={generateCertificate}
      disabled={isGenerating}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Descargar Certificado PDF
    </Button>
  )
}
