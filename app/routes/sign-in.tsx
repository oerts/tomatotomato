import { SignIn } from "@clerk/remix";

export default function SignInPage() {
  return (
    <div className="h-full grid place-content-center">
      <SignIn />
    </div>
  );
}
