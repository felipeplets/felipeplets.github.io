export interface Pillar {
  number: string;
  title: string;
  description: string;
  points: string[];
}

export const PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'Quality that does not drift',
    description:
      'Vibe coding and agentic engineering dramatically increase how fast code can be produced. High-quality code still requires planning, architecture and experienced judgement. Without strong guardrails, average quality drifts down quietly, and then all at once.',
    points: ['Guardrails by design', 'Architecture up front', 'Risk in the dependency chain'],
  },
  {
    number: '02',
    title: 'AI-native teams',
    description:
      'The biggest leadership challenge right now is not AI adoption. It is building teams that collaborate with AI rather than consume its output the way they once consumed search results.',
    points: ['Collaborate, not consume', 'Redefine "good work"', 'AI fluency as a norm'],
  },
  {
    number: '03',
    title: 'Alignment, human and machine',
    description:
      'Alignment has always been the hard problem in organizations. As AI becomes part of the work, that alignment has to extend to how teams use models: which ones, for which tasks, judged against which standards.',
    points: ['Shared standards', 'Context and instruction', 'Review against agreement'],
  },
  {
    number: '04',
    title: 'Evidence over opinion',
    description:
      'Leaders need to talk about AI with evidence, not vibes. Models change weekly and the claims about them change faster. Decisions should rest on how tools perform on your work, not on how they are marketed.',
    points: ['Benchmarks and telemetry', 'Measure the outcome', 'Revisit as models move'],
  },
];

export interface Engagement {
  title: string;
  description: string;
}

export const ENGAGEMENTS: Engagement[] = [
  {
    title: 'Keynotes & talks',
    description:
      'Conference and internal sessions on what actually changes when agents join the team, and what stubbornly does not.',
  },
  {
    title: 'Team workshops',
    description:
      'Hands-on sessions that move a team from ad-hoc AI usage to a repeatable, reviewable way of building.',
  },
  {
    title: 'Advisory',
    description:
      'Working with engineering leaders on delivery practices, quality strategy and the operating model behind them.',
  },
];

/** Figures cited when framing the cost of quality drift. Sources kept for credibility. */
export interface Stat {
  value: string;
  label: string;
  source: string;
}

export const STATS: Stat[] = [
  {
    value: '40%',
    label: 'of development effort goes to avoidable rework and maintenance driven by technical debt',
    source: 'McKinsey, 2023',
  },
  {
    value: '$2.41T',
    label: 'annual cost of poor software quality to the US economy, with ~$1.52T in accumulated technical debt',
    source: 'CISQ, 2022',
  },
  {
    value: '~3x',
    label: 'more commits pushed to GitHub in a single month of 2026 than in all of 2025',
    source: 'GitHub, 2026',
  },
];
