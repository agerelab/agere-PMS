import { cookies } from "next/headers";
import { resolveLang } from "@/lib/i18n";
import { TaskAttachments } from "./TaskAttachments";

// Stand-in task screen for the integrations MVP: shows what GitHub and Google Drive add to a task.
// The real task detail (PRD-06 §6, D41) will host <TaskAttachments> in its side panel.
export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const lang = resolveLang((await cookies()).get("agere-lang")?.value);
  return <TaskAttachments taskId={taskId} lang={lang} />;
}
