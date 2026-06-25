"use client";
import Link from "next/link";
import { Menu, Moon, Sun, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "../ui/sheet";
import useSWR from "swr";
import axios from "@/lib/axios";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Header() {
    const [isDark, setIsDark] = useState(false);
    const { data: user, isLoading, mutate } = useSWR('/api/user', fetcher);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            mutate(null);
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const triggleTheme = () =>{
        setIsDark(!isDark);
    }
    return (
        <header className="backdrop-blur border-b border-default sticky top-0 z-50 py-1 bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logov2-removebg.png" alt="Logo" className="w-15 h-15" />
                        <div className="text-xl font-medium tracking-wide text-gray-900">
                            <span>file</span>
                            <span className="font-bold text-red-500">convert</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 flex-row-reverse">
                        <div className="hidden sm:block">
                            {isLoading ? (
                                <div className="h-9 w-9 bg-gray-200 animate-pulse rounded-full" />
                            ) : user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center rounded-sm px-2 py-1">
                                            <Avatar className="h-5 w-5">
                                                <AvatarFallback className="bg-red-500 text-white">
                                                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Label>{user.email}</Label>
                                            <ChevronDown className=" h-5 w-5" />
                                        </Button>

                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link href="/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2 hover:text-black transition-colors">
                                        Sign In
                                    </Link>
                                    <Link href="/register" className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-sm ml-2">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="sm:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px] px-3">
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                        <SheetDescription className="sr-only">Navigation menu</SheetDescription>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-4 mt-4">
                                        {isLoading ? (
                                            <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
                                        ) : user ? (
                                            <>
                                                <div className="flex flex-col space-y-1 px-2 py-2 border-b mb-2">
                                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                                </div>
                                                <SheetClose asChild>
                                                    <Link href="/dashboard">
                                                        <Button variant="outline" className="w-full justify-start">Dashboard</Button>
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Button variant="destructive" className="w-full" onClick={handleLogout}>Log out</Button>
                                                </SheetClose>
                                            </>
                                        ) : (
                                            <>
                                                <SheetClose asChild>
                                                    <Link href="/login">
                                                        <Button variant="outline" className="w-full">Sign In</Button>
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link href="/register">
                                                        <Button className="w-full bg-red-500 text-white" >Sign Up</Button>
                                                    </Link>
                                                </SheetClose>
                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <Button size="icon" variant="ghost" onClick={triggleTheme}>
                            {isDark? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/> }
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}