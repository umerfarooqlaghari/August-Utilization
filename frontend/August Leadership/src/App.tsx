import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ControlCenter from "./components/ControlCenter";
import Projects from "./components/Projects";
import UtilizationIntelligence from "./components/UtilizationIntelligence";
import Prediction from "./components/Prediction";
import ForecastEngine from "./components/ForecastEngine";
import Setup from "./components/setup/Setup";
import StyleGuide from "./components/StyleGuide";
import { useViewport } from "./hooks/useViewport";

export type Module = "control" | "projects" | "utilization" | "prediction" | "engine" | "setup" | "styleguide";

const MODULE_TITLES: Record<Module, string> = {
  control:     "Control Center",
  projects:    "Projects",
  utilization: "Utilization Intelligence",
  prediction:  "Prediction",
  engine:      "Forecast Engine",
  setup:       "Setup",
  styleguide:  "Style Guide",
};

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>("control");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState("This Week");
  const { isTablet } = useViewport();

  // On tablet the sidebar is always icon-only; the manual toggle still works on desktop
  const effectiveCollapsed = sidebarCollapsed || isTablet;

  return (
    <div
      className="flex h-full"
      style={{ background: "#FFFFFF", fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      <Sidebar
        active={activeModule}
        onNavigate={setActiveModule}
        collapsed={effectiveCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          title={MODULE_TITLES[activeModule]}
          period={period}
          onPeriodChange={setPeriod}
        />
        <main className="flex-1 overflow-auto" style={{ background: "#F8FAFB" }}>
          {activeModule === "control"     && <ControlCenter period={period} />}
          {activeModule === "projects"    && <Projects period={period} />}
          {activeModule === "utilization" && <UtilizationIntelligence period={period} />}
          {activeModule === "prediction"  && <Prediction period={period} />}
          {activeModule === "engine"      && <ForecastEngine period={period} />}
          {activeModule === "setup"       && <Setup />}
          {activeModule === "styleguide"  && <StyleGuide />}
        </main>
      </div>
    </div>
  );
}
