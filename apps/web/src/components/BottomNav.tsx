import { Link, useLocation } from "react-router-dom";
import { Scan, History, User } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: "Scan", path: "/", icon: Scan },
    { name: "History", path: "/history", icon: History },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-primary-DEFAULT" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
