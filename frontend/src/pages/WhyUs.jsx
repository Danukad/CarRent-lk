import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, HeartHandshake, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhyUs = () => {
  const features = [
    {
      icon: <ShieldCheck size={28} className="icon-purple" />,
      title: "Verified Hosts & Vehicles",
      desc: "Every host and vehicle is manually verified by our team to guarantee safety, quality, and a premium experience.",
      iconBg: "bg-purple-light"
    },
    {
      icon: <Zap size={28} className="icon-blue" />,
      title: "Instant Booking",
      desc: "No waiting around. Browse, select, and book your dream vehicle instantly with our streamlined process.",
      iconBg: "bg-blue-light"
    },
    {
      icon: <HeartHandshake size={28} className="icon-orange" />,
      title: "Transparent Pricing",
      desc: "What you see is what you pay. We hate hidden fees as much as you do. Everything is crystal clear from the start.",
      iconBg: "bg-orange-light"
    },
    {
      icon: <Clock size={28} className="icon-green" />,
      title: "24/7 Dedicated Support",
      desc: "On the road or anywhere else, our support team is available round-the-clock to ensure your journey is seamless.",
      iconBg: "bg-green-light"
    }
  ];

  return (
    <div className="why-us-page page">
      <div className="container">
        <motion.div 
          className="why-us-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge badge-primary mb-4">Our Promise</div>
          <h1>Why Choose <span className="text-gradient">CarRents.lk?</span></h1>
          <p className="subtitle">We're redefining the vehicle rental experience in Sri Lanka through trust, transparency, and technology.</p>
        </motion.div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`feature-icon-wrapper ${f.iconBg}`}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="cta-section glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="cta-content">
            <h2>Ready to hit the road?</h2>
            <p>Join thousands of satisfied travelers who have experienced the CarRents.lk difference.</p>
          </div>
          <div className="cta-actions">
            <Link to="/vehicles" className="btn btn-primary">
              Browse Vehicles <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .why-us-page {
          padding-top: 4rem;
        }

        .why-us-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem auto;
        }
        
        .mb-4 { margin-bottom: 1rem; }
        
        .text-gradient {
          background: var(--grad-primary);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .why-us-header h1 {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          margin-bottom: 1.25rem;
          color: var(--text);
        }

        .subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .feature-card {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--border-strong);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .feature-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        /* Re-using glass colors */
        .bg-purple-light { background: rgba(168,85,247,0.1); }
        .bg-blue-light { background: rgba(56,189,248,0.1); }
        .bg-orange-light { background: rgba(251,146,60,0.1); }
        .bg-green-light { background: rgba(74,222,128,0.1); }
        
        .icon-purple { color: #c084fc; }
        .icon-blue { color: #38bdf8; }
        .icon-orange { color: #fb923c; }
        .icon-green { color: #4ade80; }

        .feature-card h3 {
          font-size: 1.25rem;
          color: var(--text);
          font-weight: 700;
          margin: 0;
        }

        .feature-card p {
          color: var(--text-muted);
          margin: 0;
          font-size: 0.95rem;
        }

        .cta-section {
          padding: 3rem 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(124,58,237,0.05); /* Slight purple tint */
          border-color: rgba(124,58,237,0.2);
          border-radius: 1.5rem;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .cta-content h2 {
          font-size: 2rem;
          color: var(--text);
          margin: 0 0 0.5rem 0;
        }
        
        .cta-content p {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin: 0;
        }

        @media (max-width: 768px) {
          .cta-section {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
          }
          .why-us-page { padding-top: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default WhyUs;
