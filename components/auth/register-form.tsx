// Reusable component for login form
"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
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
import { register} from "@/actions/register";
import { useState, useTransition } from "react";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log(values);
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Welcome back to Invisiguard"
      backButtonLabel="Already have an account? Login here"
      backButtonHref="/auth/login"
      showSocialButtons
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Shaka Zulu"
                          type="name"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-[1rem] text-center" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g.07 855 4536"
                          type="phone"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-[1rem] text-center" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                  <FormMessage className="text-[1rem] text-center" />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            variant="custom"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            Create An Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
