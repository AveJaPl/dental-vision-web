// app/not-found.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-lg">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="text-sm text-muted-foreground">
          It seems you&apos;ve reached a dead end. Let&apos;s get you back on
          track!
        </p>
        <div className="flex justify-between space-x-4">
          <Link href="/" className="w-2/3">
            <Button className="w-full text-foreground">Go to Homepage</Button>
          </Link>
          <Link href="/login" className="w-1/3">
            <Button variant="outline" className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
