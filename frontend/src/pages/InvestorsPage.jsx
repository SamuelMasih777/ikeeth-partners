import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Shield, 
  BarChart3, 
  Briefcase, 
  FileText,
  Handshake,
  TrendingUp,
  Users
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

export default function InvestorsPage() {
  const whyPartner = [
    { icon: Shield, title: "Curated Opportunities", description: "Access to a carefully vetted pipeline of high-potential startups" },
    { icon: BarChart3, title: "Experienced Leadership", description: "Investment team with decades of combined venture experience" },
    { icon: Briefcase, title: "Diversified Portfolio", description: "Exposure across multiple sectors and stages" },
    { icon: FileText, title: "Transparent Reporting", description: "Regular updates and comprehensive performance metrics" }
  ];

  const opportunities = [
    {
      title: "Direct Investments",
      description: "Co-invest alongside IKTHEES in our portfolio companies with access to the same terms and deal flow.",
      features: ["Deal-by-deal participation", "Full due diligence access", "Board observer rights available"]
    },
    {
      title: "Fund Participation",
      description: "Invest in our main fund for diversified exposure across our entire investment strategy.",
      features: ["Diversified portfolio access", "Professional fund management", "Quarterly reporting"]
    },
    {
      title: "Strategic Co-Investment",
      description: "Partner with us on specific opportunities aligned with your strategic interests.",
      features: ["Sector-specific focus", "Strategic value-add", "Customized partnership terms"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="investors-page">
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
              For Investors
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="investors-headline"
            >
              Partner With<br />
              <span className="text-zinc-500">IKTHEES</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              Join us in backing the next generation of transformative technology companies. 
              We offer multiple ways to participate in our investment strategy.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="why-partner-section">
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
              Why Partner With IKTHEES
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              Our Edge
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyPartner.map((item, index) => (
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

      {/* Investment Opportunities */}
      <section className="py-24 md:py-32" data-testid="opportunities-section">
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
              Investment Opportunities
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              Ways to Invest
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {opportunities.map((opp, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 card-hover flex flex-col"
                >
                  <span className="text-5xl font-['Manrope'] font-extrabold text-zinc-800 mb-6">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-['Manrope'] text-xl font-semibold text-white mb-3">
                    {opp.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6 flex-grow">
                    {opp.description}
                  </p>
                  <ul className="space-y-2">
                    {opp.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                        <span className="w-1 h-1 rounded-full bg-white" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Track Record */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="track-record-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-widest uppercase text-zinc-600 mb-4">
                Track Record
              </p>
              <h2 className="font-['Manrope'] text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                Proven Results
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Our disciplined approach to venture investing has delivered 
                consistent returns across market cycles. We focus on building 
                long-term value through active partnership with founders.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-['Manrope'] text-4xl font-extrabold text-white mb-2">42</p>
                  <p className="text-zinc-500 text-sm">Portfolio Companies</p>
                </div>
                <div>
                  <p className="font-['Manrope'] text-4xl font-extrabold text-white mb-2">$850M</p>
                  <p className="text-zinc-500 text-sm">Capital Deployed</p>
                </div>
                <div>
                  <p className="font-['Manrope'] text-4xl font-extrabold text-white mb-2">6</p>
                  <p className="text-zinc-500 text-sm">Successful Exits</p>
                </div>
                <div>
                  <p className="font-['Manrope'] text-4xl font-extrabold text-white mb-2">3.2x</p>
                  <p className="text-zinc-500 text-sm">Average MOIC</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: Handshake, label: "LP Relationships" },
                { icon: TrendingUp, label: "Consistent Returns" },
                { icon: Users, label: "Founder Network" },
                { icon: Shield, label: "Risk Management" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-center"
                >
                  <item.icon className="w-8 h-8 text-zinc-600 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-zinc-400 text-sm">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32" data-testid="investors-cta">
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
              Let's Connect
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-xl mx-auto text-zinc-400 mb-10"
            >
              Interested in learning more about investment opportunities with IKTHEES? 
              We'd love to discuss how we can work together.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="investors-contact-btn"
              >
                Get in Touch
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
