import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-yellow-500 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <LoginForm />
      </div>
    </div>
  );
}
