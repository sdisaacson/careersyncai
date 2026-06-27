export type MockJob = {
  title: string;
  company: string;
  location: string;
  jobDescription: string;
  requirements: string;
  responsibilities: string;
  salaryRange: string;
  jobType: string;
  experienceLevel: string;
  applicationLink: string;
  deadline: string;
  postedDate: string;
  source: string;
  fitScore: number;
  matchReasons: string;
  skillGaps: string;
  sectorName: string;
  sectorId: number;
};

export type SectorConfig = {
  id: number;
  name: string;
  color: string;
  icon: string;
  companies: string[];
  jobTitles: string[];
  descriptions: string[];
  requirements: string[];
};

export const SECTOR_CONFIGS: SectorConfig[] = [
  {
    id: 1,
    name: "Technology",
    color: "#00C9FF",
    icon: "cpu",
    companies: [
      "Google", "Meta", "Stripe", "Airbnb", "Uber", "Netflix", "Spotify", "Slack",
      "Vercel", "Figma", "Notion", "Databricks", "Snowflake", "Palantir", "Cloudflare",
      "Twilio", "Datadog", "MongoDB", "Elastic", "HashiCorp",
    ],
    jobTitles: [
      "Software Engineer", "Senior Frontend Developer", "Backend Engineer", "Full Stack Developer",
      "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "Site Reliability Engineer",
      "Platform Engineer", "Security Engineer", "Mobile Engineer", "Staff Engineer",
      "Engineering Manager", "Product Engineer", "AI Research Scientist",
    ],
    descriptions: [
      "Design and build scalable distributed systems serving millions of users.",
      "Develop machine learning pipelines for personalized recommendations.",
      "Lead frontend architecture using React, TypeScript, and modern tooling.",
      "Build and maintain CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.",
      "Research and implement cutting-edge NLP models for content understanding.",
    ],
    requirements: [
      "5+ years experience with modern JavaScript/TypeScript frameworks",
      "Strong CS fundamentals — algorithms, data structures, system design",
      "Experience with cloud platforms (AWS/GCP/Azure) and containerization",
      "Track record of shipping production ML models at scale",
      "Bachelor's in CS or equivalent practical experience",
    ],
  },
  {
    id: 2,
    name: "Healthcare",
    color: "#22C55E",
    icon: "heart-pulse",
    companies: [
      "Roche", "Pfizer", "Moderna", "Illumina", "Tempus", "Guardant Health",
      "Veracyte", "23andMe", "Teladoc Health", "Amwell", "Cerner", "Epic Systems",
      "Medtronic", "Johnson & Johnson", "Siemens Healthineers",
    ],
    jobTitles: [
      "Clinical Research Scientist", "Bioinformatician", "Health Data Analyst",
      "Biostatistician", "Computational Biologist", "Clinical Data Manager",
      "Regulatory Affairs Specialist", "Medical Science Liaison", "Epidemiologist",
      "Pharmacovigilance Analyst", "Health Informatics Specialist", "Genomics Researcher",
    ],
    descriptions: [
      "Analyze clinical trial data to support regulatory submissions for novel therapeutics.",
      "Develop bioinformatics pipelines for genomic sequencing and variant analysis.",
      "Build predictive models for patient outcomes using electronic health records.",
      "Design and execute studies to evaluate drug safety and efficacy profiles.",
      "Lead data management activities for Phase I-III clinical trials.",
    ],
    requirements: [
      "PhD or Master's in Bioinformatics, Biostatistics, or related field",
      "Proficiency in R, Python, and statistical analysis methods",
      "Experience with clinical data standards (CDISC, SDTM, ADaM)",
      "Knowledge of FDA/EMA regulatory guidelines",
      "Strong publication record in peer-reviewed journals preferred",
    ],
  },
  {
    id: 3,
    name: "Finance",
    color: "#F59E0B",
    icon: "landmark",
    companies: [
      "Goldman Sachs", "JPMorgan Chase", "Citadel", "Two Sigma", "Bloomberg",
      "Stripe", "Plaid", "Affirm", "Robinhood", "Betterment", "BlackRock",
      "Vanguard", "Fidelity", "Charles Schwab", "Wise",
    ],
    jobTitles: [
      "Financial Analyst", "Risk Manager", "Quantitative Researcher", "Investment Analyst",
      "Portfolio Manager", "Credit Risk Analyst", "Compliance Officer", "Trader",
      "FinTech Product Manager", "Blockchain Engineer", "Actuary", "Treasury Analyst",
    ],
    descriptions: [
      "Build quantitative models for pricing derivatives and risk management.",
      "Analyze market trends and construct optimal investment portfolios.",
      "Develop fraud detection systems using machine learning techniques.",
      "Lead compliance initiatives ensuring adherence to SEC and FINRA regulations.",
      "Design and implement algorithmic trading strategies.",
    ],
    requirements: [
      "Bachelor's in Finance, Economics, Math, or related quantitative field",
      "Proficiency in Python, SQL, and Excel/VBA",
      "Experience with statistical modeling and time series analysis",
      "CFA or FRM certification preferred",
      "Strong understanding of financial markets and instruments",
    ],
  },
  {
    id: 4,
    name: "Energy",
    color: "#EF4444",
    icon: "zap",
    companies: [
      "Tesla Energy", "NextEra Energy", "Orsted", "BP", "Shell", "ExxonMobil",
      "Schneider Electric", "Siemens Energy", "GE Vernova", "Enphase Energy",
      "SolarEdge", "Fluence", "Vestas", "First Solar", "Brookfield Renewable",
    ],
    jobTitles: [
      "Renewable Energy Engineer", "Power Systems Analyst", "Energy Analyst",
      "Sustainability Consultant", "Grid Modernization Engineer", "Environmental Engineer",
      "Project Development Manager", "Energy Trader", "Carbon Analyst",
      "Battery Storage Engineer", "Wind Resource Analyst", "Solar PV Designer",
    ],
    descriptions: [
      "Design and optimize renewable energy systems for utility-scale projects.",
      "Analyze power grid stability and model energy transition scenarios.",
      "Lead carbon footprint assessments and develop net-zero strategies.",
      "Manage engineering projects for wind and solar installations.",
      "Develop energy storage solutions and battery management systems.",
    ],
    requirements: [
      "Bachelor's or Master's in Electrical/Mechanical Engineering or Energy Systems",
      "Experience with power system modeling tools (PSS/E, ETAP, PowerFactory)",
      "Knowledge of energy markets and regulatory frameworks",
      "Proficiency in Python, MATLAB, or R for data analysis",
      "PE license or equivalent certification preferred",
    ],
  },
  {
    id: 5,
    name: "Education",
    color: "#8B5CF6",
    icon: "graduation-cap",
    companies: [
      "Coursera", "Khan Academy", "Duolingo", "Chegg", "Byju's", "Udemy",
      " edX", "Guild Education", "Handshake", "Elevate K-12", "Outschool",
      "Quizlet", "Grammarly", "Course Hero", "Pearson",
    ],
    jobTitles: [
      "Curriculum Developer", "Learning Experience Designer", "EdTech Product Manager",
      "Instructional Designer", "Education Data Analyst", "Academic Researcher",
      "AI Tutoring Engineer", "Assessment Specialist", "Education Consultant",
      "Content Strategist — Education", "User Researcher — Learning", "Platform Engineer — EdTech",
    ],
    descriptions: [
      "Design engaging learning experiences using cognitive science principles.",
      "Build adaptive learning algorithms that personalize content for each student.",
      "Analyze learning analytics to improve course completion and engagement rates.",
      "Develop assessment frameworks aligned with educational standards.",
      "Lead product strategy for online learning platforms.",
    ],
    requirements: [
      "Master's or PhD in Education, Learning Sciences, or related field",
      "Experience with learning management systems and authoring tools",
      "Proficiency in data analysis and A/B testing methodologies",
      "Knowledge of pedagogical frameworks and assessment design",
      "Background in curriculum development preferred",
    ],
  },
  {
    id: 6,
    name: "Manufacturing",
    color: "#64748B",
    icon: "factory",
    companies: [
      "Tesla", "Boeing", "Siemens", "Honeywell", "Caterpillar", "John Deere",
      "Procter & Gamble", "Unilever", "3M", "Bosch", "ABB", "Fanuc",
      "Rockwell Automation", "DHL Supply Chain", "Flex",
    ],
    jobTitles: [
      "Industrial Engineer", "Supply Chain Analyst", "Quality Assurance Manager",
      "Manufacturing Engineer", "Robotics Engineer", "Process Improvement Specialist",
      "Operations Research Analyst", "Plant Manager", "Lean Six Sigma Black Belt",
      "Automation Engineer", "Materials Planner", "Production Supervisor",
    ],
    descriptions: [
      "Optimize production lines using lean manufacturing principles and data analytics.",
      "Design robotic automation systems for assembly and quality inspection.",
      "Lead supply chain optimization projects across global manufacturing networks.",
      "Implement Industry 4.0 solutions including IoT sensors and predictive maintenance.",
      "Develop quality control systems ensuring Six Sigma compliance.",
    ],
    requirements: [
      "Bachelor's in Industrial, Mechanical, or Manufacturing Engineering",
      "Experience with CAD/CAM software and PLM systems",
      "Knowledge of lean manufacturing, Six Sigma, and continuous improvement",
      "Proficiency in data analysis tools (Python, SQL, Tableau)",
      "APICS or Lean Six Sigma certification preferred",
    ],
  },
  {
    id: 7,
    name: "Consulting",
    color: "#EC4899",
    icon: "briefcase",
    companies: [
      "McKinsey & Company", "Boston Consulting Group", "Bain & Company",
      "Deloitte", "Accenture", "PwC", "KPMG", "EY", "Oliver Wyman",
      "Roland Berger", "Strategy&", "Capgemini", "IBM Consulting",
      "Infosys Consulting", "Tata Consultancy Services",
    ],
    jobTitles: [
      "Management Consultant", "Strategy Consultant", "Business Analyst",
      "Digital Transformation Consultant", "Data & Analytics Consultant",
      "Technology Strategy Associate", "Change Management Consultant",
      "Risk Advisory Consultant", "Operations Consultant",
      "Healthcare Consultant", "Financial Advisory Associate", "Senior Consultant",
    ],
    descriptions: [
      "Advise Fortune 500 clients on strategic transformations and market entry.",
      "Lead digital transformation initiatives across financial services clients.",
      "Develop data-driven insights to optimize operational efficiency.",
      "Design organizational change management programs for M&A integrations.",
      "Build financial models and conduct due diligence for private equity clients.",
    ],
    requirements: [
      "Bachelor's from top-tier university; MBA preferred for senior roles",
      "Exceptional analytical and problem-solving skills",
      "Advanced Excel, PowerPoint, and financial modeling capabilities",
      "Experience in client-facing roles with C-suite exposure",
      "Willingness to travel up to 80% of the time",
    ],
  },
  {
    id: 8,
    name: "Government",
    color: "#3B82F6",
    icon: "shield",
    companies: [
      "NASA", "NSA", "DARPA", "Department of Energy", "EPA", "FDA",
      "CDC", "NIH", "Department of State", "Department of Defense",
      "Lockheed Martin", "Raytheon", "Northrop Grumman", "Booz Allen Hamilton",
      "General Dynamics",
    ],
    jobTitles: [
      "Policy Analyst", "Intelligence Analyst", "Program Manager",
      "Defense Systems Engineer", "Cybersecurity Specialist", "Data Analyst — Federal",
      " Grants Manager", "Regulatory Affairs Analyst", "Public Health Analyst",
      "Research Scientist — Federal", "IT Specialist — Government", "Contract Specialist",
    ],
    descriptions: [
      "Analyze policy impacts and develop legislative recommendations.",
      "Lead cybersecurity operations for critical infrastructure protection.",
      "Manage federal R&D programs with multi-million dollar budgets.",
      "Conduct intelligence analysis using advanced data analytics tools.",
      "Develop and implement public health surveillance systems.",
    ],
    requirements: [
      "U.S. citizenship required; security clearance preferred or obtainable",
      "Bachelor's or advanced degree in relevant field",
      "Experience working within government or defense contracting environments",
      "Strong written and verbal communication skills",
      "Ability to obtain and maintain security clearances",
    ],
  },
];

