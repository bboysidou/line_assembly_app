import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import { useTheme } from "./use-theme";

const DarkModeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Switch
      icon={theme === "dark" ? Moon : Sun}
      checked={theme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
};

export default DarkModeToggle;
