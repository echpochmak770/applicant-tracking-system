import { type UserDto } from "@/api/auth/model/types";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";
import { useLogoutMutation } from "@/api/auth/model/mutations";

interface HeaderProps {
  user?: UserDto;
}

export function Header({ user }: HeaderProps) {
  const navigate = useNavigate();

  const { mutate } = useLogoutMutation();

  const handleLogout = () => {
    mutate();
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ГГ";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-foreground/95 backdrop-blur-md text-primary-foreground shadow-sm">
      <div className="max-w-[1440px] mx-auto flex h-20 items-center justify-between px-6">
        <div
          className="flex items-center gap-3 cursor-pointer transition-opacity"
          onClick={() => navigate("/")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">ATS System</span>
        </div>

        <nav className="flex gap-5 text-lg font-medium">
          <NavLink
            to="/vacancies"
            className="transition-colors hover:text-accent"
          >
            Вакансии
          </NavLink>
          <NavLink to="/stages" className="transition-colors hover:text-accent">
            Стадии
          </NavLink>
        </nav>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="hidden flex-col items-end md:flex">
              <span className="text-lg font-semibold leading-none transition-colors">
                {user?.fullName || "Гость системы"}
              </span>
              <span className="text-sm text-accent font-medium mt-1 uppercase tracking-widest">
                {user?.email || "Awaiting Auth"}
              </span>
            </div>

            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-chart-1 to-chart-2 text-md font-bold text-white border border-white/20 shadow-inner">
              {initials}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-9 px-4 border-white/20 bg-transparent text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-all gap-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
