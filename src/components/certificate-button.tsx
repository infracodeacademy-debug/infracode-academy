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

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();  // 297
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210
      const centerX = pageWidth / 2;

      const date = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

      // === BACKGROUND ===
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // === BORDER ===
      pdf.setDrawColor(139, 92, 246); // violet-500
      pdf.setLineWidth(1.5);
      pdf.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 6, 6, "S");

      // Inner decorative border
      pdf.setDrawColor(139, 92, 246);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(16, 16, pageWidth - 32, pageHeight - 32, 4, 4, "S");

      // === DECORATIVE CORNERS ===
      const cornerSize = 15;
      pdf.setDrawColor(167, 139, 250); // violet-400
      pdf.setLineWidth(0.8);
      // Top-left
      pdf.line(18, 22, 18, 22 + cornerSize);
      pdf.line(18, 22, 18 + cornerSize, 22);
      // Top-right
      pdf.line(pageWidth - 18, 22, pageWidth - 18, 22 + cornerSize);
      pdf.line(pageWidth - 18, 22, pageWidth - 18 - cornerSize, 22);
      // Bottom-left
      pdf.line(18, pageHeight - 22, 18, pageHeight - 22 - cornerSize);
      pdf.line(18, pageHeight - 22, 18 + cornerSize, pageHeight - 22);
      // Bottom-right
      pdf.line(pageWidth - 18, pageHeight - 22, pageWidth - 18, pageHeight - 22 - cornerSize);
      pdf.line(pageWidth - 18, pageHeight - 22, pageWidth - 18 - cornerSize, pageHeight - 22);

      // === DECORATIVE LINE TOP ===
      pdf.setDrawColor(139, 92, 246);
      pdf.setLineWidth(0.5);
      pdf.line(centerX - 60, 38, centerX + 60, 38);

      // === LOGO TEXT ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text("INFRACODE ACADEMY", centerX, 34, { align: "center" });

      // === TITLE ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.setTextColor(167, 139, 250); // violet-400
      pdf.text("CERTIFICADO", centerX, 56, { align: "center" });

      pdf.setFontSize(16);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text("DE FINALIZACIÓN", centerX, 65, { align: "center" });

      // === DECORATIVE LINE ===
      pdf.setDrawColor(139, 92, 246);
      pdf.setLineWidth(0.5);
      pdf.line(centerX - 40, 70, centerX + 40, 70);

      // === SUBTITLE ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(203, 213, 225); // slate-300
      pdf.text("Este certificado se otorga con orgullo a:", centerX, 82, { align: "center" });

      // === STUDENT NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      pdf.text(studentName, centerX, 100, { align: "center" });

      // Underline under the name
      const nameWidth = pdf.getTextWidth(studentName);
      pdf.setDrawColor(139, 92, 246);
      pdf.setLineWidth(0.8);
      pdf.line(centerX - nameWidth / 2, 103, centerX + nameWidth / 2, 103);

      // === COURSE LABEL ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(203, 213, 225);
      pdf.text("Por haber completado exitosamente el curso:", centerX, 118, { align: "center" });

      // === COURSE NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(226, 232, 240); // slate-200
      pdf.text(courseName, centerX, 132, { align: "center" });

      // === DECORATIVE STARS ===
      pdf.setFontSize(18);
      pdf.setTextColor(139, 92, 246);
      pdf.text("★  ★  ★  ★  ★", centerX, 145, { align: "center" });

      // === BOTTOM SECTION ===
      // Date
      pdf.setDrawColor(148, 163, 184);
      pdf.setLineWidth(0.3);
      pdf.line(45, 175, 115, 175);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184);
      pdf.text(date, 80, 181, { align: "center" });
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text("Fecha de emisión", 80, 187, { align: "center" });

      // Signature
      pdf.setDrawColor(148, 163, 184);
      pdf.line(pageWidth - 115, 175, pageWidth - 45, 175);
      pdf.setFont("helvetica", "bolditalic");
      pdf.setFontSize(16);
      pdf.setTextColor(139, 92, 246);
      pdf.text("InfraCode", pageWidth - 80, 172, { align: "center" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184);
      pdf.text("Instructor Principal", pageWidth - 80, 181, { align: "center" });
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text("InfraCode Academy", pageWidth - 80, 187, { align: "center" });

      // === SAVE ===
      pdf.save(`Certificado_${courseName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error al generar el certificado. Intenta de nuevo.");
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
