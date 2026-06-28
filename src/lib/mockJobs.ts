import type { Job } from "@/db/schema";

const SECTORS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Energy",
  "Education",
  "Manufacturing",
  "Retail",
  "Government",
] as const;

const COMPANIES: Record<string, string[]> = {
  Technology: [
    "Google",
    "Microsoft",
    "Apple",
    "Meta",
    "Amazon",
    "Netflix",
    "Stripe",
    "Airbnb",
    "Uber",
    "Slack",
    "Notion",
    "Figma",
    "Vercel",
    "Datadog",
    "Snowflake",
    "Databricks",
    "Coinbase",
    "Shopify",
    "Twilio",
    "Atlassian",
    "Palantir",
    "Cloudflare",
    "HashiCorp",
    "Elastic",
    "MongoDB",
    "Confluent",
    "Okta",
    "Zscaler",
    "CrowdStrike",
    "SentinelOne",
  ],
  Healthcare: [
    "Johnson & Johnson",
    "Pfizer",
    "Roche",
    "Novartis",
    "Merck",
    "Abbott",
    "Medtronic",
    "UnitedHealth",
    "CVS Health",
    "Eli Lilly",
    "Amgen",
    "Gilead",
    "Vertex",
    "Regeneron",
    "Moderna",
    "BioNTech",
    "Teladoc",
    "Cerner",
    "Epic Systems",
    "Illumina",
    "Boston Scientific",
    "Stryker",
    "Becton Dickinson",
    "Thermo Fisher",
    "IQVIA",
  ],
  Finance: [
    "JPMorgan Chase",
    "Goldman Sachs",
    "Morgan Stanley",
    "Bank of America",
    "Citigroup",
    "Wells Fargo",
    "BlackRock",
    "Vanguard",
    "Charles Schwab",
    "Raymond James",
    "Deutsche Bank",
    "Barclays",
    "HSBC",
    "UBS",
    "Credit Suisse",
    "BNP Paribas",
    "American Express",
    "Visa",
    "Mastercard",
    "PayPal",
    "Square",
    "Robinhood",
    "Coinbase",
    "Citadel",
    "Two Sigma",
  ],
  Energy: [
    "ExxonMobil",
    "Chevron",
    "Shell",
    "BP",
    "TotalEnergies",
    "Schlumberger",
    "Halliburton",
    "NextEra Energy",
    "Duke Energy",
    "Southern Company",
    "Dominion Energy",
    "Exelon",
    "ConocoPhillips",
    "EOG Resources",
    "Pioneer Natural",
    "Williams",
    "Kinder Morgan",
    "Cheniere Energy",
    "Tesla Energy",
    "First Solar",
    "Sunrun",
    "Enphase",
    "Vestas",
    "Orsted",
    "Equinor",
  ],
  Education: [
    "Pearson",
    "McGraw-Hill",
    "Coursera",
    "Udemy",
    "Khan Academy",
    "Chegg",
    "2U",
    "Duolingo",
    "Grammarly",
    "Guild Education",
    "Handshake",
    "Brightwheel",
    "Nearpod",
    "Instructure",
    "Blackbaud",
    "Scholastic",
    "Wiley",
    "Cengage",
    "Houghton Mifflin",
    "Pluralsight",
    "Skillshare",
    " edX",
    "Udacity",
    "Codecademy",
    "Springboard",
  ],
  Manufacturing: [
    "Tesla",
    "Boeing",
    "Siemens",
    "Honeywell",
    "3M",
    "Caterpillar",
    "John Deere",
    "General Electric",
    "ABB",
    "Rockwell",
    "Emerson",
    "Eaton",
    "Stanley Black & Decker",
    "Snap-on",
    "Parker Hannifin",
    "Illinois Tool",
    "Dover",
    "Fortive",
    "Roper",
    "Graco",
    "Nordson",
    "Silgan",
    "Packaging Corp",
    "WestRock",
    "International Paper",
  ],
  Retail: [
    "Walmart",
    "Target",
    "Costco",
    "Home Depot",
    "Lowe's",
    "Amazon",
    "Best Buy",
    "Kroger",
    "Walgreens",
    "Macy's",
    "Nordstrom",
    "Gap",
    "Nike",
    "Adidas",
    "Lululemon",
    "TJX",
    "Ross",
    "Dollar General",
    "Five Below",
    "Etsy",
    "Wayfair",
    "Chewy",
    "ASOS",
    "Zalando",
    "JD.com",
  ],
  Government: [
    "NASA",
    "EPA",
    "DOE",
    "DOD",
    "USDA",
    "FDA",
    "CDC",
    "NIH",
    "NSF",
    "DHS",
    "State Department",
    "Treasury",
    "Justice Department",
    "FEMA",
    "SBA",
    "VA",
    "USPS",
    "Federal Reserve",
    "CIA",
    "FBI",
    "NSA",
    "NIST",
    "NOAA",
    "BLM",
    "USFS",
  ],
};

