import type { Job, TailoredResume } from "@/db/schema";

export interface DemoResumeProfile {
  name: string;
  experience: string;
  education: string;
  skills: string;
}

export interface ParsedDemoResume {
  filename: string;
  size: number;
  text: string;
  profile: DemoResumeProfile;
}

export const BARBARA_RESUME_TEXT = `BARBARA CHEN
New York, NY | barbara.chen.email@example.com | (555) 123-4567 | linkedin.com/in/barbarachen-art

EDUCATION
Bachelor of Arts in Art History, Minor in Museum Studies
Columbia University, New York, NY | Graduated May 2025
GPA: 3.7/4.0
Relevant Coursework: Renaissance & Baroque Art, Modern Art Theory, Curatorial Practice, Conservation Ethics, Digital Humanities for Art

EXPERIENCE
Curatorial Intern | The Metropolitan Museum of Art, New York, NY | Sep 2024 – May 2025
- Assisted curators with research for an upcoming Impressionist exhibition, compiling object files and provenance records for 40+ works.
- Conducted archival research and drafted wall labels, audio tour scripts, and educational materials for general audiences.
- Coordinated logistics for two public gallery talks, increasing attendance by 25% through targeted outreach.

Gallery Assistant | Columbia University Miriam and Ira D. Wallach Art Gallery | Jan 2023 – May 2024
- Managed front-of-house operations and guided weekly tours for 30+ visitors, adapting content for diverse age groups.
- Supported installation teams with artwork handling, condition reporting, and label production.
- Maintained digital collection records and social media content, growing Instagram followers by 18%.

Volunteer Docent | Museum of Modern Art (MoMA) | Jun 2022 – Aug 2022
- Led interactive tours for families and school groups, emphasizing close looking and discussion-based learning.

SKILLS
Research & Writing: Art historical research, provenance investigation, exhibition catalog writing, grant writing
Digital Tools: Adobe Photoshop, InDesign, TMS/eMuseum, WordPress, Microsoft Office, Google Workspace
Languages: English (native), French (conversational), Mandarin (conversational)
Soft Skills: Public speaking, event coordination, cross-functional collaboration, attention to detail

PROJECTS
"Reframing the Female Gaze" — Independent curatorial project exploring women artists in post-war abstraction.
- Wrote 5 critical essays and designed a digital exhibition prototype using Adobe InDesign and WordPress.
`;

export const BARBARA_PARSED_RESUME: ParsedDemoResume = {
  filename: "Barbara_Chen_Resume.pdf",
  size: 142_000,
  text: BARBARA_RESUME_TEXT,
  profile: {
    name: "Barbara Chen",
    experience:
      "Curatorial Intern at The Metropolitan Museum of Art; Gallery Assistant at Columbia University Wallach Art Gallery; Volunteer Docent at MoMA.",
    education:
      "Bachelor of Arts in Art History, Minor in Museum Studies, Columbia University, Graduated May 2025.",
    skills:
      "Art historical research, provenance investigation, exhibition catalog writing, grant writing, Adobe Photoshop, InDesign, TMS/eMuseum, WordPress, public speaking, event coordination, French, Mandarin.",
  },
};

export const BARBARA_INTERVIEW_ANSWERS: Record<number, string> = {
  1: "I want to start my career in museums, galleries, or arts administration where I can combine research, writing, and public engagement. Long term, I hope to become a curator who champions underrepresented artists and produces exhibitions that make art history accessible to wider audiences.",
  2: "Gallery Assistant, Curatorial Assistant, Museum Educator, Arts Administrator, Collections Coordinator",
  3: "Research, Writing, Public Speaking, Visual Analysis, Event Coordination, Adobe Photoshop, Adobe InDesign",
  4: "Media / Entertainment, Education / EdTech, Government / Defense, Technology / SaaS",
  5: "New York, NY",
  6: "Mid-size growth company",
  7: "3",
  8: "Entry-level / Junior",
};

