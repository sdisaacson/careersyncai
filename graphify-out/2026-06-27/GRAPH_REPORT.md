# Graph Report - app (2026-06-27)

## Corpus Check

- 181 files · ~135,651 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 1333 nodes · 2188 edges · 97 communities (82 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `965ee895`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Core App & Pages|Core App & Pages]]
- [[_COMMUNITY_Mock Job Data & Dashboard|Mock Job Data & Dashboard]]
- [[_COMMUNITY_Resume & Tailoring|Resume & Tailoring]]
- [[_COMMUNITY_Package Configuration|Package Configuration]]
- [[_COMMUNITY_Research Agent UI|Research Agent UI]]
- [[_COMMUNITY_UI Primitives|UI Primitives]]
- [[_COMMUNITY_App TSConfig|App TSConfig]]
- [[_COMMUNITY_API & Database Core|API & Database Core]]
- [[_COMMUNITY_Homepage & Marketing|Homepage & Marketing]]
- [[_COMMUNITY_Kimi Auth & Session|Kimi Auth & Session]]
- [[_COMMUNITY_Server TSConfig|Server TSConfig]]
- [[_COMMUNITY_Command & Dialog UI|Command & Dialog UI]]
- [[_COMMUNITY_Auth Layout & Sidebar|Auth Layout & Sidebar]]
- [[_COMMUNITY_Node TSConfig|Node TSConfig]]
- [[_COMMUNITY_Button Group & Item UI|Button Group & Item UI]]
- [[_COMMUNITY_Sidebar & Tooltip UI|Sidebar & Tooltip UI]]
- [[_COMMUNITY_shadcnui Configuration|shadcn/ui Configuration]]
- [[_COMMUNITY_Dashboard Preview Asset|Dashboard Preview Asset]]
- [[_COMMUNITY_Menubar UI|Menubar UI]]
- [[_COMMUNITY_Interview API & Schema|Interview API & Schema]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Dropdown Menu UI|Dropdown Menu UI]]
- [[_COMMUNITY_Graphify Query Tools|Graphify Query Tools]]
- [[_COMMUNITY_Auth Router & Middleware|Auth Router & Middleware]]
- [[_COMMUNITY_Graphify Skills & Watch|Graphify Skills & Watch]]
- [[_COMMUNITY_Carousel UI|Carousel UI]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Input & Textarea UI|Input & Textarea UI]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Graphify Extraction Agents|Graphify Extraction Agents]]
- [[_COMMUNITY_Chart UI|Chart UI]]
- [[_COMMUNITY_Sheet UI|Sheet UI]]
- [[_COMMUNITY_Navigation Menu UI|Navigation Menu UI]]
- [[_COMMUNITY_API Boot & Context|API Boot & Context]]
- [[_COMMUNITY_Graphify Core Pipeline|Graphify Core Pipeline]]
- [[_COMMUNITY_OG Image Asset|OG Image Asset]]
- [[_COMMUNITY_Base TSConfig|Base TSConfig]]
- [[_COMMUNITY_Resume Preview Asset|Resume Preview Asset]]
- [[_COMMUNITY_Graphify Exports|Graphify Exports]]
- [[_COMMUNITY_Empty State UI|Empty State UI]]
- [[_COMMUNITY_Graphify Incremental Update|Graphify Incremental Update]]
- [[_COMMUNITY_Video & Audio Transcription|Video & Audio Transcription]]
- [[_COMMUNITY_HTTP Client|HTTP Client]]
- [[_COMMUNITY_Hero Background Asset|Hero Background Asset]]
- [[_COMMUNITY_Toggle UI|Toggle UI]]
- [[_COMMUNITY_GitHub Clone & Merge|GitHub Clone & Merge]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Alert UI|Alert UI]]
- [[_COMMUNITY_OTP Input UI|OTP Input UI]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Tabs UI|Tabs UI]]
- [[_COMMUNITY_Skeleton Loading UI|Skeleton Loading UI]]
- [[_COMMUNITY_Error Contracts|Error Contracts]]
- [[_COMMUNITY_Hover Card UI|Hover Card UI]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Vite Server Helpers|Vite Server Helpers]]
- [[_COMMUNITY_Graphify Hooks|Graphify Hooks]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Vitest Config|Vitest Config]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]