const JOB_TITLES: Record<string, string[]> = {
  Technology: [
    "Senior Frontend Engineer",
    "Backend Developer",
    "Full Stack Engineer",
    "DevOps Engineer",
    "Data Scientist",
    "ML Engineer",
    "Product Manager",
    "UX Designer",
    "Site Reliability Engineer",
    "Security Engineer",
    "iOS Developer",
    "Android Developer",
    "Engineering Manager",
    "Staff Engineer",
    "Principal Architect",
    "Cloud Engineer",
    "Platform Engineer",
    "QA Engineer",
    "Technical Writer",
    "Solutions Architect",
  ],
  Healthcare: [
    "Clinical Data Analyst",
    "Biostatistician",
    "Regulatory Affairs Manager",
    "Medical Science Liaison",
    "Health Informatics Specialist",
    "Pharmaceutical Researcher",
    "Clinical Trial Manager",
    "Health Policy Analyst",
    "Medical Writer",
    "Drug Safety Associate",
    "HEOR Analyst",
    "Biotech Process Engineer",
    "Genomics Researcher",
    "Medical Affairs Manager",
    "Patient Outcomes Analyst",
    "Epidemiologist",
    "Clinical Programmer",
    "Quality Assurance Specialist",
    "HEOR Consultant",
    "Medical Director",
  ],
  Finance: [
    "Investment Banking Associate",
    "Quantitative Analyst",
    "Risk Manager",
    "Portfolio Manager",
    "Financial Analyst",
    "Trader",
    "Compliance Officer",
    "M&A Analyst",
    "Credit Analyst",
    "Equity Research Associate",
    "Treasury Analyst",
    "Actuary",
    "Financial Planner",
    "Wealth Manager",
    "Operations Analyst",
    "Derivatives Trader",
    "Structured Products Analyst",
    "PE Associate",
    "VC Analyst",
    "FP&A Manager",
  ],
  Energy: [
    "Renewable Energy Engineer",
    "Petroleum Engineer",
    "Drilling Engineer",
    "Reservoir Engineer",
    "Energy Analyst",
    "Grid Operations Manager",
    "Environmental Engineer",
    "Solar Project Manager",
    "Wind Farm Engineer",
    "Battery Systems Engineer",
    "Energy Trader",
    "Regulatory Analyst",
    "Sustainability Consultant",
    "Power Systems Engineer",
    "Geoscientist",
    "Landman",
    "Pipeline Engineer",
    "HSE Manager",
    "Carbon Analyst",
    "Energy Economist",
  ],
  Education: [
    "Instructional Designer",
    "EdTech Product Manager",
    "Curriculum Developer",
    "Learning Experience Designer",
    "Education Data Analyst",
    "Academic Advisor",
    "Student Success Manager",
    "Content Strategist",
    "Assessment Specialist",
    "Education Consultant",
    "Program Manager",
    "Partnership Manager",
    "Policy Researcher",
    "Grant Writer",
    "Enrollment Manager",
    "Regional Director",
    "Operations Manager",
    "Learning Engineer",
    "UX Researcher",
    "Growth Marketing Manager",
  ],
  Manufacturing: [
    "Manufacturing Engineer",
    "Quality Engineer",
    "Industrial Engineer",
    "Supply Chain Analyst",
    "Operations Manager",
    "Process Engineer",
    "Automation Engineer",
    "Lean Six Sigma Black Belt",
    "Production Supervisor",
    "Materials Planner",
    "Continuous Improvement Manager",
    "Plant Manager",
    "Reliability Engineer",
    "Safety Engineer",
    "Procurement Specialist",
    "Logistics Coordinator",
    "Packaging Engineer",
    "Tooling Engineer",
    "Test Engineer",
    "NPI Engineer",
  ],
  Retail: [
    "Merchandising Manager",
    "Supply Chain Manager",
    "E-commerce Analyst",
    "Inventory Planner",
    "Store Operations Manager",
    "Digital Marketing Manager",
    "Customer Insights Analyst",
    "Pricing Analyst",
    "Brand Manager",
    "Product Development Manager",
    "Retail Analyst",
    "Omni-channel Manager",
    "Loss Prevention Manager",
    "Buying Manager",
    "Planning Manager",
    "CRM Manager",
    "Loyalty Program Manager",
    "Vendor Manager",
    "Allocation Analyst",
    "Regional Manager",
  ],
  Government: [
    "Policy Analyst",
    "Program Officer",
    "Budget Analyst",
    "Contract Specialist",
    "Research Scientist",
    "Intelligence Analyst",
    "Project Manager",
    "Public Affairs Specialist",
    "Legislative Analyst",
    "Grants Manager",
    "Field Investigator",
    "Systems Analyst",
    "Security Specialist",
    "Emergency Manager",
    "Communications Director",
    "Strategic Planner",
    "Data Analyst",
    "Inspector",
    "Foreign Service Officer",
    "Technical Advisor",
  ],
};

