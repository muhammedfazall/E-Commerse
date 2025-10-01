export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4 py-12">
                {/* Newsletter Section */}
                <section className="max-w-2xl mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Stay in the Loop</h2>
                    <p className="text-gray-600 mb-6">Sign up now to get early access to exclusive launches and events.</p>
                    
                    <div className="flex gap-3">
                        <input 
                            type="email" 
                            placeholder="Enter your email address"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <button className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                            Subscribe
                        </button>
                    </div>
                </section>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Customer Service</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Shipping & FAQs</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Contact Us</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Returns & Exchanges</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Size Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">About Us</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Store Locator</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Careers</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Wholesale Inquiries</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Legal</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Accessibility</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Cookie Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Connect</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Instagram</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Facebook</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Twitter</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">TikTok</a></li>
                        </ul>
                    </div>
                </div>

                {/* Brand Section */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col items-center">
                        <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">SNEAKCAVE</h1>
                        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Sneakcave. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}