"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/context/authStore";
import { useRouter } from "@/components/navigation";

const schema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Your email is invalid" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const RegForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const register = useAuthStore((state) => state.register);
  const router = useRouter();
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      try {
        await register({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName
        });
        toast.success("Account created successfully");
        router.push("/dashboard/analytics");
      } catch (err: any) {
        toast.error(err.message || "Registration failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            {...registerField("firstName")}
            size="lg"
            className={cn("", {
              "border-destructive": errors.firstName,
            })}
          />
          {errors.firstName && (
            <div className="text-destructive text-sm">
              {errors.firstName.message}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...registerField("lastName")}
            size="lg"
            className={cn("", {
              "border-destructive": errors.lastName,
            })}
          />
          {errors.lastName && (
            <div className="text-destructive text-sm">
              {errors.lastName.message}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...registerField("email")}
          size="lg"
          className={cn("", {
            "border-destructive": errors.email,
          })}
        />
        {errors.email && (
          <div className="text-destructive text-sm">
            {errors.email.message}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...registerField("password")}
          size="lg"
          className={cn("", {
            "border-destructive": errors.password,
          })}
        />
        {errors.password && (
          <div className="text-destructive text-sm">
            {errors.password.message}
          </div>
        )}
      </div>

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Creating Account..." : "Create An Account"}
      </Button>
    </form>
  );
};

export default RegForm;