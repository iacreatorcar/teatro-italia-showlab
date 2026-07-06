import Link from 'next/link'

export const metadata = {
  title: 'Showtime ERP - Smart Theatre Management',
}

export default function WelcomePage() {
  return (
    <>
      <style>{`
        .welcome-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .welcome-page {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff;
          overflow-x: hidden;
          position: relative;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-40px) scale(1.05); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .bg-float-1 {
          position: absolute;
          top: -10%;
          right: -5%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 20, 147, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          z-index: 1;
        }

        .bg-float-2 {
          position: absolute;
          bottom: -5%;
          left: -10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 150, 200, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite reverse;
          z-index: 1;
        }

        .welcome-page header {
          position: relative;
          z-index: 10;
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideInRight 0.8s ease-out;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ff1493, #00bcd4);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
        }

        .logo-text h1 {
          font-weight: 700;
          font-size: 18px;
          margin: 0;
        }

        .logo-text p {
          font-size: 11px;
          color: #00bcd4;
          letter-spacing: 1px;
          margin: 0;
        }

        .nav {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: #aaa;
        }

        .welcome-banner {
          position: relative;
          z-index: 8;
          margin: 40px auto;
          text-align: center;
          padding: 40px;
          max-width: 900px;
          animation: fadeInUp 1.4s ease-out;
        }

        .banner-content {
          background: linear-gradient(90deg, rgba(255, 20, 147, 0.15), rgba(0, 200, 200, 0.15));
          border: 1px solid rgba(255, 20, 147, 0.4);
          border-radius: 16px;
          padding: 40px;
          backdrop-filter: blur(10px);
        }

        .banner-content h1 {
          font-size: 48px;
          font-weight: 900;
          margin: 0;
          background: linear-gradient(90deg, #ff1493, #00bcd4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
        }

        .banner-content .subtitle {
          font-size: 32px;
          font-weight: 700;
          margin-top: 16px;
          color: #fff;
        }

        .banner-content p {
          font-size: 14px;
          color: #aaa;
          margin-top: 20px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.8;
        }

        .cta-container {
          position: relative;
          z-index: 8;
          display: flex;
          gap: 16px;
          justify-content: center;
          padding: 20px;
          flex-wrap: wrap;
          animation: fadeInUp 1.6s ease-out;
        }

        .cta-btn {
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          display: inline-block;
          text-decoration: none;
        }

        .cta-theatre {
          background: linear-gradient(135deg, #ff1493, #ff4d6d);
        }

        .cta-theatre:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 20, 147, 0.4);
        }

        .cta-ghost {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .cta-ghost:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.1);
        }

        .stats {
          position: relative;
          z-index: 8;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          padding: 60px 40px;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 40px;
        }

        .stat-item {
          animation: fadeInUp 1.8s ease-out;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(90deg, #ff1493, #ff4d6d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 12px;
          color: #aaa;
          letter-spacing: 1px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: rgba(255,20,147,0.1);
          border: 1px solid rgba(255,20,147,0.3);
          border-radius: 12px;
          padding: 30px;
          animation: fadeInUp 1s ease-out;
        }

        .feature-card .icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .feature-card h3 {
          color: #ff1493;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .feature-card p {
          font-size: 13px;
          color: #aaa;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .banner-content h1 {
            font-size: 32px;
          }

          .banner-content .subtitle {
            font-size: 22px;
          }

          .cta-container {
            flex-direction: column;
          }

          .cta-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="welcome-page">
        <div className="bg-float-1"></div>
        <div className="bg-float-2"></div>

        <header>
          <div className="logo">
            <div className="logo-icon">🎬</div>
            <div className="logo-text">
              <h1>SHOWTIME ERP</h1>
              <p>SMART THEATRE</p>
            </div>
          </div>
          <div className="nav">
            <div>Dashboard</div>
            <div>Docs</div>
            <div>Admin</div>
          </div>
        </header>

        <div className="welcome-banner">
          <div className="banner-content">
            <h1>Welcome to Showtime.</h1>
            <div className="subtitle">Smart Theatre Ecosystem</div>
            <p>
              One platform. Complete control. Real-time LED walls, screen sync, artist management, scheduling &amp; ticketing.
              All your theatre needs orchestrated seamlessly.
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 8, padding: '60px 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 50, color: '#ff1493' }}>
              Smart Ecosystem
            </h2>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="icon">📅</div>
                <h3>Show Scheduling</h3>
                <p>Calendar management, rehearsals, performance times, recurring shows.</p>
              </div>
              <div className="feature-card">
                <div className="icon">🎤</div>
                <h3>Artist Profiles</h3>
                <p>Cast databases, bios, contracts, availability tracking, performance history.</p>
              </div>
              <div className="feature-card">
                <div className="icon">🎫</div>
                <h3>Ticketing</h3>
                <p>Seat management, pricing tiers, sales tracking, revenue reports.</p>
              </div>
              <div className="feature-card">
                <div className="icon">💡</div>
                <h3>LED &amp; Screens</h3>
                <p>Real-time wall control, sync displays, visual programming, templates.</p>
              </div>
              <div className="feature-card">
                <div className="icon">🔌</div>
                <h3>Tech Integration</h3>
                <p>Crestron, Dante, AV systems, hardware control, automation.</p>
              </div>
              <div className="feature-card">
                <div className="icon">👥</div>
                <h3>Crew Management</h3>
                <p>Scheduling, roles, shifts, communication, task assignments.</p>
              </div>
              <div className="feature-card">
                <div className="icon">📊</div>
                <h3>Analytics</h3>
                <p>Performance metrics, attendance reports, revenue insights, trends.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-container">
          <Link href="/" className="cta-btn cta-theatre">GET STARTED</Link>
          <Link href="/" className="cta-btn cta-ghost">EXPLORE DOCS →</Link>
        </div>

        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">THEATRES WORLDWIDE</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1M+</div>
            <div className="stat-label">SHOWS MANAGED YEARLY</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">ARTISTS CONNECTED</div>
          </div>
        </div>

        <footer style={{ position: 'relative', zIndex: 8, textAlign: 'center', padding: 40, borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 40 }}>
          <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
            Founder: <span style={{ color: '#ff1493', fontWeight: 600 }}>Carmine D&apos;Alise</span>
          </p>
          <p style={{ fontSize: 12, color: '#666', marginTop: 10 }}>Project for demonstration purposes only</p>
        </footer>
      </div>
    </>
  )
}
