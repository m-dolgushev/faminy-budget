import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            FamilyBudget
          </span>
        </Link>
        <nav className="flex items-center space-x-4 text-sm font-medium">
          <span className="text-muted-foreground">Умное управление финансами</span>
        </nav>
      </div>
    </header>
  );
}
