"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, Loader2 } from "lucide-react";
import type { Transaction } from "@/lib/types";
import {
  analyzeSpendingHabits,
  AnalyzeSpendingHabitsOutput,
} from "@/ai/flows/analyze-spending-habits";

export default function AiInsights({ transactions }: { transactions: Transaction[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeSpendingHabitsOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const transactionHistory = transactions
      .map(
        (t) =>
          `${t.date}: ${t.name} (${t.category}) - $${t.amount.toFixed(2)} (${
            t.type
          })`
      )
      .join("\n");

    try {
      const result = await analyzeSpendingHabits({ transactionHistory });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError("Failed to generate insights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Get personalized recommendations based on your spending.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {analysis && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Spending Summary</h3>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-1">Recommendations</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {analysis.recommendations}
              </p>
            </div>
          </div>
        )}
        {!isLoading && !analysis && !error && (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
            <p>Click the button below to analyze your spending habits.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAnalysis}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Analyze My Spending"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
