"use client";

import { Youtube, Facebook, Twitter, Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#d8bf78] rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">BigDentist</span>
                <span className="text-xs text-[#d8bf78] font-medium">EXCEL & SELL</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              © 2025 BigDentist | Your gateway to professional dental education with expert instructors and comprehensive courses.
            </p>

            {/* Social Media */}
            <div className="flex space-x-3" role="list" aria-label="Social media links">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#d8bf78] transition-colors"
                aria-label="YouTube"
                role="listitem"
              >
                <Youtube className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#d8bf78] transition-colors"
                aria-label="Facebook"
                role="listitem"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#d8bf78] transition-colors"
                aria-label="Twitter"
                role="listitem"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#d8bf78] transition-colors"
                aria-label="Instagram"
                role="listitem"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#d8bf78] transition-colors"
                aria-label="LinkedIn"
                role="listitem"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#d8bf78] transition-colors"
                aria-label="WhatsApp"
                role="listitem"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="mailto:contact@bigdentist.com" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#d8bf78] transition-colors"
                aria-label="Email us"
                role="listitem"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Who We Are */}
          <nav aria-labelledby="who-we-are-heading">
            <h3 id="who-we-are-heading" className="text-lg font-semibold mb-6">Who We Are</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Payment Methods</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Join Us as Instructor</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Affiliate Marketing Program</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Reseller Program</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Purchase & Refund Policy</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </nav>

          {/* Courses */}
          <nav aria-labelledby="courses-heading">
            <h3 id="courses-heading" className="text-lg font-semibold mb-6">Courses</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">My Courses</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Monthly Courses</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">All Courses</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Diplomas</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Books & Resources</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Instructors</a></li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-labelledby="support-heading">
            <h3 id="support-heading" className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Technical Support</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Community Forum</a></li>
              <li><a href="#" className="hover:text-[#d8bf78] transition-colors">Live Chat</a></li>
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              All rights reserved © 2025 | <a href="#" className="hover:text-[#d8bf78] transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-[#d8bf78] transition-colors">Terms of Service</a>
            </p>
            <p className="text-gray-400 text-sm">
              Designed and developed with <span aria-label="love">❤️</span> for dental professionals worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
