// --- Persona assignment ---
const PERSONAS = {
  familyProtector: { name: 'Family Protector', icon: '🛡️', tagline: 'You put your loved ones first' },
  smartPlanner: { name: 'Smart Planner', icon: '🧠', tagline: 'Calculated and covered' },
  riskTaker: { name: 'Risk Taker', icon: '🎲', tagline: 'Living on the edge — but let\'s add a net' },
  risingStar: { name: 'Rising Star', icon: '🌟', tagline: 'Starting strong, building smart' },
  safetyFirst: { name: 'Safety First', icon: '🏰', tagline: 'Maximum protection, zero compromise' },
}

function assignPersona(answers, type, points, maxPoints) {
  const ratio = points / maxPoints

  if (type === 'health') {
    if (answers.coverage_for === 'family' || answers.coverage_for === 'parents') return PERSONAS.familyProtector
    if (answers.existing_cover === 'personal' && ratio > 0.7) return PERSONAS.smartPlanner
    if (answers.budget === '3000+') return PERSONAS.safetyFirst
    if (answers.existing_cover === 'none' && answers.budget === '500-1000') return PERSONAS.riskTaker
    return PERSONAS.risingStar
  }
  if (type === 'motor') {
    if (answers.priority === 'max_coverage') return PERSONAS.safetyFirst
    if (answers.existing_insurance === 'comprehensive') return PERSONAS.smartPlanner
    if (answers.existing_insurance === 'none' || answers.existing_insurance === 'expired') return PERSONAS.riskTaker
    if (answers.vehicle_age === 'new') return PERSONAS.risingStar
    return PERSONAS.smartPlanner
  }
  if (type === 'life') {
    if (answers.life_stage === 'kids' || answers.dependents === '3-4' || answers.dependents === '5+') return PERSONAS.familyProtector
    if (answers.existing_life_cover === 'term' && ratio > 0.7) return PERSONAS.smartPlanner
    if (answers.protection_goal === 'family_income' || answers.protection_goal === 'kids_education') return PERSONAS.familyProtector
    if (answers.existing_life_cover === 'none') return PERSONAS.risingStar
    if (answers.annual_income === '20l+') return PERSONAS.safetyFirst
    return PERSONAS.risingStar
  }
  return PERSONAS.risingStar
}

function calcProtectionScore(points, maxPoints) {
  return Math.min(100, Math.round((points / maxPoints) * 100))
}

