import { ModeToggle } from "./mode-toggle";
import { Logo } from "./ui/Logo";

export function Navbar() {
  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-foreground" />
          <span className="text-lg font-bold">GitHub Search</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
} 