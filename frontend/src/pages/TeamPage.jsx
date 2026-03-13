import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Linkedin } from "lucide-react";

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

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API}/team`);
        setTeam(response.data);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const advisors = [
    { name: "Dr. James Park", title: "Board Advisor", bio: "Former CEO of a Fortune 500 tech company" },
    { name: "Maria Santos", title: "Strategic Advisor", bio: "20+ years in growth equity and private markets" },
    { name: "Robert Kim", title: "Technical Advisor", bio: "Founding engineer at two unicorn startups" }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="team-page">
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
              Our Team
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="team-headline"
            >
              The People<br />
              <span className="text-zinc-500">Behind IKTHEES</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              A team of experienced investors, operators, and advisors 
              united by a passion for backing exceptional founders.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-24 bg-[#0A0A0A]" data-testid="team-grid">
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
              Investment Team
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              Leadership
            </motion.h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-zinc-900 rounded-2xl animate-pulse" />
                    <div className="h-6 bg-zinc-900 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-zinc-900 rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {team.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={fadeInUp}
                    className="team-card group"
                    data-testid={`team-member-${member.id}`}
                  >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-zinc-900">
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover team-image"
                      />
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-['Manrope'] text-lg font-semibold text-white mb-1">
                          {member.name}
                        </h3>
                        <p className="text-zinc-500 text-sm mb-3">
                          {member.title}
                        </p>
                        <p className="text-zinc-600 text-xs leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-zinc-800 text-zinc-600 hover:text-white hover:border-zinc-600 transition-colors flex-shrink-0"
                        data-testid={`linkedin-${member.id}`}
                      >
                        <Linkedin size={16} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Advisors */}
      <section className="py-24 md:py-32" data-testid="advisors-section">
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
              Strategic Advisors
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              Advisors
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {advisors.map((advisor, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 card-hover"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                    <span className="text-2xl font-['Manrope'] font-bold text-zinc-600">
                      {advisor.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-['Manrope'] text-xl font-semibold text-white mb-1">
                    {advisor.name}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-3">
                    {advisor.title}
                  </p>
                  <p className="text-zinc-600 text-sm">
                    {advisor.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="join-section">
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
              Join Our Team
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-xl mx-auto text-zinc-400 mb-10"
            >
              We're always looking for exceptional talent to join our team. 
              If you're passionate about venture capital and technology, we'd love to hear from you.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a
                href="mailto:careers@ischus.com"
                className="inline-flex items-center justify-center bg-white text-black rounded-full px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="careers-btn"
              >
                View Open Positions
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
