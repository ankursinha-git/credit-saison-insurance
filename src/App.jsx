import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from './context/AppContext'
import Landing from './components/Landing'
import InsuranceSelector from './components/InsuranceSelector'
import QuizFlow from './components/QuizFlow'
import Results from './components/Results'
import LeadCapture from './components/LeadCapture'
import ThankYou from './components/ThankYou'

const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.25, ease: 'easeInOut' },
}

function getScreen(screen) {
  switch (screen) {
    case 'landing':
      return <Landing key="landing" />
    case 'selector':
      return <InsuranceSelector key="selector" />
    case 'quiz':
      return <QuizFlow key="quiz" />
    case 'results':
      return <Results key="results" />
    case 'leadCapture':
      return <LeadCapture key="leadCapture" />
    case 'thankYou':
      return <ThankYou key="thankYou" />
    default:
      return <Landing key="landing" />
  }
}

export default function App() {
  const { screen } = useApp()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        {...pageTransition}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {getScreen(screen)}
      </motion.div>
    </AnimatePresence>
  )
}
