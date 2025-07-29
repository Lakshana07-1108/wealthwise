
import Link from "next/link";
import { ArrowRight, BarChart, Bot, LayoutDashboard } from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 lg:p-6">
        <Logo />
        <Button asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
              Take Control of Your Finances
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8">
              WealthWise helps you track your spending, manage budgets, and get
              AI-powered insights to achieve your financial goals.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">
                Start for Free <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
        
        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">All-in-One Finance Tracker</h2>
                <p className="text-muted-foreground mt-2">Everything you need to manage your money effectively.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <LayoutDashboard className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Smart Dashboard</h3>
                  <p className="text-muted-foreground">Visualize your income, expenses, and savings at a glance.</p>
                </div>
                <div className="flex flex-col items-center">
                  <BarChart className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                  <p className="text-muted-foreground">Track spending by category and identify savings opportunities.</p>
                </div>
                <div className="flex flex-col items-center">
                  <Bot className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-muted-foreground">Get personalized tips and recommendations from our smart assistant.</p>
                </div>
              </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
           <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
             <div className="lg:w-1/2">
                <Image 
                  src="/hero-image.png"
                  alt="WealthWise hero image" 
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
             </div>
             <div className="lg:w-1/2">
               <h2 className="text-3xl font-bold mb-4">See the Full Picture</h2>
               <p className="text-muted-foreground text-lg">
                 Our intuitive dashboard makes it easy to understand where your money is going. 
                 Connect your accounts, categorize transactions, and see your financial health improve.
               </p>
             </div>
           </div>
        </section>

      </main>

      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} WealthWise. All rights reserved.
          </p>
          <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
