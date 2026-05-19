import { LoginForm } from "@/components/admin/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/logo/logo.png"
            alt="Campedèl"
            width={72}
            height={72}
            className="mx-auto rounded-2xl mb-4 object-contain"
          />
          <h1 className="font-heading font-bold text-2xl text-zinc-900 dark:text-zinc-100">
            Campedèl Admin
          </h1>
          <p className="text-sm text-muted-light dark:text-muted-dark mt-1">
            Menüverwaltung
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
