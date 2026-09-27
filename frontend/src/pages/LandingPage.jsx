import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../config";
import Hero from "../components/Hero";
import VehicleCard from "../components/VehicleCard";
import {
  ShieldCheck,
  HeartHandshake,
  Clock,
  Car,
  Truck,
  Zap,
  Star,
  Quote,
  ArrowRight,
  ChevronRight,
  Search,
  CalendarCheck,
  KeyRound,
  ThumbsUp,
  Users,
  Fuel,
} from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";

import thivinaImg from "../assets/images/thivina.png";
import punsaraImg from "../assets/images/punsara.png";
import nirmalImg from "../assets/images/nirmal.png";

const categories = [
  {
    id: "suv",
    label: "SUV & 4x4",
    vehicleType: "premium-car",
    icon: Truck,
    image: "/assets/images/suv_category.jpg",
  },
  {
    id: "sedan",
    label: "Sedan & Cars",
    vehicleType: "car",
    icon: Car,
    image: "/assets/images/sedan_category.jpg",
  },
  {
    id: "luxury",
    label: "Luxury",
    vehicleType: "premium-car",
    icon: Star,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "mini-car",
    label: "Mini Cars",
    vehicleType: "mini-car",
    icon: Car,
    image: "/assets/images/electric_category.jpg",
  },
  {
    id: "van",
    label: "Vans & Groups",
    vehicleType: "van",
    icon: Truck,
    image: "/assets/images/van_category.jpg",
  },
  {
    id: "threewheeler",
    label: "Three-Wheelers",
    vehicleType: "threewheeler",
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400",
  },
];

const testimonials = [
  {
    name: "Thivina pehasara",
    location: "Colombo",
    rating: 5,
    text: "Booked a Toyota Fortuner for our family trip to Ella. Smooth process, verified host, and the car was spotless. Will definitely use again!",
    avatar: thivinaImg,
  },
  {
    name: "Punsara Rajapaksa",
    location: "Kandy",
    rating: 5,
    text: "As a tourist, Yamu Car Rentals made renting so easy. Transparent pricing, no hidden fees, and 24/7 support when I had a question.",
    avatar: punsaraImg,
  },
  {
    name: "Nirmal Perera",
    location: "Galle",
    rating: 5,
    text: "I listed my car and started earning within a week. The platform handles everything — verification, bookings, payments. Highly recommend!",
    avatar: nirmalImg,
  },
];

const steps = [
  {
    num: "01",
    title: "Browse & Select",
    desc: "Explore verified vehicles across Sri Lanka with smart filters.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=300",
  },
  {
    num: "02",
    title: "Book Instantly",
    desc: "Pick your dates and confirm your booking in seconds.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=300",
  },
  {
    num: "03",
    title: "Pick Up & Drive",
    desc: "Meet your host, grab the keys, and hit the road.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=300",
  },
  {
    num: "04",
    title: "Return & Rate",
    desc: "Return the car and share your experience with the community.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=300",
  },
];

const resolveTestimonialAvatar = (t) => {
  if (t?.avatar && typeof t.avatar === "string") {
    if (t.avatar.includes("thivina") || t.name?.toLowerCase().includes("thivina")) return thivinaImg;
    if (t.avatar.includes("punsara") || t.name?.toLowerCase().includes("punsara")) return punsaraImg;
    if (t.avatar.includes("nirmal") || t.name?.toLowerCase().includes("nirmal")) return nirmalImg;
    if (t.avatar.startsWith("http://") || t.avatar.startsWith("https://") || t.avatar.startsWith("/")) {
      return t.avatar;
    }
  }
  if (t?.avatar && typeof t.avatar !== "string") {
    return t.avatar;
  }
  if (t?.name?.toLowerCase().includes("thivina")) return thivinaImg;
  if (t?.name?.toLowerCase().includes("punsara")) return punsaraImg;
  if (t?.name?.toLowerCase().includes("nirmal")) return nirmalImg;
  return thivinaImg;
};

