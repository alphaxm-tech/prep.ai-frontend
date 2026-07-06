// components/resume-pdfs/ProfessionalResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData, formatDuration } from "./types";

/**
 * FIXED A4 PDF TEMPLATE
 * - React-PDF compatible only
 * - No Tailwind
 * - No DOM styles
 */

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    lineHeight: 1.4,
  },

  headerBar: {
    height: 6,
    backgroundColor: "#1f2937",
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },

  title: {
    fontSize: 11,
    marginTop: 4,
    color: "#374151",
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  contactItem: {
    marginRight: 12,
    marginBottom: 4,
    fontSize: 10,
  },

  section: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  summaryBox: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 4,
  },

  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  linkItem: {
    fontSize: 9,
    color: "#1d4ed8",
    marginRight: 12,
    marginBottom: 4,
  },

  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillTag: {
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 6,
  },

  card: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },

  bold: {
    fontWeight: "bold",
  },

  muted: {
    color: "#6b7280",
    fontSize: 9,
  },

  footer: {
    marginTop: 24,
    textAlign: "center",
  },

  sup: {
    fontSize: 6,
    position: "relative",
    top: -2,
  },
});

export default function ProfessionalResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER BAR */}
        <View style={styles.headerBar} />

        {/* HEADER */}
        <View>
          <Text style={styles.name}>{data.fullName || "Your Name"}</Text>
          {data.title ? <Text style={styles.title}>{data.title}</Text> : null}

          <View style={styles.contactRow}>
            {data.email ? (
              <Text style={styles.contactItem}>Email: {data.email}</Text>
            ) : null}
            {data.phone ? (
              <Text style={styles.contactItem}>Phone: {data.phone}</Text>
            ) : null}
            {data.location ? (
              <Text style={styles.contactItem}>Location: {data.location}</Text>
            ) : null}
          </View>
        </View>

        {/* SUMMARY */}
        {data.objective ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.summaryBox}>
              <Text>{data.objective}</Text>
            </View>
          </View>
        ) : null}

        {/* LINKS */}
        {data.portfolioLink || data.githubLink || data.linkedinLink ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            <View style={styles.linkRow}>
              {data.portfolioLink ? (
                <Text style={styles.linkItem}>Portfolio: {data.portfolioLink}</Text>
              ) : null}
              {data.githubLink ? (
                <Text style={styles.linkItem}>GitHub: {data.githubLink}</Text>
              ) : null}
              {data.linkedinLink ? (
                <Text style={styles.linkItem}>LinkedIn: {data.linkedinLink}</Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* SKILLS */}
        {data.technicalSkills?.length || data.softSkills?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillWrap}>
              {(data.technicalSkills ?? []).map((s, i) => (
                <Text key={`tech-${i}`} style={styles.skillTag}>
                  {s}
                </Text>
              ))}
              {(data.softSkills ?? []).map((s, i) => (
                <Text key={`soft-${i}`} style={styles.skillTag}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* EDUCATION */}
        {data.educations?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.educations.map((ed, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.bold}>{ed.degree}</Text>
                {ed.institute ? <Text>{ed.institute}</Text> : null}
                <Text style={styles.muted}>
                  {formatDuration(ed.start_year, ed.end_year)}
                  {ed.location ? ` • ${ed.location}` : ""}
                  {ed.grade ? ` • GPA: ${ed.grade}` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* EXPERIENCE */}
        {data.experiences?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((ex, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.bold}>{ex.role}</Text>
                <Text>{ex.company}</Text>
                <Text style={styles.muted}>
                  {formatDuration(ex.start_year, ex.end_year)}
                </Text>
                {ex.description ? <Text>{ex.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* PROJECTS */}
        {data.projects?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((p, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.bold}>{p.name}</Text>
                {p.description ? <Text>{p.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.muted}>
            Generated by PrepBuddy
            <Text style={styles.sup}>AI</Text> — Professional Resume
          </Text>
        </View>
      </Page>
    </Document>
  );
}
