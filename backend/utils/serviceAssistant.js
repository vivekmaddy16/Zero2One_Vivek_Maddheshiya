const CATEGORY_LABELS = {
  electrician: 'Electrician',
  plumber: 'Plumber',
  tutor: 'Tutor',
  delivery: 'Delivery',
  cleaning: 'Cleaning',
  painting: 'Painting',
  carpentry: 'Carpentry',
  other: 'General Service',
};

const CATEGORY_KEYWORDS = {
  electrician: [
    'electric',
    'electrical',
    'power',
    'socket',
    'switch',
    'wire',
    'wiring',
    'fan',
    'light',
    'bulb',
    'inverter',
    'short circuit',
    'ac',
    'air conditioner',
    'appliance',
    'fridge',
    'refrigerator',
    'washing machine',
    'microwave',
  ],
  plumber: [
    'plumber',
    'tap',
    'faucet',
    'leak',
    'leaking',
    'pipe',
    'drain',
    'sink',
    'toilet',
    'flush',
    'shower',
    'wash basin',
    'bathroom',
    'water',
    'motor',
    'pump',
    'tank',
    'geyser',
  ],
  tutor: [
    'tutor',
    'tuition',
    'teacher',
    'coaching',
    'study',
    'class',
    'classes',
    'math',
    'mathematics',
    'science',
    'physics',
    'chemistry',
    'biology',
    'coding',
    'programming',
    'python',
    'javascript',
    'exam',
    'jee',
    'neet',
  ],
  delivery: [
    'delivery',
    'deliver',
    'courier',
    'parcel',
    'package',
    'pickup',
    'pick up',
    'drop',
    'drop off',
    'moving',
    'move',
    'transport',
    'shift',
    'grocery',
    'groceries',
    'same day',
    'urgent',
  ],
  cleaning: [
    'clean',
    'cleaning',
    'deep clean',
    'dust',
    'mop',
    'sanitize',
    'sanitise',
    'washroom',
    'bathroom clean',
    'sofa clean',
    'kitchen clean',
  ],
  painting: [
    'paint',
    'painting',
    'repaint',
    'wall paint',
    'wall color',
    'colour',
    'color',
    'primer',
    'interior paint',
    'exterior paint',
  ],
  carpentry: [
    'carpenter',
    'wood',
    'wooden',
    'cupboard',
    'wardrobe',
    'cabinet',
    'shelf',
    'table',
    'chair',
    'bed',
    'door',
    'window',
    'furniture repair',
    'furniture',
  ],
  other: [],
};

const CATEGORY_HINTS = {
  electrician: 'This sounds like an electrical or appliance issue.',
  plumber: 'This sounds like a plumbing or water-related issue.',
  tutor: 'This looks like a learning, tutoring, or coaching request.',
  delivery: 'This sounds like a pickup, drop, or transport request.',
  cleaning: 'This sounds like a cleaning or sanitization request.',
  painting: 'This sounds like a wall, room, or paint-related job.',
  carpentry: 'This sounds like a woodwork or furniture-related job.',
  other: 'This looks like a general service need.',
};

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'be',
  'for',
  'from',
  'help',
  'i',
  'in',
  'is',
  'it',
  'me',
  'my',
  'need',
  'of',
  'on',
  'please',
  'some',
  'the',
  'to',
  'with',
]);

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function scoreKeywordMatches(normalizedQuery, category) {
  const matches = [];
  let score = 0;

  for (const keyword of CATEGORY_KEYWORDS[category] || []) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) continue;

    if (normalizedQuery.includes(normalizedKeyword)) {
      matches.push(keyword);
      score += normalizedKeyword.includes(' ') ? 4 : 3;
    }
  }

  return { matches: unique(matches), score };
}

function getQueryTokens(normalizedQuery) {
  return unique(
    normalizedQuery
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  );
}

function buildServiceText(service) {
  return normalizeText(
    [
      service.title,
      service.description,
      service.category,
      ...(service.tags || []),
      service.providerId?.name,
      service.providerId?.location,
    ]
      .filter(Boolean)
      .join(' ')
  );
}

function scoreServiceAgainstQuery(service, normalizedQuery, queryTokens) {
  const serviceText = buildServiceText(service);
  let score = 0;
  const matchedTokens = [];

  if (normalizedQuery && serviceText.includes(normalizedQuery)) {
    score += 8;
  }

  for (const token of queryTokens) {
    if (serviceText.includes(token)) {
      matchedTokens.push(token);
      score += token.length >= 6 ? 1.5 : 1;
    }
  }

  return {
    score,
    matchedTokens: unique(matchedTokens),
  };
}

