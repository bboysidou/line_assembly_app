import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "./use-theme";
import { motion } from "framer-motion";

const DarkModeToggle = () => {
  const { effectiveTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-xl hover:bg-primary/10"
      onClick={toggleTheme}
    >
      <motion.div
        initial={false}
        animate={{ rotate: effectiveTheme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {effectiveTheme === "dark" ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-warning" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkModeToggle;