export const BARBARA_PROFILE = {
  fullName: "Barbara Chen",
  email: "barbara.chen.email@example.com",
  location: "New York, NY",
  targetLocation: "New York, NY",
  summary:
    "Recent Art History graduate with hands-on curatorial and gallery experience at leading New York institutions. Skilled in research, writing, visual analysis, and public programming. Seeking entry-level roles in museums, galleries, and arts administration.",
  skills: BARBARA_PARSED_RESUME.profile.skills,
  education: BARBARA_PARSED_RESUME.profile.education,
  experience: BARBARA_PARSED_RESUME.profile.experience,
  preferredRoles:
    "Gallery Assistant, Curatorial Assistant, Museum Educator, Arts Administrator, Collections Coordinator",
  preferredIndustries: "Arts & Culture, Museums, Education, Media",
  salaryExpectation: "$45k - $60k",
  workType: "In-person / Hybrid",
  resumeText: BARBARA_RESUME_TEXT,
  resumeUrl: "Barbara_Chen_Resume.pdf",
};

const BARBARA_SECTORS = [
  "Arts & Culture",
  "Museums",
  "Education",
  "Media",
  "Nonprofit",
  "Galleries",
  "Publishing",
  "Auction Houses",
];

const BARBARA_COMPANIES: Record<string, string[]> = {
  "Arts & Culture": [
    "The Met",
    "MoMA",
    "Whitney Museum",
    "Guggenheim",
    "New Museum",
    "Brooklyn Museum",
  ],
  Museums: [
    "The Met",
    "MoMA",
    "Whitney Museum",
    "Guggenheim",
    "New Museum",
    "Brooklyn Museum",
  ],
  Education: [
    "Columbia University",
    "NYU",
    "Parsons School of Design",
    "School of Visual Arts",
    "MoMA Learning",
  ],
  Media: ["Artnet", "Artsy", "Hyperallergic", "The Art Newspaper", "Frieze"],
  Nonprofit: [
    "Creative Time",
    "Public Art Fund",
    "Art Production Fund",
    "Lower Manhattan Cultural Council",
  ],
  Galleries: [
    "David Zwirner",
    "Gagosian",
    "Hauser & Wirth",
    "Pace Gallery",
    "Lehmann Maupin",
  ],
  Publishing: ["Phaidon", "Rizzoli", "Thames & Hudson", "Abrams Books"],
  "Auction Houses": ["Christie's", "Sotheby's", "Bonhams", "Heritage Auctions"],
};

const BARBARA_TITLES: Record<string, string[]> = {
  "Arts & Culture": [
    "Curatorial Assistant",
    "Exhibition Coordinator",
    "Collections Assistant",
    "Public Programs Assistant",
    "Development Assistant",
  ],
  Museums: [
    "Gallery Assistant",
    "Museum Educator",
    "Visitor Services Associate",
    "Curatorial Intern",
    "Registrar Assistant",
  ],
  Education: [
    "Education Assistant",
    "Teaching Assistant",
    "Program Coordinator",
    "Curriculum Assistant",
  ],
  Media: [
    "Editorial Assistant",
    "Content Coordinator",
    "Research Assistant",
    "Social Media Coordinator",
  ],
  Nonprofit: [
    "Program Assistant",
    "Grants Assistant",
    "Communications Assistant",
    "Event Coordinator",
  ],
  Galleries: [
    "Gallery Assistant",
    "Sales Assistant",
    "Artist Liaison",
    "Exhibition Assistant",
  ],
  Publishing: [
    "Editorial Assistant",
    "Photo Researcher",
    "Production Assistant",
  ],
  "Auction Houses": [
    "Cataloguing Assistant",
    "Client Services Assistant",
    "Specialist Assistant",
  ],
};

const BARBARA_LOCATIONS = ["New York, NY", "Brooklyn, NY", "Remote"];

