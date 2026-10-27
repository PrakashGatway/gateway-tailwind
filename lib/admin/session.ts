import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import mongoose from "mongoose";
import Admin from "@/models/Admin";
import { connectAdminDb } from "@/lib/admin/db";

export const ADMIN_COOKIE = "gateway_admin_session";
export const SESSION_MAX_AGE = 8 * 60 * 60;

export type AdminIdentity = {
  id: string;
  name: string;
  email: string;
};

function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(adminId: string) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuer("gateway-abroad-admin")
    .setAudience("gateway-abroad-admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(signingKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, signingKey(), {
      algorithms: ["HS256"],
      issuer: "gateway-abroad-admin",
      audience: "gateway-abroad-admin",
    });
    return payload.role === "admin" && typeof payload.sub === "string"
      ? payload.sub
      : null;
  } catch {
    return null;
  }
}

export const getCurrentAdmin = cache(async (): Promise<AdminIdentity | null> => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  const id = await verifyAdminToken(token);
  if (!id || !mongoose.isValidObjectId(id)) return null;

  await connectAdminDb();
  const admin = await Admin.findById(id)
    .select("name email isActive")
    .lean();

  if (!admin || admin.isActive === false) return null;
  return {
    id: String(admin._id),
    name: admin.name,
    email: admin.email,
  };
});

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
