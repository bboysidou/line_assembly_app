import { Link, useLocation } from "react-router-dom";
import { sidebarNavigation } from "@/core/routes/navigation.route";
import { cn } from "@/lib/utils";
import { useSidebar } from "../context/hooks/useSidebar";
import {
  MAX_WIDTH,
  MAX_WIDTH_MOBILE,
  useMediaQuery,
} from "../context/hooks/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";

const SidebarComponent = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  const isMd = useMediaQuery(`(max-width: ${MAX_WIDTH}px)`);
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);
  const path = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "h-full flex flex-col bg-card dark:bg-black border-r border-border/50 dark:border-border/20 transition-all duration-300 z-50",
          isMobile && [
            "fixed top-0 left-0",
            collapsed
              ? "w-0 opacity-0 pointer-events-none -translate-x-full"
              : "w-72 opacity-100 translate-x-0",
          ],
          !isMobile && [
            "hidden md:flex",
            collapsed
              ? isMd
                ? "w-0 opacity-0 pointer-events-none"
                : "w-20"
              : "w-20 lg:w-72",
          ],
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-4 border-b border-border/50 dark:border-zinc-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25">
              <span className="text-lg font-bold">IZ</span>
            </div>
            <AnimatePresence>
              {((isMobile && !collapsed) || (!isMobile && !collapsed && !isMd)) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="truncate font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    IZDIHAR
                  </span>
                  <span className="truncate text-xs text-muted-foreground dark:text-zinc-500">
                    Assembly Line
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {sidebarNavigation.map((item, index) => {
              const isActive = path.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={isMobile && !collapsed ? toggleSidebar : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 dark:bg-primary/20 text-primary"
                        : "text-muted-foreground hover:bg-muted dark:hover:bg-zinc-900 hover:text-foreground",
                    )}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center size-8 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/20 dark:bg-primary/30 text-primary"
                          : "group-hover:bg-muted dark:group-hover:bg-zinc-900",
                      )}
                    >
                      {item.icon}
                    </div>
                    
                    {/* Title */}
                    <AnimatePresence>
                      {((isMobile && !collapsed) || (!isMobile && !collapsed && !isMd)) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="font-medium text-sm"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-border/50 dark:border-zinc-800">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/50 dark:bg-zinc-900",
              !collapsed && !isMd ? "justify-start" : "justify-center",
            )}
          >
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-medium">
              U
            </div>
            <AnimatePresence>
              {((isMobile && !collapsed) || (!isMobile && !collapsed && !isMd)) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="text-sm font-medium dark:text-zinc-200">User</span>
                  <span className="text-xs text-muted-foreground dark:text-zinc-500">Admin</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;
