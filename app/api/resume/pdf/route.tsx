// app/api/resume/pdfs/route.ts
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import ProfessionalResumePDF from "@/components/resume-pdfs/ProfessionalResumePDF";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pdfBuffer = await renderToBuffer(
      <ProfessionalResumePDF data={body} />
    );

    // return new NextResponse(pdfBuffer, {
    //   headers: {
    //     "Content-Type": "application/pdf",
    //     "Content-Disposition": 'attachment; filename="resume.pdf"',
    //   },
    // });

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
