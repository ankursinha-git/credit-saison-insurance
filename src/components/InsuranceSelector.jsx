import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import '../styles/Quiz.css'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function InsuranceSelector() {
  const { selectInsurance, navigate } = useApp()

  return (
    <div className="selector-container">
      <motion.div
        className="selector-header"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button className="selector-back" onClick={() => navigate('landing')}>
          ←
        </button>
        <span className="selector-title">Pick Your Quest 🎮</span>
      </motion.div>

      <motion.p
        className="selector-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Choose a category and take a quick 60-second quiz. We'll reveal your protection score and personalized insights!
      </motion.p>

      <div className="selector-cards">
        <motion.div
          className="selector-card health"
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileTap={{ scale: 0.97 }}
          onClick={() => selectInsurance('health')}
        >
          <div className="selector-card-icon">🏥</div>
          <div className="selector-card-title">Health Shield</div>
          <div className="selector-card-desc">
            How protected is your health? 5 quick questions to find out. Takes under 60 seconds!
          </div>
          <div className="selector-card-tags">
            <span className="selector-card-tag">5 Questions</span>
            <span className="selector-card-tag">60 sec</span>
            <span className="selector-card-tag">Free</span>
          </div>
          <span className="selector-card-arrow">→</span>
        </motion.div>

        <motion.div
          className="selector-card life"
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileTap={{ scale: 0.97 }}
          onClick={() => selectInsurance('life')}
        >
          <div className="selector-card-icon">💙</div>
          <div className="selector-card-title">Life Shield</div>
          <div className="selector-card-desc">
            Is your family financially protected? Find out your life coverage gap in a minute.
          </div>
          <div className="selector-card-tags">
            <span className="selector-card-tag">5 Questions</span>
            <span className="selector-card-tag">60 sec</span>
            <span className="selector-card-tag">Free</span>
          </div>
          <span className="selector-card-arrow">→</span>
        </motion.div>

        <motion.div
          className="selector-card motor"
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileTap={{ scale: 0.97 }}
          onClick={() => selectInsurance('motor')}
        >
          <div className="selector-card-icon">🚗</div>
          <div className="selector-card-title">Motor Shield</div>
          <div className="selector-card-desc">
            Is your ride covered? Quick check to see if your vehicle is properly protected.
          </div>
          <div className="selector-card-tags">
            <span className="selector-card-tag">5 Questions</span>
            <span className="selector-card-tag">60 sec</span>
            <span className="selector-card-tag">Free</span>
          </div>
          <span className="selector-card-arrow">→</span>
        </motion.div>
      </div>

      <motion.div
        className="selector-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="selector-footer-text">
          🔒 100% private · No sign-up needed
        </p>
      </motion.div>
    </div>
  )
}
