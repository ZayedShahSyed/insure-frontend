import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Navbar -->
    <nav class="navbar">
      <a class="nav-brand" href="/">  <img src="logo.jpg" alt="InsureHealth" class="nav-logo"> InsureHealth</a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#plans">Plans</a>
        <a href="#why-us">Why Us</a>
        <a routerLink="/login" class="btn-outline">Login</a>
        <a routerLink="/register" class="btn-primary">Get Started</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#7c3aed"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Trusted by 10,000+ customers
        </div>
        <h1>Your Health,<br><span class="gradient-text">Our Priority</span></h1>
        <p class="hero-subtitle">
          Comprehensive health insurance plans tailored to your needs.
          Protect yourself and your family with the best coverage at affordable prices.
        </p>
        <div class="hero-actions">
          <a routerLink="/register" class="btn-hero-primary">
            Get Free Quote
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a routerLink="/login" class="btn-hero-secondary">Existing Member? Login</a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">10K+</span>
            <span class="stat-label">Happy Customers</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">50+</span>
            <span class="stat-label">Insurance Plans</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">99%</span>
            <span class="stat-label">Claim Approval</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Support</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card main-card">
          <div class="card-icon-wrap purple">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="card-info">
            <span class="card-title">Premium Coverage</span>
            <span class="card-sub">Active Protection</span>
          </div>
          <div class="card-badge active">Active</div>
        </div>
        <div class="hero-card float-card top">
          <div class="float-icon green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div>
            <span class="float-title">Claim Approved!</span>
            <span class="float-amount">₹45,000</span>
          </div>
        </div>
        <div class="hero-card float-card bottom">
          <div class="float-icon blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <span class="float-title">New Enrollment</span>
            <span class="float-sub">Family Plan - Gold</span>
          </div>
        </div>
        <div class="blob blob1"></div>
        <div class="blob blob2"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="section-header">
        <h2>Everything You Need</h2>
        <p>A complete health insurance platform built for you</p>
      </div>
      <div class="features-grid">
        <div class="feature-card" *ngFor="let feature of features">
          <div class="feature-icon-wrap" [style.background]="feature.bg" [innerHTML]="getFeatureSvg(feature)"></div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Plans Section -->
    <section class="plans-section" id="plans">
      <div class="section-header">
        <h2>Choose Your Plan</h2>
        <p>Flexible plans designed to fit every lifestyle and budget</p>
      </div>
      <div class="plans-grid">
        <div class="plan-card" *ngFor="let plan of plans" [class.popular]="plan.popular">
          <div class="popular-badge" *ngIf="plan.popular">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Most Popular
          </div>
          <div class="plan-icon-wrap" [style.background]="plan.bg" [innerHTML]="getPlanSvg(plan)"></div>
          <h3>{{ plan.name }}</h3>
          <div class="plan-price">
            <span class="currency">₹</span>
            <span class="amount">{{ plan.price }}</span>
            <span class="period">/month</span>
          </div>
          <ul class="plan-features">
            <li *ngFor="let f of plan.features">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              {{ f }}
            </li>
          </ul>
          <a routerLink="/register" class="plan-btn" [class.plan-btn-popular]="plan.popular">Get Started</a>
        </div>
      </div>
    </section>

    <!-- Why Us Section -->
    <section class="why-us" id="why-us">
      <div class="why-content">
        <h2>Why Choose InsureHealth?</h2>
        <p>We make health insurance simple, transparent, and accessible for everyone.</p>
        <div class="why-points">
          <div class="why-point" *ngFor="let point of whyUs">
            <div class="why-icon-wrap" [style.background]="point.bg" [innerHTML]="getWhySvg(point)"></div>
            <div>
              <h4>{{ point.title }}</h4>
              <p>{{ point.desc }}</p>
            </div>
          </div>
        </div>
        <a routerLink="/register" class="btn-hero-primary">
          Start Your Journey
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="why-visual">
        <div class="testimonial-card" *ngFor="let t of testimonials">
          <div class="stars">
            <svg *ngFor="let s of [1,2,3,4,5]" width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <p>"{{ t.text }}"</p>
          <div class="testimonial-author">
            <img [src]="t.avatar" [alt]="t.name" class="author-img"/>
            <div>
              <span class="author-name">{{ t.name }}</span>
              <span class="author-role">{{ t.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Get Protected?</h2>
        <p>Join thousands of families who trust InsureHealth for their healthcare needs.</p>
        <div class="cta-actions">
          <a routerLink="/register" class="btn-cta-primary">Create Free Account</a>
          <a routerLink="/login" class="btn-cta-secondary">Login to Portal</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand-name"><img src="logo.jpg" alt="InsureHealth" class="nav-logo"> InsureHealth</div>
          <p>Making healthcare accessible and affordable for everyone.</p>
        </div>
        <div class="footer-links">
          <h4>Quick Links</h4>
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Register</a>
          <a href="#features">Features</a>
          <a href="#plans">Plans</a>
        </div>
        <div class="footer-contact">
          <h4>Contact</h4>
          <p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            support&#64;insurehealth.com
          </p>
          <p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.022 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            1800-123-4567
          </p>
          <p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            24/7 Support Available
          </p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 InsureHealth. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@700;800&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* Navbar */
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 5%; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; font-family: 'DM Sans', sans-serif; }
    .nav-brand { font-size: 1.4rem; font-weight: 700; color: #4f46e5; display: flex; align-items: center; gap: 0.5rem; font-family: 'Poppins', sans-serif; text-decoration: none; cursor: pointer; }
    .nav-logo { height: 40px; width: 40px; object-fit: contain; border-radius: 8px; }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links a { text-decoration: none; color: #555; font-size: 0.95rem; font-weight: 500; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
    .nav-links a:hover { color: #4f46e5; }
    .btn-outline { border: 2px solid #4f46e5 !important; color: #4f46e5 !important; padding: 0.5rem 1.2rem; border-radius: 8px; font-weight: 600; }
    .btn-primary { background: #4f46e5; color: white !important; padding: 0.5rem 1.2rem; border-radius: 8px; font-weight: 600; }
    .btn-primary:hover { background: #4338ca !important; }

    /* Hero */
    .hero { display: flex; align-items: center; justify-content: space-between; padding: 5rem 5%; min-height: 90vh; background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%); gap: 3rem; }
    .hero-content { flex: 1; max-width: 580px; }
    .hero-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: #ede9fe; color: #7c3aed; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; font-family: 'DM Sans', sans-serif; }
    .hero-content h1 { font-size: 3.5rem; font-weight: 900; line-height: 1.1; color: #1e293b; margin-bottom: 1.5rem; font-family: 'Poppins', sans-serif; letter-spacing: -1px; }
    .gradient-text { background: linear-gradient(135deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Playfair Display', serif; font-style: italic; }
    .hero-subtitle { font-size: 1.1rem; color: #64748b; line-height: 1.8; margin-bottom: 2rem; font-family: 'Inter', sans-serif; }
    .hero-actions { display: flex; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
    .btn-hero-primary { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 0.9rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 1rem; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(79,70,229,0.4); font-family: 'DM Sans', sans-serif; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,70,229,0.5); }
    .btn-hero-secondary { background: white; color: #4f46e5; padding: 0.9rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600; border: 2px solid #4f46e5; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
    .btn-hero-secondary:hover { background: #f0f4ff; }

    /* Stats */
    .hero-stats { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-number { display: block; font-size: 1.6rem; font-weight: 800; color: #4f46e5; font-family: 'Space Grotesk', sans-serif; }
    .stat-label { font-size: 0.72rem; color: #94a3b8; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; text-transform: uppercase; }
    .stat-divider { width: 1px; height: 40px; background: #e2e8f0; }

    /* Hero Visual */
    .hero-visual { flex: 1; max-width: 480px; position: relative; height: 500px; }
    .blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.3; }
    .blob1 { width: 300px; height: 300px; background: #4f46e5; top: 50px; left: 50px; }
    .blob2 { width: 200px; height: 200px; background: #7c3aed; bottom: 50px; right: 50px; }
    .hero-card { position: absolute; background: white; border-radius: 16px; padding: 1.2rem 1.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 2; font-family: 'Inter', sans-serif; }
    .main-card { display: flex; align-items: center; gap: 1rem; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 290px; }
    .card-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .card-icon-wrap.purple { background: linear-gradient(135deg, #4f46e5, #7c3aed); }
    .card-info { flex: 1; }
    .card-title { display: block; font-weight: 600; color: #1e293b; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; }
    .card-sub { font-size: 0.78rem; color: #94a3b8; }
    .card-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
    .card-badge.active { background: #dcfce7; color: #16a34a; }
    .float-card { display: flex; align-items: center; gap: 0.75rem; }
    .float-card.top { top: 60px; right: 20px; animation: float 3s ease-in-out infinite; }
    .float-card.bottom { bottom: 80px; left: 10px; animation: float 3s ease-in-out infinite 1.5s; }
    .float-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .float-icon.green { background: #16a34a; }
    .float-icon.blue { background: #3b82f6; }
    .float-title { display: block; font-weight: 600; color: #1e293b; font-size: 0.82rem; font-family: 'DM Sans', sans-serif; }
    .float-amount { color: #16a34a; font-size: 1rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif; display: block; }
    .float-sub { color: #94a3b8; font-size: 0.75rem; font-family: 'Inter', sans-serif; display: block; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

    /* Section Headers */
    .section-header { text-align: center; margin-bottom: 3rem; }
    .section-header h2 { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem; font-family: 'Poppins', sans-serif; letter-spacing: -0.5px; }
    .section-header p { color: #64748b; font-size: 1.05rem; font-family: 'Inter', sans-serif; }

    /* Features */
    .features { padding: 5rem 5%; background: white; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; }
    .feature-card { padding: 2rem; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; transition: transform 0.2s, box-shadow 0.2s; text-align: center; }
    .feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .feature-icon-wrap { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; }
    .feature-card h3 { font-size: 1.05rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; font-family: 'Poppins', sans-serif; }
    .feature-card p { color: #64748b; font-size: 0.88rem; line-height: 1.7; font-family: 'Inter', sans-serif; }

    /* Plans */
    .plans-section { padding: 5rem 5%; background: linear-gradient(135deg, #f0f4ff, #faf5ff); }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto; }
    .plan-card { background: white; border-radius: 20px; padding: 2.5rem 2rem; border: 2px solid #e2e8f0; position: relative; transition: transform 0.2s; text-align: center; }
    .plan-card:hover { transform: translateY(-5px); }
    .plan-card.popular { border-color: #4f46e5; box-shadow: 0 10px 40px rgba(79,70,229,0.2); }
    .popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 0.3rem 1.2rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; white-space: nowrap; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 0.3rem; }
    .plan-icon-wrap { width: 72px; height: 72px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; }
    .plan-card h3 { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; font-family: 'Poppins', sans-serif; }
    .plan-price { margin-bottom: 1.5rem; }
    .currency { font-size: 1.2rem; color: #4f46e5; font-weight: 700; vertical-align: top; margin-top: 0.5rem; display: inline-block; font-family: 'Space Grotesk', sans-serif; }
    .amount { font-size: 3rem; font-weight: 800; color: #4f46e5; font-family: 'Space Grotesk', sans-serif; }
    .period { color: #94a3b8; font-size: 0.9rem; font-family: 'Inter', sans-serif; }
    .plan-features { list-style: none; text-align: left; margin-bottom: 2rem; }
    .plan-features li { padding: 0.45rem 0; color: #475569; font-size: 0.88rem; border-bottom: 1px solid #f1f5f9; font-family: 'Inter', sans-serif; display: flex; align-items: center; gap: 0.5rem; }
    .plan-btn { display: block; padding: 0.85rem; background: #f0f4ff; color: #4f46e5; border-radius: 10px; text-decoration: none; font-weight: 600; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
    .plan-btn:hover { background: #e0e7ff; }
    .plan-btn-popular { background: linear-gradient(135deg, #4f46e5, #7c3aed) !important; color: white !important; }

    /* Why Us */
    .why-us { display: flex; gap: 4rem; padding: 5rem 5%; background: white; align-items: flex-start; }
    .why-content { flex: 1; }
    .why-content h2 { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; font-family: 'Poppins', sans-serif; }
    .why-content > p { color: #64748b; font-size: 1.05rem; margin-bottom: 2rem; font-family: 'Inter', sans-serif; }
    .why-points { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
    .why-point { display: flex; gap: 1rem; align-items: flex-start; }
    .why-icon-wrap { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .why-point h4 { font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; font-family: 'DM Sans', sans-serif; }
    .why-point p { color: #64748b; font-size: 0.88rem; font-family: 'Inter', sans-serif; }
    .why-visual { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }

    /* Testimonials */
    .testimonial-card { background: #f8fafc; border-radius: 16px; padding: 1.5rem; border-left: 4px solid #4f46e5; }
    .stars { display: flex; gap: 0.2rem; margin-bottom: 0.75rem; }
    .testimonial-card p { color: #475569; font-style: italic; margin-bottom: 1rem; line-height: 1.7; font-family: 'Playfair Display', serif; font-size: 0.95rem; }
    .testimonial-author { display: flex; align-items: center; gap: 0.75rem; }
    .author-img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e7ff; }
    .author-name { display: block; font-weight: 700; color: #1e293b; font-size: 0.88rem; font-family: 'DM Sans', sans-serif; }
    .author-role { font-size: 0.72rem; color: #94a3b8; font-family: 'Inter', sans-serif; }

    /* CTA */
    .cta-section { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 5rem 5%; text-align: center; color: white; }
    .cta-content h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; font-family: 'Poppins', sans-serif; }
    .cta-content p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2.5rem; font-family: 'Inter', sans-serif; }
    .cta-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .btn-cta-primary { background: white; color: #4f46e5; padding: 1rem 2.5rem; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 1rem; transition: transform 0.2s; font-family: 'DM Sans', sans-serif; }
    .btn-cta-primary:hover { transform: translateY(-2px); }
    .btn-cta-secondary { background: transparent; color: white; padding: 1rem 2.5rem; border-radius: 10px; text-decoration: none; font-weight: 600; border: 2px solid white; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
    .btn-cta-secondary:hover { background: rgba(255,255,255,0.1); }

    /* Footer */
    .footer { background: #1e293b; color: #cbd5e1; padding: 3rem 5% 1.5rem; font-family: 'Inter', sans-serif; }
    .footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; margin-bottom: 2rem; }
    .brand-name { font-size: 1.3rem; font-weight: 700; color: white; margin-bottom: 0.75rem; font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 0.5rem; }
    .footer-brand p { font-size: 0.9rem; line-height: 1.6; }
    .footer-links, .footer-contact { display: flex; flex-direction: column; gap: 0.5rem; }
    .footer-links h4, .footer-contact h4 { color: white; font-weight: 700; margin-bottom: 0.5rem; font-family: 'DM Sans', sans-serif; }
    .footer-links a { color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
    .footer-links a:hover { color: white; }
    .footer-contact p { font-size: 0.88rem; display: flex; align-items: center; gap: 0.5rem; }
    .footer-bottom { border-top: 1px solid #334155; padding-top: 1.5rem; text-align: center; font-size: 0.85rem; color: #64748b; }
  `]
})
export class HomeComponent {
  constructor(private sanitizer: DomSanitizer) {}

  getFeatureSvg(item: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${item.color}" stroke-width="2" style="display:block">${item.svg}</svg>`
    );
  }

  getPlanSvg(item: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${item.color}" stroke-width="2" style="display:block">${item.svg}</svg>`
    );
  }

  getWhySvg(item: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${item.color}" stroke-width="2" style="display:block">${item.svg}</svg>`
    );
  }

  features = [
    {
      svg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
      color: '#4f46e5', bg: '#ede9fe',
      title: 'Comprehensive Coverage',
      desc: 'Wide range of health plans covering hospitalization, surgery, medicines, and preventive care.'
    },
    {
      svg: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
      color: '#f59e0b', bg: '#fef3c7',
      title: 'Instant Enrollment',
      desc: 'Enroll in a plan in minutes. Simple online process with zero paperwork required.'
    },
    {
      svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
      color: '#3b82f6', bg: '#dbeafe',
      title: 'Easy Claims',
      desc: 'Submit and track claims online with real-time updates and fast processing.'
    },
    {
      svg: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
      color: '#10b981', bg: '#d1fae5',
      title: 'Family Plans',
      desc: 'Protect your entire family under one plan with special family floater benefits.'
    },
    {
      svg: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
      color: '#8b5cf6', bg: '#ede9fe',
      title: 'Affordable Premiums',
      desc: 'Competitive pricing with flexible payment options to suit every budget.'
    },
    {
      svg: `<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.022 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>`,
      color: '#ef4444', bg: '#fee2e2',
      title: '24/7 Support',
      desc: 'Round the clock customer support via chat, call or email whenever you need help.'
    },
  ];

  plans = [
    {
      svg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
      color: '#64748b', bg: '#f1f5f9',
      name: 'Basic Plan', price: '499', popular: false,
      features: ['₹2 Lakh Coverage', 'Hospitalization Cover', 'Basic OPD', 'Ambulance Cover', '1 Member']
    },
    {
      svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
      color: '#f59e0b', bg: '#fef9c3',
      name: 'Gold Plan', price: '999', popular: true,
      features: ['₹5 Lakh Coverage', 'Cashless Treatment', 'Full OPD Cover', 'Critical Illness', 'Upto 4 Members']
    },
    {
      svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><circle cx="12" cy="12" r="3"/>`,
      color: '#6366f1', bg: '#ede9fe',
      name: 'Platinum Plan', price: '1,999', popular: false,
      features: ['₹15 Lakh Coverage', 'Global Coverage', 'Maternity Benefit', 'Mental Health Cover', 'Entire Family']
    }
  ];

  whyUs = [
    {
      svg: `<path d="M20 6L9 17l-5-5"/>`,
      color: '#16a34a', bg: '#dcfce7',
      title: '99% Claim Settlement',
      desc: 'We have one of the highest claim settlement ratios in the industry.'
    },
    {
      svg: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
      color: '#3b82f6', bg: '#dbeafe',
      title: '5000+ Network Hospitals',
      desc: 'Cashless treatment at thousands of hospitals across India.'
    },
    {
      svg: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
      color: '#8b5cf6', bg: '#ede9fe',
      title: 'Secure & Transparent',
      desc: 'Your data is safe and all policy terms are clear with no hidden charges.'
    },
    {
      svg: `<path d="M5 12h14M12 5l7 7-7 7"/>`,
      color: '#f59e0b', bg: '#fef3c7',
      title: 'Digital First Experience',
      desc: 'Manage everything online — policies, claims, renewals from one portal.'
    },
  ];

  testimonials = [
    {
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Priya Sharma',
      role: 'Gold Plan Member',
      text: 'InsureHealth made my hospitalization claim so easy. Got reimbursed within 3 days. Highly recommend!'
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Rahul Verma',
      role: 'Platinum Plan Member',
      text: 'The family plan is amazing. Covers my parents too. The app is simple and support is always available.'
    },
  ];
}