## God Nodes (most connected - your core abstractions)

1. `cn()` - 273 edges
2. `graphify` - 34 edges
3. `graphify skill definition` - 24 edges
4. `compilerOptions` - 22 edges
5. `Button()` - 18 edges
6. `compilerOptions` - 18 edges
7. `compilerOptions` - 16 edges
8. `getDb()` - 15 edges
9. `useAuth()` - 14 edges
10. `trpc` - 14 edges

## Surprising Connections (you probably didn't know these)

- `CareerSyncAI` --semantically_similar_to--> `CareerSyncAI` [INFERRED] [semantically similar]
  index.html → info.md
- `spawn_agent` --semantically_similar_to--> `Subagent` [INFERRED] [semantically similar]
  .codex/skills/graphify/SKILL.md → .claude/skills/graphify/SKILL.md
- `Vite` --semantically_similar_to--> `Vite` [INFERRED] [semantically similar]
  info.md → README.md
- `Semantic Extraction` --conceptually_related_to--> `extraction subagent` [INFERRED]
  .claude/skills/graphify/SKILL.md → .kimi/skills/graphify/references/extraction-spec.md
- `/graphify query` --conceptually_related_to--> `BFS Traversal` [INFERRED]
  .kimi/skills/graphify/SKILL.md → .claude/skills/graphify/references/query.md

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **graphify Pipeline** — graphify_skill_ast_extraction, graphify_skill_semantic_extraction, graphify_skill_graph_report, graphify_skill_community_detection [INFERRED 0.85]
- **Query Traversal Modes** — references_query_bfs, references_query_dfs, references_query_vocab_expansion [EXTRACTED 1.00]
- **graphify Export Formats** — references_exports_wiki, references_exports_neo4j, references_exports_svg, references_exports_graphml, references_exports_mcp [EXTRACTED 1.00]
- **graphify subcommands** — graphify_skill_graphify_query, graphify_skill_graphify_path, graphify_skill_graphify_explain, references_add_watch_graphify_add, graphify_skill_incremental_update, graphify_skill_cluster_only [INFERRED 0.75]
- **CareerSyncAI tech stack** — readme_react, readme_typescript, readme_vite, info_tailwind_css, info_shadcn_ui, info_node_js_20 [INFERRED 0.75]
- **graphify extraction pipeline** — graphify_skill_detect_files, graphify_skill_ast_extraction, graphify_skill_semantic_extraction, graphify_skill_video_audio_transcription, references_extraction_spec_extraction_subagent [INFERRED 0.75]
- **Dashboard UI Components** — public_dashboard_preview_job_matching_dashboard, public_dashboard_preview_sidebar_navigation, public_dashboard_preview_top_navigation, public_dashboard_preview_search_bar, public_dashboard_preview_notifications [INFERRED 0.85]
- **Job Card Elements** — public_dashboard_preview_job_card, public_dashboard_preview_fit_score, public_dashboard_preview_apply_now, public_dashboard_preview_bookmark [INFERRED 0.85]
- **Sample Job Listings** — public_dashboard_preview_current_job_opportunities, public_dashboard_preview_senior_ux_ui_designer, public_dashboard_preview_lead_software_engineer, public_dashboard_preview_data_scientist, public_dashboard_preview_marketing_manager, public_dashboard_preview_devops_engineer [INFERRED 0.85]
- **Network Visualization Elements** — public_hero_neural_bg_network_nodes, public_hero_neural_bg_connections, public_hero_neural_bg_neural_network [EXTRACTED 1.00]

## Communities (97 total, 15 thin omitted)

### Community 0 - "Package Dependencies"

Cohesion: 0.03
Nodes (76): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, class-variance-authority, clsx, cmdk, cookie, date-fns (+68 more)

### Community 1 - "UI Components"

Cohesion: 0.14
Nodes (16): easeOutExpo, PLAN_OPTIONS, SETTING_KEYS, Alert(), AlertDescription(), AlertTitle(), alertVariants, Select() (+8 more)

