import prisma from "@/lib/prisma";
import ExperienceManager from "./ExperienceManager";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  return <ExperienceManager initialExperiences={experiences} />;
}
