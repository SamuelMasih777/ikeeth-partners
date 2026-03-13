import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { MapPin, Mail, CheckCircle2 } from "lucide-react";

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

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiry_type: "",
    message: ""
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
      await axios.post(`${API}/contact`, formData);
      setSubmitted(true);
      toast.success("Message sent successfully! We'll be in touch.");
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      content: "Houston, Texas",
      sub: "United States"
    },
    {
      icon: Mail,
      title: "General Inquiries",
      content: "contact@ischus.com",
      link: "mailto:contact@ischus.com"
    }
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "founder", label: "Founder Inquiry" },
    { value: "investor", label: "Investor Relations" },
    { value: "media", label: "Media & Press" }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-20" data-testid="contact-page">
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
              Contact
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="font-['Manrope'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-white mb-8"
              data-testid="contact-headline"
            >
              Get In<br />
              <span className="text-zinc-500">Touch</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              Have a question or want to learn more about IKTHEES? 
              We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24 bg-[#0A0A0A]" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-widest uppercase text-zinc-600 mb-8">
                Contact Information
              </p>

              <div className="space-y-8 mb-12">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">
                        {info.title}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-white hover:text-zinc-400 transition-colors"
                          data-testid={`contact-${info.title.toLowerCase().replace(' ', '-')}`}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-white">{info.content}</p>
                      )}
                      {info.sub && <p className="text-zinc-600 text-sm">{info.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-8">
                <h3 className="font-['Manrope'] text-lg font-semibold text-white mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/founders" className="text-zinc-400 hover:text-white transition-colors text-sm">
                      Submit a Pitch →
                    </a>
                  </li>
                  <li>
                    <a href="/investors" className="text-zinc-400 hover:text-white transition-colors text-sm">
                      Investor Inquiries →
                    </a>
                  </li>
                  <li>
                    <a href="mailto:media@ischus.com" className="text-zinc-400 hover:text-white transition-colors text-sm">
                      Media & Press →
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
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
                    Message Sent!
                  </h3>
                  <p className="text-zinc-400">
                    Thank you for reaching out. Our team will review your message 
                    and get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700"
                        placeholder="Your name"
                        data-testid="contact-name"
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
                        data-testid="contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700"
                        placeholder="Your company"
                        data-testid="contact-company"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                        Inquiry Type *
                      </label>
                      <select
                        name="inquiry_type"
                        value={formData.inquiry_type}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors"
                        data-testid="contact-inquiry-type"
                      >
                        <option value="" className="bg-zinc-900">Select type</option>
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value} className="bg-zinc-900">
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-white text-white px-0 py-4 outline-none transition-colors placeholder:text-zinc-700 resize-none"
                      placeholder="How can we help you?"
                      data-testid="contact-message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black rounded-full px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    data-testid="contact-submit-btn"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-24 md:py-32" data-testid="location-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-widest uppercase text-zinc-600 mb-4"
            >
              Our Location
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-['Manrope'] text-4xl md:text-5xl font-semibold tracking-tight text-white mb-12"
            >
              Houston, Texas
            </motion.h2>
            <motion.div 
              variants={fadeInUp}
              className="aspect-[21/9] rounded-2xl overflow-hidden bg-zinc-900/30 border border-white/5"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">Houston, Texas</p>
                  <p className="text-zinc-600 text-sm">United States</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