### Community 2 - "Core App & Pages"

Cohesion: 0.20
Nodes (11): easeOutExpo, Navbar(), navLinks, Button(), Card(), CardAction(), CardContent(), CardDescription() (+3 more)

### Community 3 - "Mock Job Data & Dashboard"

Cohesion: 0.07
Nodes (38): COMPANIES, DESCRIPTION_TEMPLATES, EXPERIENCE_LEVELS, generateDeadline(), generateDescription(), generateMatchReasons(), generateMockJobs(), generatePostedDate() (+30 more)

### Community 4 - "Resume & Tailoring"

Cohesion: 0.12
Nodes (32): CHANGE_TEMPLATES, COMPANIES, generateDate(), generateMockResumes(), getRandomItems(), HIGHLIGHT_TEMPLATES, JOB_TITLES, KEYWORDS (+24 more)

### Community 5 - "Package Configuration"

Cohesion: 0.05
Nodes (40): devDependencies, autoprefixer, drizzle-kit, esbuild, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+32 more)

### Community 6 - "Research Agent UI"

Cohesion: 0.09
Nodes (29): createLogEntry(), EXPERIENCE_LEVELS, generateAllMockJobs(), generateDeadline(), generateFitScore(), generateMatchReasons(), generateMockJobsForSector(), generatePostedDate() (+21 more)

### Community 7 - "UI Primitives"

Cohesion: 0.09
Nodes (18): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+10 more)

### Community 8 - "App TSConfig"

Cohesion: 0.07
Nodes (26): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+18 more)

### Community 9 - "API & Database Core"

Cohesion: 0.15
Nodes (15): jobRouter, adminQuery, profileRouter, researchRouter, resumeRouter, sectorRouter, settingsRouter, appSettings (+7 more)

### Community 10 - "Homepage & Marketing"

Cohesion: 0.10
Nodes (10): AnimatedCounter(), AnimatedCounterProps, NeuralCanvas(), NeuralCanvasProps, Node, easeOutExpo, featureCards, processSteps (+2 more)

### Community 11 - "Kimi Auth & Session"

Cohesion: 0.12
Nodes (19): app, createContext(), TrpcContext, AppRouter, Paths, InsertUser, User, authenticateRequest() (+11 more)

### Community 12 - "Server TSConfig"

Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, baseUrl, esModuleInterop, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 14 - "Auth Layout & Sidebar"

Cohesion: 0.13
Nodes (8): footerColumns, Layout(), easeOutExpo, easeOutExpo, messages, steps, Login(), NotFound()

### Community 15 - "Node TSConfig"

Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 16 - "Button Group & Item UI"

Cohesion: 0.13
Nodes (17): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Item(), ItemActions(), ItemContent(), ItemDescription() (+9 more)

### Community 17 - "Sidebar & Tooltip UI"

Cohesion: 0.07
Nodes (34): AdminLayout(), navItems, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+26 more)

### Community 18 - "shadcn/ui Configuration"

Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 19 - "Dashboard Preview Asset"

Cohesion: 0.15
Nodes (17): Apex Brand, Apply Now Action, Bookmark Action, Current Job Opportunities, Data Scientist, DevOps Engineer, Fit Score, Dashboard Preview Image (+9 more)

### Community 20 - "Menubar UI"

