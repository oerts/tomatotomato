import { SignUp } from "@clerk/remix";

export default function SignUpPage() {
  return (
    <div className="h-full grid place-content-center">
      <SignUp />
    </div>
  );
}
