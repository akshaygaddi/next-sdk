import Link from "next/link";
import {createClient} from "@/utils/supabase/server";

import {Button} from "@/components/ui/button";
import {login} from "@/app/auth/login/actions";
import {ArrowRight} from "lucide-react";
import {logout} from "@/app/auth/signout/action";


const Navbar = async () => {

  const supabase = await createClient()
  // const {data: {user}} = await supabase.auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return (
    <nav className=" w-full  bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent cursor-pointer">
                Skill Bridge
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Main Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/home"
                className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-xl"
              >
                Home
              </Link>
              <Link
                href="/community"
                className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-xl"
              >
                Community
              </Link>
              <Link
                href="/room"
                className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-xl"
              >
                Room
              </Link>
              <Link
                href="/about"
                className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-xl"
              >
                About Us
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none ml-2 w-40"
              />
            </div>

            {/* Icons */}
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <span className="sr-only">Settings</span>
            </button>

            {/* Auth Buttons */}

            {
              user ? (
                  <div>
                    <form>
                      <Button className="w-full" formAction={logout}>
                        logout
                        <ArrowRight className="ml-2" size={18}/>
                      </Button>
                    </form>
                  </div>
              ): (
                  <div className="hidden md:flex items-center space-x-4">
                    <Link
                        href="/auth/login"
                        className="flex items-center space-x-2 text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all"
                    >
                      Login
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
              )
            }


            {/* Mobile Menu Toggle */}
            <button className="md:hidden">
              <span className="sr-only">Toggle Menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
