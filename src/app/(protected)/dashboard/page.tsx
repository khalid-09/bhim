import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) redirect("/");

  return <div>Dashboard Page</div>;
};

export default Page;
