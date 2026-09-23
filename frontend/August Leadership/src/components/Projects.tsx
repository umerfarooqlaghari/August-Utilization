import { useState } from "react";
import ProjectsList from "./projects/ProjectsList";
import ProjectDetail from "./projects/ProjectDetail";

interface ProjectsProps {
  period: string;
}

export default function Projects({ period: _period }: ProjectsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    return <ProjectDetail projectId={selected} onBack={() => setSelected(null)} />;
  }

  return <ProjectsList onSelect={setSelected} />;
}
