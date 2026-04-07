import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import '../styles/Results.css'

function formatCurrency(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) {
    const lakhs = amount / 100000
    return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
}

function ScoreGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (animatedScore / 100) * circumference
  const color = score >= 70 ? 'var(--accent)' : score >= 40 ? 'var(--orange)' : 'var(--warning)'

  return (
    <div className="score-gauge">
      <svg viewBox="0 0 120 120" className="score-gauge-svg">
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-light)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="score-gauge-content">
        <motion.div
          className="score-gauge-value"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {animatedScore}
        </motion.div>
        <div className="score-gauge-label">Protection Score</div>
      </div>
    </div>
  )
}

export default function Results() {
  const { recommendation, navigate, startTime, completionTime, points } = useApp()
  const rec = recommendation

  const timeTaken = startTime && completionTime
    ? Math.round((completionTime - startTime) / 1000)
    : null

  const riskLabels = { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' }
  const riskIcons = { high: '🔴', medium: '🟡', low: '🟢' }

  const scoreMessage = rec.protectionScore >= 70
    ? "You're in great shape! Just a few tweaks for full coverage."
    : rec.protectionScore >= 40
    ? "You've got some coverage, but there are gaps to fix."
    : "Your protection needs serious attention — let's fix that!"

  return (
    <div className="results-container">
      <motion.div
        className="results-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="results-header-top">
          <button className="results-back-btn" onClick={() => navigate('quiz')}>←</button>
          <span className="results-header-label">
            {timeTaken && `Done in ${timeTaken}s ⚡`}
          </span>
        </div>
        <h1 className="results-title">Your Results Are In!</h1>
        <p className="results-plan-name">⭐ {points} points earned</p>
      </motion.div>

      {/* Protection Score + Persona */}
      <motion.div
        className="results-score-card"
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <ScoreGauge score={rec.protectionScore} />

        {rec.persona && (
          <div className="results-persona">
            <span className="results-persona-icon">{rec.persona.icon}</span>
            <div className="results-persona-content">
              <div className="results-persona-name">{rec.persona.name}</div>
              <div className="results-persona-tagline">{rec.persona.tagline}</div>
            </div>
          </div>
        )}

        <p className="results-score-message">{scoreMessage}</p>
      </motion.div>

      {/* Coverage card */}
      <motion.div
        className="results-coverage-card"
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="results-coverage-header">
          <div>
            <div className="results-coverage-label">
              {rec.type === 'health' ? 'Recommended Coverage'
                : rec.type === 'life' ? 'Recommended Life Cover'
                : 'Insured Declared Value'}
            </div>
            <div className="results-coverage-amount">
              {formatCurrency(rec.type === 'motor' ? rec.idv : rec.coverageAmount)}
            </div>
          </div>
          <div className={`results-risk-badge ${rec.riskLevel}`}>
            {riskIcons[rec.riskLevel]} {riskLabels[rec.riskLevel]}
          </div>
        </div>
        <div className="results-coverage-divider" />
        <div className="results-coverage-row">
          <div className="results-coverage-metric">
            <div className="results-coverage-metric-value">
              ₹{rec.monthlyPremium?.toLocaleString('en-IN')}
            </div>
            <div className="results-coverage-metric-label">Monthly est.</div>
          </div>
          <div className="results-coverage-metric">
            <div className="results-coverage-metric-value">{rec.planName}</div>
            <div className="results-coverage-metric-label">Recommended Plan</div>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      {rec.tips.length > 0 && (
        <motion.div
          className="results-section"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h3 className="results-section-title">
            <span className="results-section-title-icon">⚠️</span>
            Things You Should Know
          </h3>
          <div className="results-tips">
            {rec.tips.map((tip, i) => (
              <div key={i} className="results-tip">
                <span className="results-tip-icon">💡</span>
                {tip}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Highlights */}
      <motion.div
        className="results-section"
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h3 className="results-section-title">
          <span className="results-section-title-icon">✅</span>
          What You'd Get
        </h3>
        <div className="results-highlights">
          {rec.highlights.map((highlight, i) => (
            <div key={i} className="results-highlight">
              <div className="results-highlight-icon">✓</div>
              <span className="results-highlight-text">{highlight}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="results-bottom"
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          className="results-cta-primary"
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('leadCapture')}
        >
          🔔 Get Your Personalized Plans at Launch
        </motion.button>
        <button
          className="results-cta-secondary"
          onClick={() => navigate('leadCapture')}
        >
          💬 Talk to an Insurance Advisor
        </button>
      </motion.div>
    </div>
  )
}
