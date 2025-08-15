import GoogleSignInButton from "@/components/auth/google-signin-button";

const Page = () => {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1>BHIM</h1>
      <GoogleSignInButton />
    </section>
  );
};

export default Page;
