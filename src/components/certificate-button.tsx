"use client";

import { useState } from "react";
import { Download, Loader2, Lock } from "lucide-react";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";

import QRCode from 'qrcode';

interface CertificateButtonProps {
  courseId: string;
  courseName: string;
  studentName: string;
  isLocked?: boolean;
}

export const CertificateButton = ({
  courseId,
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

      // === DECORATIVE SHAPES (InfraCode Inspired - Purple/Indigo) ===
      
      // Top Right Accent
      pdf.setFillColor(124, 58, 237); // violet-600
      pdf.triangle(pageWidth - 60, 0, pageWidth, 0, pageWidth, 60, "F");
      
      pdf.setFillColor(79, 70, 229); // indigo-600
      pdf.triangle(pageWidth - 90, 0, pageWidth, 0, pageWidth, 90, "F");
      
      pdf.setFillColor(139, 92, 246); // violet-500
      pdf.triangle(pageWidth, 20, pageWidth, 120, pageWidth - 100, 20, "F");

      // Bottom Left Accent
      pdf.setFillColor(49, 46, 129); // indigo-900
      pdf.triangle(0, pageHeight - 100, 0, pageHeight, 100, pageHeight, "F");
      
      pdf.setFillColor(67, 56, 202); // indigo-700
      pdf.triangle(0, pageHeight - 130, 0, pageHeight, 130, pageHeight, "F");

      pdf.setFillColor(124, 58, 237); // violet-600
      pdf.triangle(0, pageHeight - 40, 0, pageHeight - 150, 110, pageHeight - 40, "F");

      // === LOGO TEXT ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.setTextColor(49, 46, 129); // indigo-900
      pdf.text("InfraCode", 25, 30);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(79, 70, 229); // indigo-600
      pdf.text("ACADEMY", 25, 37);

      // Helper for perfectly centering text with charSpace in jsPDF
      const drawCenteredText = (text: string, y: number, charSpace: number = 0) => {
        const shiftX = charSpace ? ((text.length - 1) * charSpace) / 2 : 0;
        pdf.text(text, centerX - shiftX, y, { align: "center", charSpace: charSpace || undefined });
      };

      // === HEADER TEXT ===
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(51, 65, 85); // slate-700
      drawCenteredText("CERTIFICADO DE", 55, 4);

      // === TITLE ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(44);
      pdf.setTextColor(49, 46, 129); // indigo-900
      drawCenteredText("PARTICIPACIÓN", 75, 6);

      // === SUBTITLE ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(51, 65, 85); // slate-700
      drawCenteredText("OTORGADO CON HONOR A:", 95, 1);

      // === STUDENT NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(28);
      pdf.setTextColor(15, 23, 42); // slate-900
      drawCenteredText(safeStudentName, 115, 0);

      // === COURSE LABEL ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139); // slate-500
      drawCenteredText("POR HABER APROBADO CON ÉXITO LA CERTIFICACIÓN:", 130, 0);

      // === COURSE NAME ===
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(15, 23, 42);
      drawCenteredText(safeCourseName, 142, 0);

      // === BOTTOM SECTION ===
      const rightCenterX = pageWidth - 80;

      // Signature Graphic (Simulated with cursive-like text for now)
      pdf.setFont("times", "italic");
      pdf.setFontSize(32);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text("InfraCode Academy", rightCenterX, 165, { align: "center" });

      // Signature Details
      pdf.setDrawColor(148, 163, 184);
      pdf.setLineWidth(0.5);
      pdf.line(rightCenterX - 60, 170, rightCenterX + 60, 170);
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(49, 46, 129); // indigo-900
      pdf.text("LUIS DIEGO FERNÁNDEZ CHAVES", rightCenterX, 176, { align: "center" });
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(79, 70, 229); // indigo-600
      pdf.text("DIRECTOR DE DESARROLLO ACADÉMICO", rightCenterX, 182, { align: "center" });

      // Date
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      pdf.text(date, rightCenterX, 195, { align: "center" });
      
      pdf.setDrawColor(148, 163, 184);
      pdf.line(rightCenterX - 20, 198, rightCenterX + 20, 198);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text("FECHA", rightCenterX, 203, { align: "center", charSpace: 2 });

      // === QR CODE ===
      const verificationUrl = `${window.location.origin}/courses/${courseId}`;
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: '#312e81', // indigo-900
          light: '#ffffff' // white
        }
      });
      
      // Bottom Left
      pdf.addImage(qrDataUrl, 'PNG', 30, pageHeight - 55, 30, 30);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text("Validar en LinkedIn", 45, pageHeight - 20, { align: "center" });

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
