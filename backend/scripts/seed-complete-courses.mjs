import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// Schemas
const courseCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    image: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseCategory', required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const coursePlanSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    description: { type: String, trim: true },
    durationType: { type: String, enum: ['Month', 'Year', 'Day'], required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['video', 'text', 'quiz', 'assignment', 'file'], default: 'text' },
    order: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    isFree: { type: Boolean, default: false },
    duration: { type: Number, default: 15 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const moduleSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    seoMetaDescription: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    verticalCarouselImage: { type: String, trim: true },
    featuredImageBanner: { type: String, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseCategory' },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    level: [{ type: String, enum: ['beginner', 'intermediate', 'advanced'], default: ['beginner'] }],
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    price: { type: mongoose.Types.Decimal128, default: 0 },
    salePrice: { type: mongoose.Types.Decimal128, default: 0 },
    currency: { type: String, default: 'INR' },
    duration: { type: Number, default: 480 },
    totalLessons: { type: Number, default: 8 },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true },
    popular: { type: Boolean, default: true },
    enrollmentType: { type: String, default: 'open' },
    tags: [{ type: String, trim: true }],
    learningOutcomes: [{ type: String, trim: true }],
    prerequisites: { type: String, default: 'Basic quantitative understanding' },
    certificateTitle: { type: String, default: 'Certificate of Academic Excellence' },
    certificateSubtitle: { type: String, default: 'Awarded by Institute of Applied Statistics & Data Systems' },
    certificateOrganization: { type: String, default: 'IAS DCS' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

async function seedCompleteData() {
  console.log('🔗 Connecting to MongoDB Atlas:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const CourseCategory = mongoose.models.CourseCategory || mongoose.model('CourseCategory', courseCategorySchema);
  const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
  const CoursePlan = mongoose.models.CoursePlan || mongoose.model('CoursePlan', coursePlanSchema);
  const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema);
  const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
  const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

  const admin = await User.findOne({ email: 'admin@ias-dcs.com' }) || await User.findOne({});
  const instructorId = admin ? admin._id : null;

  // 1. Categories Definition
  const categoriesDef = [
    { name: 'Applied Statistics', slug: 'applied-statistics', image: '/uploads/courses/architecture.png' },
    { name: 'Digital Strategy & Analytics', slug: 'digital-strategy-analytics', image: '/uploads/courses/curator.png' },
    { name: 'Statistical Modeling & AI', slug: 'statistical-modeling-ai', image: '/uploads/courses/workshop.png' },
    { name: 'Data Engineering & Systems', slug: 'data-engineering-systems', image: '/uploads/courses/typography.png' },
  ];

  const categoryMap = {};
  for (const cat of categoriesDef) {
    let doc = await CourseCategory.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await CourseCategory.create({
        name: cat.name,
        slug: cat.slug,
        status: 'active',
        image: cat.image,
        isDeleted: false,
      });
      console.log(`✅ Category created: ${cat.name}`);
    } else {
      doc.name = cat.name;
      doc.image = cat.image;
      doc.status = 'active';
      doc.isDeleted = false;
      await doc.save();
      console.log(`ℹ️ Category updated: ${cat.name}`);
    }
    categoryMap[cat.slug] = doc;
  }

  // 2. SubCategories Definition
  const subCategoriesDef = [
    { name: 'Inferential & Empirical Statistics', slug: 'inferential-empirical-statistics', categorySlug: 'applied-statistics' },
    { name: 'Biostatistics & Experimental Design', slug: 'biostatistics-experimental-design', categorySlug: 'applied-statistics' },
    { name: 'Executive KPI & Decision Architecture', slug: 'executive-kpi-decision-architecture', categorySlug: 'digital-strategy-analytics' },
    { name: 'Quantitative Risk & Governance', slug: 'quantitative-risk-governance', categorySlug: 'digital-strategy-analytics' },
    { name: 'Time Series & Stochastic Forecasting', slug: 'time-series-stochastic-forecasting', categorySlug: 'statistical-modeling-ai' },
    { name: 'Machine Learning & Neural Architectures', slug: 'machine-learning-neural-architectures', categorySlug: 'statistical-modeling-ai' },
    { name: 'Cloud Data Pipelines & ETL', slug: 'cloud-data-pipelines-etl', categorySlug: 'data-engineering-systems' },
  ];

  const subCategoryMap = {};
  for (const sub of subCategoriesDef) {
    const parentCat = categoryMap[sub.categorySlug];
    if (!parentCat) continue;

    let doc = await SubCategory.findOne({ slug: sub.slug });
    if (!doc) {
      doc = await SubCategory.create({
        name: sub.name,
        slug: sub.slug,
        categoryId: parentCat._id,
        status: 'active',
        isDeleted: false,
      });
      console.log(`  ✅ SubCategory created: ${sub.name} (under ${parentCat.name})`);
    } else {
      doc.name = sub.name;
      doc.categoryId = parentCat._id;
      doc.status = 'active';
      doc.isDeleted = false;
      await doc.save();
      console.log(`  ℹ️ SubCategory updated: ${sub.name}`);
    }
    subCategoryMap[sub.slug] = doc;
  }

  // 3. Courses Definition with Distinct Images, Pricing, Plans, Categories & Subcategories
  const coursesDef = [
    {
      title: 'Advanced Applied Statistics & Data Analysis',
      subtitle: 'Master empirical statistical techniques, hypothesis testing, ANOVA, and multivariate modeling',
      slug: 'advanced-applied-statistics-data-analysis',
      shortDescription: 'Comprehensive hands-on training in applied statistical methodologies, experimental design, regression diagnostics, and predictive data modeling.',
      description: 'Master the principles and practices of Applied Statistics. This course provides rigorous mathematical frameworks and practical implementations using R and Python. Explore probability distributions, inferential statistics, ANOVA, regression diagnostics, and robust predictive modeling.',
      categorySlug: 'applied-statistics',
      subCategorySlug: 'inferential-empirical-statistics',
      price: 4999,
      salePrice: 2999,
      discountPrice: 2499,
      level: ['intermediate', 'advanced'],
      thumbnail: '/uploads/courses/architecture.png',
      coverImage: '/uploads/courses/architecture.png',
      verticalCarouselImage: '/uploads/courses/architecture.png',
      tags: ['Statistics', 'Data Analysis', 'Hypothesis Testing', 'Regression', 'ANOVA'],
      learningOutcomes: [
        'Formulate, test, and interpret complex statistical hypotheses',
        'Execute multi-variable regression with full residual diagnostics',
        'Perform one-way and two-way ANOVA and non-parametric tests',
        'Translate quantitative research findings into actionable insights',
      ],
      plans: [
        { name: '6 Months Access', price: 3999, salePrice: 2499, durationType: 'Month', duration: 6, description: 'Complete access to curriculum & exercises for 6 months.' },
        { name: '1 Year Standard Access', price: 4999, salePrice: 2999, durationType: 'Year', duration: 1, description: '12-month full access with verified certificate of completion.' },
        { name: 'Lifetime Master Access', price: 7999, salePrice: 4499, durationType: 'Year', duration: 5, description: 'Lifetime updates, certificate, and 1-on-1 mentor Q&A support.' },
      ],
      modules: [
        {
          title: 'Module 1: Probability Densities & Sampling Theory',
          description: 'Foundations of continuous probability and central limit theorem.',
          lessons: [
            { title: 'Probability Distributions & Continuous Random Variables', duration: 30 },
            { title: 'Central Limit Theorem & Sampling Methodologies', duration: 25 },
            { title: 'Confidence Intervals & Point Estimation', duration: 35 },
          ],
        },
        {
          title: 'Module 2: Hypothesis Testing & Inferential Frameworks',
          description: 'T-tests, ANOVA, and chi-square tests.',
          lessons: [
            { title: 'Single & Two-Sample Hypothesis Formulations', duration: 40 },
            { title: 'One-Way & Two-Way ANOVA with Post-Hoc Tests', duration: 45 },
            { title: 'Non-Parametric Statistical Methods', duration: 35 },
          ],
        },
        {
          title: 'Module 3: Multiple Regression & Model Diagnostics',
          description: 'Ordinary Least Squares, multicollinearity, and heteroskedasticity.',
          lessons: [
            { title: 'Multiple Linear Regression & Interaction Terms', duration: 50 },
            { title: 'Residual Analysis, Collinearity & Influence Measures', duration: 40 },
          ],
        },
      ],
    },
    {
      title: 'Digital Strategy & Quantitative Decision Systems',
      subtitle: 'Frameworks for executive KPI architecture, data governance, and strategic analytical modeling',
      slug: 'digital-strategy-quantitative-decision-systems',
      shortDescription: 'Learn to transform complex institutional data pipelines into high-impact executive decision systems and scalable strategy.',
      description: 'Equip yourself with the strategic frameworks required to design and deploy enterprise decision systems. Learn how quantitative analysis shapes organizational strategy, risk assessment, metric decomposition, and data-driven transformation.',
      categorySlug: 'digital-strategy-analytics',
      subCategorySlug: 'executive-kpi-decision-architecture',
      price: 5999,
      salePrice: 3499,
      discountPrice: 2999,
      level: ['beginner', 'intermediate'],
      thumbnail: '/uploads/courses/curator.png',
      coverImage: '/uploads/courses/curator.png',
      verticalCarouselImage: '/uploads/courses/curator.png',
      tags: ['Strategy', 'Decision Systems', 'Analytics', 'KPI Architecture', 'Governance'],
      learningOutcomes: [
        'Design robust KPI architectures for institutional systems',
        'Build quantitative decision matrices and scenario analysis models',
        'Implement ethical data governance and reporting pipelines',
        'Lead cross-functional data-driven transformation initiatives',
      ],
      plans: [
        { name: '1 Year Executive Access', price: 5999, salePrice: 3499, durationType: 'Year', duration: 1, description: '12-month complete access with strategy templates & frameworks.' },
        { name: 'Lifetime Leadership Access', price: 8999, salePrice: 5199, durationType: 'Year', duration: 5, description: 'Lifetime access, executive workshops, and verified credentials.' },
      ],
      modules: [
        {
          title: 'Module 1: Strategic Analytics & Metric Decomposition',
          description: 'Foundations of quantitative decision modeling.',
          lessons: [
            { title: 'Executive KPI Architecture & Metric Decomposition', duration: 35 },
            { title: 'Scenario Analysis & Quantitative Decision Trees', duration: 45 },
          ],
        },
        {
          title: 'Module 2: Data Governance & Organizational Execution',
          description: 'Deploying decision systems in modern organizational environments.',
          lessons: [
            { title: 'Data Governance, Compliance & Quality Controls', duration: 30 },
            { title: 'Executive Reporting & Stakeholder Communication', duration: 40 },
          ],
        },
      ],
    },
    {
      title: 'Statistical Machine Learning & Time Series Forecasting',
      subtitle: 'Supervised and unsupervised statistical learning algorithms for pattern recognition and forecasting',
      slug: 'statistical-machine-learning-time-series-forecasting',
      shortDescription: 'Explore stochastic processes, ARIMA/SARIMA models, clustering, and modern statistical learning architectures.',
      description: 'Delve into the intersection of modern statistical theory and machine learning. This course provides rigorous mathematical foundations and practical implementations for time series forecasting, dimensionality reduction, PCA, and pattern recognition.',
      categorySlug: 'statistical-modeling-ai',
      subCategorySlug: 'time-series-stochastic-forecasting',
      price: 6999,
      salePrice: 3999,
      discountPrice: 3499,
      level: ['advanced'],
      thumbnail: '/uploads/courses/workshop.png',
      coverImage: '/uploads/courses/workshop.png',
      verticalCarouselImage: '/uploads/courses/workshop.png',
      tags: ['Machine Learning', 'Time Series', 'Forecasting', 'ARIMA', 'PCA', 'Stochastic'],
      learningOutcomes: [
        'Model stochastic processes and stationary time series with ARIMA/SARIMA',
        'Apply dimensionality reduction and principal component analysis (PCA)',
        'Train and evaluate statistical learning algorithms with cross-validation',
        'Build production-ready forecasting models for dynamic environments',
      ],
      plans: [
        { name: '1 Year Standard Access', price: 6999, salePrice: 3999, durationType: 'Year', duration: 1, description: '12-month full curriculum access, datasets & code notebooks.' },
        { name: 'Lifetime Research Access', price: 9999, salePrice: 5999, durationType: 'Year', duration: 5, description: 'Lifetime access, masterclasses, and certified verification.' },
      ],
      modules: [
        {
          title: 'Module 1: Time Series Modeling & Stochastic Analysis',
          description: 'Stationarity, autocorrelation, and ARIMA models.',
          lessons: [
            { title: 'Stationarity, Autocorrelation (ACF/PACF) & Differencing', duration: 40 },
            { title: 'ARIMA & Seasonal SARIMA Modeling', duration: 50 },
            { title: 'Volatility Modeling (ARCH/GARCH Frameworks)', duration: 45 },
          ],
        },
        {
          title: 'Module 2: Statistical Learning & Dimensionality Reduction',
          description: 'PCA, clustering, and ensemble architectures.',
          lessons: [
            { title: 'Principal Component Analysis (PCA) & Feature Space Decomposition', duration: 45 },
            { title: 'Non-Parametric Clustering & Density Estimation', duration: 40 },
            { title: 'Regularization Techniques (Lasso, Ridge & ElasticNet)', duration: 35 },
          ],
        },
      ],
    },
    {
      title: 'Biostatistics & Experimental Clinical Research',
      subtitle: 'Clinical trial design, survival analysis, epidemiological modeling, and bio-statistical inference',
      slug: 'biostatistics-experimental-clinical-research',
      shortDescription: 'Master modern biostatistical methodologies, clinical trial randomizations, Kaplan-Meier survival curves, and epidemiological modeling.',
      description: 'An in-depth specialization covering biostatistical analysis in medical and clinical research. Learn experimental randomization, Kaplan-Meier survival estimation, Cox proportional hazards modeling, and regulatory compliance standards.',
      categorySlug: 'applied-statistics',
      subCategorySlug: 'biostatistics-experimental-design',
      price: 5499,
      salePrice: 3199,
      discountPrice: 2699,
      level: ['intermediate'],
      thumbnail: '/uploads/courses/motion.png',
      coverImage: '/uploads/courses/motion.png',
      verticalCarouselImage: '/uploads/courses/motion.png',
      tags: ['Biostatistics', 'Clinical Trials', 'Survival Analysis', 'Epidemiology'],
      learningOutcomes: [
        'Design randomized clinical trials with adequate statistical power',
        'Perform Kaplan-Meier survival analysis and log-rank hypothesis testing',
        'Model time-to-event outcomes using Cox proportional hazards',
        'Comply with international medical research standards (CONSORT/ICH)',
      ],
      plans: [
        { name: '1 Year Academic Access', price: 5499, salePrice: 3199, durationType: 'Year', duration: 1, description: '12-month access with clinical case studies and certificate.' },
        { name: 'Lifetime Practitioner Access', price: 8499, salePrice: 4899, durationType: 'Year', duration: 5, description: 'Lifetime access with clinical dataset libraries.' },
      ],
      modules: [
        {
          title: 'Module 1: Clinical Trial Design & Randomization',
          description: 'Sample size determination and blinding protocols.',
          lessons: [
            { title: 'Sample Size Calculation & Statistical Power', duration: 35 },
            { title: 'Randomization Schemes & Blinding Protocols', duration: 30 },
          ],
        },
        {
          title: 'Module 2: Survival Analysis & Time-to-Event Modeling',
          description: 'Kaplan-Meier survival curves and Cox regression.',
          lessons: [
            { title: 'Kaplan-Meier Estimator & Log-Rank Tests', duration: 45 },
            { title: 'Cox Proportional Hazards Regression', duration: 50 },
          ],
        },
      ],
    },
    {
      title: 'Enterprise Cloud Data Pipelines & ETL Architecture',
      subtitle: 'Build robust, scalable data ingestion, transformation pipelines, and distributed analytics systems',
      slug: 'enterprise-cloud-data-pipelines-etl',
      shortDescription: 'Design and deploy modern cloud data pipelines, automated ETL workflows, streaming analytics, and relational data lakes.',
      description: 'Master enterprise data engineering. Learn the end-to-end lifecycle of building high-throughput data pipelines, data lakehouse architectures, distributed query engines, and automated ETL orchestration.',
      categorySlug: 'data-engineering-systems',
      subCategorySlug: 'cloud-data-pipelines-etl',
      price: 6499,
      salePrice: 3699,
      discountPrice: 3199,
      level: ['intermediate', 'advanced'],
      thumbnail: '/uploads/courses/typography.png',
      coverImage: '/uploads/courses/typography.png',
      verticalCarouselImage: '/uploads/courses/typography.png',
      tags: ['Data Engineering', 'ETL', 'Pipelines', 'Cloud', 'SQL', 'Data Lake'],
      learningOutcomes: [
        'Architect scalable batch and streaming data ingestion pipelines',
        'Implement robust data quality checks and automated schema validation',
        'Optimize distributed query execution across cloud data warehouses',
        'Deploy production-ready data pipelines with CI/CD orchestration',
      ],
      plans: [
        { name: '1 Year Engineer Access', price: 6499, salePrice: 3699, durationType: 'Year', duration: 1, description: '12-month access to architecture labs & projects.' },
        { name: 'Lifetime Architect Access', price: 9499, salePrice: 5499, durationType: 'Year', duration: 5, description: 'Lifetime access with hands-on enterprise cloud templates.' },
      ],
      modules: [
        {
          title: 'Module 1: Pipeline Architecture & Ingestion Patterns',
          description: 'Batch vs Streaming architectures and data ingestion.',
          lessons: [
            { title: 'Batch vs Stream Processing Architecture', duration: 40 },
            { title: 'Event Sourcing & High-Throughput Message Brokers', duration: 45 },
          ],
        },
        {
          title: 'Module 2: Data Lakehouse & SQL Transformation',
          description: 'Modern data modeling, dimensional schemas, and validation.',
          lessons: [
            { title: 'Dimensional Modeling & Star/Snowflake Schemas', duration: 40 },
            { title: 'Data Quality Auditing & Automated Validation Pipelines', duration: 35 },
          ],
        },
      ],
    },
  ];

  for (const cData of coursesDef) {
    const parentCat = categoryMap[cData.categorySlug];
    const parentSubCat = subCategoryMap[cData.subCategorySlug];

    let course = await Course.findOne({ slug: cData.slug });

    if (!course) {
      course = new Course({
        title: cData.title,
        subtitle: cData.subtitle,
        slug: cData.slug,
        shortDescription: cData.shortDescription,
        description: cData.description,
        seoMetaDescription: cData.shortDescription,
        categoryId: parentCat ? parentCat._id : null,
        subCategoryId: parentSubCat ? parentSubCat._id : null,
        instructorId: instructorId,
        price: mongoose.Types.Decimal128.fromString(String(cData.price)),
        salePrice: mongoose.Types.Decimal128.fromString(String(cData.salePrice)),
        discountPrice: mongoose.Types.Decimal128.fromString(String(cData.discountPrice)),
        currency: 'INR',
        level: cData.level,
        thumbnail: cData.thumbnail,
        coverImage: cData.coverImage,
        verticalCarouselImage: cData.verticalCarouselImage,
        tags: cData.tags,
        learningOutcomes: cData.learningOutcomes,
        isPublished: true,
        isFeatured: true,
        popular: true,
        isDeleted: false,
        enrollmentType: 'open',
        modules: [],
      });
      await course.save();
      console.log(`✅ Course created: "${cData.title}"`);
    } else {
      course.title = cData.title;
      course.subtitle = cData.subtitle;
      course.shortDescription = cData.shortDescription;
      course.description = cData.description;
      course.seoMetaDescription = cData.shortDescription;
      course.categoryId = parentCat ? parentCat._id : course.categoryId;
      course.subCategoryId = parentSubCat ? parentSubCat._id : course.subCategoryId;
      course.price = mongoose.Types.Decimal128.fromString(String(cData.price));
      course.salePrice = mongoose.Types.Decimal128.fromString(String(cData.salePrice));
      course.discountPrice = mongoose.Types.Decimal128.fromString(String(cData.discountPrice));
      course.thumbnail = cData.thumbnail;
      course.coverImage = cData.coverImage;
      course.verticalCarouselImage = cData.verticalCarouselImage;
      course.tags = cData.tags;
      course.learningOutcomes = cData.learningOutcomes;
      course.isPublished = true;
      course.isFeatured = true;
      course.popular = true;
      course.isDeleted = false;
      await course.save();
      console.log(`ℹ️ Course updated: "${cData.title}"`);
    }

    // Create / Update Modules & Lessons
    const moduleIds = [];
    let totalLessonsCount = 0;

    for (let mIdx = 0; mIdx < cData.modules.length; mIdx++) {
      const mInfo = cData.modules[mIdx];
      let mod = await Module.findOne({ courseId: course._id, order: mIdx + 1 });
      if (!mod) {
        mod = new Module({
          courseId: course._id,
          title: mInfo.title,
          description: mInfo.description,
          order: mIdx + 1,
          isPublished: true,
          isDeleted: false,
          lessons: [],
        });
        await mod.save();
      } else {
        mod.title = mInfo.title;
        mod.description = mInfo.description;
        mod.isPublished = true;
        mod.isDeleted = false;
        await mod.save();
      }

      const lessonIds = [];
      for (let lIdx = 0; lIdx < mInfo.lessons.length; lIdx++) {
        const lInfo = mInfo.lessons[lIdx];
        let lesson = await Lesson.findOne({ moduleId: mod._id, order: lIdx + 1 });
        if (!lesson) {
          lesson = new Lesson({
            courseId: course._id,
            moduleId: mod._id,
            title: lInfo.title,
            order: lIdx + 1,
            duration: lInfo.duration || 25,
            type: 'text',
            isPublished: true,
            isDeleted: false,
          });
          await lesson.save();
        } else {
          lesson.title = lInfo.title;
          lesson.duration = lInfo.duration || 25;
          lesson.isPublished = true;
          lesson.isDeleted = false;
          await lesson.save();
        }
        lessonIds.push(lesson._id);
        totalLessonsCount++;
      }

      mod.lessons = lessonIds;
      await mod.save();
      moduleIds.push(mod._id);
    }

    course.modules = moduleIds;
    course.totalLessons = totalLessonsCount;
    await course.save();

    // Create Course Plans
    for (const plan of cData.plans) {
      let existingPlan = await CoursePlan.findOne({ courseId: course._id, name: plan.name });
      if (!existingPlan) {
        existingPlan = new CoursePlan({
          courseId: course._id,
          name: plan.name,
          price: plan.price,
          salePrice: plan.salePrice,
          description: plan.description,
          durationType: plan.durationType,
          duration: plan.duration,
          status: 'active',
        });
        await existingPlan.save();
        console.log(`    📋 Created Course Plan: "${plan.name}" (₹${plan.salePrice})`);
      } else {
        existingPlan.price = plan.price;
        existingPlan.salePrice = plan.salePrice;
        existingPlan.description = plan.description;
        existingPlan.durationType = plan.durationType;
        existingPlan.duration = plan.duration;
        existingPlan.status = 'active';
        await existingPlan.save();
        console.log(`    📋 Updated Course Plan: "${plan.name}" (₹${plan.salePrice})`);
      }
    }
  }

  console.log('🎉 All categories, subcategories, distinct images, courses, and pricing plans successfully updated in MongoDB Atlas!');
  await mongoose.disconnect();
  console.log('🔌 Disconnected.');
}

seedCompleteData().catch((err) => {
  console.error('❌ Seeding error:', err);
  mongoose.disconnect();
  process.exit(1);
});
