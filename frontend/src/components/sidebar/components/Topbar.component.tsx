import { AlignJustify, AlignLeft } from "lucide-react";
import { useSidebar } from "../context/hooks/useSidebar";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/theme/mode-toggle";
import LangSwitcherComponent from "@/components/lang_switcher/Lang_switcher.layout";

const TopbarComponent = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  return (
    <header className="flex items-center justify-between mb-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        {collapsed ? (
          <AlignJustify className="w-6 h-6" />
        ) : (
          <AlignLeft className="w-6 h-6" />
        )}
      </Button>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        <LangSwitcherComponent />
      </div>
    </header>
  );
};

export default TopbarComponent;
