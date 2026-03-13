import { motion } from "framer-motion";
import { Target, Handshake, LineChart, Leaf } from "lucide-react";

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

export default function AboutPage() {
  const philosophyItems = [
    {
      icon: Handshake,
      title: "Long-term Partnerships",
      description: "We build lasting relationships with founders, prioritizing sustainable growth over short-term gains."
    },
    {
      icon: Target,
      title: "Deep Collaboration",
      description: "We work alongside our portfolio companies, providing hands-on support and strategic guidance."
    },
    {
      icon: LineChart,
      title: "Data-Driven Strategy",
      description: "Our investment decisions are backed by rigorous analysis and market intelligence."
    },
    {
      icon: Leaf,
      title: "Responsible Growth",
      description: "We believe in building companies that create lasting value for all stakeholders."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="about-page">
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
              About Us
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="about-headline"
            >
              Building the Future,<br />
              <span className="text-zinc-500">Together</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              IKTHEES PARTNERS was founded to bridge capital, expertise, and innovation. 
              We work closely with entrepreneurs to help scale breakthrough companies 
              from idea to global impact.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="mission-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-widest uppercase text-zinc-600 mb-4">
                Our Mission
              </p>
              <h2 className="font-['Manrope'] text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                Empowering Visionary Founders
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Our mission is to identify and support visionary founders building 
                category-defining companies that solve meaningful global challenges.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                We believe that the most transformative companies are built by founders 
                who see the world differently and have the conviction to pursue bold ideas. 
                Our role is to provide the capital, expertise, and network they need to 
                turn their vision into reality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1765481496225-fd8d74cd22e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwZnV0dXJpc3RpYyUyMGFyY2hpdGVjdHVyZSUyMHNreXNjcmFwZXIlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fHx8MTc3MzQxMzYzOXww&ixlib=rb-4.1.0&q=85"
                  alt="Mission"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32" data-testid="philosophy-section">
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
              Our Philosophy
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              How We Think
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {philosophyItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 card-hover"
                >
                  <item.icon className="w-8 h-8 text-white mb-6" strokeWidth={1} />
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

      {/* Story Section */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="story-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
            >
              Our Story
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-8"
            >
              From Vision to Impact
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6 text-zinc-400 leading-relaxed">
              <p>
                IKTHEES PARTNERS was founded with a singular vision: to bridge the gap between 
                exceptional founders and the resources they need to build transformative companies.
              </p>
              <p>
                Based in Houston, Texas, we've assembled a team of experienced investors, 
                operators, and advisors who share a passion for backing bold ideas. Our 
                diverse backgrounds span technology, finance, and entrepreneurship, giving 
                us unique insights into what it takes to build successful companies.
              </p>
              <p>
                Today, we partner with founders across artificial intelligence, fintech, 
                climate tech, healthcare, and enterprise software. We're proud of the 
                companies we've backed and the impact they're creating in the world.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 md:py-32" data-testid="values-section">
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
              Our Values
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-6xl font-semibold tracking-tight text-white mb-16"
            >
              What Drives Us
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 rounded-2xl overflow-hidden">
              {[
                { number: "01", title: "Conviction", text: "We back founders with unwavering belief in their vision." },
                { number: "02", title: "Integrity", text: "We operate with transparency and build trust through action." },
                { number: "03", title: "Excellence", text: "We pursue the highest standards in everything we do." }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-[#0A0A0A] p-10"
                >
                  <span className="text-6xl font-['Manrope'] font-extrabold text-zinc-900">
                    {value.number}
                  </span>
                  <h3 className="font-['Manrope'] text-2xl font-semibold text-white mt-4 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-zinc-500">
                    {value.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
