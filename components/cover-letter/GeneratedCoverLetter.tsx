import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface GeneratedCoverLetterProps {
  content: string;
  tone: string;
  length: string;
  userName: string;
  userEmail: string;
  companyName: string;
  onRegenerate: () => void;
  isGenerating: boolean;
}

const GeneratedCoverLetter: React.FC<GeneratedCoverLetterProps> = ({
  content,
  tone,
  length,
  userName,
  userEmail,
  companyName,
  onRegenerate,
  isGenerating,
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const downloadPDF = async () => {
    const element = document.getElementById('cover-letter-paper');
    if (!element) return;

    try {
      // Set explicit dimensions for A4 at 96 DPI (approx 794x1123)
      // pixelRatio: 2 will double this for high quality
      const dataUrl = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '210mm',
          height: '297mm',
          margin: '0',
          padding: '48px', // Equivalent to p-12 (3rem = 48px)
          boxSizing: 'border-box',
          overflow: 'visible',
        }
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Since we forced the capture to A4 ratio, we can fit it exactly
      // We use a small margin for a professional look
      const margin = 10;
      const finalWidth = pdfWidth - (margin * 2);
      const finalHeight = (1123 / 794) * finalWidth;

      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = margin;

      pdf.addImage(dataUrl, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
      pdf.save(`Cover_Letter_${companyName || 'Application'}.pdf`);
      toast.success("PDF Downloaded!");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Failed to generate PDF.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div
          id="cover-letter-paper"
          className="bg-white p-12 shadow-md border font-serif leading-relaxed mx-auto rounded-none"
          style={{
            fontFamily: "'Times New Roman', serif",
            color: "#111827",
            borderColor: "#e5e7eb",
            backgroundColor: "#ffffff",
            width: "210mm",
            minHeight: "297mm",
            boxSizing: "border-box"
          }}
        >
          <div className="pb-4 mb-8" style={{ borderBottom: "2px solid #000000" }}>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest" style={{ color: "#000000" }}>{userName || "YOUR NAME"}</h1>
            <p className="mt-1" style={{ color: "#4b5563" }}>{userEmail || "your.email@example.com"}</p>
          </div>

          <div className="space-y-6">
            <div className="mb-8">
              <p className="font-medium" style={{ color: "#111827" }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <div className="mt-4">
                <p className="font-bold" style={{ color: "#111827" }}>Hiring Manager</p>
                <p style={{ color: "#111827" }}>{companyName || "The Hiring Team"}</p>
              </div>
            </div>

            <div className="whitespace-pre-wrap text-[14px] md:text-[15px]" style={{ color: "#111827" }}>
              {content}
            </div>

            <div className="mt-12">
              <p style={{ color: "#111827" }}>Sincerely,</p>
              <p className="mt-4 font-bold" style={{ color: "#111827" }}>{userName || "Your Name"}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center bg-gray-50 p-4 rounded-lg gap-4">
          <p className="text-xs text-gray-500 italic">Tone: {tone} | Length: {length}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onRegenerate} disabled={isGenerating} className="gap-2 rounded-[8px]">
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button variant="outline" onClick={copyToClipboard} className="gap-2 rounded-[8px]">
              <Copy className="w-4 h-4" />
              Copy Text
            </Button>
            <Button onClick={downloadPDF} className="gap-2 bg-[#6B5FD3] hover:bg-[#5A4FC1] rounded-[8px]">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedCoverLetter;
