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
      pdf.setFillColor(29, 78, 216); // blue-700
      pdf.triangle(pageWidth - 80, 0, pageWidth, 0, pageWidth, 80, "F");
      
      pdf.setFillColor(37, 99, 235); // blue-600 (lighter)
      pdf.triangle(pageWidth - 110, 0, pageWidth, 0, pageWidth, 110, "F");
      
      pdf.setFillColor(59, 130, 246); // blue-500
      pdf.triangle(pageWidth, 30, pageWidth, 140, pageWidth - 110, 30, "F");

      // Bottom Left Blue Accent
      pdf.setFillColor(30, 58, 138); // blue-900
      pdf.triangle(0, pageHeight - 80, 0, pageHeight, 80, pageHeight, "F");
      
      pdf.setFillColor(37, 99, 235); // blue-600
      pdf.triangle(0, pageHeight - 110, 0, pageHeight, 110, pageHeight, "F");

      pdf.setFillColor(59, 130, 246); // blue-500
      pdf.triangle(0, pageHeight - 30, 0, pageHeight - 140, 110, pageHeight - 30, "F");

      // === LOGO TEXT ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(30, 58, 138); // blue-900
      pdf.text("InfraCode", 25, 35);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(16);
      pdf.setTextColor(71, 85, 105); // slate-600
      pdf.text("ACADEMY", 25, 43);

      // === HEADER TEXT ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(71, 85, 105);
      pdf.text("CERTIFICADO DE PARTICIPACIÓN", centerX, 65, { align: "center" });

      // Teal/Mint Line
      pdf.setDrawColor(20, 184, 166); // teal-500
      pdf.setLineWidth(1.5);
      pdf.line(centerX - 60, 68, centerX + 60, 68);

      // === TITLE ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(40);
      pdf.setTextColor(15, 23, 42); // slate-900
      pdf.text("CERTIFICADO", centerX, 85, { align: "center", charSpace: 2 });

      // === SUBTITLE ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text("OTORGADO CON HONOR A:", centerX, 100, { align: "center" });

      // === STUDENT NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(28);
      pdf.setTextColor(15, 23, 42);
      pdf.text(safeStudentName, centerX, 115, { align: "center" });
      
      // Line under name
      const nameWidth = pdf.getTextWidth(safeStudentName);
      pdf.setDrawColor(203, 213, 225); // slate-300
      pdf.setLineWidth(0.5);
      pdf.line(centerX - nameWidth / 2 - 10, 118, centerX + nameWidth / 2 + 10, 118);

      // === COURSE LABEL ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text("POR HABER APROBADO CON ÉXITO EL CURSO:", centerX, 130, { align: "center" });

      // === COURSE NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(15, 23, 42);
      pdf.text(safeCourseName, centerX, 142, { align: "center" });

      // === BOTTOM SECTION ===
      // Date
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      pdf.text(date, 70, 180, { align: "center" });
      
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.5);
      pdf.line(40, 183, 100, 183);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text("FECHA", 70, 189, { align: "center" });

      // Signature
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      pdf.text("Director Principal", pageWidth - 70, 178, { align: "center" });
      
      pdf.setDrawColor(203, 213, 225);
      pdf.line(pageWidth - 100, 183, pageWidth - 40, 183);
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(15, 23, 42);
      pdf.text("DIRECTOR DE DESARROLLO ACADÉMICO", pageWidth - 70, 189, { align: "center" });

      // Footer disclaimer
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text("Este certificado virtual autogestionado valida la finalización y aprobación del material del curso.", centerX, 200, { align: "center" });

      // Slogan
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Be Limitless. Be Successful.", 45, pageHeight - 15);

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
