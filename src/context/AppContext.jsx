import { createContext, useContext, useReducer, useCallback } from 'react'
import { trackEvent } from '../utils/analytics'

const AppContext = createContext(null)

const initialState = {
  screen: 'landing',
  insuranceType: null,     // health | motor | life
  quizStep: 0,
  answers: {},
  recommendation: null,
  leadData: null,
  abVariant: Math.random() > 0.5 ? 'A' : 'B',
  startTime: null,
  completionTime: null,
  // Gamification
  points: 0,
  protectionScore: 0,
  persona: null,
  lastReward: null,        // { text, points } — shown briefly after each answer
  totalPossiblePoints: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.payload }
    case 'SELECT_INSURANCE':
      return {
        ...state,
        insuranceType: action.payload,
        screen: 'quiz',
        quizStep: 0,
        answers: {},
        points: 0,
        protectionScore: 0,
        persona: null,
        lastReward: null,
        startTime: Date.now(),
      }
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.questionId]: action.payload.answer },
        points: state.points + (action.payload.points || 0),
        lastReward: action.payload.reward || null,
      }
    case 'CLEAR_REWARD':
      return { ...state, lastReward: null }
    case 'NEXT_STEP':
      return { ...state, quizStep: state.quizStep + 1 }
    case 'PREV_STEP':
      return { ...state, quizStep: Math.max(0, state.quizStep - 1) }
    case 'SET_RECOMMENDATION':
      return {
        ...state,
        recommendation: action.payload,
        protectionScore: action.payload.protectionScore || 0,
        persona: action.payload.persona || null,
        screen: 'results',
        completionTime: Date.now(),
      }
    case 'SET_LEAD_DATA':
      return { ...state, leadData: action.payload, screen: 'thankYou' }
    case 'RESTART':
      return { ...initialState, abVariant: state.abVariant }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const navigate = useCallback((screen) => {
    trackEvent('screen_view', { screen })
    dispatch({ type: 'SET_SCREEN', payload: screen })
  }, [])

  const selectInsurance = useCallback((type) => {
    trackEvent('insurance_selected', { type })
    dispatch({ type: 'SELECT_INSURANCE', payload: type })
  }, [])

  const answerQuestion = useCallback((questionId, answer, points, reward) => {
    trackEvent('question_answered', { questionId, answer, points })
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId, answer, points, reward },
    })
  }, [])

  const clearReward = useCallback(() => {
    dispatch({ type: 'CLEAR_REWARD' })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const setRecommendation = useCallback((rec) => {
    trackEvent('recommendation_generated', {
      type: rec.type,
      protectionScore: rec.protectionScore,
      persona: rec.persona,
    })
    dispatch({ type: 'SET_RECOMMENDATION', payload: rec })
  }, [])

  const submitLead = useCallback((data) => {
    trackEvent('lead_submitted', { type: state.insuranceType, ...data })
    dispatch({ type: 'SET_LEAD_DATA', payload: data })
  }, [state.insuranceType])

  const restart = useCallback(() => {
    trackEvent('flow_restarted')
    dispatch({ type: 'RESTART' })
  }, [])

  const value = {
    ...state,
    navigate,
    selectInsurance,
    answerQuestion,
    clearReward,
    nextStep,
    prevStep,
    setRecommendation,
    submitLead,
    restart,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
