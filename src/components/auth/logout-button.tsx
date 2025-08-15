"use client";

import { authClient } from "@/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return <Button onClick={handleClick}>LogoutButton</Button>;
};

export default LogoutButton;
