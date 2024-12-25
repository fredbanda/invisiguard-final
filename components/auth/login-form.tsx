"use client";

import React, { useState, useTransition, useRef } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Sorry this Email is registered and linked to another account."
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [code, setCode] = useState(Array(6).fill("")); // State for 6-digit 2FA code
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus(); // Focus next input
    }
  };

  const handleCodeKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus(); // Focus previous input
    }
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
  
    // Combine the 6-digit code into a single string
    const twoFactorCode = code.join(""); 
  
    startTransition(() => {
      login({ ...values, twoFactorCode}, callbackUrl) // Include twoFactorCode in the login payload
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
  
          if (data?.success) {
            toast.success("You have successfully logged in", {
              position: "top-right",
            });
            form.reset();
            setSuccess(data.success);
          }
      
          if (data?.twoFactor) {
            setSuccess("Please check your email for verification code");
            toast.success("Please check your email for verification code", {
              position: "top-right",
            });
            setShowTwoFactor(true);
          }
        })
    });
  };
    
  return (
    <CardWrapper
      headerLabel="Welcome back to Invisiguard"
      backButtonLabel="Don't have an account yet? Create one here"
      backButtonHref="/auth/register"
      showSocialButtons
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="twoFactorCode"
                render={() => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {code.map((digit, index) => (
                          <Input
                            key={index}
                            ref={(el) => {
                              if (el) {
                                inputsRef.current[index] = el; // Add the element to the inputsRef array
                              }
                            }}
                            value={digit}
                            onChange={(e) =>
                              handleCodeChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleCodeKeyDown(index, e)}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center text-lg border rounded"
                            disabled={isPending}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-[1rem] text-center" />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. shakazulu@eunny.co.za"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-[1rem] text-center" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g.******"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        variant="link"
                        size="sm"
                        asChild
                        className="px-6 ext-[1rem] text-center"
                      >
                        <Link
                          href="/auth/reset-password"
                          className="text-[1rem] text-center"
                        >
                          Forgot Password?
                        </Link>
                      </Button>
                      <FormMessage className="text-[1rem] text-center" />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            variant="custom"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
