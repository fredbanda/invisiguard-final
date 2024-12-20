// Reusable component for login form
"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
  }
  return (
        <CardWrapper
          headerLabel="Welcome back to Invisiguard"
          backButtonLabel="Don't have an account yet? Create one here"
          backButtonHref="/auth/register"
          showSocialButtons
        >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
            >
              <div className="space-y-4">
                <FormField 
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. shakazulu@eunny.co.za" type="email" />
                    </FormControl>
                    <FormMessage className="text-[1rem] text-center"/>
                  </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g.******" type="password" />
                    </FormControl>
                    <FormMessage className="text-[1rem] text-center"/>
                  </FormItem>
                )}
                />
              </div>
              <FormError message="" />
              <FormSuccess message="" />
              <Button type="submit" variant="custom" size="lg" className="w-full">Login</Button>
          </form>
        </Form>
        </CardWrapper>
  )
}
