import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { healthQuestions } from '../data/healthQuestions'
import { motorQuestions } from '../data/motorQuestions'
import { lifeQuestions } from '../data/lifeQuestions'
import { getHealthRecommendation, getMotorRecommendation, getLifeRecommendation } from '../data/recommendations'
import { trackEvent } from '../utils/analytics'
import '../styles/Quiz.css'

const questionSets = { health: healthQuestions, motor: motorQuestions, life: lifeQuestions }
const recFunctions = { health: getHealthRecommendation, motor: getMotorRecommendation, life: getLifeRecommendation }
const typeLabels = { health: '🏥 Health Shield', motor: '🚗 Motor Shield', life: '💙 Life Shield' }

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
}

export default function QuizFlow() {
  const {
    insuranceType, quizStep, answers, points,
    answerQuestion, clearReward, lastReward,
    nextStep, prevStep, setRecommendation, navigate,
  } = useApp()

  const [direction, setDirection] = useState(1)
  const [showReward, setShowReward] = useState(false)

  const questions = questionSets[insuranceType] || healthQuestions
  const currentQuestion = questions[quizStep]
  const totalSteps = questions.length
  const progress = ((quizStep + 1) / totalSteps) * 100
  const currentAnswer = answers[currentQuestion.id]

  const isAnswered = currentQuestion.type === 'multi'
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : currentAnswer != null

  // Show reward toast when lastReward changes
  useEffect(() => {
    if (lastReward) {
      setShowReward(true)
      const timer = setTimeout(() => {
        setShowReward(false)
        clearReward()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [lastReward, clearReward])

  const handleSelect = useCallback((value) => {
    const option = currentQuestion.options.find(o => o.value === value)
    const optPoints = option?.points || 5

    // Determine reward message
    let reward = null
    if (currentQuestion.rewards) {
      if (currentQuestion.type === 'multi') {
        reward = currentQuestion.rewards[value] || currentQuestion.rewards._default
      } else {
        reward = currentQuestion.rewards[value]
      }
    }

    if (currentQuestion.type === 'multi') {
      const current = Array.isArray(currentAnswer) ? currentAnswer : []
      if (option?.exclusive) {
        answerQuestion(currentQuestion.id, [value], optPoints, reward)
      } else {
        const filtered = current.filter(v => {
          const o = currentQuestion.options.find(o => o.value === v)
          return !o?.exclusive
        })
        if (filtered.includes(value)) {
          answerQuestion(currentQuestion.id, filtered.filter(v => v !== value), 0, null)
        } else {
          answerQuestion(currentQuestion.id, [...filtered, value], optPoints, reward)
        }
      }
    } else {
      answerQuestion(currentQuestion.id, value, optPoints, reward)
    }
  }, [currentQuestion, currentAnswer, answerQuestion])

  const isSelected = (value) => {
    if (currentQuestion.type === 'multi') {
      return Array.isArray(currentAnswer) && currentAnswer.includes(value)
    }
    return currentAnswer === value
  }

  const handleNext = () => {
    if (quizStep < totalSteps - 1) {
      setDirection(1)
      nextStep()
    } else {
      trackEvent('quiz_completed', { type: insuranceType, answers, points })
      const getRecommendation = recFunctions[insuranceType]
      const rec = getRecommendation(answers, points)
      setRecommendation(rec)
    }
  }

  const handleBack = () => {
    if (quizStep > 0) {
      setDirection(-1)
      prevStep()
    } else {
      navigate('selector')
    }
  }

  // Determine insight text
  const insightText = currentQuestion.insight?.[currentAnswer]
  const inlineInsight = currentQuestion.inlineInsight

  // Protection level text based on progress
  const protectionText = progress <= 20 ? "Let's get started!"
    : progress <= 40 ? "You're building your shield..."
    : progress <= 60 ? "Halfway there! Looking good 👀"
    : progress <= 80 ? "Almost done! Your score is taking shape"
    : "Last question! Let's finish strong 💪"

  return (
    <div className="quiz-container">
      {/* Header with gamified progress */}
      <div className="quiz-header">
        <div className="quiz-header-top">
          <button className="quiz-back-btn" onClick={handleBack}>←</button>
          <span className="quiz-step-label">{typeLabels[insuranceType]}</span>
          <button className="quiz-close-btn" onClick={() => navigate('selector')}>✕</button>
        </div>

        <div className="quiz-progress">
          <motion.div
            className="quiz-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="quiz-gamification-bar">
          <span className="quiz-progress-text">{protectionText}</span>
          <motion.span
            className="quiz-points-badge"
            key={points}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ⭐ {points} pts
          </motion.span>
        </div>
      </div>

      {/* Reward toast */}
      <AnimatePresence>
        {showReward && lastReward && (
          <motion.div
            className="quiz-reward-toast"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="quiz-reward-text">{lastReward.text}</span>
            <span className="quiz-reward-points">+{lastReward.points} pts</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestion.id}
          className="quiz-content"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <h2 className="quiz-question-text">{currentQuestion.question}</h2>
          <p className="quiz-question-subtitle">{currentQuestion.subtitle}</p>

          <div className="quiz-options">
            {currentQuestion.options.map((option) => (
              <motion.button
                key={option.value}
                className={`quiz-option ${isSelected(option.value) ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div className="quiz-option-icon">{option.icon}</div>
                <div className="quiz-option-content">
                  <div className="quiz-option-label">{option.label}</div>
                  {option.description && (
                    <div className="quiz-option-desc">{option.description}</div>
                  )}
                </div>
                <div className="quiz-option-right">
                  <span className="quiz-option-points">+{option.points}</span>
                  <div className="quiz-option-check">
                    {isSelected(option.value) && '✓'}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Inline insight — always visible */}
          {inlineInsight && !insightText && (
            <motion.div
              className="quiz-insight inline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="quiz-insight-icon">💡</span>
              <span className="quiz-insight-text">{inlineInsight}</span>
            </motion.div>
          )}

          {/* Conditional insight — based on selected answer */}
          <AnimatePresence>
            {insightText && (
              <motion.div
                className="quiz-insight"
                initial={{ opacity: 0, y: 10, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, y: -10, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="quiz-insight-icon">💡</span>
                <span className="quiz-insight-text">{insightText}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="quiz-bottom">
        <motion.button
          className="quiz-next-btn"
          disabled={!isAnswered}
          onClick={handleNext}
          whileTap={isAnswered ? { scale: 0.97 } : {}}
        >
          {quizStep === totalSteps - 1 ? '✨ Reveal My Score' : 'Continue →'}
        </motion.button>
      </div>
    </div>
  )
}
