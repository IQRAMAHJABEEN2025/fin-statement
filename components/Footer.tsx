
import React from 'react';
import { BrainCircuit, Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-200">AlphaInsight</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Empowering investors with institutional-grade financial analysis using advanced AI extraction.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Github className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => scrollToSection('home')} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('team')} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Meet the Team
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left">
                  Get in Touch
                </button>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Karachi, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-slate-500 dark:text-slate-400 cursor-default">Privacy Policy</li>
              <li className="text-slate-500 dark:text-slate-400 cursor-default">Terms of Service</li>
              <li className="text-slate-500 dark:text-slate-400 cursor-default">Cookie Policy</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} AlphaInsight. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span>Designed with AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
