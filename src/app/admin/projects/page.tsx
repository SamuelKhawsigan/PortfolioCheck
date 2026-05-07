import prisma from "@/lib/prisma";
import ProjectsManager from "./ProjectsManager";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ProjectsManager initialProjects={projects} />;
}
