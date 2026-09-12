// BeeBook Data & In-Video Checkpoints for Lecture Studio

import { BeeBookNote, InVideoQuizCheckpoint, PreLectureFlashcard } from '@/lib/types';

export const MOCK_BEEBOOK_NOTES: BeeBookNote[] = [
  {
    id: 'note-01',
    timestampSec: 45,
    timestampLabel: '00:45',
    conceptTitle: 'Geometric Intuition of Matrix Transformations',
    keyTakeaway: 'A matrix acts as a linear space stretcher or compressor. The basis vectors i-hat and j-hat land at the matrix columns.',
    latexFormula: 'A \\vec{x} = x_1 \\vec{v}_1 + x_2 \\vec{v}_2',
    pythonSnippet: 'import numpy as np\nA = np.array([[2, 1], [1, 2]])\nv = np.array([1, 1])\nprint(A @ v)  # Transformed coordinate',
    isBookmarked: true
  },
  {
    id: 'note-02',
    timestampSec: 180,
    timestampLabel: '03:00',
    conceptTitle: 'The Determinant as Area Scaling Factor',
    keyTakeaway: 'det(A) measures the factor by which area changes. If det(A) = 0, the 2D plane collapses onto a 1D line or point.',
    latexFormula: '\\det(A) = ad - bc',
    studentAnnotation: 'Crucial for ML: Singular matrices cannot be inverted in Normal Equations!'
  },
  {
    id: 'note-03',
    timestampSec: 360,
    timestampLabel: '06:00',
    conceptTitle: 'Eigenvectors: The Direction of Invariance',
    keyTakeaway: 'Vectors that do not knock off their span during matrix transformation. They only stretch or shrink by eigenvalue lambda.',
    latexFormula: 'A \\vec{v} = \\lambda \\vec{v}',
    pythonSnippet: 'evals, evecs = np.linalg.eig(A)\nprint("Eigenvalues:", evals)'
  }
];

export const MOCK_IN_VIDEO_QUIZ: InVideoQuizCheckpoint = {
  id: 'ivq-01',
  triggerTimestampSec: 195, // 03:15
  question: 'Quick Check: If det(A) = 0 for a dataset transformation matrix, what happens to the dimensionality of the feature space?',
  options: [
    'At least one dimension collapses to zero volume (information is permanently lost)',
    'The space scales infinitely in all directions',
    'The matrix becomes orthogonal and easily invertible',
    'Nothing changes; feature dimensions remain independent'
  ],
  correctIndex: 0,
  xpReward: 25,
  socraticHint: 'Remember: det(A) is the volume scaling factor. If scaling factor is 0, what is the new area?'
};

export const MOCK_PRE_LECTURE_FLASHCARDS: PreLectureFlashcard[] = [
  {
    id: 'fc-01',
    lectureNumber: 3,
    frontConcept: 'Linear Independence',
    frontQuestion: 'When is a set of feature vectors {v1, v2, ..., vn} considered linearly independent?',
    backAnswer: 'When no vector in the set can be written as a linear combination of the others (c1*v1 + c2*v2 + ... = 0 implies all c_i = 0).',
    latexFormula: '\\sum c_i \\vec{v}_i = \\vec{0} \\implies c_i = 0',
    tag: 'Foundations'
  },
  {
    id: 'fc-02',
    lectureNumber: 3,
    frontConcept: 'Matrix Rank',
    frontQuestion: 'What does the rank of a matrix tell us in Machine Learning?',
    backAnswer: 'The number of truly independent features or dimensions spanned by the dataset columns.',
    tag: 'Dimensionality'
  },
  {
    id: 'fc-03',
    lectureNumber: 3,
    frontConcept: 'Orthogonality & Dot Products',
    frontQuestion: 'What is the dot product of two mutually orthogonal vectors?',
    backAnswer: 'Zero. Orthogonal features share zero redundant covariance.',
    latexFormula: '\\vec{u} \\cdot \\vec{v} = 0',
    tag: 'Geometry'
  }
];