export function generateBarbaraJobs(count: number = 12): Job[] {
  const jobs: Job[] = [];
  for (let i = 0; i < count; i++) {
    const sector =
      BARBARA_SECTORS[Math.floor(Math.random() * BARBARA_SECTORS.length)];
    const titles = BARBARA_TITLES[sector] || BARBARA_TITLES["Arts & Culture"];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const companies =
      BARBARA_COMPANIES[sector] || BARBARA_COMPANIES["Arts & Culture"];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location =
      BARBARA_LOCATIONS[Math.floor(Math.random() * BARBARA_LOCATIONS.length)];

    const fitScore = 75 + Math.floor(Math.random() * 23); // 75-97

    jobs.push({
      id: i + 1,
      profileId: 1,
      sectorId: BARBARA_SECTORS.indexOf(sector) + 1,
      title,
      company,
      location,
      jobDescription: `We are seeking a detail-oriented ${title} to support our ${sector} team in New York. You will conduct research, assist with exhibitions and programs, and contribute to a welcoming, intellectually engaged environment.`,
      requirements:
        "Bachelor's degree in Art History, Museum Studies, or related field; strong research and writing skills; attention to detail; ability to work collaboratively.",
      responsibilities:
        "Support curatorial and education teams with research and administrative tasks. Assist with exhibition installation, public programs, and visitor engagement. Maintain accurate records and contribute to digital content.",
      salaryRange: "$42k - $58k",
      jobType: "Full-time",
      experienceLevel: "Entry Level",
      applicationLink: `https://careers.${company.toLowerCase().replace(/[^a-z]/g, "")}.com/jobs/${i + 1}`,
      deadline: new Date(
        Date.now() + (14 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      postedDate: new Date(
        Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      source: ["LinkedIn", "Indeed", "Company Website", "Idealist"][
        Math.floor(Math.random() * 4)
      ],
      fitScore,
      matchReasons: `Your Art History background and ${sector} internship experience align well with this ${title} role. Strong writing and research skills are a key match.`,
      skillGaps:
        "Some roles may prefer prior TMS/database experience or additional years of gallery work.",
      status: "discovered",
      createdAt: new Date(),
    });
  }
  return jobs.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));
}

export function generateBarbaraTailoredResumes(jobs: Job[]): TailoredResume[] {
  return jobs.slice(0, 5).map((job, index) => {
    const highlights = [
      `Reframed museum internship experience to emphasize ${job.title.toLowerCase()} responsibilities.`,
      "Highlighted art historical research and writing skills relevant to the role.",
      "Emphasized event coordination and public-speaking experience from gallery tours.",
      "Added French language skills and digital tools (Photoshop, InDesign, WordPress).",
    ];

    return {
      id: index + 1,
      jobId: job.id,
      profileId: 1,
      content: `BARBARA CHEN\nNew York, NY | barbara.chen.email@example.com\n\nSUMMARY\nRecent Art History graduate with curatorial and gallery experience seeking a ${job.title} role at ${job.company}. Combines rigorous research, clear writing, and audience-centered programming.\n\nEXPERIENCE\nCuratorial Intern | The Metropolitan Museum of Art | Sep 2024 – May 2025\n- Researched 40+ works for an Impressionist exhibition and drafted wall labels and audio scripts.\n- Coordinated two public gallery talks, increasing attendance by 25%.\n\nGallery Assistant | Columbia University Wallach Art Gallery | Jan 2023 – May 2024\n- Led weekly tours for 30+ visitors and supported exhibition installation.\n- Grew gallery Instagram following by 18% through digital content.\n\nEDUCATION\nB.A. Art History, Minor in Museum Studies | Columbia University | 2025\n\nSKILLS\nArt historical research, provenance investigation, exhibition writing, public speaking, event coordination, Adobe Photoshop, InDesign, WordPress, French, Mandarin.`,
      pdfUrl: null,
      highlights: highlights.join("\n"),
      changesMade: [
        "Summary tailored to target role and institution.",
        "Experience bullets rewritten to emphasize relevant responsibilities.",
        "Skills reordered to match job description priorities.",
      ].join("\n"),
      narrativeSummary: `This resume positions Barbara as a strong ${job.title} candidate at ${job.company} by emphasizing research, writing, and public-programming experience in museum and gallery settings.`,
      createdAt: new Date(),
    };
  });
}
