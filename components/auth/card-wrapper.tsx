"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CardHead } from "@/components/auth/card-head";
import { SocialButtons } from "@/components/auth/social-buttons";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocialButtons?: boolean;
}
export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocialButtons,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] max-w-full shadow-md">
      <CardHeader>
        <CardHead label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocialButtons && (
        <CardFooter>
          <SocialButtons />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
