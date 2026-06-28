import type { MockTailoredResume } from "@/lib/resumeMockData";
import { getScoreColor, getSectorColor } from "@/lib/resumeUtils";

interface HtmlResumeRendererProps {
  item: MockTailoredResume;
  scale?: number;
}

export default function HtmlResumeRenderer({
  item,
  scale = 1,
}: HtmlResumeRendererProps) {
  const { job, highlights, keywordsMatched } = item;
  const scoreColor = getScoreColor(job.fitScore ?? 0);
  const sectorColor = getSectorColor(
    [
      "Technology",
      "Healthcare",
      "Finance",
      "Energy",
      "Education",
      "Manufacturing",
      "Retail",
      "Government",
      "Consulting",
      "Media",
      "Automotive",
      "Pharmaceuticals",
      "Aerospace",
      "Telecommunications",
      "Biotechnology",
    ][(job.sectorId ?? 1) - 1] ?? "Technology"
  );

  const candidateName = "Alexandra Chen";
  const candidateEmail = "alexandra.chen@email.com";
  const candidatePhone = "(415) 555-0137";
  const candidateLocation = "San Francisco, CA";
  const candidateLinkedIn = "linkedin.com/in/alexandrachen";
  const sectorName =
    [
      "Technology",
      "Healthcare",
      "Finance",
      "Energy",
      "Education",
      "Manufacturing",
      "Retail",
      "Government",
      "Consulting",
      "Media",
      "Automotive",
      "Pharmaceuticals",
      "Aerospace",
      "Telecommunications",
      "Biotechnology",
    ][(job.sectorId ?? 1) - 1] ?? "Technology";

  const topSkills = keywordsMatched.slice(0, 8);

  return (
    <div
      className="html-resume-container"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: "800px",
        minHeight: "1000px",
        backgroundColor: "#FFFFFF",
        color: "#1a1a1a",
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: "13px",
        lineHeight: 1.5,
        overflow: "hidden",
      }}
    >
      {/* Dark Header Bar */}
      <div
        style={{
          backgroundColor: "#0B0E14",
          padding: "28px 36px",
          borderBottom: `3px solid ${sectorColor}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                color: "#F5F7FA",
                fontSize: "28px",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {candidateName}
            </h1>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "13px",
                margin: "6px 0 0 0",
              }}
            >
              {candidateLocation} | {candidateEmail} | {candidatePhone}
            </p>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "12px",
                margin: "2px 0 0 0",
              }}
            >
              {candidateLinkedIn}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                backgroundColor: scoreColor,
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: '"JetBrains Mono", monospace',
                display: "inline-block",
                marginBottom: "6px",
              }}
            >
              {job.fitScore ?? 0}% MATCH
            </div>
            <div style={{ color: "#94A3B8", fontSize: "10px" }}>
              Tailored for {job.company}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 36px" }}>
        {/* Professional Summary */}
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              color: "#0B0E14",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 10px 0",
              paddingBottom: "6px",
              borderBottom: `2px solid ${sectorColor}`,
              display: "inline-block",
            }}
          >
            Professional Summary
          </h2>
          <p
            style={{
              color: "#374151",
              fontSize: "12.5px",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Results-driven professional with extensive experience in{" "}
            {sectorName.toLowerCase()}.
            {highlights[0]
              ?.replace(
                /emphasized|highlighted|tailored|reordered|added|refined|featured|showcased/i,
                ""
              )
              .trim() ??
              "Skilled in leading cross-functional teams and delivering impactful results."}
            Proven track record of leveraging data-driven insights to optimize
            processes and drive strategic initiatives. Seeking to contribute
            expertise to {job.company}&apos;s {job.title} role.
          </p>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              color: "#0B0E14",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 10px 0",
              paddingBottom: "6px",
              borderBottom: `2px solid ${sectorColor}`,
              display: "inline-block",
            }}
          >
            Core Skills
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {topSkills.map((skill, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: i < 4 ? `${sectorColor}15` : "#F3F4F6",
                  color: i < 4 ? sectorColor : "#4B5563",
                  padding: "3px 10px",
                  borderRadius: "4px",
                  fontSize: "11.5px",
                  fontWeight: 500,
                  border:
                    i < 4 ? `1px solid ${sectorColor}30` : "1px solid #E5E7EB",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              color: "#0B0E14",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 12px 0",
              paddingBottom: "6px",
              borderBottom: `2px solid ${sectorColor}`,
              display: "inline-block",
            }}
          >
            Professional Experience
          </h2>

          {[
            {
              role: "Senior Analyst",
              company: "Previous Company Inc.",
              period: "2022 - Present",
              bullets: [
                `Led ${sectorName.toLowerCase()} initiatives that improved operational efficiency by 35% through data-driven optimization`,
                highlights[0]?.replace(/^\w/, c => c.toUpperCase()) ??
                  "Developed predictive models that reduced costs by $2.3M annually",
                `Collaborated with cross-functional teams to implement new ${sectorName.toLowerCase()} workflows adopted across 12 departments`,
                `Mentored 4 junior team members and established best practices for ${topSkills[0]?.toLowerCase() ?? "data analysis"}`,
              ],
            },
            {
              role: job.title.includes("Engineer")
                ? "Engineer II"
                : job.title.includes("Scientist")
                  ? "Data Scientist"
                  : "Analyst",
              company: "Earlier Organization Ltd.",
              period: "2019 - 2022",
              bullets: [
                highlights[1]?.replace(/^\w/, c => c.toUpperCase()) ??
                  "Designed and deployed analytics dashboards used by 200+ stakeholders",
                `Built automated pipelines processing 10M+ records daily using ${topSkills[0] ?? "Python"} and ${topSkills[1] ?? "SQL"}`,
                `Conducted comprehensive analysis that informed ${sectorName.toLowerCase()} strategic planning for 3 consecutive years`,
              ],
            },
            {
              role: "Junior Associate",
              company: "Starting Point Corp",
              period: "2017 - 2019",
              bullets: [
                `Supported senior team in ${sectorName.toLowerCase()} research and data collection across 15+ client projects`,
                "Developed foundational expertise in statistical analysis and reporting automation",
              ],
            },
          ].map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "4px",
                }}
              >
                <h3
                  style={{
                    color: "#111827",
                    fontSize: "13px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {exp.role}
                </h3>
                <span
                  style={{
                    color: "#6B7280",
                    fontSize: "11px",
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {exp.period}
                </span>
              </div>
              <p
                style={{
                  color: "#4B5563",
                  fontSize: "12px",
                  fontStyle: "italic",
                  margin: "0 0 6px 0",
                }}
              >
                {exp.company}
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#374151" }}>
                {exp.bullets.map((bullet, bi) => (
                  <li
                    key={bi}
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.55,
                      marginBottom: "3px",
                    }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              color: "#0B0E14",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 10px 0",
              paddingBottom: "6px",
              borderBottom: `2px solid ${sectorColor}`,
              display: "inline-block",
            }}
          >
            Education
          </h2>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <h3
                style={{
                  color: "#111827",
                  fontSize: "13px",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Master of Science, {sectorName} Focus
              </h3>
              <span
                style={{
                  color: "#6B7280",
                  fontSize: "11px",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                2015 - 2017
              </span>
            </div>
            <p
              style={{
                color: "#4B5563",
                fontSize: "12px",
                margin: "2px 0 0 0",
              }}
            >
              Stanford University — GPA 3.8/4.0
            </p>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <h3
                style={{
                  color: "#111827",
                  fontSize: "13px",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Bachelor of Science, Engineering
              </h3>
              <span
                style={{
                  color: "#6B7280",
                  fontSize: "11px",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                2011 - 2015
              </span>
            </div>
            <p
              style={{
                color: "#4B5563",
                fontSize: "12px",
                margin: "2px 0 0 0",
              }}
            >
              University of California, Berkeley — Magna Cum Laude
            </p>
          </div>
        </div>

        {/* Research / Internships tailored */}
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              color: "#0B0E14",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 10px 0",
              paddingBottom: "6px",
              borderBottom: `2px solid ${sectorColor}`,
              display: "inline-block",
            }}
          >
            {sectorName === "Technology"
              ? "Technical Projects"
              : sectorName === "Education"
                ? "Teaching & Research"
                : "Research & Internships"}
          </h2>
          <p
            style={{
              color: "#374151",
              fontSize: "12.5px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {highlights[2]?.replace(/^\w/, c => c.toUpperCase()) ??
              `Conducted research on ${sectorName.toLowerCase()} optimization techniques, resulting in a published paper and 2 conference presentations.`}{" "}
            Completed a competitive internship at a leading{" "}
            {sectorName.toLowerCase()} organization, contributing to a project
            that was later adopted at scale.
          </p>
        </div>

        {/* Tailoring Highlights Footer */}
        <div
          style={{
            marginTop: "24px",
            padding: "12px 16px",
            backgroundColor: "#F9FAFB",
            borderLeft: `3px solid ${sectorColor}`,
            borderRadius: "0 4px 4px 0",
          }}
        >
          <p
            style={{
              color: "#6B7280",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 6px 0",
            }}
          >
            Tailored by CareerSync AI for {job.title} at {job.company}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {highlights.map((h, i) => (
              <span
                key={i}
                style={{
                  color: sectorColor,
                  fontSize: "10px",
                  fontWeight: 500,
                  backgroundColor: `${sectorColor}12`,
                  padding: "2px 8px",
                  borderRadius: "3px",
                }}
              >
                {h.length > 50 ? h.substring(0, 50) + "..." : h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