const SOURCES = [
  "LinkedIn Jobs",
  "Indeed",
  "Glassdoor",
  "AngelList",
  "Hacker News",
  "Company Website",
  "Greenhouse",
  "Lever",
  "Workday",
  "ZipRecruiter",
];

const JOB_TYPES = ["Full-time", "Contract", "Remote", "Hybrid"];

const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid-Level",
  "Senior",
  "Lead",
  "Principal",
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDeadline(): string {
  const now = new Date();
  const daysAhead = randomInt(7, 90);
  const d = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
}

function generatePostedDate(): string {
  const now = new Date();
  const daysAgo = randomInt(1, 30);
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
}

function generateSalaryRange(): string {
  const base = randomInt(60, 200);
  const top = base + randomInt(20, 80);
  return `$${base}k - $${top}k / year`;
}

function generateFitScore(): number {
  return randomInt(60, 98);
}

function generateMatchReasons(sector: string): string {
  const reasons = [
    `Strong alignment with ${sector.toLowerCase()} sector requirements`,
    "Skills match 85% of job description keywords",
    "Experience level aligns perfectly with role expectations",
    "Location preferences match — within target radius",
    "Company size and culture align with candidate preferences",
    "Competitive salary range within expectations",
    "Required tech stack matches candidate expertise",
    "Strong educational background for this role type",
    "Visa sponsorship available if needed",
    "Remote work policy matches candidate preferences",
  ];
  const count = randomInt(3, 5);
  const shuffled = [...reasons].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join("; ");
}

