import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1>BHIM</h1>
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/log-in">Login</Link>
        </Button>
      </div>
    </section>
  );
};

export default Page;
