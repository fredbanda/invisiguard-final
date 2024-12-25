// Reusable component for login form
"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { NewPasswordSchema } from "@/schemas";
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
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    console.log(values);
    

    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          setError(data.error)
          setSuccess(data.success)
        })
    });
  };
  return (
    <CardWrapper
      headerLabel="Enter your new password"
      backButtonLabel="Back to login page"
      backButtonHref="/auth/login"
      showSocialButtons={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. *******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-[1rem] text-center" />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error } />
          <FormSuccess message={success} />
          <Button
            type="submit"
            variant="custom"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
