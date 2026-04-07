import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { trackEvent } from '../utils/analytics'
import '../styles/Landing.css'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function Landing() {
  const { navigate, abVariant } = useApp()

  const handleStart = () => {
    trackEvent('cta_clicked', { screen: 'landing', variant: abVariant })
    navigate('selector')
  }

  if (abVariant === 'B') return <LandingVariantB onStart={handleStart} />

  return (
    <div className="landing variant-a">
      <motion.div
        className="landing-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="landing-brand-logo">CS</div>
        <div className="landing-brand-name">CREDIT SAISON</div>
      </motion.div>

      <div className="landing-hero">
        <motion.div
          className="landing-badge"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span className="landing-badge-dot" />
          FREE PROTECTION QUIZ
        </motion.div>

        <motion.h1
          className="landing-title"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          What's your{' '}
          <span className="landing-title-highlight">protection score</span>?
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Take a 60-second quiz to discover your insurance gaps, get a personalized score, and find out which plans you actually need.
        </motion.p>

        <motion.div
          className="landing-features"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="landing-feature">
            <div className="landing-feature-icon">🎯</div>
            <span>Get your Protection Score</span>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">🧠</div>
            <span>Discover your insurance persona</span>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">⚡</div>
            <span>60 seconds, zero commitment</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="landing-bottom"
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          className="landing-cta"
          onClick={handleStart}
          whileTap={{ scale: 0.96 }}
        >
          Start the Quiz
          <span className="landing-cta-arrow">→</span>
        </motion.button>
        <div className="landing-trust">
          <span className="landing-trust-icon">🔒</span>
          Free · No sign-up · 100% private
        </div>
      </motion.div>
    </div>
  )
}

function LandingVariantB({ onStart }) {
  return (
    <div className="landing variant-b">
      <motion.div
        className="landing-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="landing-brand-logo">CS</div>
        <div className="landing-brand-name">CREDIT SAISON</div>
      </motion.div>

      <div className="landing-hero">
        <motion.div
          className="landing-badge"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span className="landing-badge-dot" />
          TAKE THE QUIZ
        </motion.div>

        <motion.h1
          className="landing-title"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Are you{' '}
          <span className="landing-title-highlight">actually protected</span>?
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Most people think they're covered until something goes wrong. Find your real protection score in 60 seconds.
        </motion.p>

        <motion.div
          className="landing-stats"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="landing-stat">
            <div className="landing-stat-value">70%</div>
            <div className="landing-stat-label">Underinsured</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">₹5L</div>
            <div className="landing-stat-label">Avg Hospital Bill</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-value">60s</div>
            <div className="landing-stat-label">To Know</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="landing-bottom"
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          className="landing-cta"
          onClick={onStart}
          whileTap={{ scale: 0.96 }}
        >
          Find My Score
          <span className="landing-cta-arrow">→</span>
        </motion.button>
        <div className="landing-trust">
          <span className="landing-trust-icon">🛡️</span>
          Free · No login · Takes 60 seconds
        </div>
      </motion.div>
    </div>
  )
}
