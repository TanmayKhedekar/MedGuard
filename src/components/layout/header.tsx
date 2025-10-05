import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">PillPatrol</span>
          </div>
        </div>
      </div>
    </header>
  );
}
