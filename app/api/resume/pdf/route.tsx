// app/api/resume/pdfs/route.ts
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import ProfessionalResumePDF from "@/components/resume-pdfs/ProfessionalResumePDF";
import ModernResumePDF from "@/components/resume-pdfs/ModernResumePDF";
import CreativeResumePDF from "@/components/resume-pdfs/CreativeResumePDF";
import MinimalResumePDF from "@/components/resume-pdfs/MinimalResumePDF";
import StandardResumePDF from "@/components/resume-pdfs/StandardResumePDF";
import FresherResumePDF from "@/components/resume-pdfs/FresherResumePDF";

const TEMPLATES_BY_FORMAT: Record<string, typeof ProfessionalResumePDF> = {
  MODERN: ModernResumePDF,
  CLASSIC: ProfessionalResumePDF,
  CREATIVE: CreativeResumePDF,
  MINIMAL: MinimalResumePDF,
  STANDARD: StandardResumePDF,
  FRESHER: FresherResumePDF,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeFormat, ...data } = body;

    const PdfTemplate =
      TEMPLATES_BY_FORMAT[String(resumeFormat).toUpperCase()] ??
      StandardResumePDF;

    const pdfBuffer = await renderToBuffer(<PdfTemplate data={data} />);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
