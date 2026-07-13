// components/resume-pdfs/FresherResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData, formatDuration } from "./types";

/**
 * FRESHER RESUME PDF
 * Two-column sidebar layout — mirrors FresherResume.tsx. The sidebar
 * (contact/links/skills/education) holds only fields that are mandatory
 * elsewhere in the form, so the PDF stays dense even with no work
 * experience or projects.
 */

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    lineHeight: 1.4,
  },

  header: {
    backgroundColor: "#0d9488",
    padding: 24,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  contactItem: {
    fontSize: 9,
    marginRight: 14,
    color: "#ccfbf1",
  },

  body: {
    flexDirection: "row",
  },

  sidebar: {
    width: "34%",
    backgroundColor: "#f0fdfa",
    padding: 18,
  },

  main: {
    flex: 1,
    padding: 18,
  },

  sidebarSection: {
    marginBottom: 16,
  },

  sidebarTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#115e59",
    textTransform: "uppercase",
    marginBottom: 6,
  },

  linkItem: {
    fontSize: 9,
    color: "#0f766e",
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
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#99f6e4",
    color: "#115e59",
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },

  softSkillTag: {
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#ecfeff",
    borderWidth: 1,
    borderColor: "#a5f3fc",
    color: "#155e75",
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },

  eduEntry: {
    marginBottom: 8,
  },

  eduDegree: {
    fontSize: 9,
    fontWeight: "bold",
  },

  eduInstitute: {
    fontSize: 8.5,
    color: "#374151",
  },

  eduMeta: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 1,
  },

  profileBox: {
    backgroundColor: "#f0fdfa",
    borderWidth: 1,
    borderColor: "#ccfbf1",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },

  profileTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#115e59",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  mainSection: {
    marginBottom: 16,
  },

  mainSectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccfbf1",
    paddingBottom: 3,
  },

  entry: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 4,
  },

  bold: {
    fontWeight: "bold",
  },

  muted: {
    color: "#6b7280",
    fontSize: 9,
  },

  footer: {
    marginTop: 8,
    textAlign: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },

  sup: {
    fontSize: 6,
    position: "relative",
    top: -2,
  },
});

export default function FresherResumePDF({ data }: { data: ResumeData }) {
  const hasLinks = data.portfolioLink || data.githubLink || data.linkedinLink;

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
        </View>

        <View style={styles.body}>
          {/* SIDEBAR */}
          <View style={styles.sidebar}>
            {hasLinks ? (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Links</Text>
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

            {data.technicalSkills?.length || data.softSkills?.length ? (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Skills</Text>
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

            {data.educations?.length ? (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Education</Text>
                {data.educations.map((ed, i) => (
                  <View key={i} style={styles.eduEntry}>
                    <Text style={styles.eduDegree}>{ed.degree}</Text>
                    {ed.institute ? (
                      <Text style={styles.eduInstitute}>{ed.institute}</Text>
                    ) : null}
                    <Text style={styles.eduMeta}>
                      {formatDuration(ed.start_year, ed.end_year)}
                    </Text>
                    {ed.grade ? (
                      <Text style={styles.eduMeta}>GPA: {ed.grade}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>

          {/* MAIN */}
          <View style={styles.main}>
            {data.objective ? (
              <View style={styles.profileBox}>
                <Text style={styles.profileTitle}>Profile</Text>
                <Text>{data.objective}</Text>
              </View>
            ) : null}

            {data.projects?.length ? (
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>Projects</Text>
                {data.projects.map((p, i) => (
                  <View key={i} style={styles.entry}>
                    <Text style={styles.bold}>{p.name}</Text>
                    {p.description ? <Text>{p.description}</Text> : null}
                  </View>
                ))}
              </View>
            ) : null}

            {data.experiences?.length ? (
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>Experience</Text>
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
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.muted}>
            PrepBuddy
            <Text style={styles.sup}>AI</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
}