const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Chicago, IL",
  "Los Angeles, CA",
  "Denver, CO",
  "Atlanta, GA",
  "Remote",
  "Washington, DC",
  "Dallas, TX",
  "Portland, OR",
  "Miami, FL",
  "Philadelphia, PA",
  "San Diego, CA",
  "Minneapolis, MN",
  "Phoenix, AZ",
  "Nashville, TN",
  "Detroit, MI",
  "Raleigh, NC",
  "Salt Lake City, UT",
  "Boulder, CO",
  "Palo Alto, CA",
  "Cambridge, MA",
  "Houston, TX",
  "Kansas City, MO",
  "Pittsburgh, PA",
  "Cincinnati, OH",
  "Indianapolis, IN",
];

const JOB_TYPES = ["Full-time", "Contract", "Part-time", "Internship"] as const;
const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Manager",
] as const;

const DESCRIPTION_TEMPLATES = [
  "We are seeking a talented {title} to join our growing team. In this role, you will be responsible for driving key initiatives, collaborating with cross-functional teams, and delivering high-impact solutions that align with our strategic goals.",
  "Join our dynamic organization as a {title} where you will leverage your expertise to solve complex challenges, mentor junior team members, and contribute to innovative projects that make a real difference.",
  "We are looking for a passionate {title} to help us scale our operations. You will work closely with leadership to define strategy, implement best practices, and ensure operational excellence across the board.",
  "As a {title} at our company, you will be at the forefront of industry innovation. This role offers the opportunity to work with cutting-edge technologies and lead transformative projects.",
  "Exciting opportunity for a {title} to join a collaborative team environment. You will be instrumental in shaping our product roadmap, improving processes, and driving measurable business outcomes.",
  "We are hiring a {title} to lead critical projects and drive continuous improvement. The ideal candidate brings strong analytical skills, a proactive mindset, and a track record of delivering results in fast-paced environments.",
  "Our team is growing and we need a skilled {title} who thrives in agile environments. You will partner with stakeholders to gather requirements, design solutions, and ensure successful delivery.",
  "Seeking an experienced {title} to take ownership of key functional areas. This role combines technical depth with strategic thinking to advance our mission and deliver exceptional value.",
];

