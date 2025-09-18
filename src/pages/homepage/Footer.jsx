export default function Footer(){
    return(
        <div>
          
      <footer className="bg-white border-t border-gray-200 py-5">
        <div className="container mx-auto px-4">
         
          <section className="flex flex-col gap-4 lg:col-span-3 mb-12">
            <h2 className="font-medium text-gray-700">Newsletter</h2>
            <p className="text-lg font-medium">Sign up now to get early access to exclusive launches and events.</p>
            
            <div className="flex flex-row justify-between border-b border-gray-400 pb-1 mt-4">
              <div className="block w-full bg-transparent pr-1 h-8">Email address</div>
              <div className="shrink-0 font-medium h-8 flex items-center">Subscribe</div>
            </div>
          </section>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              <div>
                <ul className="mt-4">
                  <li className="pb-4">
                    <div className="font-medium">Shipping & FAQs</div>
                  </li>
                  <li className="pb-4">
                    <div className="font-medium">Contact</div>
                  </li>
                  <li className="pb-4">
                    <div className="font-medium">Blog</div>
                  </li>
                </ul>
              </div>


              <div>         
              <ul className="mt-4">
                  <li className="pb-4">
                    <div className="font-medium">About</div>
                  </li>
                  <li className="pb-4">
                    <div className="font-medium">Stores</div>
                  </li>
                  <li className="pb-4">
                    <div className="font-medium">Wholesale Inquiries</div>
                  </li>
                </ul>
              </div>

              <div>
                <ul className="mt-4">
                  <li className="pb-4">
                    <div className="font-medium">Privacy Policy</div>
                  </li>
                  <li className="pb-4">
                    <div className="font-medium">Terms of Service</div>
                  </li>
                  <li className="pb-4">
                    <div className="font-medium">Accessibility</div>
                  </li>
                </ul>
              </div>

              <div>
                <ul className="mt-4">
                  <li className="pb-4">
                    <div className="font-medium">Instagram</div>
                  </li>
                  <li className="pb-4">
                    <div className="font-medium">Facebook</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="m-0 p-0 border-t border-gray-200">
            <div className="flex justify-center">
              <p className="text-9xl font-black">SNEACAVE</p>
            </div>
          </div>
        </div>
      </footer></div>
    );
}