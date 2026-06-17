"use client";

import { useState } from "react";
import { Download, Loader2, Lock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";

interface CertificateButtonProps {
  courseName: string;
  studentName: string;
}

export const CertificateButton = ({
  courseName,
  studentName
}: CertificateButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async () => {
    try {
      setIsGenerating(true);
      
      // We create a temporary hidden div with the certificate design
      const certContainer = document.createElement("div");
      certContainer.style.position = "absolute";
      certContainer.style.left = "-9999px";
      certContainer.style.top = "0";
      certContainer.style.width = "1123px"; // A4 landscape width
      certContainer.style.height = "794px"; // A4 landscape height
      certContainer.style.backgroundColor = "#0f172a";
      certContainer.style.display = "flex";
      certContainer.style.flexDirection = "column";
      certContainer.style.justifyContent = "center";
      certContainer.style.alignItems = "center";
      certContainer.style.padding = "40px";
      certContainer.style.fontFamily = "sans-serif";
      certContainer.style.color = "white";
      
      const date = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

      certContainer.innerHTML = `
        <div style="border: 4px solid #8b5cf6; padding: 40px; border-radius: 20px; width: 100%; height: 100%; box-sizing: border-box; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 50%); pointer-events: none;"></div>
          
          <h1 style="font-size: 64px; color: #a78bfa; margin-bottom: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px;">Certificado de Finalización</h1>
          
          <p style="font-size: 24px; color: #cbd5e1; margin-bottom: 40px;">Este certificado se otorga con gran orgullo a:</p>
          
          <h2 style="font-size: 56px; color: #ffffff; margin-bottom: 40px; border-bottom: 2px solid #8b5cf6; display: inline-block; padding-bottom: 10px;">${studentName}</h2>
          
          <p style="font-size: 24px; color: #cbd5e1; margin-bottom: 40px;">Por haber completado exitosamente y con excelencia el curso:</p>
          
          <h3 style="font-size: 40px; color: #e2e8f0; margin-bottom: 60px;">${courseName}</h3>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 80%; margin: 0 auto; margin-top: auto; padding-top: 40px;">
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid #94a3b8; width: 200px; margin-bottom: 10px;"></div>
              <p style="color: #94a3b8; font-size: 18px;">${date}</p>
              <p style="color: #64748b; font-size: 14px;">Fecha de emisión</p>
            </div>
            
            <div style="text-align: center;">
              <div style="color: #8b5cf6; font-size: 32px; font-weight: bold; font-style: italic; margin-bottom: 10px;">Master Teacher</div>
              <div style="border-bottom: 1px solid #94a3b8; width: 200px; margin-bottom: 10px;"></div>
              <p style="color: #64748b; font-size: 14px;">Instructor Principal</p>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(certContainer);

      const canvas = await html2canvas(certContainer, {
        scale: 2, 
        backgroundColor: "#0f172a",
        logging: false
      });

      document.body.removeChild(certContainer);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1123, 794]
      });

      pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
      pdf.save(`Certificado_${courseName.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error(error);
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
