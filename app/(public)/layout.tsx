import Link from "next/link";
import Image from "next/image";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header dengan Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="h-12">
              <Image
                src="/images/logo.png"
                alt="SIM-KARA Logo"
                height={48}
                width={120}
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                SIM-KARA
              </h1>
              <p className="text-sm text-gray-600">D4 Teknik Mesin UNESA</p>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            <Link href="/karya" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Karya
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-lg transition hover:bg-blue-100"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Always at Bottom */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 D4 Teknik Mesin UNESA. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
