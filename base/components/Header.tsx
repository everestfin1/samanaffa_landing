export const Header = () => {

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/">
              <img
                src="/apesenegal/logo-everest.png"
                alt="EVEREST Finance"
                className="h-24 w-auto object-contain"
              />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 text-base tracking-wide font-titillium">
            <a
              href="/apesenegal"
              className="text-gray-900 hover:text-[#C38D1C] transition-colors duration-200 font-semibold"
            >
              ACCUEIL
            </a>
            <a
              href="/"
              className="text-gray-900 hover:text-[#C38D1C] transition-colors duration-200 font-semibold"
            >
              EVEREST Finance
            </a>

            <a
              href="/contact"
              className="text-gray-900 hover:text-[#C38D1C] transition-colors duration-200 font-semibold"
            >
              CONTACT
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}; 