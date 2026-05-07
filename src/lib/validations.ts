import { z } from "zod";

export const contactSchema = z.object({
  senderName: z.string().min(2, "Name is too short"),
  senderEmail: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message is too short"),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  techStack: z.array(z.string()).default([]),
});

export const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.date().optional().nullable(),
});

export const ctfWriteupSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  competition: z.string(),
  category: z.string(),
  content: z.string(),
  publishedAt: z.date().optional().nullable(),
});

export const experienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  description: z.string(),
  isLeadership: z.boolean().default(false),
});

export const skillSchema = z.object({
  category: z.string(),
  name: z.string(),
  proficiencyLevel: z.number().min(1).max(5),
});

export const certificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  dateAcquired: z.coerce.date(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
});

export const profileSchema = z.object({
  name: z.string(),
  bio: z.string(),
  email: z.string().email(),
  githubUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
});