export function generateMockJobsForSector(sectorConfig: SectorConfig): MockJob[] {
  const count = randomInt(10, 15);
  const jobs: MockJob[] = [];

  for (let i = 0; i < count; i++) {
    const title = randomPick(sectorConfig.jobTitles);
    const company = randomPick(sectorConfig.companies);
    const description = randomPick(sectorConfig.descriptions);
    const requirements = randomPick(sectorConfig.requirements);
    const responsibilities = randomPick(sectorConfig.descriptions);
    const fitScore = generateFitScore();

    jobs.push({
      title,
      company,
      location: randomPick([
        "San Francisco, CA",
        "New York, NY",
        "Seattle, WA",
        "Austin, TX",
        "Boston, MA",
        "Chicago, IL",
        "Los Angeles, CA",
        "Denver, CO",
        "Remote",
        "Washington, DC",
      ]),
      jobDescription: description,
      requirements,
      responsibilities,
      salaryRange: generateSalaryRange(),
      jobType: randomPick(JOB_TYPES),
      experienceLevel: randomPick(EXPERIENCE_LEVELS),
      applicationLink: `https://careers.${company.toLowerCase().replace(/\s+/g, "")}.com/jobs/${randomInt(10000, 99999)}`,
      deadline: generateDeadline(),
      postedDate: generatePostedDate(),
      source: randomPick(SOURCES),
      fitScore,
      matchReasons: generateMatchReasons(sectorConfig.name),
      skillGaps: randomPick([
        "Minor gap: Specific cloud certification may be beneficial",
        "No significant skill gaps identified",
        "Consider learning Kubernetes for this role",
        "May need domain-specific regulatory knowledge",
        "Minor: Advanced statistics course recommended",
      ]),
      sectorName: sectorConfig.name,
      sectorId: sectorConfig.id,
    });
  }

  return jobs;
}

