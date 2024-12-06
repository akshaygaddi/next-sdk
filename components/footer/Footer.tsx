import React from 'react';
import { Mail, Twitter, Github, Linkedin, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    product: {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Smart Rooms', href: '/rooms' },
        { name: 'Communities', href: '/communities' },
        { name: 'Roadmap', href: '/roadmap' },
        { name: 'Changelog', href: '/changelog' }
      ]
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    resources: {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Community Guidelines', href: '/guidelines' },
        { name: 'API', href: '/api' }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' }
      ]
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-orange-50/50 to-amber-50/50 dark:from-gray-900 dark:to-gray-950">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>

      <div className="container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-0.5">
                <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Your Brand</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              Redefining digital conversations through innovative features and meaningful community engagement.
            </p>
            {/* Newsletter signup */}
            <div className="relative group max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex">
                <input
                  type="email"
                  placeholder="Subscribe to our newsletter"
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 rounded-l-lg border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-r-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Your Brand. All rights reserved.
            </div>

            {/* Social links */}
            <div className="flex items-center gap-6">
              {[Twitter, Github, Linkedin, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;