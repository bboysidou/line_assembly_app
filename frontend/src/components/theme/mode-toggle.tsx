import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import { useTheme } from "./use-theme";

const DarkModeToggle = () => {
  const { setTheme, effectiveTheme } = useTheme();

  return (
    <Switch
      icon={effectiveTheme === "dark" ? Moon : Sun}
      checked={effectiveTheme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
};

export default DarkModeToggle;
