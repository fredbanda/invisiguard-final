"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin()
        .then((data) => {
            if(data.error){
                toast.error("Your access has been denied", {
                    position: "top-right",
                })

            }
            if (data.success){
                toast.success("Server action success", {
                    position: "top-right",
                });
            }
        })
    };

    const onApiRouteClick = () => {
        fetch("/api/admin")
        .then((response) => {
            if(response.ok){
                toast.success("API route success", {
                    position: "top-right",
                });
                
            }else {
                toast.error("Your access has been denied", {
                    position: "top-right",
                })
            }
        })
    }
  return (
    <Card className="w-[600px] shawdow-sm">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">🔐 Admin Page</p>
        </CardHeader>
        <CardContent className="space-y-4">
            <RoleGate 
            allowedRole={UserRole.ADMIN}
            >
                <FormSuccess message="You are now an admin so welcome" />
            </RoleGate>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    Admin-only API ROUTE
                </p>
                <Button onClick={onApiRouteClick}>
                    Click To Test
                </Button>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    Admin-only Server Action
                </p>
                <Button onClick={onServerActionClick}>
                    Click To Test
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default AdminPage