Cohesion: 0.06
Nodes (42): cn(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut() (+34 more)

### Community 21 - "Interview API & Schema"

Cohesion: 0.08
Nodes (24): interviewRouter, AppSetting, InsertAppSetting, InsertInterview, InsertInterviewQuestion, InsertJob, InsertProfile, InsertSector (+16 more)

### Community 22 - "Community 22"

Cohesion: 0.15
Nodes (12): Connection Changes (`api/queries/connection.ts`), Context, Database Backend Migration: MySQL → Supabase (PostgreSQL), Decision Log, Dependency Changes (`package.json`), Drizzle Kit Config (`drizzle.config.ts`), Environment Variables, Goal (+4 more)

### Community 23 - "Dropdown Menu UI"

Cohesion: 0.07
Nodes (25): AuthLayoutContent(), AuthLayoutContentProps, menuItems, useIsMobile(), Avatar(), AvatarFallback(), AvatarImage(), DropdownMenu() (+17 more)

### Community 24 - "Graphify Query Tools"

Cohesion: 0.19
Nodes (12): graphify, graphify, Fast Path for Existing Graph, /graphify explain, /graphify path, /graphify query, query reference, BFS Traversal (+4 more)

### Community 25 - "Auth Router & Middleware"

Cohesion: 0.18
Nodes (10): authRouter, authedQuery, requireAuth, t, PLANS, subscriptionRouter, ErrorMessages, Session (+2 more)

### Community 26 - "Graphify Skills & Watch"

Cohesion: 0.17
Nodes (11): graphify, Graph Health Check, GRAPH_REPORT.md, graphify, GraphRAG-Ready JSON, Interactive HTML, Obsidian Vault, Surprising Connections (+3 more)

### Community 27 - "Carousel UI"

Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 28 - "Community 28"

Cohesion: 0.29
Nodes (9): AuthLayout(), PricingCard(), PricingCardProps, useAuth(), getPlanById(), PRICING_PLANS, PricingPlan, easeOutExpo (+1 more)

### Community 29 - "Input & Textarea UI"

Cohesion: 0.07
Nodes (16): Checkbox(), HoverCardContent(), InputOTP(), InputOTPGroup(), InputOTPSlot(), Progress(), ResizableHandle(), ResizablePanelGroup() (+8 more)

### Community 30 - "Project Documentation"

Cohesion: 0.19
Nodes (12): CareerSyncAI, CareerSyncAI, Node.js 20, shadcn/ui, Tailwind CSS, Vite, Expanding the ESLint configuration, React (+4 more)

### Community 31 - "Community 31"

Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 32 - "Graphify Extraction Agents"

Cohesion: 0.18
Nodes (11): Gemini API, Semantic Extraction, spawn_agent, Subagent, extraction-spec reference, Confidence Rubric, confidence rubric, extraction subagent (+3 more)

### Community 33 - "Chart UI"

Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 34 - "Sheet UI"

Cohesion: 0.14
Nodes (10): UseAuthOptions, ACCEPTED_TYPES, ExtractedProfile, ParsedResume, UploadState, queryClient, trpc, trpcClient (+2 more)

### Community 35 - "Navigation Menu UI"

Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 36 - "API Boot & Context"

Cohesion: 0.18
Nodes (10): File Structure, Self-Review Checklist, Supabase (PostgreSQL) Migration Implementation Plan, Task 1: Swap database dependencies, Task 2: Update Drizzle Kit configuration, Task 3: Convert schema from MySQL to PostgreSQL, Task 4: Switch database connection driver, Task 5: Update environment documentation (+2 more)

### Community 37 - "Graphify Core Pipeline"

Cohesion: 0.33
Nodes (9): graphify skill definition, AST Extraction, Community Detection, cost tracker, detect files, Directed Graph, God Nodes, Honesty Rules (+1 more)

### Community 38 - "OG Image Asset"

Cohesion: 0.28
Nodes (9): AI-Powered Career Partner, CareerSync AI, careersync.ai, Elevate Your Path, Future of Professional Growth, CareerSync OG Image, Join the Network, Neural Network Background (+1 more)

### Community 39 - "Base TSConfig"

Cohesion: 0.22
Nodes (8): compilerOptions, baseUrl, paths, files, @/_, @contracts/_, @/db/*, references

### Community 40 - "Resume Preview Asset"

Cohesion: 0.25
Nodes (8): Resume Template Preview, Certifications, Education, Experience, Professional Summary, Resume, Senior Software Engineer, Skills

### Community 41 - "Graphify Exports"

Cohesion: 0.25
Nodes (8): exports reference, Token Reduction Benchmark, FalkorDB Export, GraphML Export, MCP Server, Neo4j Export, SVG Export, Wiki Export

### Community 42 - "Empty State UI"

Cohesion: 0.13
Nodes (19): easeOutExpo, easeOutExpo, Badge(), badgeVariants, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader() (+11 more)

### Community 43 - "Graphify Incremental Update"

Cohesion: 0.48
Nodes (7): Cluster-Only, Incremental Update, update reference, build_merge, Cluster-Only Re-Clustering, detect_incremental, Incremental Re-Extraction

### Community 44 - "Video & Audio Transcription"

Cohesion: 0.29
Nodes (7): video and audio transcription, URL Ingestion, Whisper, yt-dlp, transcribe reference, video and audio transcription, Whisper Transcription

### Community 46 - "Hero Background Asset"

Cohesion: 0.33
Nodes (7): Artificial Intelligence, Career Matching Theme, Node Connections, Hero Neural Background Image, Machine Learning, Network Nodes, Neural Network

### Community 47 - "Toggle UI"

Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 48 - "GitHub Clone & Merge"

Cohesion: 0.40
Nodes (6): GitHub Clone, github-and-merge reference, GitHub Clone, Cross-Repo Merge, graphify clone, Monorepo Layout

### Community 49 - "Community 49"

Cohesion: 0.33
Nodes (6): AccountPage(), easeOutExpo, formatDate(), formatPrice(), Input(), Label()

### Community 50 - "Community 50"

Cohesion: 0.29
Nodes (6): AnswerState, AnswerType, buildProfileDisplay(), InterviewPage(), Question, QUESTIONS

### Community 51 - "Alert UI"

Cohesion: 0.06
Nodes (28): Job, TailoredResume, BARBARA_COMPANIES, BARBARA_INTERVIEW_ANSWERS, BARBARA_LOCATIONS, BARBARA_PARSED_RESUME, BARBARA_PROFILE, BARBARA_SECTORS (+20 more)

### Community 52 - "OTP Input UI"

Cohesion: 0.25
Nodes (6): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 53 - "Community 53"

Cohesion: 0.40
Nodes (3): AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 54 - "Tabs UI"

Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 55 - "Skeleton Loading UI"

Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 56 - "Error Contracts"

Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 58 - "Hover Card UI"

Cohesion: 0.12
Nodes (15): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+7 more)

### Community 61 - "Graphify Hooks"

Cohesion: 0.20
Nodes (9): adminRouter, jobsRelations, profilesRelations, subscriptionsRelations, tailoredResumesRelations, usersRelations, profiles, subscriptions (+1 more)

### Community 71 - "Community 71"

Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 72 - "Community 72"

Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 73 - "Community 73"

Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "Community 74"

Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 77 - "Community 77"

Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "Community 78"

Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 79 - "Community 79"

Cohesion: 0.40
Nodes (6): Add URL, Watch Mode, add-watch reference, Folder Watcher, /graphify add, --watch

### Community 80 - "Community 80"

Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 81 - "Community 81"

Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 82 - "Community 82"

Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 83 - "Community 83"

Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 84 - "Community 84"

Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 85 - "Community 85"

Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 86 - "Community 86"

Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 87 - "Community 87"

Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 88 - "Community 88"

Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 89 - "Community 89"

Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps

- **531 isolated node(s):** `app`, `jwks`, `RequestConfig`, `App`, `t` (+526 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Menubar UI` to `UI Components`, `Core App & Pages`, `UI Primitives`, `Command & Dialog UI`, `Button Group & Item UI`, `Sidebar & Tooltip UI`, `Dropdown Menu UI`, `Carousel UI`, `Community 28`, `Input & Textarea UI`, `Community 31`, `Chart UI`, `Navigation Menu UI`, `Empty State UI`, `Toggle UI`, `Community 49`, `OTP Input UI`, `Community 53`, `Hover Card UI`, `Community 59`, `Community 71`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Why does `Job` connect `Alert UI` to `Mock Job Data & Dashboard`, `Resume & Tailoring`, `Interview API & Schema`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `trpc` connect `Sheet UI` to `UI Components`, `Core App & Pages`, `Mock Job Data & Dashboard`, `Resume & Tailoring`, `Research Agent UI`, `Empty State UI`, `Community 49`, `Community 50`, `Community 28`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `app`, `jwks`, `RequestConfig` to the rest of the system?**
  _536 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.02631578947368421 - nodes in this community are weakly interconnected._
- **Should `UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Should `Mock Job Data & Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.070578231292517 - nodes in this community are weakly interconnected._