export function generateAllMockJobs(): MockJob[] {
  const allJobs: MockJob[] = [];
  for (const sector of SECTOR_CONFIGS) {
    allJobs.push(...generateMockJobsForSector(sector));
  }
  return allJobs;
}

export type LogEntry = {
  id: number;
  timestamp: string;
  sector: string;
  sectorColor: string;
  message: string;
  status: "active" | "complete" | "queued";
};

let logIdCounter = 0;

export function createLogEntry(
  sector: string,
  sectorColor: string,
  message: string,
  status: "active" | "complete" | "queued" = "active"
): LogEntry {
  const now = new Date();
  const ts = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;
  return {
    id: ++logIdCounter,
    timestamp: ts,
    sector,
    sectorColor,
    message,
    status,
  };
}

export function getLogMessagesForSector(sector: SectorConfig): string[] {
  const sources = [
    "LinkedIn",
    "Indeed",
    "Glassdoor",
    "AngelList",
    "Company Career Pages",
    "Hacker News 'Who is Hiring'",
    "Greenhouse",
    "Lever",
  ];
  const actions = [
    `Scanning ${randomPick(sources)} for ${sector.name} roles...`,
    `Found matching positions at ${randomPick(sector.companies)} — analyzing fit...`,
    `Extracting requirements from ${randomPick(sector.companies)} job listing...`,
    `Comparing candidate profile against ${sector.name} job descriptions...`,
    `Calculating fit scores for ${sector.name} opportunities...`,
    `Discovered ${randomInt(2, 5)} new ${sector.name.toLowerCase()} positions`,
    `Validating application links and deadlines for ${sector.name} roles...`,
    `${sector.name} sector scan complete — all jobs catalogued`,
  ];
  return actions;
}
