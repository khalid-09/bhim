import Link from "next/link";
import ThemeToggle from "./theme-toggle";

const Navbar = () => {
  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b px-4 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p>
          <Link href="/">BHIM</Link>
        </p>
        <nav className="flex items-center gap-10">
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/company">Company</Link>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
