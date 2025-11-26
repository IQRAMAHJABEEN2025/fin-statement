
import React, { useState } from 'react';
import { BrainCircuit, UploadCloud, Files, Send, User, Moon, Sun, Check, Sparkles, ArrowRightLeft, Landmark, ShieldCheck } from 'lucide-react';
import { db } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
import { Footer } from './Footer';

interface LandingPageProps {
  onOpenAuth: (view: 'login' | 'signup') => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, toggleTheme, theme }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('sending');
    try {
      const contactsRef = ref(db, 'contacts');
      await push(contactsRef, {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setSubmitStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'Forever',
      description: 'Essential tools for casual analysis.',
      features: ['3 PDF Uploads / Month', 'Basic Financial Extraction', 'Standard Support', '7-Day History Retention'],
      highlight: false,
      cta: 'Get Started'
    },
    {
      name: 'Standard',
      price: 'PKR 50',
      period: '/ month',
      description: 'Perfect for students & researchers.',
      features: ['5 PDF Uploads / Month', 'Advanced Charts & Trends', 'Priority Processing', '30-Day History Retention'],
      highlight: true,
      cta: 'Upgrade Now'
    },
    {
      name: 'Pro',
      price: 'PKR 100',
      period: '/ month',
      description: 'For serious investors & analysts.',
      features: ['10 PDF Uploads / Month', 'Multi-Year Trend Analysis', 'Unlimited History', '24/7 Priority Support'],
      highlight: false,
      cta: 'Go Pro'
    }
  ];

  // Team configuration with specific avatar IDs
  const teamMembers = [
    {
      name: 'Khadija-Tul-Kubra',
      role: 'AI Reserch Analyst',
      avatarId: 'girl1'
    },
    {
      name: 'Iqra Mahjabeen',
      role: 'Full Stack Developer',
      avatarId: 'girl2'
    },
    {
      name: 'Umair Ahmed',
      role: 'Api Developer',
      avatarId: 'boy'
    }
    
  ];

  // Custom Line Art Avatars
  const AvatarSVG = ({ id }: { id: string }) => {
    const strokeColor = "currentColor";
    const strokeWidth = "2";
    
    // Boy with Glasses
    if (id === 'boy') {
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-700 dark:text-slate-200">
           {/* Hair */}
           <path d="M18 20C18 16 22 10 32 10C42 10 46 16 46 20C48 20 52 22 52 26V30" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           <path d="M18 20C16 20 12 22 12 26V30" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           {/* Face Shape */}
           <path d="M14 30V40C14 52 22 58 32 58C42 58 50 52 50 40V30" stroke={strokeColor} strokeWidth={strokeWidth}/>
           {/* Glasses */}
           <circle cx="24" cy="34" r="5" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <circle cx="40" cy="34" r="5" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <path d="M29 34H35" stroke={strokeColor} strokeWidth={strokeWidth}/>
           {/* Mouth */}
           <path d="M28 48C30 49 34 49 36 48" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           {/* Body/Shirt */}
           <path d="M12 62C12 62 16 54 32 54C48 54 52 62 52 62" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <path d="M32 54V62" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <path d="M22 54L26 62" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <path d="M42 54L38 62" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    }
    
    // Girl 1 (Ponytail / Side Bangs)
    if (id === 'girl1') {
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-700 dark:text-slate-200">
          {/* Hair back */}
          <path d="M16 30C16 20 24 10 32 10C40 10 48 20 48 30V44" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          <path d="M12 34V46C12 46 14 54 18 54" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          {/* Ponytail */}
          <path d="M48 20C54 20 58 26 58 36C58 44 54 48 50 50" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          {/* Face */}
          <path d="M16 30V42C16 52 23 58 32 58C41 58 48 52 48 42V30" stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* Bangs */}
          <path d="M48 30C40 30 32 14 16 30" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          {/* Eyes */}
          <path d="M22 38H26" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          <path d="M38 38H42" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          {/* Mouth */}
          <path d="M30 48C31 49 33 49 34 48" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           {/* Body */}
           <path d="M16 62C16 62 20 58 32 58C44 58 48 62 48 62" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <path d="M22 58L24 62" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <path d="M42 58L40 62" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    }

    // Girl 2 (Wavy Hair)
    if (id === 'girl2') {
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-700 dark:text-slate-200">
           {/* Hair Top */}
           <path d="M18 26C18 16 24 8 32 8C40 8 46 16 46 26" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           {/* Hair Sides - Wavy */}
           <path d="M18 26C14 26 10 32 12 40C14 48 10 52 12 58" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           <path d="M46 26C50 26 54 32 52 40C50 48 54 52 52 58" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           {/* Face */}
           <path d="M18 30V42C18 52 25 58 32 58C39 58 46 52 46 42V30" stroke={strokeColor} strokeWidth={strokeWidth}/>
           {/* Forehead/Hairline */}
           <path d="M18 26C22 34 26 26 32 26C38 26 42 34 46 26" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           {/* Eyes */}
           <circle cx="25" cy="38" r="1.5" fill={strokeColor}/>
           <circle cx="39" cy="38" r="1.5" fill={strokeColor}/>
           {/* Mouth */}
           <path d="M30 48H34" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
           {/* Body */}
           <path d="M16 62C16 62 20 58 32 58C44 58 48 62 48 62" stroke={strokeColor} strokeWidth={strokeWidth}/>
           <path d="M32 58V62" stroke={strokeColor} strokeWidth={strokeWidth}/>
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 flex flex-col font-sans transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Alpha<span className="text-blue-600 dark:text-blue-500">Insight</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-400 hover:text-white" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button onClick={() => onOpenAuth('login')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
              Log in
            </button>
            <button onClick={() => onOpenAuth('signup')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20">
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      {/* Added min-h to take up space, and updated scroll-mt for better offset */}
      <section id="home" className="relative pt-24 pb-32 overflow-hidden scroll-mt-28 min-h-[90vh] flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-medium uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                AI-Powered Financial Analysis
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Institutional Grade <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">Financial Insights</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Instantly extract, analyze, and verify financial data from PDF reports. 
                Built for investors who demand accuracy and speed.
              </p>
              <div className="flex items-center gap-4">
                <button onClick={() => onOpenAuth('signup')} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-blue-500/20 dark:shadow-blue-900/20 transform hover:-translate-y-1">
                  Get Started Free
                </button>
                <div className="text-sm text-slate-500">
                  No credit card required
                </div>
              </div>
            </div>

            {/* Right: Mock Upload Box (CTA) */}
            <div className="relative">
              <div 
                onClick={() => onOpenAuth('signup')}
                className="group relative border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className="p-5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/10 transition-colors relative">
                    <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                    <div className="absolute -right-2 -bottom-2 bg-white dark:bg-slate-900 rounded-full p-1.5 border border-slate-200 dark:border-slate-700">
                       <Files className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">
                      Upload Financial Report
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                      Drag & drop PDF files here to start analyzing. <br/>
                      <span className="text-blue-500 dark:text-blue-400 text-xs font-medium mt-1 block">Login to continue</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative elements behind box */}
              <div className="absolute -z-10 top-6 -right-6 w-full h-full bg-slate-200 dark:bg-slate-800/30 rounded-2xl border border-slate-300 dark:border-slate-800" />
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION (Experience that grows) --- */}
      <section id="about" className="py-28 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <h3 className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase mb-3">
                Future Payment
              </h3>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Clarity that empowers your investment decisions.
              </h2>
            </div>
            <div className="flex items-center">
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                Design a financial analysis tool that helps you understand companies deeply and make confident investment decisions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 mb-6">
                <ArrowRightLeft className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smarter Data Extraction</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically extract key financial metrics from any company’s PDF report and convert them into clean, comparable insights
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 mb-6">
                <Landmark className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Multi-sector intelligence</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically extract key financial metrics from any company’s PDF report and convert them into clean, comparable insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 mb-6">
                <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure & Private</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Your uploaded reports and extracted financial data remain fully confidential with strict local-storage protection.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- PRICING PLANS SECTION --- */}
      <section id="pricing" className="py-28 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Flexible Plans for Every Investor</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Start for free and upgrade as your analysis needs grow. Transparent pricing in PKR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`
                  relative rounded-2xl p-8 transition-all duration-300 flex flex-col
                  ${plan.highlight 
                    ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-500/10 scale-100 md:scale-105 z-10' 
                    : 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:shadow-lg'
                  }
                `}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-sm text-slate-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className={`p-0.5 rounded-full ${plan.highlight ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onOpenAuth('signup')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg ${
                    plan.highlight 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25' 
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-slate-200/50 dark:shadow-none'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MEET THE TEAM SECTION (Redesigned with Line Art Icons) --- */}
      <section id="team" className="py-28 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-blue-600 dark:text-blue-400 font-bold text-xs tracking-[0.2em] uppercase mb-3">
              Who Made It
            </h3>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              Meet The Team
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
              >
                {/* SVG Avatar Container */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 p-2">
                   <AvatarSVG id={member.avatarId} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm tracking-wide bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT FORM SECTION --- */}
      <section id="contact" className="py-28 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm dark:shadow-none">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Get in Touch</h2>
              <p className="text-slate-500 dark:text-slate-400">Have questions or feature requests? Send us a message.</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Message</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={submitStatus === 'sending' || submitStatus === 'sent'}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  submitStatus === 'sent' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {submitStatus === 'sending' ? (
                  'Sending...'
                ) : submitStatus === 'sent' ? (
                  'Message Sent!'
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- REUSABLE FOOTER --- */}
      <Footer />
    </div>
  );
};
