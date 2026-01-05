// components/resume-pdfs/ModernResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * MODERN RESUME PDF
 * - React-PDF compatible
 * - Fixed A4
 * - Clean, modern layout
 * - No Tailwind / No DOM styles
 */

type Education = {
  level: string;
  institute: string;
  location: string;
  duration: string;
  grade?: string;
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
    lineHeight: 1.45,
  },

  /* HEADER */
  header: {
    backgroundColor: "#312e81", // indigo-900 vibe
    padding: 20,
    borderRadius: 6,
    marginBottom: 18,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },

  title: {
    fontSize: 11,
    color: "#e0e7ff",
    marginTop: 4,
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  contactItem: {
    fontSize: 9,
    color: "#e0e7ff",
    marginRight: 12,
  },

  /* SECTION */
  section: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 4,
    textTransform: "uppercase",
  },

  /* SUMMARY */
  summaryText: {
    fontSize: 10,
    color: "#374151",
  },

  /* SKILLS */
  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillTag: {
    fontSize: 9,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#eef2ff",
    color: "#1e3a8a",
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },

  softSkillTag: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },

  /* CARDS */
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },

  cardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: 9,
    color: "#374151",
    marginTop: 2,
  },

  cardMeta: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },

  description: {
    marginTop: 6,
    fontSize: 9,
    color: "#374151",
  },

  footer: {
    marginTop: 28,
    textAlign: "center",
  },

  muted: {
    fontSize: 8,
    color: "#9ca3af",
  },
});

export default function ModernResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          {data.title && <Text style={styles.title}>{data.title}</Text>}

          <View style={styles.contactRow}>
            {data.email && (
              <Text style={styles.contactItem}>✉ {data.email}</Text>
            )}
            {data.phone && (
              <Text style={styles.contactItem}>📞 {data.phone}</Text>
            )}
            {data.location && (
              <Text style={styles.contactItem}>📍 {data.location}</Text>
            )}
          </View>
        </View>

        {/* ABOUT / SUMMARY */}
        {data.objective && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.summaryText}>{data.objective}</Text>
          </View>
        )}

        {/* LINKS */}
        {(data.portfolioLink || data.githubLink || data.linkedinLink) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            {data.portfolioLink && (
              <Text style={styles.summaryText}>🌐 {data.portfolioLink}</Text>
            )}
            {data.githubLink && (
              <Text style={styles.summaryText}>🐙 {data.githubLink}</Text>
            )}
            {data.linkedinLink && (
              <Text style={styles.summaryText}>💼 {data.linkedinLink}</Text>
            )}
          </View>
        )}

        {/* SKILLS */}
        {(data.technicalSkills?.length || data.softSkills?.length) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>

            {data.technicalSkills?.length && (
              <View style={styles.skillWrap}>
                {data.technicalSkills.map((s, i) => (
                  <Text key={i} style={styles.skillTag}>
                    {s}
                  </Text>
                ))}
              </View>
            )}

            {data.softSkills?.length && (
              <View style={[styles.skillWrap, { marginTop: 6 }]}>
                {data.softSkills.map((s, i) => (
                  <Text key={i} style={[styles.skillTag, styles.softSkillTag]}>
                    {s}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* EDUCATION */}
        {data.educations?.length && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.educations.map((ed, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{ed.level}</Text>
                <Text style={styles.cardSubtitle}>{ed.institute}</Text>
                <Text style={styles.cardMeta}>
                  {ed.duration} • {ed.location}
                  {ed.grade ? ` • GPA: ${ed.grade}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* EXPERIENCE */}
        {data.experiences?.length && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((ex, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{ex.role}</Text>
                <Text style={styles.cardSubtitle}>{ex.company}</Text>
                <Text style={styles.cardMeta}>{ex.duration}</Text>
                <Text style={styles.description}>{ex.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {data.projects?.length && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((p, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.description}>{p.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.muted}>
            Modern resume template · Created by AI Prep Buddy
          </Text>
        </View>
      </Page>
    </Document>
  );
}
