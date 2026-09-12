// Calibrated MathE Question Bank for Computerized Adaptive Testing (CAT)
// Real items calibrated with Item Discrimination (a) and Difficulty (b)

import { MathEQuestion } from '@/lib/types';

export const MATHE_QUESTION_BANK: MathEQuestion[] = [
  {
    id: 'mathe-la-01',
    topic: 'LinearAlgebra',
    conceptKey: 'matrix_inversion',
    conceptLabel: 'Matrix Inversion & Determinants',
    question: 'Given a 2x2 matrix A = [[3, 2], [6, 4]], what is its determinant and can it be inverted?',
    latexEquation: 'A = \\begin{pmatrix} 3 & 2 \\\\ 6 & 4 \\end{pmatrix}',
    options: [
      'det(A) = 0; matrix is singular and cannot be inverted',
      'det(A) = 24; inverse exists with integer entries',
      'det(A) = -12; inverse exists as A^(-1)',
      'det(A) = 1; matrix is orthogonal'
    ],
    correctIndex: 0,
    explanation: 'det(A) = (3)(4) - (2)(6) = 12 - 12 = 0. Since det(A) = 0, the matrix collapses space into a single line and has no inverse.',
    difficulty_b: -0.4,       // Moderately easy baseline
    discrimination_a: 1.25,
    prerequisites: ['matrix_basics']
  },
  {
    id: 'mathe-la-02',
    topic: 'LinearAlgebra',
    conceptKey: 'eigenvalues',
    conceptLabel: 'Eigenvalues & Characteristic Equation',
    question: 'For matrix M = [[2, 1], [0, 3]], what are its eigenvalues lambda_1 and lambda_2?',
    latexEquation: '\\det(M - \\lambda I) = 0',
    options: [
      'lambda = 2, 3 (direct diagonal entries of an upper triangular matrix)',
      'lambda = 5, -1',
      'lambda = 1, 6',
      'lambda = 0, 2'
    ],
    correctIndex: 0,
    explanation: 'For any triangular matrix, eigenvalues are simply the diagonal elements: det(M - lambda I) = (2 - lambda)(3 - lambda) - 0 = 0 -> lambda = 2, 3.',
    difficulty_b: 0.2,        // Medium difficulty
    discrimination_a: 1.6,
    prerequisites: ['matrix_inversion']
  },
  {
    id: 'mathe-calc-01',
    topic: 'Calculus',
    conceptKey: 'multivariable_chain_rule',
    conceptLabel: 'Multivariable Chain Rule & Gradients',
    question: 'If z = f(u, v) where u = x^2 and v = 2xy, what is the partial derivative ?z/?x using the multivariable chain rule?',
    latexEquation: '\\frac{\\partial z}{\\partial x} = \\frac{\\partial z}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial z}{\\partial v}\\frac{\\partial v}{\\partial x}',
    options: [
      '(?z/?u)(2x) + (?z/?v)(2y)',
      '(?z/?u)(x^2) + (?z/?v)(2xy)',
      '(?z/?u)(2) + (?z/?v)(2x)',
      '(?z/?u)(2x)(?z/?v)(2y)'
    ],
    correctIndex: 0,
    explanation: 'By the chain rule: ?z/?x = (?z/?u)(?u/?x) + (?z/?v)(?v/?x). Since ?u/?x = 2x and ?v/?x = 2y, the result is (?z/?u)(2x) + (?z/?v)(2y). This is the exact math powering Neural Network Backpropagation!',
    difficulty_b: 0.75,       // Harder: Key bridge to Backprop
    discrimination_a: 1.85,
    prerequisites: ['partial_derivatives']
  },
  {
    id: 'mathe-la-03',
    topic: 'LinearAlgebra',
    conceptKey: 'pca_svd_geometry',
    conceptLabel: 'Singular Value Decomposition (SVD) Geometry',
    question: 'In SVD decomposition A = U * Sigma * V^T, what geometric transformation do the columns of U represent?',
    latexEquation: 'A = U \\Sigma V^T',
    options: [
      'Orthonormal eigenvectors of A * A^T representing output space principal axes',
      'Row space vectors representing non-orthogonal shears',
      'The eigenvalues of the original non-square matrix',
      'Random projection directions in high-dimensional space'
    ],
    correctIndex: 0,
    explanation: 'Columns of U are the left singular vectors (eigenvectors of A A^T) providing an orthonormal basis for the column space of A.',
    difficulty_b: 1.4,        // Advanced applied ML math
    discrimination_a: 2.1,
    prerequisites: ['eigenvalues', 'matrix_inversion']
  }
];
