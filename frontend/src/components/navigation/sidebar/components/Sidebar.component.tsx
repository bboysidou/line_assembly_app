import { Link, useLocation } from "react-router-dom";
import { sidebarNavigation } from "@/core/routes/navigation.route";
import { cn } from "@/lib/utils";
import { useSidebar } from "../context/hooks/useSidebar";
import {
  MAX_WIDTH,
  MAX_WIDTH_MOBILE,
  useMediaQuery,
} from "../context/hooks/useMediaQuery";
import { motion } from "framer-motion";
import DarkModeToggle from "@/components/theme/mode-toggle";

const SidebarComponent = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  const isMd = useMediaQuery(`(max-width: ${MAX_WIDTH}px)`);
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);
  const path = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => {
            toggleSidebar();
          }}
        />
      )}

      <aside
        className={cn(
          "h-full flex p-4 flex-col items-center sm:items-start justify-between transition-all duration-300 z-50 bg-sidebar border-r border-sidebar-border",
          isMobile && [
            "fixed top-0 left-0",
            collapsed
              ? "w-0 opacity-0 pointer-events-none p-0 -translate-x-full"
              : "w-[280px] opacity-100 translate-x-0",
          ],
          !isMobile && [
            "hidden md:flex",
            collapsed
              ? isMd
                ? "w-0 opacity-0 pointer-events-none p-0"
                : "w-[70px]"
              : "w-[70px] lg:w-[280px] opacity-100",
          ],
        )}
      >
        {/* Logo Section */}
        <div className="h-[5dvh] flex flex-col items-start gap-2 overflow-hidden w-full">
          <Link to="/" className="p-2 flex items-center md:items-start w-full group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
            >
              <span className="text-lg font-bold">LA</span>
            </motion.div>
            <div
              className={cn(
                "flex-col ml-3 text-left leading-tight",
                isMobile ? "flex" : "hidden lg:flex",
                !isMobile && collapsed && "lg:hidden",
              )}
            >
              <span className="truncate font-bold text-lg text-gradient">
                Line Assembly
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Production Management
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="h-[85dvh] lg:w-full flex flex-col items-center overflow-y-auto md:items-start">
          <ul className="w-full overflow-y-auto space-y-1">
            {sidebarNavigation.map((item, index) => {
              const isActive = path.pathname === item.path;
              return (
                <motion.li 
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                      />
                    )}
                    
                    <div className={cn(
                      "flex items-center justify-center size-8 rounded-lg transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
                    )}>
                      {item.icon}
                    </div>
                    
                    <span
                      className={cn(
                        "font-medium text-sm",
                        isMobile
                          ? "flex items-center"
                          : "hidden lg:flex md:items-center",
                        !isMobile && collapsed && "lg:hidden",
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with Theme Toggle */}
        <div className={cn(
          "h-[5dvh] w-full flex items-center justify-center lg:justify-start border-t border-sidebar-border pt-4",
          !isMobile && collapsed && "lg:justify-center"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            !isMobile && collapsed && "lg:justify-center"
          )}>
            <DarkModeToggle />
            <span className={cn(
              "text-sm text-muted-foreground",
              isMobile ? "flex" : "hidden lg:flex",
              !isMobile && collapsed && "lg:hidden"
            )}>
              Theme
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;
