import Header from "@/components/convert/header";
import Footer from "@/components/convert/footer";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}