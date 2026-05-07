import prisma from "@/lib/prisma";
import CtfManager from "./CtfManager";

export default async function AdminCtfPage() {
  const writeups = await prisma.ctfWriteup.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <CtfManager initialWriteups={writeups} />;
}
