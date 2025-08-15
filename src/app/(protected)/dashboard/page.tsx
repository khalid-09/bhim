import { auth } from "@/auth";
import LogoutButton from "@/components/auth/logout-button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) redirect("/");

  return (
    <div>
      Dashboard Page
      <LogoutButton />
    </div>
  );
};

export default Page;
