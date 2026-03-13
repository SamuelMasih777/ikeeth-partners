import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Globe, Briefcase } from "lucide-react";
import axios from "axios";

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

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, portfolioRes, insightsRes] = await Promise.all([
          axios.get(`${API}/stats`),
          axios.get(`${API}/portfolio`),
          axios.get(`${API}/insights`)
        ]);
        setStats(statsRes.data);
        setPortfolio(portfolioRes.data.slice(0, 4));
        setInsights(insightsRes.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const statItems = stats ? [
    { icon: Briefcase, value: stats.portfolio_companies, label: "Portfolio Companies" },
    { icon: TrendingUp, value: stats.capital_deployed, label: "Capital Deployed" },
    { icon: Users, value: stats.industries, label: "Industries" },
    { icon: Globe, value: stats.countries, label: "Countries" }
  ] : [];

  const sectorColors = {
    "Artificial Intelligence": "portfolio-ai",
    "Fintech": "portfolio-fintech",
    "Climate Tech": "portfolio-climate",
    "Healthcare": "portfolio-healthcare",
    "Enterprise Software": "portfolio-enterprise",
    "Biotech": "portfolio-biotech"
  };

  return (
    <div className="min-h-screen bg-[#030303]" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1771694093788-a0a8ecb87d02?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwZnV0dXJpc3RpYyUyMGFyY2hpdGVjdHVyZSUyMHNreXNjcmFwZXIlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fHx8MTc3MzQxMzYzOXww&ixlib=rb-4.1.0&q=85"
            alt="Hero background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Radial Glow */}
        <div className="absolute inset-0 hero-glow" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-widest uppercase text-zinc-500"
            >
              Venture Capital
            </motion.p>

            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] text-white"
              data-testid="hero-headline"
            >
              Backing Visionary<br />
              <span className="text-gradient">Founders</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed"
              data-testid="hero-subheadline"
            >
              IKTHEES PARTNERS is a venture capital firm investing in bold ideas, 
              transformative technologies, and the founders shaping the future.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link
                to="/founders"
                className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="hero-cta-founders"
              >
                Submit Your Pitch
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/investors"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-zinc-800 text-white rounded-full px-8 py-4 font-semibold transition-all hover:border-zinc-600 hover:bg-zinc-900"
                data-testid="hero-cta-investors"
              >
                Partner With Us
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-zinc-600 to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-24 md:py-32 border-t border-zinc-900" data-testid="stats-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {statItems.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-zinc-600 mx-auto mb-4" />
                  <p className="font-['Manrope'] text-4xl md:text-5xl font-extrabold text-white mb-2 stat-number">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Key Highlights */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="highlights-section">
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
              Why IKTHEES
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              Our Approach
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Early-Stage & Growth Investments",
                  description: "We invest across stages, from pre-seed to growth, partnering with founders at pivotal moments."
                },
                {
                  title: "Founder-First Approach",
                  description: "We believe in empowering founders with capital, expertise, and a network to build category-defining companies."
                },
                {
                  title: "Global Opportunity Focus",
                  description: "We identify transformative opportunities across markets, backing innovation wherever it emerges."
                },
                {
                  title: "Strategic Capital + Support",
                  description: "Beyond capital, we provide operational guidance, hiring support, and go-to-market strategy."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 card-hover"
                >
                  <h3 className="font-['Manrope'] text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Preview */}
      {portfolio.length > 0 && (
        <section className="py-24 md:py-32" data-testid="portfolio-preview">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="flex justify-between items-end mb-16">
                <div>
                  <motion.p 
                    variants={fadeInUp}
                    className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
                  >
                    Portfolio
                  </motion.p>
                  <motion.h2 
                    variants={fadeInUp}
                    className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white"
                  >
                    Featured Companies
                  </motion.h2>
                </div>
                <motion.div variants={fadeInUp}>
                  <Link
                    to="/portfolio"
                    className="hidden md:inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    data-testid="view-all-portfolio"
                  >
                    View All
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.map((company, index) => (
                  <motion.div
                    key={company.id}
                    variants={fadeInUp}
                    className={`${sectorColors[company.sector] || "bg-zinc-900"} rounded-2xl p-8 card-hover min-h-[200px] flex flex-col justify-between`}
                  >
                    <div>
                      <span className="text-xs tracking-widest uppercase text-white/50 mb-2 block">
                        {company.sector}
                      </span>
                      <h3 className="font-['Manrope'] text-2xl font-semibold text-white mb-3">
                        {company.name}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {company.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <span className="text-xs text-white/50">{company.stage} • {company.year}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp} className="mt-8 md:hidden">
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  View All Portfolio
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Insights Preview */}
      {insights.length > 0 && (
        <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="insights-preview">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="flex justify-between items-end mb-16">
                <div>
                  <motion.p 
                    variants={fadeInUp}
                    className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
                  >
                    Insights
                  </motion.p>
                  <motion.h2 
                    variants={fadeInUp}
                    className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white"
                  >
                    Latest Thinking
                  </motion.h2>
                </div>
                <motion.div variants={fadeInUp}>
                  <Link
                    to="/insights"
                    className="hidden md:inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    data-testid="view-all-insights"
                  >
                    View All
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((article) => (
                  <motion.article
                    key={article.id}
                    variants={fadeInUp}
                    className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 card-hover"
                  >
                    <span className="text-xs tracking-widest uppercase text-zinc-600 mb-4 block">
                      {article.category}
                    </span>
                    <h3 className="font-['Manrope'] text-lg font-semibold text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-zinc-600">
                      <span>{article.date}</span>
                      <span>{article.read_time}</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6"
            >
              Ready to Build the Future?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-xl mx-auto text-zinc-400 mb-10"
            >
              Whether you're a founder with a bold vision or an investor seeking transformative opportunities, we'd love to hear from you.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/founders"
                className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="cta-founders-btn"
              >
                For Founders
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/investors"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-zinc-800 text-white rounded-full px-8 py-4 font-semibold transition-all hover:border-zinc-600 hover:bg-zinc-900"
                data-testid="cta-investors-btn"
              >
                For Investors
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
