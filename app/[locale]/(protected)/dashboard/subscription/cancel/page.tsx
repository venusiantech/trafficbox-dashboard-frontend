"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function SubscriptionCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3">
                <XCircle className="w-16 h-16 text-orange-600 dark:text-orange-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                Payment Canceled
              </h1>
              <p className="text-muted-foreground">
                Your subscription upgrade was canceled. No charges were made.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              You can try upgrading again anytime. Your current plan remains active.
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full"
                color="primary"
                onClick={() => router.push('/dashboard/profile')}
              >
                Back to Profile
              </Button>
              <Button 
                className="w-full border border-default-300"
                color="default"
                onClick={() => router.push('/dashboard/analytics')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
