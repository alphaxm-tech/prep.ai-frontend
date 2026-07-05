// components/resume-pdfs/StandardResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData, formatDuration } from "./types";

/**
 * STANDARD RESUME PDF
 * Clean, centered, classic single-column layout — mirrors StandardResume.tsx
 */

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    lineHeight: 1.4,
  },

  header: {
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 12,
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },

  contactItem: {
    fontSize: 9,
    marginHorizontal: 6,
    color: "#4b5563",
  },

  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },

  linkItem: {
    fontSize: 9,
    marginHorizontal: 6,
    color: "#1d4ed8",
  },

  section: {
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 3,
  },

  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillTag: {
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 6,
  },

  softSkillTag: {
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 6,
  },

  entry: {
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
});

export default function StandardResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || "Your Name"}</Text>

          <View style={styles.contactRow}>
            {data.email ? (
              <Text style={styles.contactItem}>{data.email}</Text>
            ) : null}
            {data.phone ? (
              <Text style={styles.contactItem}>{data.phone}</Text>
            ) : null}
            {data.location ? (
              <Text style={styles.contactItem}>{data.location}</Text>
            ) : null}
          </View>

          {data.portfolioLink || data.githubLink || data.linkedinLink ? (
            <View style={styles.linkRow}>
              {data.portfolioLink ? (
                <Text style={styles.linkItem}>{data.portfolioLink}</Text>
              ) : null}
              {data.githubLink ? (
                <Text style={styles.linkItem}>{data.githubLink}</Text>
              ) : null}
              {data.linkedinLink ? (
                <Text style={styles.linkItem}>{data.linkedinLink}</Text>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* SUMMARY */}
        {data.objective ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text>{data.objective}</Text>
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
                <Text key={`soft-${i}`} style={styles.softSkillTag}>
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
              <View key={i} style={styles.entry}>
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

        {/* WORK EXPERIENCE */}
        {data.experiences?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.experiences.map((ex, i) => (
              <View key={i} style={styles.entry}>
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
              <View key={i} style={styles.entry}>
                <Text style={styles.bold}>{p.name}</Text>
                {p.description ? <Text>{p.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* FOOTER */}
        <View style={styles.footer}>
          {/* <Text style={styles.muted}>
            Standard resume template · Clean & professional
          </Text> */}
          <Text style={styles.muted}>Created by AI Prep Buddy</Text>
        </View>
      </Page>
    </Document>
  );
}
