export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="text-3xl font-bold text-primary">
            Help<span className="text-secondary">&</span>Heal
          </a>
          <p className="mt-2 text-sm text-text-light">
            Your safe space for mental health support
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
