
import Logo from "@/components/logo";
import { Skeleton } from '@/components/ui/skeleton';
import { AuthForm } from "@/components/auth-form";
import ClientOnly from "@/components/client-only";

const AuthFormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
  )
}


export default function AuthenticationPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <ClientOnly fallback={<AuthFormSkeleton />}>
          <AuthForm />
        </ClientOnly>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
