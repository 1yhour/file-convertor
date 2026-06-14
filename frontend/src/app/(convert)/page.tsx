'use client'
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";

export default function Page() {
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
    };
    return (
        <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold">Home</h1>
            <div>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    );
}