// --- Health ---
export function getHealthRecommendation(answers, points) {
  const { coverage_for, age_group, existing_cover, health_status, budget } = answers
  const maxPoints = 65

  let coverageAmount = 500000
  let tips = []
  let planName = 'Essential Health Plan'

  const coverageMultiplier = { self: 1, couple: 1.8, family: 2.5, parents: 2 }
  coverageAmount *= (coverageMultiplier[coverage_for] || 1)

  const ageMultiplier = { '18-25': 0.8, '26-35': 1, '36-45': 1.5, '46-55': 2, '55+': 2.5 }
  coverageAmount *= (ageMultiplier[age_group] || 1)

  const budgetScale = { '500-1000': 0.7, '1000-2000': 1, '2000-3000': 1.5, '3000+': 2 }
  coverageAmount *= (budgetScale[budget] || 1)

  coverageAmount = Math.round(coverageAmount / 100000) * 100000
  coverageAmount = Math.max(coverageAmount, 300000)
  coverageAmount = Math.min(coverageAmount, 5000000)

  let riskLevel = 'low'
  if (existing_cover === 'none' || existing_cover === 'unsure') {
    riskLevel = 'high'
    tips.push('You\'re uninsured — one hospital visit could wipe out your savings')
  }
  if (existing_cover === 'employer') {
    riskLevel = 'medium'
    tips.push('Employer insurance vanishes when you switch jobs — always have personal cover')
  }

  const conditions = Array.isArray(health_status) ? health_status : [health_status]
  if (!conditions.includes('none') && health_status) {
    riskLevel = riskLevel === 'low' ? 'medium' : 'high'
    tips.push('With pre-existing conditions, waiting longer = more expensive premiums')
  }

  if (age_group === '46-55' || age_group === '55+') {
    tips.push('Premiums jump significantly after 45 — locking in now saves thousands')
  }

  if (coverage_for === 'parents') {
    tips.push('Senior plans have waiting periods — the earlier you start, the better')
  }

  if (coverageAmount >= 2000000) planName = 'Premium Shield Plan'
  else if (coverageAmount >= 1000000) planName = 'Smart Health Plan'

  const premiumBase = { '18-25': 450, '26-35': 700, '36-45': 1100, '46-55': 1800, '55+': 2800 }
  let monthlyPremium = premiumBase[age_group] || 800
  monthlyPremium *= (coverageMultiplier[coverage_for] || 1)
  monthlyPremium = Math.round(monthlyPremium / 10) * 10

  const protectionScore = calcProtectionScore(points, maxPoints)
  const persona = assignPersona(answers, 'health', points, maxPoints)

  return {
    type: 'health',
    planName,
    coverageAmount,
    monthlyPremium,
    riskLevel,
    tips,
    protectionScore,
    persona,
    points,
    maxPoints,
    highlights: [
      'Cashless treatment at 10,000+ hospitals',
      'No room rent capping',
      'Day-care procedures covered',
      'Free annual health check-up',
    ],
    coverageFor: coverage_for,
  }
}

// --- Motor ---
export function getMotorRecommendation(answers, points) {
  const { vehicle_type, vehicle_age, usage, existing_insurance, priority } = answers
  const maxPoints = 65

  let planName = 'Comprehensive Motor Plan'
  let riskLevel = 'low'
  let tips = []

  const vehiclePricing = {
    car: { base: 8000, idv: 500000 },
    bike: { base: 3000, idv: 80000 },
    scooter: { base: 2500, idv: 60000 },
  }
  const vehicle = vehiclePricing[vehicle_type] || vehiclePricing.car
  let annualPremium = vehicle.base
  let idv = vehicle.idv

  const ageFactor = {
    new: { premium: 1.1, idv: 1 },
    '1-3': { premium: 1, idv: 0.8 },
    '3-5': { premium: 0.9, idv: 0.6 },
    '5+': { premium: 0.8, idv: 0.4 },
  }
  const af = ageFactor[vehicle_age] || ageFactor['1-3']
  annualPremium *= af.premium
  idv *= af.idv

  if (usage === 'daily') {
    annualPremium *= 1.15
    tips.push('Daily drivers face 30% higher accident risk — comprehensive cover is your best friend')
  }
  if (usage === 'commercial') {
    annualPremium *= 1.3
    tips.push('Business vehicles need specialized coverage — check for commercial add-ons')
  }

  if (existing_insurance === 'none' || existing_insurance === 'expired') {
    riskLevel = 'high'
    tips.push('Driving uninsured is illegal in India — fines + vehicle seizure risk')
  }
  if (existing_insurance === 'third_party') {
    riskLevel = 'medium'
    tips.push('Third-party only means YOUR vehicle damage comes from your pocket')
  }

  if (priority === 'max_coverage') {
    planName = 'All-in-One Motor Shield'
    annualPremium *= 1.2
  } else if (priority === 'low_premium') {
    planName = 'Value Motor Plan'
    annualPremium *= 0.85
  } else if (priority === 'roadside') {
    planName = 'Motor + Roadside Plan'
  }

  annualPremium = Math.round(annualPremium / 100) * 100
  idv = Math.round(idv / 1000) * 1000

  const highlights = [
    'Own damage + third-party cover',
    'Cashless repairs at 5,000+ garages',
    'Zero depreciation add-on available',
  ]
  if (priority === 'roadside') highlights.push('24/7 roadside assistance included')
  else highlights.push('Personal accident cover included')

  const protectionScore = calcProtectionScore(points, maxPoints)
  const persona = assignPersona(answers, 'motor', points, maxPoints)

  return {
    type: 'motor',
    planName,
    annualPremium,
    monthlyPremium: Math.round(annualPremium / 12 / 10) * 10,
    idv,
    riskLevel,
    tips,
    protectionScore,
    persona,
    points,
    maxPoints,
    highlights,
    vehicleType: vehicle_type,
  }
}

