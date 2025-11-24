import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ninjaLogo from "@/assets/ninja-logo.png";
import { useLogout } from "@/hooks/useLogout";

interface HeaderProps {
  showNavigation?: boolean;
  showLogout?: boolean;
}

export const Header = ({ showNavigation = true, showLogout = true }: HeaderProps) => {
  const { logout } = useLogout();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={ninjaLogo} alt="HAQ" className="h-10 w-10 object-contain" />
            <h1 className="text-base md:text-xl font-bold text-foreground">
              HEALTHCARE ANALYSIS HQ
            </h1>
          </Link>

          {/* Navigation Links and Logout */}
          <div className="flex items-center gap-4 md:gap-6">
            {showNavigation && (
              <nav className="flex items-center gap-4 md:gap-6">
                <Link to="/technology" className="nav-link text-sm">
                  Technology
                </Link>
                <Link to="/about" className="nav-link text-sm">
                  About Us
                </Link>
              </nav>
            )}
            
            {showLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
