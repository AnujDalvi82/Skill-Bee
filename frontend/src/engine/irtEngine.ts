// 2-Parameter Logistic (2PL) Item Response Theory & Bayesian Updating Engine

import { MathEQuestion } from '@/lib/types';

/**
 * 2PL-IRT Probability of a correct response:
 * P(correct | theta, a, b) = 1 / (1 + exp(-1.7 * a * (theta - b)))
 * 
 * @param theta - Student latent ability (-3.0 to +3.0)
 * @param a - Item discrimination (slope, typically 0.5 to 2.2)
 * @param b - Item difficulty (threshold, typically -2.5 to +2.5)
 */
export function calculateProbabilityOfCorrect(theta: number, a: number, b: number): number {
  const z = -1.7 * a * (theta - b);
  // Guard against overflow
  if (z > 35) return 0.0;
  if (z < -35) return 1.0;
  return 1 / (1 + Math.exp(z));
}

/**
 * Update student latent ability (theta) using Bayesian maximum a posteriori (MAP)
 * with a standard normal prior N(0, 1).
 * 
 * @param currentTheta - Current latent ability estimate
 * @param isCorrect - Whether student got the item right (1) or wrong (0)
 * @param a - Item discrimination
 * @param b - Item difficulty
 * @param dwellTimeRatio - (Actual Dwell Time) / (Expected Dwell Time)
 * @returns Updated theta bounded in [-3.0, +3.0]
 */
export function updateThetaBayesian(
  currentTheta: number,
  isCorrect: boolean,
  a: number,
  b: number,
  dwellTimeRatio: number = 1.0
): { newTheta: number; delta: number; probability: number } {
  const P = calculateProbabilityOfCorrect(currentTheta, a, b);
  const responseScore = isCorrect ? 1.0 : 0.0;

  // Dwell-time adjustment factor based on EdNet telemetry:
  // - If correct but dwell ratio < 0.25 on hard question (b > 0.5) -> suspected guessing, dampen gain.
  // - If incorrect and dwell ratio > 2.5 -> high cognitive struggle.
  let learningRate = 0.45;
  if (isCorrect && dwellTimeRatio < 0.3 && b > 0.0) {
    learningRate *= 0.6; // Dampen gain for quick guess
  } else if (!isCorrect && dwellTimeRatio > 2.5) {
    learningRate *= 0.8; // High effort struggle, less punitive drop
  }

  // Gradient of log likelihood: a * (Score - P)
  // Minus prior gradient: theta / (sigma_prior^2) with sigma_prior = 1.0
  const gradient = 1.7 * a * (responseScore - P) - 0.2 * currentTheta;
  const delta = learningRate * gradient;

  let newTheta = currentTheta + delta;
  // Clamp theta within standard psychometric bounds
  newTheta = Math.max(-3.0, Math.min(3.0, Number(newTheta.toFixed(3))));

  return {
    newTheta,
    delta: Number(delta.toFixed(3)),
    probability: Number(P.toFixed(3)),
  };
}

/**
 * Select the optimal next question from a pool using Maximum Information Criterion:
 * Fisher Information I(theta) = 1.7^2 * a^2 * P * (1 - P)
 * 
 * The best question maximizes Fisher Information at the student's current theta.
 */
export function selectNextAdaptiveQuestion(
  currentTheta: number,
  unansweredPool: MathEQuestion[]
): MathEQuestion | null {
  if (unansweredPool.length === 0) return null;

  let maxInfo = -1;
  let bestQuestion: MathEQuestion = unansweredPool[0];

  for (const q of unansweredPool) {
    const P = calculateProbabilityOfCorrect(currentTheta, q.discrimination_a, q.difficulty_b);
    // Fisher Information for 2PL
    const info = Math.pow(1.7 * q.discrimination_a, 2) * P * (1 - P);
    if (info > maxInfo) {
      maxInfo = info;
      bestQuestion = q;
    }
  }

  return bestQuestion;
}
