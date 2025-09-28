import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  return (
    <>
      <header className="border-border bg-background fixed top-0 z-50 flex w-full items-center justify-between border-b px-4 py-6 lg:hidden">
        <p>
          <Link href="/">BHIM</Link>
        </p>
        <SidebarTrigger />
      </header>
      <div className="h-[77px] lg:hidden" />
    </>
  );
};

export default Navbar;
