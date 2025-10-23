﻿import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/WelcomePage.module.css';

export default function WelcomePage() {
  // Welcome page is now accessible to everyone - no auto-redirect
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>MirÃ«sevini nÃ« <span className={styles.highlight}>MedPal</span></h1>
        <p>PlatformÃ« digjitale pÃ«r menaxhimin e shÃ«ndetit pÃ«r KlinikÃ«, MjekÃ« dhe PacientÃ«.</p>
      </header>

      <main className={styles.main}>
        <section className={styles.infoSection}>
          <div className={styles.card}>
            <h2>ðŸ¥ PÃ«r KlinikÃ«n</h2>
            <p>Menaxhoni mjekÃ«t dhe terminet nÃ« njÃ« sistem tÃ« thjeshtÃ« dhe efikas.</p>
          </div>
          <div className={styles.card}>
            <h2>ðŸ‘©â€âš•ï¸ PÃ«r MjekÃ«t</h2>
            <p>Shihni oraret, pacientÃ«t dhe historikun shÃ«ndetÃ«sor me lehtÃ«si.</p>
          </div>
          <div className={styles.card}>
            <h2>ðŸ§‘â€ðŸ¤â€ðŸ§‘ PÃ«r PacientÃ«t</h2>
            <p>Rezervoni termine, ndiqni medikamentet dhe komunikoni me mjekun tuaj.</p>
          </div>
        </section>

        <section className={styles.authButtons}>
          <Link to="/login" className={styles.btnPrimary}>KyÃ§u</Link>
          <Link to="/register" className={styles.btnSecondary}>Regjistrohu</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Â© {new Date().getFullYear()} MedPal. TÃ« gjitha tÃ« drejtat tÃ« rezervuara.</p>
      </footer>
    </div>
  );
}
