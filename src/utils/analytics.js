const events = []

export function trackEvent(name, data = {}) {
  const event = {
    name,
    data,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  }
  events.push(event)

  if (typeof window !== 'undefined' && window.__CS_DEBUG__) {
    console.log('[Analytics]', name, data)
  }
}

export function getEvents() {
  return [...events]
}

export function getSessionId() {
  if (typeof window === 'undefined') return 'server'
  if (!window.__CS_SESSION__) {
    window.__CS_SESSION__ = 'cs_' + Math.random().toString(36).substring(2, 10)
  }
  return window.__CS_SESSION__
}

export function getFunnelMetrics() {
  const screenViews = events.filter(e => e.name === 'screen_view')
  const questionsAnswered = events.filter(e => e.name === 'question_answered')
  const recommendations = events.filter(e => e.name === 'recommendation_generated')
  const leads = events.filter(e => e.name === 'lead_submitted')

  return {
    totalScreenViews: screenViews.length,
    questionsAnswered: questionsAnswered.length,
    recommendationsGenerated: recommendations.length,
    leadsSubmitted: leads.length,
    insuranceTypeInterest: events
      .filter(e => e.name === 'insurance_selected')
      .reduce((acc, e) => {
        acc[e.data.type] = (acc[e.data.type] || 0) + 1
        return acc
      }, {}),
  }
}

// Enable debug mode by default in development
if (typeof window !== 'undefined') {
  window.__CS_DEBUG__ = true
  window.__CS_ANALYTICS__ = { getEvents, getFunnelMetrics }
}
