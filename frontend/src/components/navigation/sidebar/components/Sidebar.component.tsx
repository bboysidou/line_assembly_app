import { Link, useLocation } from "react-router-dom";
import { sidebarNavigation } from "@/core/routes/navigation.route";
import { cn } from "@/lib/utils";
import { useSidebar } from "../context/hooks/useSidebar";
import {
  MAX_WIDTH,
  MAX_WIDTH_MOBILE,
  useMediaQuery,
} from "../context/hooks/useMediaQuery";

const SidebarComponent = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  const isMd = useMediaQuery(`(max-width: ${MAX_WIDTH}px)`);
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);
  const path = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            toggleSidebar();
          }}
        />
      )}

      <aside
        className={cn(
          "h-full flex p-4 flex-col items-center sm:items-start justify-between transition-all duration-300 z-50",
          isMobile && [
            "fixed top-0 left-0 bg-background border-r",
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
              : "w-[70px] lg:w-[300px] opacity-100",
          ],
        )}
      >
        <div className="h-[5dvh] flex flex-col items-start gap-2 overflow-hidden">
          <Link to="/" className="p-2 flex items-center md:items-start">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <span className="text-lg font-bold">OC</span>
            </div>
            <div
              className={cn(
                "flex-col ml-2 text-left text-sm leading-tight",
                isMobile ? "flex" : "hidden lg:flex",
                !isMobile && collapsed && "lg:hidden",
              )}
            >
              <span className="truncate font-semibold text-emerald-600">
                Open
                <span className="ml-[3px] text-foreground">Company</span>
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Manage projects & teams
              </span>
            </div>
          </Link>
        </div>

        <nav className="h-[90dvh] lg:w-full flex flex-col items-center overflow-y-auto md:items-start">
          <ul className="w-full overflow-y-auto">
            <div className="mt-4">
              {sidebarNavigation.map((item) => (
                <li key={item.path} className="mb-2">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 text-foreground hover:bg-primary/20 p-2 rounded-md transition-all duration-300",
                      path.pathname === item.path &&
                        "text-emerald-600 hover:bg-primary/20",
                    )}
                  >
                    {item.icon}
                    <span
                      className={cn(
                        "font-medium",
                        isMobile
                          ? "flex items-center"
                          : "hidden lg:flex md:items-center",
                        !isMobile && collapsed && "lg:hidden",
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </div>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SidebarComponent;
