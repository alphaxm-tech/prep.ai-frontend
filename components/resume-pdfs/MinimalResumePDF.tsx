// components/resume-pdfs/MinimalResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData, formatDuration } from "./types";

/**
 * MINIMAL RESUME PDF
 * Sparse, uppercase small-caps labels, thin rule under name — mirrors
 * MinimalResume.tsx's slate, print-friendly aesthetic.
 */

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b", // slate-800
    lineHeight: 1.45,
  },

  rule: {
    height: 2,
    width: 60,
    backgroundColor: "#1e293b",
    borderRadius: 1,
    marginBottom: 14,
    alignSelf: "center",
  },

  header: {
    textAlign: "center",
    marginBottom: 16,
  },

  name: {
    fontSize: 20,
    fontWeight: "semibold",
    textAlign: "center",
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 6,
  },

  contactItem: {
    fontSize: 8,
    color: "#64748b", // slate-500
    marginHorizontal: 6,
  },

  section: {
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 8,
    fontWeight: "medium",
    color: "#475569", // slate-600
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },

  bodyText: {
    fontSize: 9,
    color: "#334155", // slate-700
  },

  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  linkItem: {
    fontSize: 9,
    color: "#334155",
    textDecoration: "underline",
    marginRight: 14,
  },

  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillTag: {
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#f1f5f9", // slate-100
    color: "#334155",
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 6,
  },

  softSkillTag: {
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#ffffff",
    color: "#475569", // slate-600
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#cbd5e1", // slate-300
    marginRight: 6,
    marginBottom: 6,
  },

  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  entryTitle: {
    fontSize: 9,
    fontWeight: "medium",
    color: "#1e293b",
  },

  entrySubtitle: {
    fontSize: 8,
    color: "#475569",
  },

  entryMeta: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "right",
  },

  entry: {
    marginBottom: 10,
  },

  footer: {
    marginTop: 24,
    textAlign: "center",
  },

  muted: {
    fontSize: 8,
    color: "#94a3b8",
  },
});

export default function MinimalResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.rule} />

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
        </View>

        {/* SUMMARY */}
        {data.objective ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.bodyText}>{data.objective}</Text>
          </View>
        ) : null}

        {/* LINKS */}
        {data.portfolioLink || data.githubLink || data.linkedinLink ? (
          <View style={styles.section}>
            <View style={styles.linkRow}>
              {data.portfolioLink ? (
                <Text style={styles.linkItem}>Portfolio</Text>
              ) : null}
              {data.githubLink ? (
                <Text style={styles.linkItem}>GitHub</Text>
              ) : null}
              {data.linkedinLink ? (
                <Text style={styles.linkItem}>LinkedIn</Text>
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
                <View style={styles.entryRow}>
                  <View>
                    <Text style={styles.entryTitle}>{ed.degree}</Text>
                    {ed.institute ? (
                      <Text style={styles.entrySubtitle}>{ed.institute}</Text>
                    ) : null}
                  </View>
                  <View>
                    <Text style={styles.entryMeta}>
                      {formatDuration(ed.start_year, ed.end_year)}
                    </Text>
                    {ed.location ? (
                      <Text style={styles.entryMeta}>{ed.location}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* EXPERIENCE */}
        {data.experiences?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((ex, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryRow}>
                  <View>
                    <Text style={styles.entryTitle}>{ex.role}</Text>
                    <Text style={styles.entrySubtitle}>{ex.company}</Text>
                  </View>
                  <Text style={styles.entryMeta}>
                    {formatDuration(ex.start_year, ex.end_year)}
                  </Text>
                </View>
                {ex.description ? (
                  <Text style={[styles.bodyText, { marginTop: 4 }]}>
                    {ex.description}
                  </Text>
                ) : null}
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
                <Text style={styles.entryTitle}>{p.name}</Text>
                {p.description ? (
                  <Text style={[styles.bodyText, { marginTop: 2 }]}>
                    {p.description}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.muted}>
            Minimal resume · Clean · Print friendly
          </Text>
          <Text style={styles.muted}>Created by AI Prep Buddy</Text>
        </View>
      </Page>
    </Document>
  );
}