const REQUIREMENTS_POOL = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Data Analysis",
  "Project Management",
  "Agile",
  "Scrum",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Excel",
  "Tableau",
  "Power BI",
  "R",
  "Java",
  "C++",
  "Go",
  "Rust",
  "GraphQL",
  "REST APIs",
  "Git",
  "CI/CD",
  "Terraform",
  "Spark",
  "Hadoop",
  "TensorFlow",
  "PyTorch",
  "Statistics",
  "A/B Testing",
  "UX Research",
  "Figma",
  "Sketch",
  "Product Strategy",
  "MBA",
  "CPA",
  "CFA",
  "PMP",
  "Six Sigma",
  "Lean",
  "SAP",
  "Salesforce",
  "Marketing",
  "Content Strategy",
  "SEO",
  "Stakeholder Management",
  "Cross-functional Collaboration",
  "Strategic Planning",
  "Budget Management",
  "Risk Assessment",
  "Compliance",
  "Regulatory Knowledge",
  "Clinical Research",
  "Quality Assurance",
  "DevOps",
  "Microservices",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Elasticsearch",
  "HTML/CSS",
  "Next.js",
  "Vue.js",
  "Angular",
  "Swift",
  "Kotlin",
  "Flutter",
  "Data Modeling",
  "ETL Pipelines",
  "BigQuery",
  "Snowflake",
  "dbt",
  "Airflow",
  "Cybersecurity",
  "Penetration Testing",
  "Incident Response",
  "Network Security",
  "Renewable Energy",
  "Sustainability",
  "Environmental Science",
  "Geology",
  "Petrophysics",
  "Reservoir Simulation",
  "Grid Optimization",
  "Energy Markets",
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateDescription(title: string): string {
  const template =
    DESCRIPTION_TEMPLATES[
      Math.floor(Math.random() * DESCRIPTION_TEMPLATES.length)
    ];
  return template.replace("{title}", title);
}

function generateRequirements(): string {
  const count = 3 + Math.floor(Math.random() * 5); // 3-7 requirements
  return pickRandom(REQUIREMENTS_POOL, count).join(", ");
}

function generateResponsibilities(): string {
  const responsibilities = [
    "Lead cross-functional projects from conception to delivery",
    "Analyze data and present insights to senior leadership",
    "Develop and maintain scalable systems and processes",
    "Collaborate with stakeholders to define project requirements",
    "Mentor and guide junior team members",
    "Drive continuous improvement initiatives",
    "Ensure compliance with industry standards and regulations",
    "Manage vendor relationships and contracts",
    "Create documentation and training materials",
    "Participate in strategic planning and goal setting",
    "Monitor key performance metrics and report on progress",
    "Research and implement new technologies and methodologies",
    "Present findings and recommendations to executive teams",
    "Coordinate with external partners and agencies",
    "Support budget planning and resource allocation",
  ];
  const count = 4 + Math.floor(Math.random() * 5);
  return pickRandom(responsibilities, count).join(". ") + ".";
}

function generateMatchReasons(title: string): string {
  const reasons = [
    `Your experience aligns well with the ${title} role requirements`,
    "Strong skill match in core competencies",
    "Relevant industry background and domain expertise",
    "Educational qualifications meet the position criteria",
    "Location preferences align with this opportunity",
    "Career trajectory matches the growth path for this role",
    "Demonstrated leadership experience matches requirements",
    "Technical skill set is highly compatible",
  ];
  const count = 2 + Math.floor(Math.random() * 3);
  return pickRandom(reasons, count).join(". ") + ".";
}

function generateSkillGaps(): string {
  const gaps = [
    "Advanced certification in specialized area may be beneficial",
    "Experience with specific proprietary tools could be developed",
    "Industry-specific regulatory knowledge could be strengthened",
    "Additional years in a leadership capacity would be advantageous",
  ];
  const count = 1 + Math.floor(Math.random() * 2);
  return pickRandom(gaps, count).join(". ") + ".";
}

function generateDeadline(): string {
  const now = new Date();
  const daysAhead = 5 + Math.floor(Math.random() * 85); // 5-90 days ahead
  const deadline = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return deadline.toISOString().split("T")[0];
}

function generateSalaryRange(sector: string, level: string): string {
  const baseMin: Record<string, number> = {
    "Entry Level": 50000,
    "Mid Level": 80000,
    "Senior Level": 120000,
    Lead: 150000,
    Manager: 140000,
  };
  const baseMax: Record<string, number> = {
    "Entry Level": 85000,
    "Mid Level": 140000,
    "Senior Level": 190000,
    Lead: 220000,
    Manager: 200000,
  };
  const sectorMult: Record<string, number> = {
    Technology: 1.3,
    Healthcare: 1.1,
    Finance: 1.25,
    Energy: 1.15,
    Education: 0.85,
    Manufacturing: 1.0,
    Retail: 0.9,
    Government: 0.9,
  };
  const min =
    Math.round(((baseMin[level] || 80000) * (sectorMult[sector] || 1)) / 5000) *
    5000;
  const max =
    Math.round(
      ((baseMax[level] || 140000) * (sectorMult[sector] || 1)) / 5000
    ) * 5000;
  return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
}

function generatePostedDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const posted = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return posted.toISOString().split("T")[0];
}

let idCounter = 1;

export function generateMockJobs(
  count: number = 100,
  profileId: number = 1
): Job[] {
  const jobs: Job[] = [];

  for (let i = 0; i < count; i++) {
    const sectorName = SECTORS[Math.floor(Math.random() * SECTORS.length)];
    const sectorId = SECTORS.indexOf(sectorName) + 1;
    const titles = JOB_TITLES[sectorName] || JOB_TITLES.Technology;
    const title = titles[Math.floor(Math.random() * titles.length)];
    const companies = COMPANIES[sectorName] || COMPANIES.Technology;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const jobType = JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)];
    const experienceLevel =
      EXPERIENCE_LEVELS[Math.floor(Math.random() * EXPERIENCE_LEVELS.length)];

    // Weighted fit score distribution: more good matches than bad
    const fitScoreRoll = Math.random();
    let fitScore: number;
    if (fitScoreRoll < 0.15)
      fitScore = 95 + Math.floor(Math.random() * 6); // 95-100
    else if (fitScoreRoll < 0.4)
      fitScore = 85 + Math.floor(Math.random() * 10); // 85-94
    else if (fitScoreRoll < 0.7)
      fitScore = 70 + Math.floor(Math.random() * 15); // 70-84
    else if (fitScoreRoll < 0.88)
      fitScore = 50 + Math.floor(Math.random() * 20); // 50-69
    else fitScore = 20 + Math.floor(Math.random() * 30); // 20-49

    const statuses = [
      "discovered",
      "shortlisted",
      "applied",
      "archived",
    ] as const;
    const statusWeights = [0.55, 0.2, 0.15, 0.1];
    const statusRoll = Math.random();
    let status: "discovered" | "shortlisted" | "applied" | "archived" =
      "discovered";
    let cumulative = 0;
    for (let s = 0; s < statuses.length; s++) {
      cumulative += statusWeights[s];
      if (statusRoll < cumulative) {
        status = statuses[s];
        break;
      }
    }

    jobs.push({
      id: idCounter++,
      profileId,
      sectorId,
      title,
      company,
      location,
      jobDescription: generateDescription(title),
      requirements: generateRequirements(),
      responsibilities: generateResponsibilities(),
      salaryRange: generateSalaryRange(sectorName, experienceLevel),
      jobType,
      experienceLevel,
      applicationLink: `https://careers.${company.toLowerCase().replace(/[^a-z]/g, "")}.com/jobs/${idCounter}`,
      deadline: generateDeadline(),
      postedDate: generatePostedDate(),
      source: [
        "LinkedIn",
        "Indeed",
        "Company Website",
        "Glassdoor",
        "AngelList",
      ][Math.floor(Math.random() * 5)],
      fitScore,
      matchReasons: generateMatchReasons(title),
      skillGaps: generateSkillGaps(),
      status,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      ),
    });
  }

  return jobs.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));
}

export const SECTOR_COLORS: Record<string, string> = {
  Technology: "#00C9FF",
  Healthcare: "#22C55E",
  Finance: "#3B82F6",
  Energy: "#F59E0B",
  Education: "#8B5CF6",
  Manufacturing: "#EF4444",
  Retail: "#EC4899",
  Government: "#14B8A6",
};

export function getSectorName(sectorId: number | null | undefined): string {
  if (!sectorId) return "Unknown";
  return SECTORS[sectorId - 1] || "Unknown";
}

export function getFitScoreColor(score: number | null | undefined): {
  bg: string;
  text: string;
} {
  if (!score && score !== 0)
    return { bg: "rgba(100, 116, 139, 0.2)", text: "#94A3B8" };
  if (score >= 95) return { bg: "rgba(34, 197, 94, 0.2)", text: "#22C55E" };
  if (score >= 85)
    return {
      bg: "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
      text: "#FFFFFF",
    };
  if (score >= 70) return { bg: "rgba(59, 130, 246, 0.2)", text: "#3B82F6" };
  if (score >= 50) return { bg: "rgba(100, 116, 139, 0.3)", text: "#94A3B8" };
  return { bg: "rgba(51, 65, 85, 0.5)", text: "#64748B" };
}

export { SECTORS };
