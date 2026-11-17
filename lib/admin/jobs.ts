import { ObjectId, type Collection } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type JobRecord = {
  _id: ObjectId;
  jobTitle: string;
  jobShortDescription: string;
  jobDescription: string;
  vacancy: number;
  location: string;
  jobType: string;
  jobExp: number;
  jobLevel: string;
  Status: boolean;
  __v?: number;
};

export type JobInput = Omit<JobRecord, "_id" | "__v">;

export async function getJobsCollection(): Promise<Collection<JobRecord>> {
  const connection = await connectAdminDb();
  return connection.connection.db!.collection<JobRecord>("jobs");
}

function text(value: unknown, label: string, maxLength: number, required = false) {
  if (typeof value !== "string") throw new Error("Enter a valid " + label);
  const result = value.trim();
  if (required && !result) throw new Error("Enter a " + label);
  if (result.length > maxLength) throw new Error(label + " is too long");
  return result;
}

function number(value: unknown, label: string, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max) {
    throw new Error("Enter a valid " + label);
  }
  return value;
}

export function parseJobInput(value: unknown): JobInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Job details are required");
  }
  const raw = value as Record<string, unknown>;
  if (typeof raw.Status !== "boolean") throw new Error("Choose whether this job is active");

  return {
    jobTitle: text(raw.jobTitle, "job title", 150, true),
    jobShortDescription: text(raw.jobShortDescription, "short description", 20000),
    jobDescription: text(raw.jobDescription, "job description", 50000),
    vacancy: number(raw.vacancy, "vacancy count", 100000),
    location: text(raw.location, "location", 200, true),
    jobType: text(raw.jobType, "job type", 100, true),
    jobExp: number(raw.jobExp, "experience", 100),
    jobLevel: text(raw.jobLevel, "job level", 100, true),
    Status: raw.Status,
  };
}

export function serializeJob(job: JobRecord) {
  return {
    _id: String(job._id),
    jobTitle: job.jobTitle,
    jobShortDescription: job.jobShortDescription || "",
    jobDescription: job.jobDescription || "",
    vacancy: job.vacancy,
    location: job.location,
    jobType: job.jobType,
    jobExp: job.jobExp,
    jobLevel: job.jobLevel,
    Status: job.Status,
  };
}

export function parseJobId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? new ObjectId(value) : null;
}
