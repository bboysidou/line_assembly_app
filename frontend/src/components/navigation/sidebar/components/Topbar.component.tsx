import { AlignJustify, AlignLeft } from "lucide-react";
import { useSidebar } from "../context/hooks/useSidebar";
import { Button } from "@/components/ui/button";

const TopbarComponent = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  return (
    <header className="dark:bg-zinc-900 flex items-center justify-between mb-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        {collapsed ? (
          <AlignJustify className="w-6 h-6" />
        ) : (
          <AlignLeft className="w-6 h-6" />
        )}
      </Button>
    </header>
  );
};

export default TopbarComponent;
