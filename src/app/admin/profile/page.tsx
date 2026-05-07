import prisma from "@/lib/prisma";
import ProfileEditor from "./ProfileEditor";

export default async function AdminProfilePage() {
  // Fetch the first (and only) profile record
  const profile = await prisma.profile.findFirst();

  return <ProfileEditor profile={profile} />;
}
