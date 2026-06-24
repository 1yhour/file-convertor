import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 mt-auto">
            <div className="max-w-7xl mx-auto px-5 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img src="/logov2-removebg.png" alt="Logo" className="w-8 h-8" />
                            <div className="text-xl font-medium tracking-wide text-gray-900 dark:text-white">
                                <span>file</span>
                                <span className="font-bold text-red-500">convert</span>
                            </div>
                        </Link>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                            The ultimate tool to convert your files online. Fast, secure, and easy to use. We delete all uploaded files automatically after 24 hours.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link href="/formats" className="hover:text-red-500 transition-colors">Supported Formats</Link></li>
                            <li><Link href="/api" className="hover:text-red-500 transition-colors">Developer API</Link></li>
                            <li><Link href="/pricing" className="hover:text-red-500 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link href="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                        © {new Date().getFullYear()} FileConvert. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
