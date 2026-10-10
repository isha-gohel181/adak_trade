import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

// Import models
import User from "../models/user.js";
import JobPosting from "../models/JobPosting.js";
import ForumThread from "../models/ForumThread.js";
import ForumReply from "../models/ForumReply.js";
import News from "../models/News.js";

async function seedData() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log(" Connected to MongoDB successfully.");

    // 1. Ensure or find Users for posting
    let adminUser = await User.findOne({ email: "admin@ias-dcs.com" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      adminUser = await User.create({
        fullName: "Dr. Alok Verma",
        email: "admin@ias-dcs.com",
        password: hashedPassword,
        role: "admin",
        is_verify: true,
        emailVerified: true,
        status: "active",
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      });
      console.log(" Created Admin user:", adminUser.email);
    }

    let scholarUser = await User.findOne({ email: "learner@nexprism.com" });
    if (!scholarUser) {
      const hashedPassword = await bcrypt.hash("Learner@123", 10);
      scholarUser = await User.create({
        fullName: "Priya Sharma",
        email: "learner@nexprism.com",
        password: hashedPassword,
        role: "student",
        is_verify: true,
        emailVerified: true,
        status: "active",
        profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      });
      console.log(" Created Scholar user:", scholarUser.email);
    }

    let facultyUser = await User.findOne({ email: "faculty@ias-dcs.com" });
    if (!facultyUser) {
      const hashedPassword = await bcrypt.hash("Faculty@123", 10);
      facultyUser = await User.create({
        fullName: "Prof. Rajesh Sengupta",
        email: "faculty@ias-dcs.com",
        password: hashedPassword,
        role: "instructor",
        is_verify: true,
        emailVerified: true,
        status: "active",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      });
      console.log(" Created Faculty user:", facultyUser.email);
    }

    // ==========================================
    // 2. SEED GIGS / JOB POSTINGS
    // ==========================================
    console.log("\n💼 Seeding Gigs / Job Postings...");
    await JobPosting.deleteMany({});

    const gigsData = [
      {
        title: "Senior Biostatistician for Clinical Trial Data Analysis",
        description: `We are seeking an experienced Senior Biostatistician to lead statistical programming and analysis for multi-center Phase-II/III clinical trials. 

Key Responsibilities:
• Formulate Statistical Analysis Plans (SAP) and sample size calculations.
• Perform survival analysis, Kaplan-Meier estimation, and Cox proportional hazards regression.
• Generate CDISC-compliant SDTM and ADaM datasets.
• Validate statistical outputs and author formal Clinical Study Reports (CSR).`,
        thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        isAdminApproved: true,
        status: true,
        budget: { min: 85000, max: 160000, currency: "INR" },
        category: "Statistical Analysis",
        skillsRequired: ["R", "SAS", "Survival Analysis", "Clinical Trials", "Biostatistics", "CDISC"],
        experienceLevel: "expert",
        estimatedDuration: { value: 3, unit: "months" },
        mode: "contract",
        location: {
          type: "remote",
          address: { city: "Hyderabad", state: "Telangana", country: "India" },
        },
        createdBy: facultyUser._id,
      },
      {
        title: "Machine Learning Engineer - Predictive Time Series Forecasting",
        description: `Looking for a high-caliber ML Engineer to develop end-to-end multi-horizon demand forecasting pipelines.

Requirements:
• Experience with ARIMA, SARIMAX, Prophet, and LSTM/Transformer architectures.
• Solid background in stationarity tests, autocorrelation analysis, and cross-validation on time-split datasets.
• Ability to containerize models with Docker and expose low-latency FastAPI inference endpoints.`,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        isAdminApproved: true,
        status: true,
        budget: { min: 65000, max: 130000, currency: "INR" },
        category: "Machine Learning",
        skillsRequired: ["Python", "PyTorch", "Prophet", "Time Series", "Pandas", "FastAPI"],
        experienceLevel: "intermediate",
        estimatedDuration: { value: 2, unit: "months" },
        mode: "freelance",
        location: {
          type: "hybrid",
          address: { city: "Bengaluru", state: "Karnataka", country: "India" },
        },
        createdBy: adminUser._id,
      },
      {
        title: "Econometrician & Quantitative Survey Data Analyst",
        description: `Conduct comprehensive econometric evaluations on large-scale socioeconomic survey datasets.

Scope of Work:
• Data cleaning, imputation, and complex survey weight calibration (NSSO, NFHS, World Bank formats).
• Estimate panel data models (Fixed Effects, Random Effects, GMM).
• Synthesize findings into clear executive policy briefs and visualization charts.`,
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        isAdminApproved: true,
        status: true,
        budget: { min: 45000, max: 95000, currency: "INR" },
        category: "Data Science",
        skillsRequired: ["STATA", "SPSS", "Econometrics", "Panel Data", "Hypothesis Testing", "Survey Design"],
        experienceLevel: "intermediate",
        estimatedDuration: { value: 6, unit: "weeks" },
        mode: "freelance",
        location: {
          type: "remote",
          address: { city: "New Delhi", state: "Delhi", country: "India" },
        },
        createdBy: facultyUser._id,
      },
      {
        title: "Applied Statistics Consultant for A/B Testing & Causal Inference",
        description: `Join as a lead experiment design consultant to architect our next-generation experimentation platform.

Key Deliverables:
• Design rigorous randomized controlled experiments with sequential testing protocols.
• Calculate statistical power, sample sizes, and Minimum Detectable Effects (MDE).
• Apply quasi-experimental methods (Synthetic Controls, Difference-in-Differences, Propensity Matching) when A/B testing is unfeasible.`,
        thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
        isAdminApproved: true,
        status: true,
        budget: { min: 75000, max: 150000, currency: "INR" },
        category: "Statistical Analysis",
        skillsRequired: ["Python", "Causal Inference", "A/B Testing", "Power Analysis", "Bayesian Statistics"],
        experienceLevel: "expert",
        estimatedDuration: { value: 1, unit: "months" },
        mode: "contract",
        location: {
          type: "remote",
          address: { city: "Mumbai", state: "Maharashtra", country: "India" },
        },
        createdBy: adminUser._id,
      },
      {
        title: "Interactive Data Visualization & Shiny Dashboard Developer",
        description: `Build responsive, visually appealing scientific dashboards in R Shiny and Plotly for empirical statistics research publications.

Responsibilities:
• Translate complex multivariate statistical summaries into clean, interactive UI components.
• Optimize reactive Shiny server workflows for high-volume dataset exploration.`,
        thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
        isAdminApproved: true,
        status: true,
        budget: { min: 35000, max: 70000, currency: "INR" },
        category: "BI & Visualization",
        skillsRequired: ["R Shiny", "Plotly", "ggplot2", "D3.js", "Data Visualization"],
        experienceLevel: "beginner",
        estimatedDuration: { value: 1, unit: "months" },
        mode: "internship",
        location: {
          type: "remote",
          address: { city: "Pune", state: "Maharashtra", country: "India" },
        },
        createdBy: facultyUser._id,
      },
      {
        title: "Lead NLP & LLM Data Extraction Specialist",
        description: `Develop state-of-the-art document intelligence pipelines to extract tabular and qualitative statistics from research papers and whitepapers.

Requirements:
• Experience with LangChain, LlamaIndex, embeddings, and vector databases.
• Fine-tuning and prompt engineering for structured JSON output formatting.`,
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        isAdminApproved: true,
        status: true,
        budget: { min: 95000, max: 190000, currency: "INR" },
        category: "Machine Learning",
        skillsRequired: ["Python", "LangChain", "OpenAI API", "Hugging Face", "Vector DB", "FastAPI"],
        experienceLevel: "expert",
        estimatedDuration: { value: 4, unit: "months" },
        mode: "full-time",
        location: {
          type: "hybrid",
          address: { city: "Noida", state: "Uttar Pradesh", country: "India" },
        },
        createdBy: adminUser._id,
      },
    ];

    const insertedGigs = await JobPosting.insertMany(gigsData);
    console.log(` Inserted ${insertedGigs.length} Gigs / Job Postings.`);

    // ==========================================
    // 3. SEED FORUM THREADS & REPLIES
    // ==========================================
    console.log("\n💬 Seeding Forum Threads & Replies...");
    await ForumThread.deleteMany({});
    await ForumReply.deleteMany({});

    const threadsData = [
      {
        title: "Bayesian vs. Frequentist Estimation in Small Sample Clinical Studies",
        content: `When dealing with small clinical sample sizes (e.g. N < 25), frequentist confidence intervals often span unrealistically wide ranges or violate physiological boundary constraints. 

How do you approach specifying informative vs. weakly informative prior distributions in Stan/brms? What MCMC convergence diagnostics (R-hat, effective sample size) do you consider non-negotiable before reporting findings?`,
        createdBy: scholarUser._id,
        isPinned: true,
        isApproved: true,
        Is_openSource: true,
        tags: ["bayesian", "frequentist", "statistics", "clinical-trials", "r-programming"],
        likes: [adminUser._id, facultyUser._id],
      },
      {
        title: "Handling High Multicollinearity in High-Dimensional Regression Models",
        content: `In our latest econometrics project, several macroeconomic regressors show Variance Inflation Factors (VIF) well above 12. 

What is your preferred strategy: Ridge Regression, ElasticNet, or Principal Component Regression (PCR)? How do you balance coefficient interpretability against prediction stability?`,
        createdBy: scholarUser._id,
        isPinned: false,
        isApproved: true,
        Is_openSource: true,
        tags: ["regression", "machine-learning", "multicollinearity", "python", "data-science"],
        likes: [facultyUser._id],
      },
      {
        title: "Best Practices for Causal Inference when Randomized Controlled Trials (RCTs) are Infeasible",
        content: `Observational datasets are plagued with confounding and selection bias. What is the community's experience using Difference-in-Differences (DiD) combined with Propensity Score Matching vs. Double Machine Learning (DML)? 

Would love to hear real-world recommendations on placebo tests and sensitivity analyses.`,
        createdBy: facultyUser._id,
        isPinned: false,
        isApproved: true,
        Is_openSource: true,
        tags: ["causal-inference", "econometrics", "data-analysis", "research-methodology"],
        likes: [adminUser._id, scholarUser._id],
      },
      {
        title: "Hypothesis Testing Pitfalls: Why p < 0.05 is Not Sufficient for Decision Making",
        content: `A critical discussion on statistical significance vs. practical significance. In large datasets, trivial effect sizes can easily achieve p < 0.001. 

Let's discuss minimum effect sizes (Cohen's d, Odds Ratios), statistical power calculations (1 - β), and False Discovery Rate (FDR) corrections like Benjamini-Hochberg.`,
        createdBy: adminUser._id,
        isPinned: true,
        isApproved: true,
        Is_openSource: true,
        tags: ["hypothesis-testing", "statistics", "p-values", "research", "analytics"],
        likes: [scholarUser._id, facultyUser._id],
      },
      {
        title: "Transitioning from Academic Statistics to Machine Learning Engineering",
        content: `For statisticians moving into industry ML roles, what are the highest-leverage software engineering skills to build? 

From version control and OOP design patterns to containerization (Docker) and ML inference serving (FastAPI/Triton), what was your roadmap?`,
        createdBy: scholarUser._id,
        isPinned: false,
        isApproved: true,
        Is_openSource: true,
        tags: ["career-advice", "machine-learning", "mlops", "python", "community"],
        likes: [adminUser._id],
      },
    ];

    const createdThreads = await ForumThread.insertMany(threadsData);
    console.log(` Inserted ${createdThreads.length} Forum Threads.`);

    // Add Replies
    const repliesData = [
      {
        threadId: createdThreads[0]._id,
        content: `Great question! In Stan or brms, I always recommend weakly informative Student-t or Normal priors scaled by the empirical standard deviation of the response variable. 

Make sure your R-hat values are strictly < 1.01 across all chains and Bulk/Tail ESS > 400 before drawing posterior conclusions.`,
        repliedBy: facultyUser._id,
        likes: [scholarUser._id, adminUser._id],
      },
      {
        threadId: createdThreads[0]._id,
        content: `Completely agree with Prof. Rajesh. Also, running prior predictive checks using \`brms::prior_summary()\` and \`bayesplot::pp_check()\` gives immediate visual feedback on whether your priors permit absurd effect sizes.`,
        repliedBy: adminUser._id,
        likes: [scholarUser._id],
      },
      {
        threadId: createdThreads[1]._id,
        content: `If your primary goal is interpretability for stakeholder reporting, ElasticNet with cross-validated L1 ratio is ideal because it performs grouped variable selection without arbitrarily discarding correlated indicators.`,
        repliedBy: adminUser._id,
        likes: [facultyUser._id],
      },
      {
        threadId: createdThreads[3]._id,
        content: `Mandatory reading for all scholars! We must normalize reporting effect sizes with 95% bootstrap confidence intervals alongside any p-value. Thank you for raising this vital standard.`,
        repliedBy: scholarUser._id,
        likes: [facultyUser._id],
      },
    ];

    const insertedReplies = await ForumReply.insertMany(repliesData);
    console.log(` Inserted ${insertedReplies.length} Forum Replies.`);

    // ==========================================
    // 4. SEED NEWS ARTICLES
    // ==========================================
    console.log("\n📰 Seeding News Articles...");
    await News.deleteMany({});

    const newsData = [
      {
        title: "IAS-DCS Launches Advanced Applied Statistics & Machine Learning Initiative for 2026",
        articleTitle: "IAS-DCS Launches Advanced Applied Statistics & Machine Learning Initiative for 2026",
        slug: "ias-dcs-launches-advanced-applied-statistics-ml-initiative-2026",
        summary: "The Institute of Applied Statistics (IAS-DCS) has officially inaugurated a premier curriculum integrating classical stochastic modeling with modern deep generative AI systems for researchers and professionals worldwide.",
        content: `<p>The Institute of Applied Statistics (IAS-DCS) today announced the nationwide expansion of its specialized training and certification programs in <strong>Applied Statistics, Econometrics, and Machine Learning Systems</strong>.</p>
<p>The updated curriculum bridges mathematical rigor with modern cloud compute infrastructure, preparing students and industry practitioners to tackle complex data challenges across healthcare, finance, policy planning, and artificial intelligence.</p>
<h3>Key Highlights of the Program:</h3>
<ul>
<li>Comprehensive coverage of Bayesian inference, Markov chain Monte Carlo, and non-parametric estimation.</li>
<li>Production-grade predictive modeling using Python, PyTorch, R, and distributed Spark clusters.</li>
<li>Direct mentorship from senior research fellows and distinguished university faculty.</li>
</ul>
<p>Enrollment for the upcoming cohort is now open to all verified scholars on the IAS-DCS platform.</p>`,
        url: "https://ias-dcs.com/news/ias-dcs-launches-advanced-applied-statistics-ml-initiative-2026",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date(Date.now() - 2 * 3600 * 1000), // 2 hours ago
        fetchedAt: new Date(),
        language: "en",
        country: "India",
        categories: ["ACADEMIC EXCELLENCE", "APPLIED STATISTICS", "ANNOUNCEMENTS"],
        category: "ACADEMIC EXCELLENCE",
        tags: ["IAS-DCS", "Applied Statistics", "Data Science", "Machine Learning", "Education"],
        author: { name: "IAS-DCS Editorial Board" },
        newsType: "top",
        Top: true,
        topNews: true,
        status: "active",
        stats: { views: 18420, likes: 1250, shares: 340 },
      },
      {
        title: "The Renaissance of Bayesian Statistics in Modern Generative Artificial Intelligence",
        articleTitle: "The Renaissance of Bayesian Statistics in Modern Generative Artificial Intelligence",
        slug: "renaissance-of-bayesian-statistics-in-generative-ai",
        summary: "How probabilistic graphical models, variational inference, and Bayesian neural networks are driving the next paradigm shift in robust, uncertainty-aware deep learning architectures.",
        content: `<p>As generative artificial intelligence moves into safety-critical domains such as automated medical diagnosis, aerospace navigation, and algorithmic risk pricing, deterministic black-box models are no longer sufficient.</p>
<p>Researchers are increasingly turning to <strong>Bayesian methods</strong> to provide exact uncertainty quantification, prevent catastrophic model hallucinations, and guide active learning pipelines with principled posterior distributions.</p>
<h3>Why Bayesian Thinking Matters in AI:</h3>
<p>Unlike standard optimization that yields single point estimates, Bayesian inference models entire probability distributions over network weights and latent states. This provides transparent confidence bounds and prevents overconfident false positives.</p>`,
        url: "https://ias-dcs.com/news/renaissance-of-bayesian-statistics-in-generative-ai",
        imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
        coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date(Date.now() - 24 * 3600 * 1000), // 1 day ago
        fetchedAt: new Date(),
        language: "en",
        country: "India",
        categories: ["RESEARCH INSIGHTS", "ARTIFICIAL INTELLIGENCE", "BAYESIAN STATS"],
        category: "RESEARCH INSIGHTS",
        tags: ["Bayesian", "Generative AI", "Deep Learning", "Probabilistic ML"],
        author: { name: "Dr. Alok Verma" },
        newsType: "normal",
        status: "active",
        stats: { views: 14200, likes: 980, shares: 215 },
      },
      {
        title: "Global Statistical Governance: Overcoming Algorithmic Bias and Covariate Shift",
        articleTitle: "Global Statistical Governance: Overcoming Algorithmic Bias and Covariate Shift",
        slug: "global-statistical-governance-algorithmic-bias-data-drift",
        summary: "Why leading institutions worldwide are adopting rigorous continuous statistical monitoring and conformal prediction frameworks to safeguard automated decision systems.",
        content: `<p>Data drift and concept drift remain the silent killers of production machine learning systems. When real-world test distributions diverge from training distributions, model performance degrades sharply without obvious software errors.</p>
<p>Modern data governance relies on <strong>sequential hypothesis testing, Kolmogorov-Smirnov drift detection, and conformal prediction bands</strong> to guarantee coverage error bounds even under severe distribution shifts.</p>`,
        url: "https://ias-dcs.com/news/global-statistical-governance-algorithmic-bias-data-drift",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date(Date.now() - 48 * 3600 * 1000), // 2 days ago
        fetchedAt: new Date(),
        language: "en",
        country: "India",
        categories: ["INDUSTRY TRENDS", "DATA GOVERNANCE", "ETHICS"],
        category: "INDUSTRY TRENDS",
        tags: ["Data Governance", "Algorithmic Bias", "Conformal Prediction", "MLOps"],
        author: { name: "Prof. Rajesh Sengupta" },
        newsType: "normal",
        status: "active",
        stats: { views: 9800, likes: 640, shares: 142 },
      },
      {
        title: "Python 3.13 and R 4.4: The Next Evolution in High-Performance Statistical Computing",
        articleTitle: "Python 3.13 and R 4.4: The Next Evolution in High-Performance Statistical Computing",
        slug: "python-313-and-r-44-high-performance-statistical-computing",
        summary: "Evaluating free-threaded Python execution and R's enhanced matrix acceleration benchmarks for large-scale demographic and financial simulations.",
        content: `<p>The statistical computing landscape is undergoing rapid transformation with the arrival of <strong>Python 3.13's experimental no-GIL (Global Interpreter Lock) execution</strong> and <strong>R 4.4's optimized BLAS/LAPACK matrix routines</strong>.</p>
<p>Benchmarks conducted across 10-million row Monte Carlo simulations demonstrate up to a 3.8x speedup on multi-core workstation architectures without requiring specialized GPU accelerators.</p>`,
        url: "https://ias-dcs.com/news/python-313-and-r-44-high-performance-statistical-computing",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date(Date.now() - 72 * 3600 * 1000), // 3 days ago
        fetchedAt: new Date(),
        language: "en",
        country: "India",
        categories: ["TECH & TOOLS", "PYTHON", "R PROGRAMMING"],
        category: "TECH & TOOLS",
        tags: ["Python 3.13", "R 4.4", "Statistical Computing", "High Performance"],
        author: { name: "IAS-DCS Tech Lab" },
        newsType: "normal",
        status: "active",
        stats: { views: 11300, likes: 820, shares: 195 },
      },
      {
        title: "IAS-DCS Annual National Data Science Hackathon & Research Symposium Announced",
        articleTitle: "IAS-DCS Annual National Data Science Hackathon & Research Symposium Announced",
        slug: "ias-dcs-annual-data-science-hackathon-symposium-announced",
        summary: "Over 5,000 scholars, data scientists, and statisticians will gather virtually and on-premise to solve pressing healthcare, climate, and macroeconomic challenges.",
        content: `<p>IAS-DCS is thrilled to announce the <strong>2026 National Statistical Hackathon & Empirical Research Symposium</strong>.</p>
<p>Participants will gain access to real-world anonymized enterprise datasets, high-performance compute clusters, and compete for a total prize pool of <strong>₹10,00,000</strong> plus research fellowship grants.</p>
<h3>Key Tracks:</h3>
<ul>
<li>Predictive Healthcare Analytics & Survival Modeling</li>
<li>Climate Risk Modeling & Geo-Spatial Statistics</li>
<li>High-Frequency Financial Econometrics</li>
</ul>`,
        url: "https://ias-dcs.com/news/ias-dcs-annual-data-science-hackathon-symposium-announced",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date(Date.now() - 96 * 3600 * 1000), // 4 days ago
        fetchedAt: new Date(),
        language: "en",
        country: "India",
        categories: ["EVENTS & SYMPOSIUMS", "HACKATHON", "COMMUNITY"],
        category: "EVENTS & SYMPOSIUMS",
        tags: ["Hackathon", "Symposium", "IAS-DCS", "Research", "Prizes"],
        author: { name: "IAS-DCS Event Committee" },
        newsType: "normal",
        status: "active",
        stats: { views: 22100, likes: 1670, shares: 530 },
      },
      {
        title: "Causal Machine Learning: Bridging Predictive Analytics with Actionable Policy Decisions",
        articleTitle: "Causal Machine Learning: Bridging Predictive Analytics with Actionable Policy Decisions",
        slug: "causal-machine-learning-predictive-analytics-policy-decisions",
        summary: "Exploring Double Machine Learning (DML) and Generalized Random Forests for estimating heterogeneous treatment effects in economic and clinical research.",
        content: `<p>Predictive machine learning answers 'what is likely to happen?', but policymakers and clinicians must know <strong>'what will happen if we take action X?'</strong>.</p>
<p>Causal Machine Learning bridges statistical econometric identification strategies with regularized non-parametric estimators to identify individualized treatment effects while avoiding unmeasured confounding bias.</p>`,
        url: "https://ias-dcs.com/news/causal-machine-learning-predictive-analytics-policy-decisions",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date(Date.now() - 120 * 3600 * 1000), // 5 days ago
        fetchedAt: new Date(),
        language: "en",
        country: "India",
        categories: ["RESEARCH INSIGHTS", "CAUSAL ML", "ECONOMETRICS"],
        category: "RESEARCH INSIGHTS",
        tags: ["Causal ML", "Econometrics", "Policy", "Treatment Effects"],
        author: { name: "Dr. Alok Verma" },
        newsType: "normal",
        status: "active",
        stats: { views: 8750, likes: 590, shares: 118 },
      },
    ];

    const insertedNews = await News.insertMany(newsData);
    console.log(` Inserted ${insertedNews.length} News Articles.`);

    console.log("\n🎉 ALL DATA SEEDED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
