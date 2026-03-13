import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { 
  Users, 
  Rocket, 
  Target, 
  Zap,
  DollarSign,
  Network,
  UserPlus,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function FoundersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    founder_name: "",
    email: "",
    company_name: "",
    website: "",
    industry: "",
    funding_stage: "",
    description: "",
    deck_url: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/pitch`, formData);
      setSubmitted(true);
      toast.success("Pitch submitted successfully! We'll be in touch.");
    } catch (error) {
      console.error("Error submitting pitch:", error);
      toast.error("Failed to submit pitch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const lookingFor = [
    { icon: Users, title: "Exceptional Teams", description: "Founders with domain expertise and execution ability" },
    { icon: Rocket, title: "Scalable Technology", description: "Innovative solutions with defensible technical moats" },
    { icon: Target, title: "Large Markets", description: "Opportunities in massive addressable markets" },
    { icon: Zap, title: "Clear Advantage", description: "Distinct competitive positioning and differentiation" }
  ];

  const whatWeProvide = [
    { icon: DollarSign, title: "Strategic Capital", description: "Flexible funding to fuel your growth" },
    { icon: Network, title: "Network Access", description: "Connections to customers, partners, and talent" },
    { icon: UserPlus, title: "Hiring Support", description: "Help building world-class teams" },
    { icon: TrendingUp, title: "Go-to-Market", description: "Strategic guidance on scaling" }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="founders-page">
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
            >
              For Founders
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="founders-headline"
            >
              Partner With<br />
              <span className="text-zinc-500">IKTHEES</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              We back exceptional founders building category-defining companies. 
              If you're working on something transformative, we want to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="looking-for-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
            >
              What We Look For
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              The Founders We Back
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lookingFor.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 card-hover"
                >
                  <item.icon className="w-10 h-10 text-white mb-6" strokeWidth={1} />
                  <h3 className="font-['Manrope'] text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-24 md:py-32" data-testid="provide-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
            >
              What We Provide
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              More Than Capital
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whatWeProvide.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-white" strokeWidth={1} />
                  </div>
                  <h3 className="font-['Manrope'] text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pitch Form */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="pitch-form-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-widest uppercase text-zinc-600 mb-4">
                Submit Your Pitch
              </p>
              <h2 className="font-['Manrope'] text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                Tell Us About Your Company
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                We review every submission and aim to respond within two weeks. 
                Include as much detail as possible to help us understand your vision.
              </p>
              <div className="space-y-4 text-zinc-500 text-sm">
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Every pitch is reviewed by our investment team
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Response within 2 weeks
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Confidential and secure
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {submitted ? (
                <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-10 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                  <h3 className="font-['Manrope'] text-2xl font-semibold text-white mb-4">
                    Pitch Submitted!
                  </h3>
                  <p className="text-zinc-400">
                    Thank you for your submission. Our team will review your pitch 
                    and get back to you within two weeks.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="pitch-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Founder Name *
                      </label>
                      <input
                        type="text"
                        name="founder_name"
                        value={formData.founder_name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700"
                        placeholder="Your name"
                        data-testid="pitch-founder-name"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700"
                        placeholder="you@company.com"
                        data-testid="pitch-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700"
                        placeholder="Company name"
                        data-testid="pitch-company-name"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700"
                        placeholder="https://yourcompany.com"
                        data-testid="pitch-website"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Industry *
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors"
                        data-testid="pitch-industry"
                      >
                        <option value="" className="bg-zinc-900">Select industry</option>
                        <option value="AI" className="bg-zinc-900">Artificial Intelligence</option>
                        <option value="Fintech" className="bg-zinc-900">Fintech</option>
                        <option value="Enterprise" className="bg-zinc-900">Enterprise Software</option>
                        <option value="Healthcare" className="bg-zinc-900">Healthcare & Biotech</option>
                        <option value="Climate" className="bg-zinc-900">Climate & Energy</option>
                        <option value="Infrastructure" className="bg-zinc-900">Infrastructure</option>
                        <option value="Other" className="bg-zinc-900">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Funding Stage *
                      </label>
                      <select
                        name="funding_stage"
                        value={formData.funding_stage}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors"
                        data-testid="pitch-funding-stage"
                      >
                        <option value="" className="bg-zinc-900">Select stage</option>
                        <option value="Pre-Seed" className="bg-zinc-900">Pre-Seed</option>
                        <option value="Seed" className="bg-zinc-900">Seed</option>
                        <option value="Series A" className="bg-zinc-900">Series A</option>
                        <option value="Series B+" className="bg-zinc-900">Series B+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                      Company Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700 resize-none"
                      placeholder="Tell us about your company, the problem you're solving, and your vision..."
                      data-testid="pitch-description"
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                      Pitch Deck URL
                    </label>
                    <input
                      type="url"
                      name="deck_url"
                      value={formData.deck_url}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700"
                      placeholder="Link to your pitch deck (Google Drive, Docsend, etc.)"
                      data-testid="pitch-deck-url"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black rounded-full px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    data-testid="pitch-submit-btn"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Pitch"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
