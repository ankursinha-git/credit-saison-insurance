import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { getFunnelMetrics } from '../utils/analytics'
import '../styles/LeadCapture.css'

export default function ThankYou() {
  const { restart, recommendation, leadData, insuranceType, protectionScore, persona, points } = useApp()
  const metrics = getFunnelMetrics()
  const skipped = leadData?.skipped

  const typeLabel = insuranceType === 'health' ? '🏥 Health'
    : insuranceType === 'life' ? '💙 Life'
    : '🚗 Motor'

  return (
    <div className="thankyou-container">
      <motion.div
        className="thankyou-icon"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        {skipped ? '👋' : '🎉'}
      </motion.div>

      <motion.h1
        className="thankyou-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {skipped ? 'No worries!' : "You're on the list!"}
      </motion.h1>

      <motion.p
        className="thankyou-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {skipped
          ? 'Come back anytime to retake the quiz. Your protection score will be waiting!'
          : `We'll reach out when ${recommendation?.planName || 'your personalized plans'} go live. Early access = best prices.`}
      </motion.p>

      <motion.div
        className="thankyou-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="thankyou-summary-title">Your Quiz Results</div>
        <div className="thankyou-summary-row">
          <span className="thankyou-summary-label">Category</span>
          <span className="thankyou-summary-value">{typeLabel}</span>
        </div>
        <div className="thankyou-summary-row">
          <span className="thankyou-summary-label">Protection Score</span>
          <span className="thankyou-summary-value">{protectionScore}/100 ⭐</span>
        </div>
        <div className="thankyou-summary-row">
          <span className="thankyou-summary-label">Points Earned</span>
          <span className="thankyou-summary-value">{points} pts</span>
        </div>
        {persona && (
          <div className="thankyou-summary-row">
            <span className="thankyou-summary-label">Your Persona</span>
            <span className="thankyou-summary-value">{persona.icon} {persona.name}</span>
          </div>
        )}
        <div className="thankyou-summary-row">
          <span className="thankyou-summary-label">Recommended Plan</span>
          <span className="thankyou-summary-value">{recommendation?.planName}</span>
        </div>
        <div className="thankyou-summary-row">
          <span className="thankyou-summary-label">Est. Monthly</span>
          <span className="thankyou-summary-value">
            ₹{recommendation?.monthlyPremium?.toLocaleString('en-IN')}
          </span>
        </div>
        {!skipped && leadData?.interest && (
          <div className="thankyou-summary-row">
            <span className="thankyou-summary-label">You chose</span>
            <span className="thankyou-summary-value">
              {leadData.interest === 'notify' && '🔔 Launch notification'}
              {leadData.interest === 'advisor' && '💬 Expert call'}
              {leadData.interest === 'both' && '⚡ Plans + expert call'}
            </span>
          </div>
        )}
      </motion.div>

      <motion.button
        className="thankyou-restart"
        onClick={restart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.97 }}
      >
        🎮 Try Another Category
      </motion.button>

      <motion.p
        className="thankyou-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Credit Saison India · Protection Score Quiz
      </motion.p>

      {typeof window !== 'undefined' && window.__CS_DEBUG__ && (
        <motion.div
          style={{
            marginTop: 24,
            padding: '12px 16px',
            background: '#f1f5f9',
            borderRadius: 12,
            fontSize: 11,
            color: '#64748b',
            textAlign: 'left',
            width: '100%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>📊 Funnel Metrics (Debug)</div>
          <div>Screen views: {metrics.totalScreenViews}</div>
          <div>Questions answered: {metrics.questionsAnswered}</div>
          <div>Recommendations: {metrics.recommendationsGenerated}</div>
          <div>Leads: {metrics.leadsSubmitted}</div>
          <div>Interest: {JSON.stringify(metrics.insuranceTypeInterest)}</div>
        </motion.div>
      )}
    </div>
  )
}
