import { useContext } from "react";
import { AuthContext, ProductContext } from "../../context/Context";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Account() {
  const { user, isAccountOpen, closeAccount, logout } = useContext(AuthContext);
  const { wishList } = useContext(ProductContext);

  return (
    <Dialog
      open={isAccountOpen}
      onClose={closeAccount}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md data-closed:translate-x-full sm:duration-700 transform transition duration-500 ease-in-out bg-white shadow-xl"
            >
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-lg font-medium text-gray-900">
                    Account
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={closeAccount}
                    className="ml-3 flex h-7 items-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col space-y-4">
                  <div className="flex gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>

                  <Link
                    to="/wishlist"
                    onClick={closeAccount}
                    className="px-4 py-2 rounded hover:bg-gray-100 text-gray-900 font-medium flex justify-between items-center"
                  >
                    Wishlist
                    {wishList.length > 0 && (
                      <span className="ml-2 bg-gray-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {wishList.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeAccount}
                    className="px-4 py-2 rounded hover:bg-gray-100 text-gray-900 font-medium"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      closeAccount();
                    }}
                    className="px-4 py-2 cursor-pointer rounded hover:bg-gray-100 text-red-600 font-medium text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-center text-center text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={closeAccount}
                    className="cursor-pointer font-medium text-black hover:text-gray-700"
                  >
                    Continue Shopping →
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
