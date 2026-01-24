// SEO Analysis Types

export interface SEOScores {
  meta: number;
  content: number;
  technical: number;
  performance: number;
  mobile: number;
  security: number;
  accessibility: number;
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number | null;
}

export interface Metrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  speedIndex: number;
  timeToInteractive: number;
}

export interface FileSizes {
  originalResponseBytes: number;
  optimizedResponseBytes: number;
}

export interface MetaTitle {
  content: string;
  length: number;
  status: "good" | "warning" | "error";
  recommendations: string[];
}

export interface MetaDescription {
  content: string;
  length: number;
  status: "good" | "warning" | "error";
  recommendations: string[];
}

export interface MetaKeywords {
  content: string;
  status: "present" | "not_present";
  recommendations: string[];
}

export interface MetaRobots {
  content: string;
  status: string;
}

export interface MetaCanonical {
  exists: boolean;
  url: string;
  status: string;
  recommendations: string[];
}

export interface MetaOpenGraph {
  status: string;
  missing_tags: string[];
}

export interface MetaTwitterCard {
  status: string;
  missing_tags: string[];
}

export interface MetaViewport {
  content: string;
  exists: boolean;
  status: string;
  recommendations: string[];
}

export interface MetaInformation {
  title: MetaTitle;
  description: MetaDescription;
  keywords: MetaKeywords;
  robots: MetaRobots;
  canonical: MetaCanonical;
  open_graph: MetaOpenGraph;
  twitter_card: MetaTwitterCard;
  charset: string;
  language: string;
  viewport: MetaViewport;
}

export interface HeadingItem {
  level: string;
  text: string;
}

export interface Headings {
  structure: HeadingItem[];
  h1_count: number;
  h2_count: number;
  h3_count: number;
  h4_count: number;
  h5_count: number;
  h6_count: number;
  issues: string[];
}

export interface Readability {
  flesch_reading_ease: number;
  flesch_kincaid_grade: number;
  difficulty: string;
  notes: string;
}

export interface TopKeyword {
  keyword: string;
  count: number;
  density: number;
}

export interface ContentAnalysis {
  word_count: number;
  character_count: number;
  readability: Readability;
  top_keywords: TopKeyword[];
  reading_time_minutes: number;
  score: number;
  status: string;
}

export interface Links {
  total: number;
  internal: number;
  external: number;
  nofollow: number;
  dofollow: number;
  broken: number;
  issues: string[];
}

export interface Images {
  total: number;
  with_alt: number;
  without_alt: number;
  lazy_loaded: number;
  issues: string[];
}

export interface PerformanceResources {
  scripts: number;
  stylesheets: number;
  images: number;
}

export interface CoreWebVital {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  numericValue?: number | null;
  numericUnit?: string;
  displayValue?: string;
  details?: any;
  warnings?: string[];
  metricSavings?: any;
}

export interface LighthouseDetails {
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  core_web_vitals: Record<string, CoreWebVital>;
}

export interface Performance {
  page_load_time_ms: number;
  page_size_bytes: number;
  page_size_formatted: string;
  resources: PerformanceResources;
  score: number;
  lighthouse: LighthouseDetails;
}

export interface Mobile {
  viewport_configured: boolean;
  responsive_design: boolean;
  media_queries: number;
  is_mobile_friendly: boolean;
  score: number;
}

export interface SSL {
  enabled: boolean;
  status: string;
}

export interface StructuredData {
  exists: boolean;
  count: number;
  types: string[];
}

export interface TechnicalSEO {
  ssl: SSL;
  robots_txt: Record<string, any>;
  sitemap: Record<string, any>;
  structured_data: StructuredData;
  status_code: number;
  redirects: number;
  score: number;
}

export interface Security {
  https: boolean;
  headers: Record<string, any>;
  score: number;
  issues: string[];
}

export interface SemanticHTML {
  nav: number;
  header: number;
  footer: number;
  main: number;
  article: number;
  section: number;
}

export interface Accessibility {
  aria_labels: number;
  alt_text_coverage: number;
  semantic_html: SemanticHTML;
  form_labels: number;
  score: number;
  issues: string[];
}

export interface URLAnalysis {
  length: number;
  has_keywords: boolean;
  is_readable: boolean;
  has_parameters: boolean;
  uses_hyphens: boolean;
  uses_underscores: boolean;
  depth: number;
  status: string;
  issues: string[];
}

export interface Backlinks {
  available: boolean;
  message: string;
}

export interface Recommendation {
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  issue: string;
  impact: string;
  recommendation: string;
}

export interface Issue {
  type: string;
  message: string;
}

export interface Issues {
  critical: Issue[];
  warnings: Issue[];
  notices: Issue[];
}

export interface OverallScore {
  total: number;
  grade: string;
  status: string;
  breakdown: SEOScores;
}

export interface ServiceInfo {
  name: string;
  category: string;
  version: string;
}

export interface FullReportData {
  status: string;
  timestamp: string;
  url: string;
  domain: string;
  analysis_id: string;
  processing_time_ms: number;
  overall_score: OverallScore;
  category_scores: SEOScores;
  meta_information: MetaInformation;
  headings: Headings;
  content_analysis: ContentAnalysis;
  links: Links;
  images: Images;
  performance: Performance;
  mobile: Mobile;
  technical_seo: TechnicalSEO;
  security: Security;
  accessibility: Accessibility;
  url_analysis: URLAnalysis;
  backlinks: Backlinks;
  recommendations: Recommendation[];
  issues: Issues;
  cost: number;
  remaining_credits: number;
  service_info: ServiceInfo;
}

export interface FullReportJson {
  success: boolean;
  message: string;
  timestamp: string;
  requestId: string;
  data: FullReportData;
}

export interface AdditionalImage {
  signedUrl: string;
}

export interface ScreenshotTimelineItem {
  timing: number; // in milliseconds
  timestamp: number;
  data: string; // URL
}

export interface NestedData {
  fullReportJson: FullReportJson;
  lighthouseScreenshot: string;
  additionalImages: AdditionalImage[];
  finalScreenshot?: string;
  screenshotTimeline?: ScreenshotTimelineItem[];
}

export interface SEOAnalysisData {
  scores: SEOScores;
  lighthouseScores: LighthouseScores;
  metrics: Metrics;
  fileSizes: FileSizes;
  _id: string;
  user: string;
  analysisId: string;
  url: string;
  totalScore: number;
  overallScore: number;
  grade: string;
  scoreStatus: string;
  includeBacklinks: boolean;
  backlinkCount: number;
  status: "completed" | "processing" | "failed" | "pending";
  processingTime: number;
  aiProvider: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  data: NestedData;
}

export interface SEOAnalysisResponse {
  status: "success" | "error" | "pending";
  data: SEOAnalysisData;
  error?: string;
  message?: string;
}
