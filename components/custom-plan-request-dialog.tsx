"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/context/authStore";
import { useNotificationStore } from "@/context/notificationStore";

// Form validation schema
const customPlanSchema = z.object({
  email: z.string().email("Valid email is required"),
  campaignCount: z.number().min(1, "Campaign count must be at least 1"),
  creditLimit: z.string().min(1, "Credit limit is required"),
  additionalNotes: z.string().optional(),
});

type CustomPlanFormData = z.infer<typeof customPlanSchema>;

interface CustomPlanRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CustomPlanRequestDialog({
  open,
  onOpenChange,
  onSuccess,
}: CustomPlanRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { fetchNotifications, fetchUnreadCount } = useNotificationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CustomPlanFormData>({
    resolver: zodResolver(customPlanSchema),
    defaultValues: {
      email: user?.email || "",
      campaignCount: 5,
      creditLimit: "1M",
      additionalNotes: "",
    },
  });

  // Update email when user data is available
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const creditLimit = watch("creditLimit");

  const onSubmit = async (data: CustomPlanFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/forms/custom-plan-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      toast.success("Custom plan request submitted successfully! We'll get back to you soon.");
      
      // Refresh notifications to show the new notification instantly
      await Promise.all([
        fetchNotifications(1, 10),
        fetchUnreadCount()
      ]);
      
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error submitting custom plan request:", error);
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="heroicons:sparkles" className="w-5 h-5 text-primary" />
            Request Custom Plan
          </DialogTitle>
          <DialogDescription>
            Tell us about your requirements and we'll create a custom plan tailored to your needs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              readOnly={!!user?.email}
              className={user?.email ? "bg-muted" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              We'll contact you at this email address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaignCount">
              Number of Campaigns <span className="text-destructive">*</span>
            </Label>
            <Input
              id="campaignCount"
              type="number"
              min="1"
              placeholder="e.g., 10"
              {...register("campaignCount", { valueAsNumber: true })}
            />
            {errors.campaignCount && (
              <p className="text-xs text-destructive">{errors.campaignCount.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              How many campaigns do you plan to run simultaneously?
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">
              Credit Limit (Visits/Month) <span className="text-destructive">*</span>
            </Label>
            <Select
              value={creditLimit}
              onValueChange={(value) => setValue("creditLimit", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select credit limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Million visits</SelectItem>
                <SelectItem value="2M">2 Million visits</SelectItem>
                <SelectItem value="5M">5 Million visits</SelectItem>
                <SelectItem value="10M">10 Million visits</SelectItem>
                <SelectItem value="20M">20 Million visits</SelectItem>
                <SelectItem value="50M">50 Million visits</SelectItem>
                <SelectItem value="100M+">100 Million+ visits</SelectItem>
              </SelectContent>
            </Select>
            {errors.creditLimit && (
              <p className="text-xs text-destructive">{errors.creditLimit.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Requirements</Label>
            <Textarea
              id="additionalNotes"
              rows={4}
              placeholder="Tell us about any specific features, support needs, or special requirements..."
              {...register("additionalNotes")}
            />
            {errors.additionalNotes && (
              <p className="text-xs text-destructive">{errors.additionalNotes.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icon icon="heroicons:arrow-path" className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon icon="heroicons:paper-airplane" className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
