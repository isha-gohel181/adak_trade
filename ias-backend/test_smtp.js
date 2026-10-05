import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testTransactional() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.TransactionalEmail,
      pass: process.env.TransactionalEmailPass,
    },
  });

  try {
    const info = await transporter.verify();
    console.log("Transactional Email (noreply@ias-dcs.com): SUCCESS");
  } catch (error) {
    console.error("Transactional Email (noreply@ias-dcs.com): FAILED -", error.message);
  }
}

async function testFounder() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.FounderEmail,
      pass: process.env.FounderEmailPass,
    },
  });

  try {
    const info = await transporter.verify();
    console.log("Founder Email (contact@ias-dcs.com): SUCCESS");
  } catch (error) {
    console.error("Founder Email (contact@ias-dcs.com): FAILED -", error.message);
  }
}

async function testSupport() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SupportEmail,
      pass: process.env.SupportEmailPass,
    },
  });

  try {
    const info = await transporter.verify();
    console.log("Support Email (support@ias-dcs.com): SUCCESS");
  } catch (error) {
    console.error("Support Email (support@ias-dcs.com): FAILED -", error.message);
  }
}

async function run() {
  await testTransactional();
  await testFounder();
  await testSupport();
}

run();
