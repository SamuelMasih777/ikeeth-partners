import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`${API}/portfolio`);
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const sectors = ["All", ...new Set(portfolio.map(c => c.sector))];
  
  const filteredPortfolio = filter === "All" 
    ? portfolio 
    : portfolio.filter(c => c.sector === filter);

  const sectorColors = {
    "Artificial Intelligence": "portfolio-ai",
    "Fintech": "portfolio-fintech",
    "Climate Tech": "portfolio-climate",
    "Healthcare": "portfolio-healthcare",
    "Enterprise Software": "portfolio-enterprise",
    "Biotech": "portfolio-biotech"
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="portfolio-page">
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
              Portfolio
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="portfolio-headline"
            >
              Our<br />
              <span className="text-zinc-500">Companies</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              We partner with exceptional founders building category-defining 
              companies across technology sectors.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setFilter(sector)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === sector
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                data-testid={`filter-${sector.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24" data-testid="portfolio-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-zinc-900/30 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPortfolio.map((company) => (
                <motion.div
                  key={company.id}
                  variants={fadeInUp}
                  layout
                  className={`${sectorColors[company.sector] || "bg-zinc-900"} rounded-2xl p-8 card-hover min-h-[240px] flex flex-col justify-between`}
                  data-testid={`portfolio-card-${company.id}`}
                >
                  <div>
                    <span className="text-xs tracking-widest uppercase text-white/50 mb-3 block">
                      {company.sector}
                    </span>
                    <h3 className="font-['Manrope'] text-2xl font-semibold text-white mb-3">
                      {company.name}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {company.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs text-white/50">{company.stage}</span>
                    <span className="text-xs text-white/50">{company.year}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && filteredPortfolio.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-500">No companies found in this sector.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 md:py-24 bg-[#0A0A0A]" data-testid="portfolio-stats">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "42", label: "Portfolio Companies" },
              { value: "$850M+", label: "Capital Deployed" },
              { value: "8", label: "Industries" },
              { value: "12", label: "Countries" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="font-['Manrope'] text-4xl md:text-5xl font-extrabold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
