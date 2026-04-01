import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));

    // Smooth scroll for anchor links
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    const handlers = anchors.map((a) => {
      const handler = (e) => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
      };
      a.addEventListener('click', handler);
      return { a, handler };
    });

    return () => {
      io.disconnect();
      handlers.forEach(({ a, handler }) => a.removeEventListener('click', handler));
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">
            <img
              src="/images/logo-transparent.png"
              alt="TOPS Technologies"
              className="nav-logo-img"
              loading="eager"
              decoding="async"
            />
          </div>
        </a>
        <button type="button" className="nav-cta" onClick={() => navigate('/student/register')}>
          Take Free Test →
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="hero-blob blob-3"></div>

        <div className="hero-badge">
          <div className="badge-dot"></div>
          Free · 12–15 minutes · Science-backed
        </div>

        <h1 className="hero-heading">
          Find the degree<br />
          <span className="accent-line">
            <em>you were built for</em>
          </span>
        </h1>

        <p className="hero-sub">
          Answer 42 questions. Get a personalised career report with your top 3 degree matches, why they suit you, and
          exactly how to get there.
        </p>

        <div className="hero-actions">
          <button type="button" className="btn-primary" onClick={() => navigate('/student/register')}>
            Start Free Test
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <a href="#how-it-works" className="btn-secondary">
            How it works
          </a>
        </div>

        <div className="trust-bar">
          <div className="trust-item">
            <svg viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 1L9.5 5.5H14L10.5 8.5L12 13L7.5 10L3 13L4.5 8.5L1 5.5H5.5L7.5 1Z"
                fill="currentColor"
              />
            </svg>
            RIASEC Psychometric Framework
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 1L9.5 5.5H14L10.5 8.5L12 13L7.5 10L3 13L4.5 8.5L1 5.5H5.5L7.5 1Z"
                fill="currentColor"
              />
            </svg>
            20+ years counselling expertise
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 1L9.5 5.5H14L10.5 8.5L12 13L7.5 10L3 13L4.5 8.5L1 5.5H5.5L7.5 1Z"
                fill="currentColor"
              />
            </svg>
            17 degree streams covered
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <div className="card-strip reveal">
        <div className="card-strip-inner">
          <div className="stat-card">
            <div className="stat-num">50K+</div>
            <div className="stat-label">Students guided across India</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">17</div>
            <div className="stat-label">Career streams mapped</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">Free</div>
            <div className="stat-label">No cost, no catch</div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="section-label">How it works</div>
        <h2 className="section-title">
          Four steps to your <em>perfect path</em>
        </h2>
        <p className="section-sub">No lengthy forms. No confusing jargon. Just honest questions and a clear answer.</p>

        <div className="steps-grid">
          <div className="step-card reveal">
            <div className="step-icon" style={{ background: '#EBF2FF' }}>
              🧠
            </div>
            <div>
              <div className="step-num">STEP 01</div>
              <div className="step-name">Personality Test</div>
              <div className="step-desc">
                30 questions that map your unique RIASEC personality — your natural way of thinking and working.
              </div>
              <div className="step-time">~8 min</div>
            </div>
          </div>
          <div className="step-card reveal">
            <div className="step-icon" style={{ background: '#F0FDF8' }}>
              ⚡
            </div>
            <div>
              <div className="step-num">STEP 02</div>
              <div className="step-name">Aptitude Check</div>
              <div className="step-desc">
                6 quick questions to assess your natural strengths — numerical, logical, creative, or communication.
              </div>
              <div className="step-time">~2 min</div>
            </div>
          </div>
          <div className="step-card reveal">
            <div className="step-icon" style={{ background: '#FFF4EF' }}>
              🎯
            </div>
            <div>
              <div className="step-num">STEP 03</div>
              <div className="step-name">Interest Signals</div>
              <div className="step-desc">
                6 interest questions to confirm which domains genuinely excite you — tech, finance, design, and more.
              </div>
              <div className="step-time">~2 min</div>
            </div>
          </div>
          <div className="step-card reveal">
            <div className="step-icon" style={{ background: '#FFF8E1' }}>
              ✨
            </div>
            <div>
              <div className="step-num">STEP 04</div>
              <div className="step-name">Your Career Report</div>
              <div className="step-desc">
                Get your personalised report with top 3 degree matches, fit scores, entrance exams, and a clear pathway.
              </div>
              <div className="step-time">Instant</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="outcomes-section">
        <div className="outcomes-mesh"></div>
        <div className="section-label">What you get</div>
        <h2 className="section-title" style={{ maxWidth: '600px' }}>
          A report that actually <em>tells you what to do next</em>
        </h2>
        <p className="section-sub">Not vague suggestions. A specific, personalised action plan.</p>

        <div className="outcomes-grid">
          <div className="outcome-card reveal">
            <div className="outcome-icon" style={{ background: 'rgba(16,217,164,0.12)' }}>
              🎭
            </div>
            <div>
              <div className="outcome-name">Your Personality Identity</div>
              <div className="outcome-desc">
                A clear label like &quot;Creative Problem Solver&quot; or &quot;Strategic Analyst&quot; — and what it
                means for your career.
              </div>
            </div>
          </div>
          <div className="outcome-card reveal">
            <div className="outcome-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
              🏆
            </div>
            <div>
              <div className="outcome-name">Top 3 Degree Matches</div>
              <div className="outcome-desc">
                Ranked by fit score percentage. Each match comes with a clear explanation of why it suits you
                specifically.
              </div>
            </div>
          </div>
          <div className="outcome-card reveal">
            <div className="outcome-icon" style={{ background: 'rgba(255,139,106,0.12)' }}>
              🗺️
            </div>
            <div>
              <div className="outcome-name">Complete Pathway Guide</div>
              <div className="outcome-desc">
                Which degree to pursue, which entrance exams to target, which skills to build — laid out step by step.
              </div>
            </div>
          </div>
          <div className="outcome-card reveal">
            <div className="outcome-icon" style={{ background: 'rgba(251,191,36,0.12)' }}>
              💬
            </div>
            <div>
              <div className="outcome-name">Free Expert Counselling</div>
              <div className="outcome-desc">
                After your report, book a free 1-on-1 session with a TOPS counsellor who will walk you through your
                options.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER AREAS */}
      <section className="careers-section reveal">
        <div className="section-label">Careers covered</div>
        <h2 className="section-title">
          17 degree streams, <em>zero guesswork</em>
        </h2>
        <p className="section-sub">Every major path a Class 12 student in India can take — science, commerce, or arts.</p>

        <div className="career-chips">
          <div className="career-chip">
            <div className="dot" style={{ background: '#3B82F6' }}></div>Engineering & Technology
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#10D9A4' }}></div>Data Science & Analytics
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#FF8B6A' }}></div>Medicine & Healthcare
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#FBBF24' }}></div>Finance & CA
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#8B5CF6' }}></div>Design & Creative Tech
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#EC4899' }}></div>Law & Legal Studies
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#14B8A6' }}></div>Business & Entrepreneurship
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#F97316' }}></div>Architecture
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#6366F1' }}></div>Psychology & Social Work
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#22C55E' }}></div>Education & Teaching
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#0EA5E9' }}></div>Computer Science (BCA/BSc)
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#EF4444' }}></div>Defence & Civil Services
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#D946EF' }}></div>Animation & VFX
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#84CC16' }}></div>Hotel Management
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#FB923C' }}></div>Pharmacy & Life Sciences
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#2563EB' }}></div>Digital Marketing & Media
          </div>
          <div className="career-chip">
            <div className="dot" style={{ background: '#7C3AED' }}></div>Media & Journalism
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial-section">
        <div className="testi-card reveal">
          <div className="testi-quote-mark">&quot;</div>
          <div className="testi-stars">★★★★★</div>
          <p className="testi-text">
            &quot;I had no idea whether to go for B.Tech or BBA. The TOPS test told me I was a &apos;Strategic Analyst&apos;
            and Engineering was 86% fit. I cracked JEE and joined NIT Surat. Best decision I ever made.&quot;
          </p>
          <div className="testi-author">
            <div className="testi-avatar">P</div>
            <div>
              <div className="testi-name">Parth Mehta</div>
              <div className="testi-role">B.Tech CSE · NIT Surat, 2024 batch</div>
            </div>
          </div>
        </div>

        <div className="testi-grid" style={{ marginTop: '14px' }}>
          <div className="testi-mini reveal">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-mini-text">
              &quot;My parents wanted me to do medicine but the test showed design was a 91% fit. I got into NID.
              Couldn&apos;t be happier.&quot;
            </p>
            <div className="testi-mini-author">— Riya Shah, B.Des · NID Ahmedabad</div>
          </div>
          <div className="testi-mini reveal">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-mini-text">
              &quot;The counsellor called me the very next day after my test. She helped me understand why CA was the right
              path for me.&quot;
            </p>
            <div className="testi-mini-author">— Dhruv Patel, CA Foundation student</div>
          </div>
          <div className="testi-mini reveal">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-mini-text">
              &quot;Arts student here. I thought I had limited options. The test opened my eyes to Law, Psychology, and
              Media — all 70%+ fit!&quot;
            </p>
            <div className="testi-mini-author">— Sneha Joshi, BA LLB · Gujarat University</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="take-test">
        <div className="cta-box">
          <div className="cta-glow cta-glow-1"></div>
          <div className="cta-glow cta-glow-2"></div>
          <div className="cta-tag">✦ 100% Free · Takes 12–15 Minutes</div>
          <h2 className="cta-heading">
            Ready to discover your<br />
            <em>perfect degree?</em>
          </h2>
          <p className="cta-sub">
            Join 50,000+ students who have found their path with TOPS. No payment. No spam. Just clarity.
          </p>
          <button type="button" className="cta-btn" onClick={() => navigate('/student/register')}>
            Start My Free Career Test
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="cta-note">No credit card needed · Get your report instantly · Free counselling included</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">TOPS Technologies</div>
        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Contact</a>
          <a href="#">LearnVern</a>
        </div>
        <div className="footer-copy">© 2026 TOPS Technologies. All rights reserved. Ahmedabad, India.</div>
      </footer>
    </>
  );
}

export default LandingPage;

