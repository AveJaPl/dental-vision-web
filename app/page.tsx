"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Smile, CheckCircle, ShieldCheck, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Helper do łączenia klas (shadcn); dostosuj, jeśli masz inną strukturę

export default function LandingPage() {
  // Przykład prostego fade-in przy ładowaniu
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground flex flex-col transition-opacity duration-700 ease-in",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* HEADER */}
      <header className="w-full border-b border-muted-foreground">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 text-xl font-bold">
            <Smile className="w-6 h-6" />
            <span>Dental Vision</span>
          </div>

          {/* Right-side navigation / Login */}
          <div className="flex items-center space-x-4">
            <Button variant="default" className="text-foreground" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 md:px-8 py-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            AI-powered Initial Dental Assessment
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            Get a quick and reliable check-up of your teeth from the comfort of
            your home. Our AI advisor will provide recommendations tailored just
            for you.
          </p>
          <Button
            variant="default"
            size="lg"
            asChild
            className="transition-transform hover:scale-105 text-foreground"
          >
            <Link href="/login">Start Now</Link>
          </Button>
        </section>

        {/* FEATURES SECTION */}
        <section className="container mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CheckCircle className="w-8 h-8 text-primary" />}
            title="Quick Assessment"
            description="Simply chat with our AI advisor and receive a preliminary diagnosis."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-primary" />}
            title="Secure & Confidential"
            description="Your data is safe with us. We prioritize patient privacy and security."
          />
          <FeatureCard
            icon={<PhoneCall className="w-8 h-8 text-primary" />}
            title="No Office Visit Needed"
            description="Get recommendations online and save time—no scheduling or travel required."
          />
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="container mx-auto px-4 md:px-8 py-8">
          <h2 className="text-3xl font-semibold text-center mb-8">
            How Dental Vision Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              stepNumber="1"
              title="Sign Up"
              description="Create an account and log in to your dashboard."
            />
            <StepCard
              stepNumber="2"
              title="Chat with Our AI"
              description="Explain your situation and any symptoms for a quick analysis."
            />
            <StepCard
              stepNumber="3"
              title="Receive Recommendations"
              description="Review potential treatments and follow-up steps suggested by our AI."
            />
          </div>
        </section>

        {/* CTA / CALL TO ACTION */}
        <section className="container mx-auto px-4 md:px-8 py-8 flex flex-col items-center text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">
            Ready for Your Next Step?
          </h3>
          <p className="max-w-lg text-muted-foreground">
            Dental Vision is here to provide the best personalized advice. Take
            control of your dental health today!
          </p>
          <Button
            variant="default"
            size="lg"
            asChild
            className="transition-transform hover:scale-105 text-foreground"
          >
            <Link href="/login">Create Account</Link>
          </Button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-muted-foreground">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dental Vision. All rights reserved.
          </p>
          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            <Link href="#" className="hover:underline mr-4">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* 
  -- Poniżej przykładowe komponenty, które możesz wyciągnąć do osobnych plików 
  -- w folderze @/components. 
  -- Korzystają z Tailwind + shadcn klas i stylów.
*/

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
}
function StepCard({ stepNumber, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground mb-4 text-xl font-bold">
        {stepNumber}
      </div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}
