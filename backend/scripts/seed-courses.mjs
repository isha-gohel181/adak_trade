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
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseCategory' },
    level: [{ type: String, enum: ['beginner', 'intermediate', 'advanced'], default: ['beginner'] }],
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    price: { type: mongoose.Types.Decimal128, default: 0 },
    salePrice: { type: mongoose.Types.Decimal128, default: 0 },
    currency: { type: String, default: 'INR' },
    duration: { type: Number, default: 360 },
    totalLessons: { type: Number, default: 6 },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true },
    popular: { type: Boolean, default: true },
    enrollmentType: { type: String, default: 'open' },
    tags: [{ type: String, trim: true }],
    learningOutcomes: [{ type: String, trim: true }],
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

async function seed() {
  console.log('🔗 Connecting to MongoDB Atlas:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const CourseCategory = mongoose.models.CourseCategory || mongoose.model('CourseCategory', courseCategorySchema);
  const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema);
  const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
  const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

  // 1. Get or create Instructor / Admin user
  let admin = await User.findOne({ email: 'admin@ias-dcs.com' });
  if (!admin) {
    admin = await User.findOne({});
  }

  // 2. Create Categories
  const categoryData = [
    { name: 'Applied Statistics', slug: 'applied-statistics' },
    { name: 'Digital Strategy', slug: 'digital-strategy' },
    { name: 'Statistical Modeling', slug: 'statistical-modeling' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    let existing = await CourseCategory.findOne({ slug: cat.slug });
    if (!existing) {
      existing = await CourseCategory.create({
        name: cat.name,
        slug: cat.slug,
        status: 'active',
        isDeleted: false,
      });
      console.log(`✅ Created category: ${cat.name}`);
    } else {
      console.log(`ℹ️ Category already exists: ${cat.name}`);
    }
    categories[cat.slug] = existing._id;
  }

  // 3. Courses to add
  const coursesToSeed = [
    {
      title: 'Advanced Applied Statistics & Data Analysis',
      subtitle: 'Master empirical statistical techniques, inferential analysis, and hypothesis testing with modern methodologies',
      slug: 'advanced-applied-statistics-data-analysis',
      shortDescription: 'A comprehensive, practical guide to applied statistical methodologies, experimental design, and predictive data modeling.',
      description: 'Master the art and science of Applied Statistics. This course covers everything from exploratory data analysis, probability distributions, hypothesis testing (ANOVA, Chi-square, regression), to practical statistical decision systems.',
      categorySlug: 'applied-statistics',
      price: 4999,
      salePrice: 2999,
      level: ['intermediate', 'advanced'],
      thumbnail: '/courses/architecture.png',
      coverImage: '/courses/architecture.png',
      tags: ['Statistics', 'Data Analysis', 'Hypothesis Testing', 'Regression'],
      learningOutcomes: [
        'Formulate and execute rigorous statistical hypothesis tests',
        'Model continuous and categorical outcomes using regression techniques',
        'Analyze complex datasets with confidence intervals and power calculations',
        'Translate quantitative metrics into actionable strategic insights',
      ],
      modules: [
        {
          title: 'Module 1: Probability Distributions & Inferential Statistics',
          description: 'Deep dive into probability densities, sampling distributions, and central limit theorem.',
          lessons: [
            { title: 'Probability Distributions & Continuous Random Variables', duration: 30 },
            { title: 'Central Limit Theorem & Sampling Methods', duration: 25 },
            { title: 'Hypothesis Testing & P-Value Interpretation', duration: 40 },
          ],
        },
        {
          title: 'Module 2: Regression Modeling & ANOVA',
          description: 'Linear, multiple, and logistic regression with residual diagnostics.',
          lessons: [
            { title: 'Ordinary Least Squares (OLS) & Multiple Regression', duration: 45 },
            { title: 'One-Way & Two-Way ANOVA Analysis', duration: 35 },
            { title: 'Model Diagnostics, Multicollinearity & Heteroskedasticity', duration: 40 },
          ],
        },
      ],
    },
    {
      title: 'Digital Strategy & Quantitative Decision Systems',
      subtitle: 'Frameworks for strategic KPI architecture, decision modeling, and organizational analytics',
      slug: 'digital-strategy-quantitative-decision-systems',
      shortDescription: 'Transform complex metrics and institutional data pipelines into high-impact executive decision systems.',
      description: 'Equip yourself with the strategic frameworks required to design and deploy enterprise decision systems. Learn how quantitative analysis shapes organizational strategy, risk assessment, and resource allocation.',
      categorySlug: 'digital-strategy',
      price: 5999,
      salePrice: 3499,
      level: ['beginner', 'intermediate'],
      thumbnail: '/courses/curator.png',
      coverImage: '/courses/curator.png',
      tags: ['Strategy', 'Decision Systems', 'Analytics', 'Governance'],
      learningOutcomes: [
        'Design robust KPI architectures for institutional systems',
        'Build quantitative decision matrices and scenario analysis models',
        'Implement ethical data governance and reporting pipelines',
        'Lead cross-functional data-driven transformation initiatives',
      ],
      modules: [
        {
          title: 'Module 1: Strategic Analytics Frameworks',
          description: 'Foundations of quantitative decision modeling.',
          lessons: [
            { title: 'Executive KPI Architecture & Metric Decomposition', duration: 35 },
            { title: 'Scenario Analysis & Quantitative Decision Trees', duration: 45 },
          ],
        },
        {
          title: 'Module 2: Data Governance & Operational Excellence',
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
      shortDescription: 'Explore stochastic processes, ARIMA models, clustering, and modern statistical learning architectures.',
      description: 'Delve into the intersection of modern statistical theory and machine learning. This course provides rigorous mathematical foundations and practical implementations for time series forecasting, dimensionality reduction, and pattern recognition.',
      categorySlug: 'statistical-modeling',
      price: 6999,
      salePrice: 3999,
      level: ['advanced'],
      thumbnail: '/courses/workshop.png',
      coverImage: '/courses/workshop.png',
      tags: ['Machine Learning', 'Time Series', 'Forecasting', 'ARIMA', 'Modeling'],
      learningOutcomes: [
        'Model stochastic processes and stationary time series with ARIMA/SARIMA',
        'Apply dimensionality reduction and principal component analysis (PCA)',
        'Train and evaluate statistical learning algorithms with cross-validation',
        'Build production-ready forecasting models for dynamic environments',
      ],
      modules: [
        {
          title: 'Module 1: Time Series Analysis & Forecasting',
          description: 'Stationarity, autocorrelation, and ARIMA models.',
          lessons: [
            { title: 'Stationarity, Autocorrelation (ACF/PACF) & Differencing', duration: 40 },
            { title: 'ARIMA & Seasonal SARIMA Modeling', duration: 50 },
          ],
        },
        {
          title: 'Module 2: Statistical Learning Algorithms',
          description: 'Dimensionality reduction, clustering, and ensemble architectures.',
          lessons: [
            { title: 'Principal Component Analysis (PCA) & Feature Space Decomposition', duration: 45 },
            { title: 'Non-Parametric Clustering & Density Estimation', duration: 40 },
          ],
        },
      ],
    },
  ];

  for (const cData of coursesToSeed) {
    // Check if course already exists
    let course = await Course.findOne({ slug: cData.slug });

    if (course) {
      console.log(`ℹ️ Course already exists: ${cData.title}, updating published state...`);
      course.isPublished = true;
      course.isDeleted = false;
      course.isFeatured = true;
      course.popular = true;
      course.categoryId = categories[cData.categorySlug];
      course.thumbnail = cData.thumbnail;
      course.coverImage = cData.coverImage;
      course.price = mongoose.Types.Decimal128.fromString(String(cData.price));
      course.salePrice = mongoose.Types.Decimal128.fromString(String(cData.salePrice));
      await course.save();
      continue;
    }

    // Create Course record
    course = new Course({
      title: cData.title,
      subtitle: cData.subtitle,
      slug: cData.slug,
      shortDescription: cData.shortDescription,
      description: cData.description,
      seoMetaDescription: cData.shortDescription,
      categoryId: categories[cData.categorySlug],
      instructorId: admin ? admin._id : null,
      price: mongoose.Types.Decimal128.fromString(String(cData.price)),
      salePrice: mongoose.Types.Decimal128.fromString(String(cData.salePrice)),
      currency: 'INR',
      level: cData.level,
      thumbnail: cData.thumbnail,
      coverImage: cData.coverImage,
      verticalCarouselImage: cData.thumbnail,
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

    // Create Modules and Lessons
    const moduleIds = [];
    let totalLessonsCount = 0;

    for (let mIdx = 0; mIdx < cData.modules.length; mIdx++) {
      const mInfo = cData.modules[mIdx];
      const mod = new Module({
        courseId: course._id,
        title: mInfo.title,
        description: mInfo.description,
        order: mIdx + 1,
        isPublished: true,
        isDeleted: false,
        lessons: [],
      });
      await mod.save();

      const lessonIds = [];
      for (let lIdx = 0; lIdx < mInfo.lessons.length; lIdx++) {
        const lInfo = mInfo.lessons[lIdx];
        const lesson = new Lesson({
          courseId: course._id,
          moduleId: mod._id,
          title: lInfo.title,
          order: lIdx + 1,
          duration: lInfo.duration || 20,
          type: 'text',
          isPublished: true,
          isDeleted: false,
        });
        await lesson.save();
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

    console.log(`✅ Created course: "${cData.title}" with ${moduleIds.length} modules & ${totalLessonsCount} lessons`);
  }

  console.log('🎉 All courses seeded successfully into MongoDB Atlas!');
  await mongoose.disconnect();
  console.log('🔌 Disconnected.');
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  mongoose.disconnect();
  process.exit(1);
});
