"use client";

import { settingsAction } from "@/actions/settings-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { FaGear } from "react-icons/fa6";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

const ProfilePage = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      phone: user?.phone || undefined,
      company: user?.company || undefined,
      address: user?.address || undefined,
      street: user?.street || undefined,
      city: user?.city || undefined,
      province: user?.province || undefined,
      country: user?.country || undefined,
      postcode: user?.postcode || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      password: undefined,
      isTwoFactorEnabled: undefined,
    },
  });
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    console.log(values);

    startTransition(() => {
      settingsAction(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            toast.error("Details were not updated", {
              position: "top-right",
            });
          }
          if (data.success) {
            setSuccess(data.success);
            toast.success("Settings updated successfully", {
              position: "top-right",
            });
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <Card className="w-[600px] mb-10">
      <CardHeader>
        <p className="flex justify-center items-center text-2xl font-semibold text-center">
          <FaGear className="mr-2 text-black h-7 w-7" />
          Profile Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your name"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="company"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Comapny Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your company name"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your phone number"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.isOAuth === false && (
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. user@example.com"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Business Location</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. CTICC"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="street"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g 122 Loop St"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Johannesburg"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="province"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g Gauteng"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="postcode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g 7440"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g South Africa"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {user?.isOAuth === false && (
                <>
                  <div className="flex flex-wrap gap-4">
                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""} // Ensure the value is always controlled
                              placeholder="********"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="newPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""} // Ensure the value is always controlled
                              placeholder="e.g *******"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-4">
                <FormField
                  name="isTwoFactorEnabled"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1 flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y- 5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable 2FA to secure your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="role"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.USER}>User</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormSuccess message={success} />
            <FormError message={error} />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              variant="custom"
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
