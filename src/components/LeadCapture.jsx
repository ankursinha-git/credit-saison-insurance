import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import '../styles/LeadCapture.css'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

export default function LeadCapture() {
  const { submitLead, navigate, insuranceType, recommendation, protectionScore } = useApp()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState(null)

  const isValid = name.trim().length >= 2 && phone.trim().length >= 10 && interest

  const handleSubmit = () => {
    if (!isValid) return
    submitLead({
      name: name.trim(),
      phone: phone.trim(),
      interest,
      insuranceType,
      planName: recommendation?.planName,
      protectionScore,
    })
  }

  const typeLabel = insuranceType === 'health' ? 'health'
    : insuranceType === 'life' ? 'life'
    : 'motor'

  return (
    <div className="lead-container">
      <motion.div
        className="lead-header"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button className="lead-back-btn" onClick={() => navigate('results')}>←</button>
      </motion.div>

      <motion.div
        className="lead-icon-wrapper"
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        🚀
      </motion.div>

      <motion.h1
        className="lead-title"
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        You scored {protectionScore}/100!
      </motion.h1>

      <motion.p
        className="lead-subtitle"
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        We're building the best {typeLabel} insurance plans for people like you. Drop your details and we'll give you early access + exclusive launch pricing.
      </motion.p>

      <motion.div
        className="lead-form"
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="lead-input-group">
          <label className="lead-input-label">What should we call you?</label>
          <input
            className="lead-input"
            type="text"
            placeholder="e.g., Rahul"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="lead-input-group">
          <label className="lead-input-label">Best number to reach you</label>
          <input
            className="lead-input"
            type="tel"
            placeholder="e.g., 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            autoComplete="tel"
          />
        </div>

        <div className="lead-input-group">
          <label className="lead-input-label">How would you like to hear from us?</label>
          <div className="lead-options">
            <button
              className={`lead-option ${interest === 'notify' ? 'selected' : ''}`}
              onClick={() => setInterest('notify')}
            >
              <div className="lead-option-icon">🔔</div>
              <div className="lead-option-content">
                <div className="lead-option-label">Get personalized plans at launch</div>
                <div className="lead-option-desc">First to know, best prices</div>
              </div>
            </button>
            <button
              className={`lead-option ${interest === 'advisor' ? 'selected' : ''}`}
              onClick={() => setInterest('advisor')}
            >
              <div className="lead-option-icon">💬</div>
              <div className="lead-option-content">
                <div className="lead-option-label">Quick chat with an expert</div>
                <div className="lead-option-desc">Free, no-pressure guidance</div>
              </div>
            </button>
            <button
              className={`lead-option ${interest === 'both' ? 'selected' : ''}`}
              onClick={() => setInterest('both')}
            >
              <div className="lead-option-icon">⚡</div>
              <div className="lead-option-content">
                <div className="lead-option-label">Both — plans + expert call</div>
                <div className="lead-option-desc">The full experience</div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="lead-bottom"
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          className="lead-submit-btn"
          disabled={!isValid}
          onClick={handleSubmit}
          whileTap={isValid ? { scale: 0.97 } : {}}
        >
          Get Early Access 🚀
        </motion.button>
        <div
          className="lead-skip"
          onClick={() => submitLead({ skipped: true, insuranceType })}
        >
          Maybe later
        </div>
        <div className="lead-privacy">
          <span>🔒</span> No spam, ever. Unsubscribe anytime.
        </div>
      </motion.div>
    </div>
  )
}
