// components/resume-pdfs/CreativeResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData, formatDuration } from "./types";

/**
 * CREATIVE RESUME PDF
 * Two-column sidebar layout with a decorative accent bar — mirrors
 * CreativeResume.tsx's aside (objective/links/skills) + main (education/
 * experience/projects) structure. react-pdf has no gradients, so the header
 * accent is approximated with a solid accent color instead.
 */

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b",
    lineHeight: 1.4,
  },

  accentBar: {
    height: 5,
    backgroundColor: "#6366f1", // indigo-500
    borderRadius: 3,
    marginBottom: 16,
  },

  header: {
    textAlign: "center",
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0f172a",
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 6,
  },

  contactItem: {
    fontSize: 9,
    color: "#475569",
    marginHorizontal: 6,
  },

  body: {
    flexDirection: "row",
  },

  sidebar: {
    width: "32%",
    paddingRight: 12,
  },

  main: {
    width: "68%",
  },

  card: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4338ca", // indigo-700
    marginBottom: 4,
  },

  cardTitleNeutral: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 4,
  },

  bodyText: {
    fontSize: 9,
    color: "#334155",
  },

  linkItem: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 3,
  },

  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillTag: {
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },

  softSkillTag: {
    backgroundColor: "#fff1f2", // rose-50
    color: "#be123c", // rose-700
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
  },

  entryCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },

  entryTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },

  entrySubtitle: {
    fontSize: 9,
    color: "#475569",
  },

  entryMeta: {
    fontSize: 8,
    color: "#64748b",
  },

  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
  },

  muted: {
    fontSize: 8,
    color: "#94a3b8",
  },
});

export default function CreativeResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || "Your Name"}</Text>
          <View style={styles.contactRow}>
            {data.email ? (
              <Text style={styles.contactItem}>{data.email}</Text>
            ) : null}
            {data.location ? (
              <Text style={styles.contactItem}>{data.location}</Text>
            ) : null}
            {data.phone ? (
              <Text style={styles.contactItem}>{data.phone}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.body}>
          {/* SIDEBAR */}
          <View style={styles.sidebar}>
            {data.objective ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Objective</Text>
                <Text style={styles.bodyText}>{data.objective}</Text>
              </View>
            ) : null}

            {(data.portfolioLink || data.githubLink || data.linkedinLink) && (
              <View style={styles.card}>
                <Text style={styles.cardTitleNeutral}>Links</Text>
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
            )}

            {(data.technicalSkills?.length || data.softSkills?.length) && (
              <View style={styles.card}>
                <Text style={styles.cardTitleNeutral}>Skills</Text>
                <View style={styles.skillWrap}>
                  {(data.technicalSkills ?? []).map((s, i) => (
                    <Text key={`tech-${i}`} style={styles.skillTag}>
                      {s}
                    </Text>
                  ))}
                  {(data.softSkills ?? []).map((s, i) => (
                    <Text
                      key={`soft-${i}`}
                      style={[styles.skillTag, styles.softSkillTag]}
                    >
                      {s}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* MAIN */}
          <View style={styles.main}>
            {data.educations?.length ? (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.educations.map((ed, i) => (
                  <View key={i} style={styles.entryCard}>
                    <Text style={styles.entryTitle}>{ed.degree}</Text>
                    {ed.institute ? (
                      <Text style={styles.entrySubtitle}>{ed.institute}</Text>
                    ) : null}
                    <Text style={styles.entryMeta}>
                      {formatDuration(ed.start_year, ed.end_year)}
                      {ed.location ? ` · ${ed.location}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {data.experiences?.length ? (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experiences.map((ex, i) => (
                  <View key={i} style={styles.entryCard}>
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

            {data.projects?.length ? (
              <View>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.map((p, i) => (
                  <View key={i} style={styles.entryCard}>
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
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.muted}>
            Creative resume · Modern · Print friendly
          </Text>
          <Text style={styles.muted}>Created by AI Prep Buddy</Text>
        </View>
      </Page>
    </Document>
  );
}
