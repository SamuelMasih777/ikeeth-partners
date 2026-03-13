import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Cpu, 
  Wallet, 
  Building2, 
  HeartPulse, 
  Leaf, 
  Server 
} from "lucide-react";

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

export default function InvestmentPage() {
  const stages = [
    { name: "Pre-Seed", description: "Backing exceptional founders at the earliest stage" },
    { name: "Seed", description: "Fueling product-market fit discovery" },
    { name: "Series A", description: "Accelerating proven business models" },
    { name: "Growth", description: "Select opportunities in scaling companies" }
  ];

  const industries = [
    { icon: Cpu, name: "Artificial Intelligence", description: "Foundation models, infrastructure, and applications" },
    { icon: Wallet, name: "Fintech", description: "Payments, lending, and financial infrastructure" },
    { icon: Building2, name: "Enterprise Software", description: "B2B SaaS, productivity, and automation" },
    { icon: HeartPulse, name: "Healthcare & Biotech", description: "Digital health, therapeutics, and diagnostics" },
    { icon: Leaf, name: "Climate & Energy", description: "Clean tech, renewables, and sustainability" },
    { icon: Server, name: "Infrastructure", description: "Developer tools, security, and data" }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="investment-page">
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
              Investment Focus
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="investment-headline"
            >
              Where We<br />
              <span className="text-zinc-500">Invest</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              We invest in transformative technology companies across stages and sectors, 
              with a focus on bold ideas that can reshape industries.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Investment Stages */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="stages-section">
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
              Investment Stages
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              Stage Agnostic
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stages.map((stage, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 card-hover h-full">
                    <span className="text-5xl font-['Manrope'] font-extrabold text-zinc-800 block mb-4">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-['Manrope'] text-xl font-semibold text-white mb-2">
                      {stage.name}
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 md:py-32" data-testid="industries-section">
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
              Focus Areas
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              Industries We Back
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 card-hover group"
                >
                  <industry.icon className="w-10 h-10 text-zinc-600 mb-6 group-hover:text-white transition-colors" strokeWidth={1} />
                  <h3 className="font-['Manrope'] text-xl font-semibold text-white mb-2">
                    {industry.name}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    {industry.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Check Size */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="checksize-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-widest uppercase text-zinc-600 mb-4">
                Check Size
              </p>
              <h2 className="font-['Manrope'] text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                Investment Range
              </h2>
              <div className="space-y-6">
                <div className="border-l-2 border-white/20 pl-6">
                  <p className="font-['Manrope'] text-3xl font-bold text-white mb-2">
                    $250K – $10M
                  </p>
                  <p className="text-zinc-500">
                    Initial investment range per company
                  </p>
                </div>
                <div className="border-l-2 border-white/10 pl-6">
                  <p className="font-['Manrope'] text-xl font-semibold text-zinc-400 mb-2">
                    Follow-on Capital
                  </p>
                  <p className="text-zinc-500">
                    Reserved for high-performing portfolio companies
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-10"
            >
              <h3 className="font-['Manrope'] text-xl font-semibold text-white mb-6">
                What We Look For
              </h3>
              <ul className="space-y-4">
                {[
                  "Exceptional founding teams with domain expertise",
                  "Scalable technology with defensible moats",
                  "Large addressable market opportunities",
                  "Clear path to sustainable competitive advantage"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32" data-testid="investment-cta">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6"
            >
              Have a Bold Idea?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-xl mx-auto text-zinc-400 mb-10"
            >
              We're always looking for exceptional founders building transformative companies.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                to="/founders"
                className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="investment-cta-btn"
              >
                Submit Your Pitch
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
