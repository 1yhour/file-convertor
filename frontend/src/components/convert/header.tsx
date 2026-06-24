"use client";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "../ui/sheet";
export default function Header() {
    const [isDark, setIsDark] = useState(false);
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
                            <Link href="/login" className="px-4 py-2 hover:text-black transition-colors">
                                Sign In
                            </Link>
                            <Link href="/register" className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-sm">
                                Sign Up
                            </Link>
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
                                    </SheetHeader>
                                    <div className="flex flex-col gap-4">
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