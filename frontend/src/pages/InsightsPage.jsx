import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowRight, Calendar, Clock } from "lucide-react";

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

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`${API}/insights`);
        setInsights(response.data);
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const categories = ["All", ...new Set(insights.map(i => i.category))];
  
  const filteredInsights = filter === "All" 
    ? insights 
    : insights.filter(i => i.category === filter);

  const featuredInsight = insights[0];
  const restInsights = filteredInsights.slice(filter === "All" ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="insights-page">
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
              Insights
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="insights-headline"
            >
              Latest<br />
              <span className="text-zinc-500">Thinking</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              Market analysis, founder interviews, technology trends, and portfolio updates from our team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {!loading && featuredInsight && filter === "All" && (
        <section className="pb-16 md:pb-24" data-testid="featured-insight">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden card-hover"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <span className="text-6xl font-['Manrope'] font-extrabold text-zinc-700">01</span>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="text-xs tracking-widest uppercase text-zinc-600 mb-4 block">
                    {featuredInsight.category}
                  </span>
                  <h2 className="font-['Manrope'] text-3xl md:text-4xl font-semibold text-white mb-4">
                    {featuredInsight.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    {featuredInsight.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-zinc-600 mb-6">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      {featuredInsight.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} />
                      {featuredInsight.read_time}
                    </span>
                  </div>
                  <button 
                    className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
                    data-testid="read-featured-btn"
                  >
                    Read Article
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <section className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === category
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24" data-testid="insights-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
              {restInsights.map((article) => (
                <motion.article
                  key={article.id}
                  variants={fadeInUp}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 card-hover flex flex-col"
                  data-testid={`insight-card-${article.id}`}
                >
                  <span className="text-xs tracking-widest uppercase text-zinc-600 mb-4 block">
                    {article.category}
                  </span>
                  <h3 className="font-['Manrope'] text-lg font-semibold text-white mb-3 line-clamp-2 flex-grow">
                    {article.title}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-600 pt-4 border-t border-zinc-800">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.read_time}
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {!loading && restInsights.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-500">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="newsletter-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
            >
              Stay Updated
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6"
            >
              Subscribe to Our Newsletter
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-xl mx-auto text-zinc-400 mb-10"
            >
              Get our latest insights, market analysis, and portfolio updates delivered to your inbox.
            </motion.p>
            <motion.form 
              variants={fadeInUp}
              className="max-w-md mx-auto flex gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-zinc-800 rounded-full px-6 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                data-testid="newsletter-email"
              />
              <button
                type="submit"
                className="bg-white text-black rounded-full px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors"
                data-testid="newsletter-submit"
              >
                Subscribe
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
