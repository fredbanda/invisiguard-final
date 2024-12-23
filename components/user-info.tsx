import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
    user?: ExtendedUser;
    label: string;
}
export const UserInfo = ({user, label}: UserInfoProps) => {
  return (
    <Card className="w-[600px] shawdow-sm">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">{label}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
              ID
            </p>
            <p>{user?.id}</p>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
              Email
            </p>
            <p>{user?.email}</p>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
              Name
            </p>
            <p>{user?.name}</p>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
              Role
            </p>
            <p>{user?.role}</p>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
              Phone
            </p>
            <p>{user?.phone}</p>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
              Two Factor Authentication 2FA
            </p>
            <Badge 
            variant={user?.isTwoFactorEnabled ? "sucess" : "destructive"}
            size="sm"
            >
              {user?.isTwoFactorEnabled ? "ON" : "OFF"}
              </Badge>
          </div>
        </CardContent>
    </Card>
  )
}


