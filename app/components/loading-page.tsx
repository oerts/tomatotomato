import Spinner from "./ui/spinner";

export default function LoadingPage() {
  return (
    <div className="h-full w-full grid place-content-center">
      <Spinner />
    </div>
  );
}