const LandingPage = () => {
  const { config } = useSiteConfig();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategories = config?.home?.categories || categories;
  const isDefaultOldMock =
    config?.home?.testimonials?.length === 3 &&
    config.home.testimonials.some((t) => t.name === "Sarah Mitchell" || t.name === "Kasun Silva");

  const activeTestimonials =
    !isDefaultOldMock && config?.home?.testimonials?.length
      ? config.home.testimonials
      : testimonials;

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const listTarget =
    user?.role === "company"
      ? "/company-list-vehicle"
      : user?.role === "owner"
      ? "/list-my-car"
      : "/choose-listing-type";

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/vehicles`);
        const allCars = Array.isArray(response.data) ? response.data : [];
        // Prioritize isFeatured: true first, then newest first
        const sorted = [...allCars].sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
        // Display top 8 vehicles on Home Page
        setFeaturedCars(sorted.slice(0, 8));
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="landing-page">
      <Hero />

      {/* Featured Listings */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-badge">Popular Rentals</span>
              <h2 className="section-title">
                Featured <span className="text-gradient">Listings</span>
              </h2>
              <p className="section-subtitle">
                Hand-picked verified vehicles from our top-rated hosts
              </p>
            </div>
            <Link to="/vehicles" className="view-all-link">
              View All Vehicles <ArrowRight size={18} />
            </Link>
          </div>

          <div className="vehicle-grid">
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading vehicles...</p>
              </div>
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car, i) => (
                <VehicleCard key={car._id} vehicle={car} index={i} />
              ))
            ) : (
              <div className="empty-state">
                <Car size={40} />
                <h3>No vehicles yet</h3>
                <p>Be the first to list your car!</p>
                <Link to={listTarget} className="btn btn-primary">
                  List Your Vehicle
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="section category-section">
        <div className="container">
          <div className="category-layout">
            <div className="category-info">
              <span className="section-badge light">Browse by Category</span>
              <h2 className="section-title light">
                Find the perfect ride for every journey
              </h2>
              <p className="category-desc">
                From city sedans to rugged SUVs and luxury coupes — filter by
                body type and find exactly what you need.
              </p>
              <Link to="/vehicles" className="category-cta">
                View All Categories <ChevronRight size={18} />
              </Link>
            </div>
            <div className="category-grid">
              {activeCategories.map((cat, i) => (
                <motion.div
                  key={cat.id || i}
                  className="category-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/vehicles?type=${cat.vehicleType || cat.id || ""}`}>
                    <div className="category-img-wrap">
                      <img src={cat.image} alt={cat.label} />
                      <div className="category-overlay" />
                    </div>
                    <div className="category-label">
                      <Car size={20} />
                      <span>{cat.label}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="section steps-section">
        <div className="container">

          <div className="hiw-layout">
            {/* Left visual */}
            <motion.div
              className="hiw-visual"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="hiw-img-stack blue-theme">
                <div className="hiw-hero-content">
                  <div className="hiw-hero-badge">SIMPLE STEPS</div>
                  <h3 className="hiw-hero-title">How it<br/>works</h3>
                  <p className="hiw-hero-subtitle">
                    From browsing to driving in four steps. Renting a car has never been this straightforward.
                  </p>
                </div>

                <div className="hiw-mockups">
                  <div className="hiw-laptop-mockup">
                    <div className="hiw-laptop-screen">
                      <div className="hiw-laptop-notch"></div>
                      <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600" alt="App preview laptop" />
                    </div>
                    <div className="hiw-laptop-base">
                      <div className="hiw-laptop-trackpad"></div>
                    </div>
                  </div>

                  <div className="hiw-phone-mockup">
                    <div className="hiw-phone-notch"></div>
                    <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400" alt="App preview phone" />
                  </div>
                </div>

                <div className="hiw-glass-stats">
                  <div className="hiw-stat">
                    <span className="hiw-stat-val">200+</span>
                    <span className="hiw-stat-label">CARS</span>
                  </div>
                  <div className="hiw-stat">
                    <span className="hiw-stat-val">2</span>
                    <span className="hiw-stat-label">MINS</span>
                  </div>
                  <div className="hiw-stat">
                    <span className="hiw-stat-val">24/7</span>
                    <span className="hiw-stat-label">SUPPORT</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right steps timeline */}
            <div className="hiw-steps">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="hiw-step"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <div className="hiw-step-left">
                    <div className={`hiw-step-icon hiw-icon-${i}`}>
                      {i === 0 && <Search size={20} />}
                      {i === 1 && <CalendarCheck size={20} />}
                      {i === 2 && <KeyRound size={20} />}
                      {i === 3 && <ThumbsUp size={20} />}
                    </div>
                    {i < steps.length - 1 && <div className="hiw-connector" />}
                  </div>
                  <div className="hiw-step-body">
                    <h3 className="hiw-step-title">{step.title}</h3>
                    <p className="hiw-step-desc">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="section why-section">
        <div className="container">
          <div className="why-layout">
            <motion.div
              className="why-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">Why Yamu Car Rentals?</span>
              <h2 className="section-title">
                The most trusted car sharing marketplace in{" "}
                <span className="text-gradient">Sri Lanka</span>
              </h2>

              <ul className="benefits-list">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Fully Insured",
                    desc: "Every trip covered by comprehensive insurance.",
                  },
                  {
                    icon: HeartHandshake,
                    title: "Verified Hosts",
                    desc: "Every host and vehicle manually verified.",
                  },
                  {
                    icon: Clock,
                    title: "24/7 Support",
                    desc: "Dedicated support team always here to help.",
                  },
                ].map((b, i) => (
                  <li key={i}>
                    <div className="benefit-icon">
                      <b.icon size={22} />
                    </div>
                    <div>
                      <h4>{b.title}</h4>
                      <p>{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link to="/why-us" className="why-link">
                Learn more about us <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              className="why-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/assets/images/why_us_colombo.jpg"
                alt="Colombo Sri Lanka Skyline and Travel"
                className="why-img"
              />
              <div className="trust-card">
                <div className="trust-stat">
                  <span className="stat-number">5,000+</span>
                  <span className="stat-label">Happy Renters</span>
                </div>
                <div className="trust-divider" />
                <div className="trust-stat">
                  <span className="stat-number">4.9/5</span>
                  <span className="stat-label">Avg. Rating</span>
                </div>
                <div className="trust-divider" />
                <div className="trust-stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Verified Hosts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">
              What our <span className="text-gradient">customers say</span>
            </h2>
          </div>

          <div className="testimonials-grid">
            {activeTestimonials.map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Quote size={28} className="quote-icon" />
                <div className="stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="#f97316" color="#f97316" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={resolveTestimonialAvatar(t)} alt={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="section deals-section">
        <div className="container">
          <div className="deals-grid">
            <div className="deal-card deal-weekly">
              <div className="deal-content">
                <span className="deal-tag">Weekly Special</span>
                <h3>Save 20% on weekly rentals</h3>
                <p>
                  Book any vehicle for 7+ days and unlock exclusive savings.
                </p>
                <Link to="/vehicles" className="deal-btn">
                  Grab Deal
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=400"
                alt="Weekly deal"
              />
            </div>
            <div className="deal-card deal-weekend">
              <div className="deal-content">
                <span className="deal-tag">Weekend Discount</span>
                <h3>Weekend getaways from LKR 3,500/day</h3>
                <p>Perfect for short trips — explore the island affordably.</p>
                <Link to="/vehicles" className="deal-btn">
                  Grab Deal
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=400"
                alt="Weekend deal"
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          position: relative;
          background: linear-gradient(180deg, #fffcf7 0%, #fff7ec 60%, #fff4e0 100%);
        }

        .section {
          padding: 5.5rem 0;
          position: relative;
        }

        #how-it-works {
          scroll-margin-top: 100px;
        }

        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .section-header.center {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 0.75rem;
        }

        .section-subtitle {
          font-size: 1.05rem;
          color: var(--text-muted);
          max-width: 520px;
          line-height: 1.8;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #ea580c;
          background: #fff7ed;
          border: 1.5px solid rgba(249, 115, 22, 0.25);
          padding: 0.55rem 1.25rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.9rem;
          white-space: nowrap;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .view-all-link:hover {
          background: linear-gradient(135deg, #ff8800 0%, #ea580c 100%);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(249, 115, 22, 0.35);
          gap: 0.75rem;
        }

        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.75rem;
        }

        .loading-state,
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1rem;
          color: var(--text-muted);
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(249, 115, 22, 0.15);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .empty-state h3 {
          color: var(--text);
        }

        .empty-state .btn {
          width: auto;
          margin-top: 0.5rem;
        }

        /* Category Section */
        .category-section {
          background: var(--grad-dark);
          padding: 5rem 0;
        }

        .category-layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 3rem;
          align-items: center;
        }

        .section-badge.light {
          background: rgba(249, 115, 22, 0.15);
          color: var(--primary-light);
          border-color: rgba(249, 115, 22, 0.25);
        }

        .section-title.light {
          color: white;
        }

        .category-desc {
          color: #a8a29e;
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 1rem 0 2rem;
        }

        .category-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          font-weight: 700;
          padding: 0.85rem 1.75rem;
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          border: none;
          border-radius: var(--radius-pill);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px -4px rgba(249, 115, 22, 0.45);
        }

        .category-cta:hover {
          background: linear-gradient(135deg, #ff9500 0%, #ea580c 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -4px rgba(234, 88, 12, 0.55);
          color: #ffffff;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .category-card a {
          display: block;
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          aspect-ratio: 1;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .category-card a:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px -8px rgba(249, 115, 22, 0.25);
        }

        .category-img-wrap {
          position: absolute;
          inset: 0;
        }

        .category-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .category-card:hover img {
          transform: scale(1.08);
        }

        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(15, 23, 42, 0.85) 0%,
            rgba(15, 23, 42, 0.3) 55%,
            transparent 100%
          );
        }

        .category-label {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          z-index: 2;
        }

        /* Steps - New Two-Column Timeline Layout */
        .steps-section {
          background: #fdfbf7;
        }

        .hiw-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
          margin-top: 3.5rem;
        }

        /* Left Visual */
        .hiw-visual {
          position: relative;
        }

        .hiw-img-stack.blue-theme {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 480px;
          height: 600px;
          margin: 0 auto;
          border-radius: 28px;
          overflow: hidden;
          background: radial-gradient(circle at 50% 30%, #ff8800 0%, #f97316 35%, #ea580c 75%, #c2410c 100%);
          box-shadow: 0 24px 60px rgba(249, 115, 22, 0.32);
          padding-top: 3rem;
        }

        .hiw-hero-content {
          text-align: center;
          padding: 0 2rem;
          z-index: 2;
        }

        .hiw-hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.25);
          color: white;
          padding: 0.35rem 1.1rem;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .hiw-hero-title {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 900;
          color: white;
          margin: 0 0 1rem;
          line-height: 1.05;
          letter-spacing: -1px;
        }

        .hiw-hero-subtitle {
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
          font-weight: 500;
        }

        .hiw-mockups {
          position: relative;
          width: 100%;
          height: 300px;
          margin-top: 2rem;
          display: flex;
          justify-content: center;
        }

        .hiw-laptop-mockup {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-55%);
          width: 340px;
          z-index: 1;
        }

        .hiw-laptop-screen {
          width: 100%;
          height: 220px;
          background: #111;
          border-radius: 12px 12px 0 0;
          padding: 8px 8px 0 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          position: relative;
        }

        .hiw-laptop-notch {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 12px;
          background: #111;
          border-radius: 0 0 6px 6px;
          z-index: 2;
        }

        .hiw-laptop-screen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px 6px 0 0;
        }

        .hiw-laptop-base {
          width: 112%;
          height: 14px;
          background: #333;
          border-radius: 0 0 16px 16px;
          margin-left: -6%;
          position: relative;
          display: flex;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .hiw-laptop-trackpad {
          width: 50px;
          height: 6px;
          background: #222;
          border-radius: 0 0 4px 4px;
        }

        .hiw-phone-mockup {
          position: absolute;
          bottom: 30px;
          right: 30px;
          width: 130px;
          height: 260px;
          background: #111;
          border-radius: 20px 20px 0 0;
          padding: 8px 8px 0 8px;
          box-shadow: -10px 10px 40px rgba(0,0,0,0.4);
          z-index: 2;
        }

        .hiw-phone-notch {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 12px;
          background: #111;
          border-radius: 0 0 6px 6px;
          z-index: 2;
        }

        .hiw-phone-mockup img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px 12px 0 0;
        }

        .hiw-glass-stats {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          display: flex;
          justify-content: space-between;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 16px;
          padding: 1.25rem 0.5rem;
          z-index: 3;
        }

        .hiw-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          border-right: 1px solid rgba(255,255,255,0.25);
        }
        
        .hiw-stat:last-child {
          border-right: none;
        }

        .hiw-stat-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          line-height: 1.2;
        }
        
        .hiw-stat-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.3rem;
        }

        /* Right Steps Timeline */
        .hiw-steps {
          display: flex;
          flex-direction: column;
        }

        .hiw-step {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .hiw-step-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .hiw-step-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          color: #ea580c;
          border: 1.5px solid rgba(249, 115, 22, 0.25);
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.12);
        }

        .hiw-step:hover .hiw-step-icon {
          transform: scale(1.1);
          background: linear-gradient(135deg, #ff8800 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(249, 115, 22, 0.4);
        }

        .hiw-icon-0,
        .hiw-icon-1,
        .hiw-icon-2,
        .hiw-icon-3 {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          color: #ea580c;
          border: 1.5px solid rgba(249, 115, 22, 0.25);
        }

        .hiw-connector {
          width: 2px;
          flex-grow: 1;
          min-height: 36px;
          background: linear-gradient(to bottom, rgba(249, 115, 22, 0.3) 0%, transparent 100%);
          margin: 6px 0;
        }

        .hiw-step-body {
          padding-bottom: 2.25rem;
        }

        .hiw-step-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.35rem;
          line-height: 1.3;
        }

        .hiw-step-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.65;
          margin: 0;
        }

        @media (max-width: 860px) {
          .hiw-layout {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .hiw-main-img {
            max-width: 100%;
            height: 380px;
          }
        }

        /* Why Us */
        .why-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .benefits-list {
          list-style: none;
          margin: 2rem 0;
        }

        .benefits-list li {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .benefit-icon {
          width: 52px;
          height: 52px;
          background: var(--primary-soft);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--primary);
          border: 1px solid rgba(249, 115, 22, 0.15);
          transition: all 0.3s ease;
        }

        .benefits-list li:hover .benefit-icon {
          background: var(--primary);
          color: white;
          transform: scale(1.08);
        }

        .benefits-list h4 {
          font-family: var(--font-body);
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }

        .benefits-list p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .why-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--primary);
          font-weight: 700;
          transition: gap 0.25s ease;
        }

        .why-link:hover {
          gap: 0.65rem;
        }

        .why-visual {
          position: relative;
        }

        .why-img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          object-position: center 30%;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
        }

        .trust-card {
          position: absolute;
          bottom: -2rem;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem 2rem;
          display: flex;
          gap: 2rem;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
          border: 1px solid var(--border);
          white-space: nowrap;
        }

        .trust-stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .trust-divider {
          width: 1px;
          background: var(--border);
        }

        /* Testimonials */
        .testimonials-section {
          background: white;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .testimonial-card {
          background: var(--bg);
          border-radius: var(--radius-lg);
          padding: 2rem;
          border: 1px solid var(--border);
          transition: all 0.35s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
          border-color: rgba(249, 115, 22, 0.15);
        }

        .quote-icon {
          color: var(--primary);
          opacity: 0.4;
          margin-bottom: 0.75rem;
        }

        .stars {
          display: flex;
          gap: 2px;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .testimonial-author img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-soft);
        }

        .testimonial-author strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text);
        }

        .testimonial-author span {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* Deals */
        .deals-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .deal-card {
          display: flex;
          align-items: center;
          border-radius: var(--radius-xl);
          overflow: hidden;
          min-height: 220px;
          position: relative;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .deal-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
        }

        .deal-weekly {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid rgba(249, 115, 22, 0.15);
        }

        .deal-weekend {
          background: linear-gradient(135deg, #1c1917 0%, #292524 100%);
        }

        .deal-content {
          flex: 1;
          padding: 2rem;
          z-index: 2;
        }

        .deal-tag {
          display: inline-block;
          background: var(--primary);
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-pill);
          margin-bottom: 0.75rem;
        }

        .deal-weekend .deal-tag {
          background: rgba(249, 115, 22, 0.2);
          color: var(--primary-light);
        }

        .deal-content h3 {
          font-family: var(--font-display);
          font-size: 1.45rem;
          margin-bottom: 0.75rem;
          line-height: 1.15;
        }

        .deal-weekend h3 {
          color: white;
        }

        .deal-content p {
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.7;
          color: var(--text-muted);
        }

        .deal-weekend p {
          color: #c7c1b4;
        }

        .deal-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.85rem 1.6rem;
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 20px -2px rgba(249, 115, 22, 0.4);
          text-decoration: none;
        }

        .deal-btn:hover {
          background: linear-gradient(135deg, #ff9500 0%, #ea580c 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -2px rgba(234, 88, 12, 0.55);
          color: white;
        }

        .deal-card img {
          width: 45%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          mask-image: linear-gradient(to right, transparent, black 30%);
          -webkit-mask-image: linear-gradient(to right, transparent, black 30%);
        }

        @media (max-width: 1024px) {
          .category-layout,
          .why-layout {
            grid-template-columns: 1fr;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .section {
            padding: 3.5rem 0;
          }
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .steps-grid {
            grid-template-columns: 1fr;
          }
          .deals-grid {
            grid-template-columns: 1fr;
          }
          .trust-card {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            margin-top: -2rem;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
        }

        @media (max-width: 640px) {
          .category-grid {
            grid-template-columns: 1fr;
          }
          .deal-card {
            flex-direction: column;
            min-height: auto;
          }
          .deal-card img {
            position: relative;
            width: 100%;
            height: 220px;
            mask-image: none;
            -webkit-mask-image: none;
          }
          .deal-content {
            padding: 1.5rem;
          }
          .section-header-row {
            align-items: flex-start;
          }
          .section-title {
            font-size: clamp(1.7rem, 6vw, 2.25rem);
          }
        }

        .benefits-list h4 {
          font-family: var(--font-body);
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }

        .benefits-list p {
          font-size: 0.9rem;
        }

        .why-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--primary);
          font-weight: 700;
          transition: gap 0.25s ease;
        }

        .why-link:hover {
          gap: 0.65rem;
        }

        .why-visual {
          position: relative;
        }

        .why-img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
        }

        .trust-card {
          position: absolute;
          bottom: -2rem;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem 2rem;
          display: flex;
          gap: 2rem;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
          border: 1px solid var(--border);
          white-space: nowrap;
        }

        .trust-stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .trust-divider {
          width: 1px;
          background: var(--border);
        }

        /* Testimonials */
        .testimonials-section {
          background: white;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .testimonial-card {
          background: var(--bg);
          border-radius: var(--radius-lg);
          padding: 2rem;
          border: 1px solid var(--border);
          transition: all 0.35s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
          border-color: rgba(249, 115, 22, 0.15);
        }

        .quote-icon {
          color: var(--primary);
          opacity: 0.4;
          margin-bottom: 0.75rem;
        }

        .stars {
          display: flex;
          gap: 2px;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .testimonial-author img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-soft);
        }

        .testimonial-author strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text);
        }

        .testimonial-author span {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* Deals */
        .deals-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .deal-card {
          display: flex;
          align-items: center;
          border-radius: var(--radius-xl);
          overflow: hidden;
          min-height: 220px;
          position: relative;
        }

        .deal-weekly {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid rgba(249, 115, 22, 0.15);
        }

        .deal-weekend {
          background: linear-gradient(135deg, #1c1917 0%, #292524 100%);
        }

        .deal-content {
          flex: 1;
          padding: 2rem;
          z-index: 2;
        }

        .deal-tag {
          display: inline-block;
          background: var(--primary);
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-pill);
          margin-bottom: 0.75rem;
        }

        .deal-weekend .deal-tag {
          background: rgba(249, 115, 22, 0.2);
          color: var(--primary-light);
        }

        .deal-content h3 {
          font-family: var(--font-display);
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
        }

        .deal-weekend h3 {
          color: white;
        }

        .deal-content p {
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }

        .deal-weekend p {
          color: #a8a29e;
        }

        .deal-btn {
          display: inline-flex;
          padding: 0.6rem 1.25rem;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-pill);
          font-weight: 700;
          font-size: 0.85rem;
          transition: all 0.25s ease;
        }

        .deal-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        .deal-card img {
          width: 45%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          mask-image: linear-gradient(to right, transparent, black 30%);
          -webkit-mask-image: linear-gradient(to right, transparent, black 30%);
        }

        @media (max-width: 1024px) {
          .category-layout,
          .why-layout {
            grid-template-columns: 1fr;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .section {
            padding: 3.5rem 0;
          }
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .steps-grid {
            grid-template-columns: 1fr;
          }
          .deals-grid {
            grid-template-columns: 1fr;
          }
          .trust-card {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            margin-top: -2rem;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
