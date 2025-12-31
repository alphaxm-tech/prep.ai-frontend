// components/resume-pdfs/ProfessionalResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * FIXED A4 PDF TEMPLATE
 * - React-PDF compatible only
 * - No Tailwind
 * - No DOM styles
 */

type Education = {
  level: string;
  institute: string;
  location: string;
  duration: string;
  grade: string;
};

type WorkExperience = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

type Project = {
  title: string;
  description: string;
};

export type ResumeData = {
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  objective?: string;
  portfolioLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  technicalSkills?: string[];
  softSkills?: string[];
  educations?: Education[];
  experiences?: WorkExperience[];
  projects?: Project[];
};

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
  },

  title: {
    fontSize: 11,
    marginTop: 4,
    color: "#374151",
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  contactItem: {
    marginRight: 12,
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
});

export default function ProfessionalResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER BAR */}
        <View style={styles.headerBar} />

        {/* HEADER */}
        <View>
          <Text style={styles.name}>{data.fullName}</Text>
          {data.title && <Text style={styles.title}>{data.title}</Text>}

          <View style={styles.contactRow}>
            {data.email && (
              <Text style={styles.contactItem}>Email: {data.email}</Text>
            )}
            {data.phone && (
              <Text style={styles.contactItem}>Phone: {data.phone}</Text>
            )}
            {data.location && (
              <Text style={styles.contactItem}>Location: {data.location}</Text>
            )}
          </View>
        </View>

        {/* SUMMARY */}
        {data.objective && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.summaryBox}>
              <Text>{data.objective}</Text>
            </View>
          </View>
        )}

        {/* SKILLS */}
        {data.technicalSkills?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillWrap}>
              {data.technicalSkills.map((s, i) => (
                <Text key={i} style={styles.skillTag}>
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
                <Text style={styles.bold}>{ed.level}</Text>
                <Text>{ed.institute}</Text>
                <Text style={styles.muted}>
                  {ed.duration} • {ed.location} • GPA: {ed.grade}
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
                <Text style={styles.muted}>{ex.duration}</Text>
                <Text>{ex.description}</Text>
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
                <Text style={styles.bold}>{p.title}</Text>
                <Text>{p.description}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.muted}>
            Generated by AI Prep Buddy — Professional Resume
          </Text>
        </View>
      </Page>
    </Document>
  );
}