// --- Life ---
export function getLifeRecommendation(answers, points) {
  const { life_stage, dependents, annual_income, existing_life_cover, protection_goal } = answers
  const maxPoints = 70

  let tips = []
  let planName = 'Essential Term Plan'

  const incomeMap = { below_5l: 400000, '5-10l': 750000, '10-20l': 1500000, '20l+': 3000000 }
  const annualIncome = incomeMap[annual_income] || 750000

  // Coverage = 10-15x income, adjusted by dependents
  const depMultiplier = { '0': 8, '1-2': 12, '3-4': 15, '5+': 18 }
  let coverageAmount = annualIncome * (depMultiplier[dependents] || 10)

  // Adjust by life stage
  if (life_stage === 'kids') coverageAmount *= 1.2
  if (life_stage === 'empty_nest') coverageAmount *= 0.8

  // Round to nearest 5L
  coverageAmount = Math.round(coverageAmount / 500000) * 500000
  coverageAmount = Math.max(coverageAmount, 2500000)
  coverageAmount = Math.min(coverageAmount, 50000000)

  // Plan name
  if (coverageAmount >= 20000000) planName = 'Premium Life Shield'
  else if (coverageAmount >= 10000000) planName = 'Smart Term Plan'
  else if (coverageAmount >= 5000000) planName = 'Secure Life Plan'

  // Risk assessment
  let riskLevel = 'low'
  if (existing_life_cover === 'none') {
    riskLevel = 'high'
    tips.push('Zero life cover means your family has no financial safety net — this is critical')
  }
  if (existing_life_cover === 'employer') {
    riskLevel = 'medium'
    tips.push('Company life insurance is usually only 2-3x salary and ends when you leave')
  }
  if (existing_life_cover === 'traditional') {
    riskLevel = 'medium'
    tips.push('Traditional policies often give ₹5-10L cover — way below recommended levels')
  }

  if (dependents !== '0') {
    if (life_stage === 'kids') tips.push('With children, securing their education and living expenses is top priority')
    if (protection_goal === 'home_loan') tips.push('A term plan covering your home loan ensures your family keeps the house')
  }

  if (life_stage === 'single' && dependents === '0') {
    tips.push('Even without dependents, locking in a term plan now means the lowest premiums ever')
  }

  // Premium estimate
  const ageBase = {
    single: 500,    // assumed younger
    married: 700,
    kids: 900,
    empty_nest: 1500,
  }
  let monthlyPremium = ageBase[life_stage] || 700
  monthlyPremium *= (coverageAmount / 10000000) // scale by coverage
  monthlyPremium = Math.max(monthlyPremium, 400)
  monthlyPremium = Math.round(monthlyPremium / 10) * 10

  const highlights = [
    `₹${(coverageAmount / 100000).toFixed(0)}L cover for your family`,
    'Tax benefit under Section 80C',
    'Critical illness add-on available',
    'Premium stays fixed for entire term',
  ]

  if (protection_goal === 'kids_education') {
    highlights.push('Education funding rider available')
  }

  const protectionScore = calcProtectionScore(points, maxPoints)
  const persona = assignPersona(answers, 'life', points, maxPoints)

  return {
    type: 'life',
    planName,
    coverageAmount,
    monthlyPremium,
    riskLevel,
    tips,
    protectionScore,
    persona,
    points,
    maxPoints,
    highlights,
    lifeStage: life_stage,
    dependents,
  }
}