function compareServiceMatches(a, b) {
  return (
    b.matchScore - a.matchScore ||
    (b.avgRating || 0) - (a.avgRating || 0) ||
    (b.totalRatings || 0) - (a.totalRatings || 0)
  );
}

function getConfidence(score, secondBestScore, matchedKeywordCount) {
  if (score >= 10 || (matchedKeywordCount >= 2 && score >= secondBestScore + 4)) {
    return 'high';
  }

  if (score >= 5 || matchedKeywordCount >= 1) {
    return 'medium';
  }

  return 'low';
}

function summarizeReason(category, matchedKeywords, confidence) {
  const base = CATEGORY_HINTS[category] || CATEGORY_HINTS.other;

  if (!matchedKeywords.length) {
    return confidence === 'low'
      ? `${base} I can refine it more if you tell me what item is affected.`
      : base;
  }

  const keywordText = matchedKeywords.slice(0, 3).join(', ');
  return `${base} I matched words like ${keywordText}.`;
}

function getFallbackServices(services) {
  return [...services]
    .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0) || (b.totalRatings || 0) - (a.totalRatings || 0))
    .slice(0, 3);
}

function analyzeServiceNeed(services, userMessage) {
  const normalizedQuery = normalizeText(userMessage);
  const queryTokens = getQueryTokens(normalizedQuery);

  const categoryAnalyses = Object.keys(CATEGORY_LABELS)
    .filter((category) => category !== 'other')
    .map((category) => {
      const keywordResult = scoreKeywordMatches(normalizedQuery, category);
      const scoringTokens = unique([
        ...queryTokens,
        ...keywordResult.matches.map((keyword) => normalizeText(keyword)),
      ]);
      const matchingServices = services
        .filter((service) => service.category === category)
        .map((service) => {
          const queryMatch = scoreServiceAgainstQuery(service, normalizedQuery, scoringTokens);
          return {
            ...service.toObject(),
            matchScore: queryMatch.score,
            matchedTokens: queryMatch.matchedTokens,
          };
        })
        .filter((service) => service.matchScore > 0)
        .sort(compareServiceMatches);

      const score =
        keywordResult.score +
        matchingServices.slice(0, 3).reduce((total, service) => total + service.matchScore, 0);

      return {
        category,
        label: CATEGORY_LABELS[category],
        matchedKeywords: keywordResult.matches,
        score,
        services: matchingServices,
      };
    })
    .sort((a, b) => b.score - a.score);

  const bestMatch = categoryAnalyses[0];
  const secondBestScore = categoryAnalyses[1]?.score || 0;

  if (!bestMatch || bestMatch.score <= 0) {
    return {
      query: userMessage,
      category: null,
      label: 'Need more detail',
      confidence: 'low',
      reason:
        'I could not confidently map that yet. Tell me what is broken, what item is affected, or what kind of help you want.',
      matchedKeywords: [],
      suggestedServices: getFallbackServices(services).map((service) => ({
        ...service.toObject(),
        matchScore: 0,
        matchedTokens: [],
      })),
      browseCategory: null,
    };
  }

  const confidence = getConfidence(bestMatch.score, secondBestScore, bestMatch.matchedKeywords.length);
  const suggestedServices =
    bestMatch.services.length > 0
      ? bestMatch.services.slice(0, 3)
      : getFallbackServices(services)
          .filter((service) => service.category === bestMatch.category)
          .map((service) => ({
            ...service.toObject(),
            matchScore: 0,
            matchedTokens: [],
          }))
          .slice(0, 3);

  const matchedKeywords = unique([
    ...bestMatch.matchedKeywords,
    ...suggestedServices.flatMap((service) => service.matchedTokens || []),
  ]).slice(0, 4);

  return {
    query: userMessage,
    category: bestMatch.category,
    label: bestMatch.label,
    confidence,
    reason: summarizeReason(bestMatch.category, matchedKeywords, confidence),
    matchedKeywords,
    suggestedServices,
    browseCategory: bestMatch.category,
  };
}

module.exports = {
  analyzeServiceNeed,
  CATEGORY_LABELS,
};
