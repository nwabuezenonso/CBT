/**
 * Seeded Random Number Generator
 * Uses a simple LCG (Linear Congruential Generator) algorithm
 * to generate consistent pseudo-random numbers from a seed
 */
export function seedRandom(seed: number): () => number {
  let state = seed;
  
  return function() {
    // LCG parameters (same as used in glibc)
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Shuffle an array using a seeded random number generator
 * This ensures the same seed always produces the same shuffle order
 * 
 * @param array - Array to shuffle
 * @param seed - Seed for random number generation
 * @returns Shuffled copy of the array
 */
export function shuffleArray<T>(array: T[], seed: number): T[] {
  const rng = seedRandom(seed);
  const shuffled = [...array];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Generate a random seed for shuffling
 * @returns Random integer between 0 and 2^31-1
 */
export function generateShuffleSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

/**
 * Shuffle questions for an exam attempt
 * @param questions - Array of questions with their IDs
 * @param seed - Shuffle seed from ExamAttempt
 * @returns Shuffled questions
 */
export function shuffleQuestions<T extends { _id: any }>(
  questions: T[],
  seed: number
): T[] {
  return shuffleArray(questions, seed);
}

/**
 * Shuffle options for a question
 * @param options - Array of answer options
 * @param seed - Shuffle seed from ExamAttempt
 * @returns Shuffled options
 */
export function shuffleOptions<T extends { _id: any; displayOrder: number }>(
  options: T[],
  seed: number
): T[] {
  return shuffleArray(options, seed);
}
