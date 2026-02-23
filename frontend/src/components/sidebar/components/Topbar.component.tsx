import { Menu, X } from "lucide-react";
import { useSidebar } from "../context/hooks/useSidebar";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/theme/mode-toggle";
import LangSwitcherComponent from "@/components/lang_switcher/Lang_switcher.layout";

const TopbarComponent = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  
  return (
    <header className="flex items-center justify-between h-14 mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="rounded-xl hover:bg-muted"
      >
        {collapsed ? (
          <Menu className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
      </Button>
      <div className="flex items-center gap-2">
        <DarkModeToggle />
        <LangSwitcherComponent />
      </div>
    </header>
  );
};

export default TopbarComponent;
