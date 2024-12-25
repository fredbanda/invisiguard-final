"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { UserInfo } from "@/components/user-info";

const ClientPage = () => {
  const user = useCurrentUser();
  return (
    <div className="mb-10">
      <UserInfo label="Client Components" user={user} />
    </div>
  );
};

export default ClientPage;
