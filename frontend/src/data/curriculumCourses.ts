import { CourseTrack } from '@/lib/types';

export const CURRICULUM_COURSES: CourseTrack[] = [
  {
    id: 'course_dl',
    title: 'Deep Learning & Neural Architectures',
    code: 'CS302',
    instructor: 'Dr. Sunita Sharma & Andrej Karpathy',
    badge: 'Core Curriculum',
    description: 'From biological neurons and multilayer perceptrons to Backpropagation, micrograd, and Attention Transformers.',
    chapters: [
      {
        id: 'ch_dl_01',
        title: 'Chapter 1: Neural Networks & Biological Foundations',
        lectures: [
          {
            id: 'lec_dl_01',
            number: '01',
            title: 'What is a Neural Network? Deep Learning Foundations',
            duration: '19:13',
            durationSec: 1153,
            youtubeId: 'aircAruvnKk',
            completed: true,
            active: true,
            description: 'How 784 pixels of handwritten digits (MNIST) map through weighted connections and non-linear squashing activations.',
            conceptKey: 'neural_network_foundations',
            cues: [
              { sec: 15, label: 'MNIST Handwritten Digits', text: 'Each digit is drawn inside a grid of 784 pixels, mapping directly to 784 input neurons.' },
              { sec: 194, label: 'Sigmoid Squashing Layer', text: 'Neuron activation is computed by weighted sums squashed via Sigmoid: a^(l) = sigma(W * a^(l-1) + b).' },
              { sec: 320, label: 'Matrix Vector Layer Transition', text: 'Compact linear algebra matrix representation compresses thousands of weights into a single linear map.' },
              { sec: 480, label: 'Loss & Cost Function', text: 'Mean squared error measures the distance between the network output vector and the true one-hot label.' }
            ],
            multilingualCues: {
              EN: [
                { sec: 15, text: "Each digit is drawn inside a grid of 784 pixels, mapping directly to 784 input neurons." },
                { sec: 194, text: "Neuron activation is computed by weighted sums squashed via Sigmoid: a^(l) = sigma(W * a^(l-1) + b)." },
                { sec: 320, text: "Compact linear algebra matrix representation compresses thousands of weights into a single linear map." },
                { sec: 480, text: "Mean squared error measures the distance between the network output vector and the true one-hot label." }
              ],
              HI: [
                { sec: 15, text: "प्रत्येक अंक 784 पिक्सल के ग्रिड में खींचा जाता है, जो सीधे 784 इनपुट न्यूरॉन्स से जुड़ता है।" },
                { sec: 194, text: "सिग्मॉइड फंक्शन वेटेड सम को 0 और 1 के बीच सिकोड़ता है।" },
                { sec: 320, text: "संक्षिप्त मैट्रिक्स रूप: a^(l) = sigma( W^(l) * a^(l-1) + b^(l) )।" },
                { sec: 480, text: "कॉस्ट फंक्शन नेटवर्क के आउटपुट और वास्तविक लेबल के बीच की त्रुटि मापता है।" }
              ],
              TA: [
                { sec: 15, text: "ஒவ்வொரு எண்ணும் 784 பிக்சல்கள் கொண்ட கட்டத்தில் வரையப்பட்டுள்ளது." },
                { sec: 194, text: "சிக்மாய்டு செயல்பாடு எடைகள் மற்றும் பயாஸை 0 முதல் 1 வரை மாற்றுகிறது." },
                { sec: 320, text: "மேட்ரிக்ஸ் வடிவம் முழு அடுக்கையும் நிர்வகிக்கிறது." },
                { sec: 480, text: "விலை செயல்பாட்டை குறைக்க கிரேடியன்ட் டிசென்ட் உதவுகிறது." }
              ],
              ES: [
                { sec: 15, text: "Cada dígito se dibuja en una cuadrícula de 784 píxeles que mapean a 784 neuronas." },
                { sec: 194, text: "La función Sigmoide comprime la suma ponderada al intervalo real (0, 1)." },
                { sec: 320, text: "La notación matricial compacta representa la transición completa entre capas." },
                { sec: 480, text: "El descenso de gradiente minimiza la función de costo calculada." }
              ]
            },
            beebookNotes: [
              {
                id: 'note_dl_01',
                timestampSec: 194,
                timestampLabel: '03:14',
                conceptTitle: 'The Layer Activation Equation',
                latexFormula: 'a^{(l)} = \\sigma\\left( W^{(l)} a^{(l-1)} + b^{(l)} \\right)',
                keyTakeaway: 'The linear matrix multiplication W * a rotates and scales, while sigma adds the non-linearity required for universal function approximation.',
                pythonSnippet: 'import numpy as np\ndef layer_forward(a_prev, W, b):\n    z = np.dot(W, a_prev) + b\n    return 1.0 / (1.0 + np.exp(-z))',
                isBookmarked: true
              },
              {
                id: 'note_dl_02',
                timestampSec: 480,
                timestampLabel: '08:00',
                conceptTitle: 'Mean Squared Error Cost Function',
                latexFormula: 'C(W, b) = \\frac{1}{2n} \\sum_{x} \\|y(x) - a^{(L)}(x)\\|^2',
                keyTakeaway: 'The cost landscape has thousands of dimensions. We compute the gradient vector -nabla C to navigate downhill.',
                pythonSnippet: 'loss = 0.5 * np.mean((y_true - y_pred) ** 2)'
              }
            ],
            inVideoQuiz: {
              id: 'quiz_dl_01',
              triggerTimestampSec: 195,
              question: 'In the layer equation a^(l) = sigma(W·a + b), why is the non-linear Sigmoid activation essential?',
              options: [
                'It doubles the learning rate for faster backpropagation',
                'Without non-linearity, stacking 100 layers collapses into a single trivial linear transformation',
                'It forces the determinant of W to zero',
                'It resets weights to uniform random initialization'
              ],
              correctIndex: 1,
              explanation: 'The composition of linear functions is always linear. Non-linear squashing gives neural networks the power to approximate arbitrary non-linear boundaries.',
              xpReward: 50,
              socraticHint: 'Think about what happens when you multiply matrix A by matrix B: A(B(x)) = (AB)x, which is still just one single matrix!'
            },
            reentryPrimingQuiz: {
              concept: 'Sigmoid Squashing & Layer Transitions',
              question: 'Welcome back! Quick working-memory check: In a^(l) = sigma(W·a + b), what does the bias vector b control?',
              options: [
                'The learning rate multiplier for stochastic mini-batches',
                'The activation threshold that determines how easily a neuron fires',
                'The number of outputs in the final softmax layer',
                'The L2 regularization penalty'
              ],
              correctIndex: 1,
              explanation: 'The bias term shifts the activation curve horizontally, controlling the threshold a weighted sum must overcome to activate the neuron.',
              triggerTimestampSec: 194
            },
            flashcards: [
              {
                id: 'fc_dl_01',
                lectureNumber: 1,
                frontConcept: 'Universal Approximation Theorem',
                frontQuestion: 'What does the Universal Approximation Theorem state about feedforward networks?',
                backAnswer: 'A feedforward network with a single hidden layer and non-linear activation can approximate any continuous function on compact subsets of R^n.',
                tag: 'Foundations'
              }
            ]
          },
          {
            id: 'lec_dl_02',
            number: '02',
            title: 'Gradient Descent & Cost Optimization Landscapes',
            duration: '21:01',
            durationSec: 1261,
            youtubeId: 'IHZwWFHWa-w',
            completed: false,
            active: false,
            description: 'Visualizing how high-dimensional gradient vectors guide the weight updates down the loss surface.',
            conceptKey: 'gradient_descent',
            cues: [
              { sec: 45, label: 'Cost Surface Landscape', text: 'Visualizing a cost surface with millions of weights as a hilly terrain.' },
              { sec: 360, label: 'Negative Gradient Direction', text: 'The gradient vector nabla C points in the direction of steepest ascent; stepping along -nabla C minimizes error.' },
              { sec: 620, label: 'Learning Rate Pacing', text: 'Too high learning rate overshoots valleys; too low converges too slowly.' }
            ],
            beebookNotes: [
              {
                id: 'note_dl_03',
                timestampSec: 360,
                timestampLabel: '06:00',
                conceptTitle: 'Gradient Descent Parameter Update',
                latexFormula: 'W^{(t+1)} = W^{(t)} - \\eta \\nabla_W C',
                keyTakeaway: 'The learning rate eta determines step size along the negative gradient vector.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_dl_02',
              triggerTimestampSec: 365,
              question: 'Why do we update weights using the NEGATIVE gradient -nabla C instead of the positive gradient?',
              options: [
                'The gradient vector points in the direction of steepest increase; the negative points toward steepest loss decrease',
                'Negative numbers prevent floating-point overflow',
                'To make all weights strictly negative',
                'It is an arbitrary sign convention with no mathematical impact'
              ],
              correctIndex: 0,
              explanation: 'nabla C represents the direction of fastest cost increase. Stepping in the opposite direction (-nabla C) minimizes cost.',
              xpReward: 50,
              socraticHint: 'If you are standing on a mountain and want to reach the valley bottom, do you walk uphill or downhill?'
            },
            reentryPrimingQuiz: {
              concept: 'Gradient Descent Optimization',
              question: 'Welcome back! In gradient descent, what happens if the learning rate eta is set too high?',
              options: [
                'The model converges in exactly one iteration',
                'The weights oscillate wildly and fail to converge, causing cost divergence',
                'All gradients collapse to zero',
                'The dataset size decreases'
              ],
              correctIndex: 1,
              explanation: 'An excessively large learning rate overshoots minima valleys and can cause the loss to explode to infinity.',
              triggerTimestampSec: 360
            },
            flashcards: [
              {
                id: 'fc_dl_02',
                lectureNumber: 2,
                frontConcept: 'Local Minima vs Saddle Points',
                frontQuestion: 'In high-dimensional loss landscapes, what is more common: local minima or saddle points?',
                backAnswer: 'Saddle points are far more prevalent in high dimensions, where gradients are zero but curvature has mixed signs.',
                tag: 'Optimization'
              }
            ]
          },
          {
            id: 'lec_dl_03',
            number: '03',
            title: 'What is Backpropagation Really Doing? Intuitive Proof',
            duration: '13:54',
            durationSec: 834,
            youtubeId: 'Ilg3gGewQ5U',
            completed: false,
            active: false,
            description: 'Unpacking the multivariable chain rule that propagates prediction errors backward across every layer.',
            conceptKey: 'backpropagation_intuition',
            cues: [
              { sec: 60, label: 'Nudging the Final Layer', text: 'How a desired change in the output layer ripples back into hidden weights.' },
              { sec: 270, label: 'The Multivariable Chain Rule', text: 'Decomposing dC/dw into dC/da * da/dz * dz/dw.' },
              { sec: 510, label: 'Recursive Error Signals', text: 'Reusing intermediate sensitivities avoids exponential re-computation.' }
            ],
            beebookNotes: [
              {
                id: 'note_dl_04',
                timestampSec: 270,
                timestampLabel: '04:30',
                conceptTitle: 'Chain Rule Factorization of Weight Sensitivities',
                latexFormula: '\\frac{\\partial C}{\\partial w_{jk}^{(l)}} = a_k^{(l-1)} \\sigma\'(z_j^{(l)}) \\frac{\\partial C}{\\partial a_j^{(l)}}',
                keyTakeaway: 'The sensitivity decomposes into: (Activation of previous neuron) * (Derivative of squashing curve) * (Downstream cost sensitivity).',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_dl_03',
              triggerTimestampSec: 275,
              question: 'In backpropagation, why is computing the gradient backward through layers computationally efficient?',
              options: [
                'It avoids calculating derivatives altogether',
                'It uses dynamic programming to cache intermediate error signals delta^(l), preventing redundant work',
                'It eliminates matrix multiplication',
                'Backward loops run faster on GPUs'
              ],
              correctIndex: 1,
              explanation: 'Backprop is reverse-mode automatic differentiation. It caches layer sensitivities so all weight gradients are calculated in a single backward pass.',
              xpReward: 50,
              socraticHint: 'Think about dynamic programming: computing from outputs back to inputs allows reusing earlier calculations.'
            },
            reentryPrimingQuiz: {
              concept: 'Backpropagation Chain Rule',
              question: 'Welcome back! In backpropagation, which factor directly represents the activation of the incoming neuron?',
              options: [
                'The incoming activation a_k^(l-1)',
                'The learning rate eta',
                'The total batch size n',
                'The bias term b'
              ],
              correctIndex: 0,
              explanation: 'Because z = w * a_prev + b, the derivative dz/dw is simply a_prev.',
              triggerTimestampSec: 270
            },
            flashcards: [
              {
                id: 'fc_dl_03',
                lectureNumber: 3,
                frontConcept: 'Vanishing Gradient Problem',
                frontQuestion: 'Why does the Sigmoid activation lead to vanishing gradients in deep networks?',
                backAnswer: 'The derivative of Sigmoid maxes out at 0.25. Multiplying numbers <= 0.25 across many layers decays gradients exponentially to zero.',
                tag: 'Deep Learning'
              }
            ]
          }
        ]
      },
      {
        id: 'ch_dl_02',
        title: 'Chapter 2: Modern Deep Learning & Transformers from Scratch',
        lectures: [
          {
            id: 'lec_dl_04',
            number: '04',
            title: 'Building micrograd & Autograd Engines (Andrej Karpathy)',
            duration: '2:25:34',
            durationSec: 8734,
            youtubeId: 'VMj-3S1tku0',
            completed: false,
            active: false,
            description: 'Writing an automatic differentiation engine from scratch in pure Python and training a 2-layer neural network.',
            conceptKey: 'autograd_micrograd',
            cues: [
              { sec: 120, label: 'Value Class & Computation Graph', text: 'Wrapping scalar values with parents, operation tracking, and gradient accumulators.' },
              { sec: 1200, label: 'Topological Sort for Backward Pass', text: 'Ordering nodes topologically so parents compute gradients only after all children finish.' },
              { sec: 3600, label: 'Training a Multi-Layer Perceptron', text: 'Zeroing grads, forward pass, backward pass, and parameter update loop.' }
            ],
            beebookNotes: [
              {
                id: 'note_dl_05',
                timestampSec: 1200,
                timestampLabel: '20:00',
                conceptTitle: 'Topological Graph Traversal for Backward',
                latexFormula: 'v.\\text{grad} = \\sum_{c \\in \\text{children}} c.\\text{grad} \\cdot \\frac{\\partial c}{\\partial v}',
                keyTakeaway: 'The backward pass traverses nodes in reverse topological order, accumulating incoming chain-rule gradients.',
                pythonSnippet: 'def backward(self):\n    topo = []\n    visited = set()\n    def build(v):\n        if v not in visited:\n            visited.add(v)\n            for child in v._prev:\n                build(child)\n            topo.append(v)\n    build(self)\n    self.grad = 1.0\n    for node in reversed(topo):\n        node._backward()'
              }
            ],
            inVideoQuiz: {
              id: 'quiz_dl_04',
              triggerTimestampSec: 1210,
              question: 'Why MUST you call optimizer.zero_grad() (or set grad = 0) before each training step?',
              options: [
                'To free GPU memory buffers',
                'Because PyTorch and autograd ACCUMULATE gradients (+), otherwise grads from previous batches contaminate the new step',
                'To initialize weights to zero',
                'It is optional and does not affect convergence'
              ],
              correctIndex: 1,
              explanation: 'Gradients accumulate by default so multiple backward calls can sum together. Failing to zero grads causes them to grow unbounded.',
              xpReward: 50,
              socraticHint: 'Remember the += operator when accumulating gradients from multiple children!'
            },
            reentryPrimingQuiz: {
              concept: 'Autograd Computation Graphs',
              question: 'Welcome back! In micrograd, why is a topological sort required before triggering backward propagation?',
              options: [
                'To sort node weights by absolute magnitude',
                'To guarantee that every child node has computed its gradients before its parent reads them',
                'To eliminate negative weights',
                'To compress the model weights into 8-bit integers'
              ],
              correctIndex: 1,
              explanation: 'Topological ordering ensures dependencies are resolved in order, preventing incomplete gradient accumulations.',
              triggerTimestampSec: 1200
            },
            flashcards: [
              {
                id: 'fc_dl_04',
                lectureNumber: 4,
                frontConcept: 'Forward vs Reverse-Mode Autograd',
                frontQuestion: 'Why is reverse-mode autograd used in deep learning instead of forward-mode?',
                backAnswer: 'Neural networks have millions of inputs (weights) and a single scalar output (loss). Reverse-mode computes all gradients in one pass, whereas forward-mode would require millions of passes.',
                tag: 'Autograd'
              }
            ]
          },
          {
            id: 'lec_dl_05',
            number: '05',
            title: 'Let\'s Build GPT: From Scratch with Multi-Head Attention',
            duration: '1:56:45',
            durationSec: 7005,
            youtubeId: 'kCc8FmEb1nY',
            completed: false,
            active: false,
            description: 'Andrej Karpathy builds a Decoder-only Transformer language model from scratch in PyTorch step-by-step.',
            conceptKey: 'transformers_attention',
            cues: [
              { sec: 300, label: 'Token & Position Embeddings', text: 'Mapping token IDs and sequence indices into continuous vectors.' },
              { sec: 1800, label: 'Self-Attention as Soft Key-Value Lookup', text: 'Queries, Keys, and Values: Q * K^T / sqrt(d_k).' },
              { sec: 3600, label: 'Multi-Head Attention & Residual Highways', text: 'Splitting embeddings across multiple heads and adding skip connections.' }
            ],
            beebookNotes: [
              {
                id: 'note_dl_06',
                timestampSec: 1800,
                timestampLabel: '30:00',
                conceptTitle: 'Scaled Dot-Product Attention',
                latexFormula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V',
                keyTakeaway: 'Queries match with Keys to compute attention weight affinities, which aggregate Value vectors.',
                pythonSnippet: 'wei = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(k.size(-1)))\nwei = F.softmax(wei.masked_fill(tril == 0, float("-inf")), dim=-1)\nout = wei @ v',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_dl_05',
              triggerTimestampSec: 1810,
              question: 'Why do we scale Q · K^T by 1 / sqrt(d_k) before taking the softmax in Scaled Dot-Product Attention?',
              options: [
                'To make matrix multiplication faster',
                'In high dimensions d_k, dot products grow large, pushing softmax into extreme regions with tiny gradients',
                'To convert values to integers',
                'To invert the attention matrix'
              ],
              correctIndex: 1,
              explanation: 'Large dot products push softmax outputs close to 0 or 1, causing vanishing gradients during backpropagation. Dividing by sqrt(d_k) preserves unit variance.',
              xpReward: 50,
              socraticHint: 'Think about variance: sum of d_k independent random variables of variance 1 has variance d_k!'
            },
            reentryPrimingQuiz: {
              concept: 'Multi-Head Self-Attention',
              question: 'Welcome back! In causal (autoregressive) self-attention, what is the role of the triangular mask matrix?',
              options: [
                'To prevent tokens from attending to future tokens in the sequence',
                'To zero out negative weights in the feedforward layer',
                'To normalize token embeddings across batches',
                'To encrypt token representations'
              ],
              correctIndex: 0,
              explanation: 'Causal masking ensures each token can only attend to previous and current tokens, preserving autoregressive language generation.',
              triggerTimestampSec: 1800
            },
            flashcards: [
              {
                id: 'fc_dl_05',
                lectureNumber: 5,
                frontConcept: 'Residual Connections (Skip Connections)',
                frontQuestion: 'What critical problem do residual connections solve in deep Transformers?',
                backAnswer: 'Residual connections provide an uninterrupted gradient highway during backpropagation, allowing gradients to flow directly without vanishing.',
                tag: 'Transformers'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course_linear_algebra',
    title: 'Essence of Linear Algebra & Spectral Theory',
    code: 'MATH201',
    instructor: '3Blue1Brown & Prof. Gilbert Strang (MIT 18.06)',
    badge: 'Prerequisite Bedrock',
    description: 'Geometric intuition of vector spaces, linear transformations, determinants, column spaces, and eigenvectors.',
    chapters: [
      {
        id: 'ch_la_01',
        title: 'Chapter 1: Vectors, Matrices & Transformations',
        lectures: [
          {
            id: 'lec_la_01',
            number: '01',
            title: 'Vectors, What Even Are They? (Linear Algebra Chapter 1)',
            duration: '09:52',
            durationSec: 592,
            youtubeId: 'fNk_zzaMoSs',
            completed: true,
            active: false,
            description: 'The geometric and computer science perspectives of vectors: arrows with magnitude & direction vs lists of feature coordinates.',
            conceptKey: 'vector_spaces',
            cues: [
              { sec: 20, label: 'Physics vs CS Perspectives', text: 'Arrows in space vs ordered arrays of feature measurements.' },
              { sec: 240, label: 'Vector Addition & Scaling', text: 'Parallelogram law of vector addition and scalar multiplication.' }
            ],
            beebookNotes: [
              {
                id: 'note_la_01',
                timestampSec: 240,
                timestampLabel: '04:00',
                conceptTitle: 'Linear Combination & Span',
                latexFormula: '\\vec{v} = c_1 \\vec{i} + c_2 \\vec{j} = c_1 \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} + c_2 \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}',
                keyTakeaway: 'Coordinates are simply scalar multipliers scaling the standard basis vectors i-hat and j-hat.'
              }
            ],
            inVideoQuiz: {
              id: 'quiz_la_01',
              triggerTimestampSec: 245,
              question: 'If two vectors u and v point along the exact same line, what is their span in 2D space?',
              options: [
                'The entire 2D plane',
                'A single 1-dimensional line',
                'A single point at the origin',
                'A 3-dimensional volume'
              ],
              correctIndex: 1,
              explanation: 'Because the vectors are linearly dependent, scaling and adding them can only produce vectors along that same line.',
              xpReward: 50,
              socraticHint: 'Can you step sideways off the line using only combinations of vectors on that line?'
            },
            reentryPrimingQuiz: {
              concept: 'Vector Coordinates & Basis',
              question: 'Welcome back! In standard 2D Cartesian space, what are the coordinates of the basis vectors i-hat and j-hat?',
              options: [
                '[1, 0] and [0, 1]',
                '[0, 0] and [1, 1]',
                '[1, 1] and [-1, -1]',
                '[2, 0] and [0, 2]'
              ],
              correctIndex: 0,
              explanation: 'i-hat is the unit vector pointing 1 unit along x ([1, 0]); j-hat points 1 unit along y ([0, 1]).',
              triggerTimestampSec: 240
            },
            flashcards: [
              {
                id: 'fc_la_01',
                lectureNumber: 1,
                frontConcept: 'Linear Independence',
                frontQuestion: 'When is a set of vectors linearly independent?',
                backAnswer: 'When no vector in the set can be expressed as a linear combination of the other vectors.',
                tag: 'Linear Algebra'
              }
            ]
          },
          {
            id: 'lec_la_02',
            number: '02',
            title: 'Linear Transformations & Matrices (Chapter 3)',
            duration: '10:59',
            durationSec: 659,
            youtubeId: 'kYB8IZa5AuE',
            completed: false,
            active: false,
            description: 'Why a matrix is fundamentally a dynamic spatial transformation that keeps grid lines parallel and evenly spaced.',
            conceptKey: 'linear_transformations',
            cues: [
              { sec: 60, label: 'What Keeps a Transformation Linear?', text: 'Grid lines must remain parallel and evenly spaced, and the origin must remain fixed at (0, 0).' },
              { sec: 240, label: 'Tracking Basis Vectors i-hat and j-hat', text: 'A 2x2 matrix simply records where i-hat lands (column 1) and where j-hat lands (column 2).' }
            ],
            beebookNotes: [
              {
                id: 'note_la_02',
                timestampSec: 240,
                timestampLabel: '04:00',
                conceptTitle: 'Matrix as Destination of Basis Vectors',
                latexFormula: 'A = \\begin{pmatrix} \\text{Transformed } \\hat{i} & \\text{Transformed } \\hat{j} \\end{pmatrix} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
                keyTakeaway: 'To find where ANY vector [x, y] lands under transformation A, multiply x by transformed i-hat and add y times transformed j-hat.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_la_02',
              triggerTimestampSec: 245,
              question: 'If a transformation rotates space by 90 degrees counter-clockwise, what is its 2x2 transformation matrix?',
              options: [
                '[[1, 0], [0, 1]]',
                '[[0, -1], [1, 0]]',
                '[[0, 1], [-1, 0]]',
                '[[-1, 0], [0, -1]]'
              ],
              correctIndex: 1,
              explanation: 'i-hat [1, 0] rotates to [0, 1] (column 1); j-hat [0, 1] rotates to [-1, 0] (column 2). Thus matrix is [[0, -1], [1, 0]].',
              xpReward: 50,
              socraticHint: 'Look at where the x-axis arrow lands after rotating 90 degrees counter-clockwise!'
            },
            reentryPrimingQuiz: {
              concept: 'Basis Vector Destinations',
              question: 'Welcome back! What do the columns of a transformation matrix represent geometrically?',
              options: [
                'The coordinates of where standard basis vectors land after transformation',
                'The eigenvalues of the system',
                'The inverse determinant values',
                'The gradient of the loss surface'
              ],
              correctIndex: 0,
              explanation: 'Column 1 records where i-hat lands; column 2 records where j-hat lands.',
              triggerTimestampSec: 240
            },
            flashcards: [
              {
                id: 'fc_la_02',
                lectureNumber: 2,
                frontConcept: 'Linear Transformation Properties',
                frontQuestion: 'What two algebraic properties define a linear map T?',
                backAnswer: '1. Additivity: T(u + v) = T(u) + T(v). 2. Homogeneity: T(c * v) = c * T(v).',
                tag: 'Geometry'
              }
            ]
          },
          {
            id: 'lec_la_03',
            number: '03',
            title: 'The Determinant as Area Scaling Factor (Chapter 6)',
            duration: '10:04',
            durationSec: 604,
            youtubeId: 'Ip3X9LOh2dk',
            completed: false,
            active: false,
            description: 'How det(A) measures the expansion or compression of area, and why det(A) = 0 causes total dimensional collapse.',
            conceptKey: 'determinants',
            cues: [
              { sec: 45, label: 'Unit Square Scaling', text: 'det(A) is the factor by which the 1x1 unit square area changes.' },
              { sec: 270, label: 'Negative Determinants & Orientation', text: 'A negative determinant means space has been inverted (like a sheet flipped over).' },
              { sec: 420, label: 'det(A) = 0 and Non-Invertibility', text: 'When det(A) = 0, the 2D plane is squashed into a 1D line or 0D point. Information is permanently destroyed.' }
            ],
            beebookNotes: [
              {
                id: 'note_la_03',
                timestampSec: 420,
                timestampLabel: '07:00',
                conceptTitle: 'Singular Matrices & Area Collapse',
                latexFormula: '\\det(A) = 0 \\implies \\text{Space collapsed to } \\dim < 2 \\implies A^{-1} \\text{ does not exist}',
                keyTakeaway: 'You cannot invert a collapse because you cannot unambiguously un-flatten a 1D line back into a 2D plane.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_la_03',
              triggerTimestampSec: 425,
              question: 'If matrix A has det(A) = 0, why is it impossible to find its inverse matrix A^(-1)?',
              options: [
                'Because the transformation collapsed space into lower dimensions, so a single point came from infinitely many inputs',
                'Because 0 cannot be represented in binary computers',
                'Because eigenvectors become complex numbers',
                'The inverse exists but only for positive matrices'
              ],
              correctIndex: 0,
              explanation: 'det(A) = 0 means dimension was lost. An inverse function would have to map a single point back to an entire line of points, which violates the definition of a mathematical function.',
              xpReward: 50,
              socraticHint: 'Can you reconstruct a 3D building from just its 2D flat shadow?'
            },
            reentryPrimingQuiz: {
              concept: 'Determinant & Area Collapse',
              question: 'Welcome back! If det(A) = 3, by what factor does matrix A scale the area of any geometric shape in the plane?',
              options: [
                'By a factor of 3',
                'By a factor of 9 (3 squared)',
                'By a factor of sqrt(3)',
                'Area does not change'
              ],
              correctIndex: 0,
              explanation: 'The determinant directly measures the linear scaling factor for area (in 2D) or volume (in 3D).',
              triggerTimestampSec: 420
            },
            flashcards: [
              {
                id: 'fc_la_03',
                lectureNumber: 3,
                frontConcept: 'Determinant Product Rule',
                frontQuestion: 'What is det(A * B) equal to?',
                backAnswer: 'det(A * B) = det(A) * det(B). Composing two transformations multiplies their scaling factors.',
                tag: 'Determinants'
              }
            ]
          },
          {
            id: 'lec_la_04',
            number: '04',
            title: 'Eigenvectors and Eigenvalues (Chapter 14)',
            duration: '17:15',
            durationSec: 1035,
            youtubeId: 'PFDu9oVAE-g',
            completed: false,
            active: false,
            description: 'Vectors that stay on their own span during linear transformations, forming the bedrock of PCA, Spectral Clustering, and Matrix Factorization.',
            conceptKey: 'eigenvalues_eigenvectors',
            cues: [
              { sec: 60, label: 'Directional Invariance', text: 'Most vectors change direction when multiplied by matrix A. Eigenvectors do not.' },
              { sec: 240, label: 'The Eigen-Equation: Av = lambda v', text: 'Matrix multiplication acts like simple scalar scaling on the eigenvector.' },
              { sec: 480, label: 'Characteristic Polynomial det(A - lambda I) = 0', text: 'Finding lambdas where (A - lambda I) collapses space into having a non-trivial null space.' }
            ],
            beebookNotes: [
              {
                id: 'note_la_04',
                timestampSec: 240,
                timestampLabel: '04:00',
                conceptTitle: 'The Characteristic Eigen-Equation',
                latexFormula: 'A \\vec{v} = \\lambda \\vec{v} \\iff (A - \\lambda I) \\vec{v} = \\vec{0} \\iff \\det(A - \\lambda I) = 0',
                keyTakeaway: 'Setting det(A - lambda I) = 0 ensures a non-trivial null space, which guarantees the existence of non-zero eigenvectors.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_la_04',
              triggerTimestampSec: 245,
              question: 'If vector v is an eigenvector of matrix A with eigenvalue lambda = 3, what is A * (2v)?',
              options: [
                '6v (which is 3 * 2v)',
                '2v',
                '9v',
                '0'
              ],
              correctIndex: 0,
              explanation: 'Because A is linear, A(2v) = 2(Av) = 2(3v) = 6v. Any scalar multiple of an eigenvector is also an eigenvector with the same eigenvalue!',
              xpReward: 50,
              socraticHint: 'Use linearity: A(c * v) = c * (Av)!'
            },
            reentryPrimingQuiz: {
              concept: 'Eigenvectors & Characteristic Equation',
              question: 'Welcome back! In the equation det(A - lambda * I) = 0, why must the determinant equal zero?',
              options: [
                'To force matrix (A - lambda*I) to be singular so it has non-zero null space solutions',
                'To make all eigenvalues strictly positive',
                'Because 0 is the smallest real number',
                'To prevent matrix inversion'
              ],
              correctIndex: 0,
              explanation: 'If det != 0, the matrix would be invertible, which would force the only solution to be v = 0 (the trivial zero vector).',
              triggerTimestampSec: 240
            },
            flashcards: [
              {
                id: 'fc_la_04',
                lectureNumber: 4,
                frontConcept: 'Diagonalization',
                frontQuestion: 'When can a matrix A be diagonalized as A = P * D * P^(-1)?',
                backAnswer: 'When A has n linearly independent eigenvectors, forming the columns of invertible matrix P.',
                tag: 'Spectral Theory'
              }
            ]
          },
          {
            id: 'lec_la_05',
            number: '05',
            title: 'MIT 18.06: The Geometry of Linear Equations (Gilbert Strang)',
            duration: '39:49',
            durationSec: 2389,
            youtubeId: '7UJ4C_XVU_8',
            completed: false,
            active: false,
            description: 'Prof. Gilbert Strang\'s legendary opening lecture on row pictures vs column pictures in solving linear systems Ax = b.',
            conceptKey: 'gilbert_strang_geometry',
            cues: [
              { sec: 120, label: 'The Row Picture', text: 'Each equation represents a line (in 2D) or plane (in 3D). The solution is their intersection.' },
              { sec: 600, label: 'The Column Picture', text: 'Linear combination of column vectors: x1 * col1 + x2 * col2 = b. This is the fundamental view for machine learning!' }
            ],
            beebookNotes: [
              {
                id: 'note_la_05',
                timestampSec: 600,
                timestampLabel: '10:00',
                conceptTitle: 'Column Picture of Matrix Equations',
                latexFormula: 'A \\vec{x} = x_1 \\vec{a}_1 + x_2 \\vec{a}_2 + \\dots + x_n \\vec{a}_n = \\vec{b}',
                keyTakeaway: 'Ax = b asks: Can target vector b be formed by scaling and adding the column vectors of matrix A?',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_la_05',
              triggerTimestampSec: 610,
              question: 'According to Prof. Strang, why is the "column picture" of Ax = b far more powerful than the "row picture"?',
              options: [
                'Because it expresses Ax as a linear combination of the columns, making column space and rank intuitive',
                'Because row pictures cannot be drawn on blackboards',
                'Because column pictures do not require algebra',
                'Because computers only store data in columns'
              ],
              correctIndex: 0,
              explanation: 'Viewing Ax as a linear combination of columns immediately connects to vector spans, column space, and rank in machine learning.',
              xpReward: 50,
              socraticHint: 'Remember how we combine basis vectors in machine learning feature representations!'
            },
            reentryPrimingQuiz: {
              concept: 'Column Space & Linear Combinations',
              question: 'Welcome back! In Gilbert Strang\'s column picture, when does the system Ax = b have a solution?',
              options: [
                'When vector b lies inside the column space of matrix A',
                'Only when all diagonal entries are positive',
                'When det(A) is negative',
                'When x equals zero'
              ],
              correctIndex: 0,
              explanation: 'If b is in the column space (span of the columns), there exists a combination x that equals b.',
              triggerTimestampSec: 600
            },
            flashcards: [
              {
                id: 'fc_la_05',
                lectureNumber: 5,
                frontConcept: 'Four Fundamental Subspaces',
                frontQuestion: 'What are Strang\'s Four Fundamental Subspaces of matrix A?',
                backAnswer: 'Column Space C(A), Null Space N(A), Row Space C(A^T), and Left Null Space N(A^T).',
                tag: 'MIT 18.06'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course_calculus',
    title: 'Multivariable Calculus & Gradient Optimization',
    code: 'MATH202',
    instructor: '3Blue1Brown & StatQuest (Josh Starmer)',
    badge: 'Optimization Core',
    description: 'Master derivatives, partial gradients, multivariable chain rules, and step-by-step gradient descent.',
    chapters: [
      {
        id: 'ch_calc_01',
        title: 'Chapter 1: Gradients, Derivatives & Optimization',
        lectures: [
          {
            id: 'lec_calc_01',
            number: '01',
            title: 'The Essence of Calculus (Calculus Chapter 1)',
            duration: '17:05',
            durationSec: 1025,
            youtubeId: 'WUvTyaaNkzM',
            completed: true,
            active: false,
            description: 'Why calculus is the mathematics of continuous change: breaking hard problems into infinite small steps.',
            conceptKey: 'calculus_foundations',
            cues: [
              { sec: 60, label: 'Area Under Curves', text: 'Splitting shapes into thin rectangles of width dx.' },
              { sec: 360, label: 'The Derivative as Sensitivity', text: 'How a small nudge dx produces a change df = f\'(x) * dx.' }
            ],
            beebookNotes: [
              {
                id: 'note_calc_01',
                timestampSec: 360,
                timestampLabel: '06:00',
                conceptTitle: 'The Derivative as a Sensitivity Ratio',
                latexFormula: '\\frac{df}{dx} = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}',
                keyTakeaway: 'The derivative tells you the multiplier: nudge the input by dx, and the output responds by f\'(x) * dx.'
              }
            ],
            inVideoQuiz: {
              id: 'quiz_calc_01',
              triggerTimestampSec: 365,
              question: 'If f(x) = x^2, what is the derivative df/dx at x = 4?',
              options: ['4', '8', '16', '2'],
              correctIndex: 1,
              explanation: 'df/dx = 2x. At x = 4, 2 * 4 = 8.',
              xpReward: 50,
              socraticHint: 'Use the power rule: d(x^n)/dx = n * x^(n-1)!'
            },
            reentryPrimingQuiz: {
              concept: 'Derivatives as Sensitivity Multipliers',
              question: 'Welcome back! In calculus, what does the derivative df/dx geometrically represent?',
              options: [
                'The slope of the tangent line to the curve at point x',
                'The total area under the entire function',
                'The average value of the function over [0, infinity]',
                'The inverse determinant'
              ],
              correctIndex: 0,
              explanation: 'The derivative represents the instantaneous rate of change and the slope of the tangent line.',
              triggerTimestampSec: 360
            },
            flashcards: [
              {
                id: 'fc_calc_01',
                lectureNumber: 1,
                frontConcept: 'Chain Rule Foundation',
                frontQuestion: 'State the single-variable chain rule for composite function f(g(x)).',
                backAnswer: 'd/dx[f(g(x))] = f\'(g(x)) * g\'(x). Rates of change multiply.',
                tag: 'Calculus'
              }
            ]
          },
          {
            id: 'lec_calc_02',
            number: '02',
            title: 'What is the Gradient Vector? (Multivariable Calculus)',
            duration: '15:43',
            durationSec: 943,
            youtubeId: 'GkB4vW10wE4',
            completed: false,
            active: false,
            description: 'Why the gradient vector nabla f packages all directional derivatives and always points uphill.',
            conceptKey: 'multivariable_gradient',
            cues: [
              { sec: 60, label: 'Partial Derivatives', text: 'Varying one feature while holding all other features strictly constant.' },
              { sec: 320, label: 'The Gradient Vector nabla f', text: 'Vector containing [df/dx, df/dy, df/dz]. Points in the direction of steepest increase.' }
            ],
            beebookNotes: [
              {
                id: 'note_calc_02',
                timestampSec: 320,
                timestampLabel: '05:20',
                conceptTitle: 'The Multivariable Gradient Vector',
                latexFormula: '\\nabla f(x_1, \\dots, x_n) = \\begin{pmatrix} \\frac{\\partial f}{\\partial x_1} \\\\ \\vdots \\\\ \\frac{\\partial f}{\\partial x_n} \\end{pmatrix}',
                keyTakeaway: 'The gradient vector is perpendicular (orthogonal) to the contour lines (level curves) of the function.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_calc_02',
              triggerTimestampSec: 325,
              question: 'If f(x, y) = 3x^2 + 4y, what is the gradient vector nabla f at point (2, 1)?',
              options: [
                '[12, 4]',
                '[6, 4]',
                '[12, 1]',
                '[4, 12]'
              ],
              correctIndex: 0,
              explanation: 'df/dx = 6x; df/dy = 4. At (2, 1), df/dx = 6(2) = 12 and df/dy = 4. Gradient vector is [12, 4].',
              xpReward: 50,
              socraticHint: 'Differentiate with respect to x (treat y as constant), then with respect to y (treat x as constant).'
            },
            reentryPrimingQuiz: {
              concept: 'Directional Derivative & Gradient',
              question: 'Welcome back! In multivariable calculus, what direction does the gradient vector nabla f always point?',
              options: [
                'In the direction of steepest increase of the function',
                'In the direction of zero change',
                'Along the contour level lines',
                'Towards the origin (0, 0)'
              ],
              correctIndex: 0,
              explanation: 'The gradient vector points in the direction of maximum ascent; its magnitude gives the maximum rate of increase.',
              triggerTimestampSec: 320
            },
            flashcards: [
              {
                id: 'fc_calc_02',
                lectureNumber: 2,
                frontConcept: 'Jacobian Matrix',
                frontQuestion: 'What is a Jacobian matrix in vector calculus?',
                backAnswer: 'A matrix of all first-order partial derivatives of a vector-valued function, mapping differential inputs to differential outputs.',
                tag: 'Multivariable'
              }
            ]
          },
          {
            id: 'lec_calc_03',
            number: '03',
            title: 'StatQuest: Gradient Descent Step-by-Step',
            duration: '23:54',
            durationSec: 1434,
            youtubeId: 'sDv4f4s2SB8',
            completed: false,
            active: false,
            description: 'Josh Starmer clearly breaks down step size, learning rate, and derivative intuition for linear regression and neural networks.',
            conceptKey: 'statquest_gradient_descent',
            cues: [
              { sec: 120, label: 'Finding the Best Fit Line', text: 'Using sum of squared residuals to quantify fit error.' },
              { sec: 480, label: 'Taking Steps Downhill', text: 'Step size = Slope * Learning Rate.' }
            ],
            beebookNotes: [
              {
                id: 'note_calc_03',
                timestampSec: 480,
                timestampLabel: '08:00',
                conceptTitle: 'Adaptive Step Size Reduction',
                latexFormula: '\\text{Step Size} = \\eta \\cdot \\text{Slope}',
                keyTakeaway: 'As you approach the minimum, the slope shrinks naturally toward 0, causing step size to automatically reduce.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_calc_03',
              triggerTimestampSec: 485,
              question: 'As gradient descent gets closer to the minimum of a smooth bowl, what happens to the slope and step size?',
              options: [
                'The slope gets flatter (closer to 0), so step size automatically gets smaller even with constant learning rate',
                'The slope gets steeper, causing steps to explode',
                'Step size stays identically constant until manually stopped',
                'Slope reverses sign every millisecond'
              ],
              correctIndex: 0,
              explanation: 'Because slope shrinks near the minimum, step size = slope * learning rate automatically slows down, allowing clean convergence.',
              xpReward: 50,
              socraticHint: 'Look at the tangent line at the bottom of a parabolic bowl: what is its slope?'
            },
            reentryPrimingQuiz: {
              concept: 'Gradient Descent Step Size',
              question: 'Welcome back! In StatQuest\'s gradient descent, what stops the algorithm from taking steps once it reaches the minimum?',
              options: [
                'The slope is zero, making step size = 0 * learning rate = 0',
                'The computer runs out of memory',
                'The learning rate is divided by zero',
                'The data points disappear'
              ],
              correctIndex: 0,
              explanation: 'At a minimum, the derivative (slope) equals 0, so the parameter update becomes 0.',
              triggerTimestampSec: 480
            },
            flashcards: [
              {
                id: 'fc_calc_03',
                lectureNumber: 3,
                frontConcept: 'Stochastic Gradient Descent (SGD)',
                frontQuestion: 'How does SGD differ from standard Batch Gradient Descent?',
                backAnswer: 'SGD updates parameters on a single random sample (or small mini-batch) at a time, making steps much faster and helping escape local minima.',
                tag: 'StatQuest'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course_ibm_ai',
    title: 'IBM SkillsBuild Enterprise AI & watsonx Governance',
    code: 'IBM-AI101',
    instructor: 'IBM SkillsBuild & IBM Technology Academy',
    badge: 'Industry Certification',
    description: 'Foundation models, enterprise LLM architectures, AI guardrails, and algorithmic fairness with watsonx.governance.',
    chapters: [
      {
        id: 'ch_ibm_01',
        title: 'Chapter 1: Foundation Models & Governance',
        lectures: [
          {
            id: 'lec_ibm_01',
            number: '01',
            title: 'What is a Foundation Model? (IBM Technology)',
            duration: '06:12',
            durationSec: 372,
            youtubeId: '2X_2b06L2eE',
            completed: false,
            active: false,
            description: 'Why pre-trained foundation models shifted AI from task-specific brittle models to multi-task adaptable generalists.',
            conceptKey: 'ibm_foundation_models',
            cues: [
              { sec: 30, label: 'Task-Specific vs Foundation Models', text: 'Moving from building one model per task to adapting a single foundation model.' },
              { sec: 180, label: 'Self-Supervised Pre-Training', text: 'Pre-training on massive unlabeled data by predicting masked tokens.' }
            ],
            beebookNotes: [
              {
                id: 'note_ibm_01',
                timestampSec: 180,
                timestampLabel: '03:00',
                conceptTitle: 'Foundation Model Adaptation Loop',
                latexFormula: '\\text{Pre-trained Base Model} \\xrightarrow{\\text{PEFT / LoRA / Prompt Tuning}} \\text{Domain Specialized Agent}',
                keyTakeaway: 'Adapting foundation models via Parameter-Efficient Fine-Tuning (PEFT) retains core knowledge while tailoring domain behavior.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_ibm_01',
              triggerTimestampSec: 185,
              question: 'What is the primary architectural advantage of a Foundation Model over traditional machine learning models?',
              options: [
                'It is pre-trained on broad data and can be fine-tuned to dozens of downstream tasks with minimal data',
                'It requires zero matrix multiplication',
                'It runs without any compute hardware',
                'It is 100% deterministic and never hallucinates'
              ],
              correctIndex: 0,
              explanation: 'Foundation models absorb generalized patterns through self-supervised pre-training and adapt rapidly to diverse tasks.',
              xpReward: 50,
              socraticHint: 'Think about transfer learning: you do not need to re-train the model from scratch for each new task.'
            },
            reentryPrimingQuiz: {
              concept: 'Foundation Model Pre-Training',
              question: 'Welcome back! What type of training signal is used in foundation model pre-training?',
              options: [
                'Self-supervised learning (predicting missing tokens or next tokens in unlabeled data)',
                'Manual human labelling on every single sentence',
                'Rule-based if-else algorithms',
                'Simple linear regression'
              ],
              correctIndex: 0,
              explanation: 'Self-supervised learning allows models to learn from billions of tokens without expensive human annotations.',
              triggerTimestampSec: 180
            },
            flashcards: [
              {
                id: 'fc_ibm_01',
                lectureNumber: 1,
                frontConcept: 'Parameter-Efficient Fine-Tuning (LoRA)',
                frontQuestion: 'What does LoRA (Low-Rank Adaptation) do during fine-tuning?',
                backAnswer: 'LoRA freezes the base model weights and injects trainable rank decomposition matrices (A and B), reducing trainable parameters by 99%.',
                tag: 'IBM AI'
              }
            ]
          },
          {
            id: 'lec_ibm_02',
            number: '02',
            title: 'IBM watsonx: AI Governance & Fairness Audits',
            duration: '07:15',
            durationSec: 435,
            youtubeId: 'tY0e0zHjDGE',
            completed: false,
            active: false,
            description: 'Automating model risk management, disparate impact evaluation, demographic parity, and ethical guardrails in production.',
            conceptKey: 'watsonx_governance',
            cues: [
              { sec: 40, label: 'The Pillars of AI Trust', text: 'Fairness, Explainability, Robustness, Transparency, and Privacy.' },
              { sec: 210, label: 'Disparate Impact & Demographic Parity', text: 'Evaluating whether protected demographic cohorts experience equivalent model acceptance rates.' }
            ],
            beebookNotes: [
              {
                id: 'note_ibm_02',
                timestampSec: 210,
                timestampLabel: '03:30',
                conceptTitle: 'Demographic Parity & Disparate Impact Ratio',
                latexFormula: '\\text{Disparate Impact Ratio} = \\frac{P(\\hat{Y}=1 \\mid D=\\text{unprivileged})}{P(\\hat{Y}=1 \\mid D=\\text{privileged})} \\ge 0.80',
                keyTakeaway: 'Compliance standards (like EEOC four-fifths rule and NEP 2020) mandate that model decisions do not unfairly penalize unprivileged demographics.',
                isBookmarked: true
              }
            ],
            inVideoQuiz: {
              id: 'quiz_ibm_02',
              triggerTimestampSec: 215,
              question: 'Under IBM watsonx.governance standards, what does a Disparate Impact Ratio of 0.96 indicate?',
              options: [
                'High algorithmic fairness compliant with the 80% four-fifths rule (unprivileged group receives favorable outcomes at 96% of privileged rate)',
                'Severe bias requiring model shutdown',
                'A classification accuracy of 96%',
                'Overfitting on the training dataset'
              ],
              correctIndex: 0,
              explanation: 'A ratio >= 0.80 indicates compliance with non-discrimination regulatory standards; 0.96 demonstrates excellent algorithmic fairness.',
              xpReward: 50,
              socraticHint: 'A ratio close to 1.0 means both groups are treated equally.'
            },
            reentryPrimingQuiz: {
              concept: 'AI Governance & Model Bias Audits',
              question: 'Welcome back! In AI governance, what does "Explainability" (XAI) guarantee for high-stakes decisions?',
              options: [
                'Stakeholders can inspect the root-cause feature attributions that produced the decision',
                'The code must be written in assembly language',
                'The model must never make errors',
                'All predictions must be randomized'
              ],
              correctIndex: 0,
              explanation: 'Explainability ensures decisions are interpretable, auditable, and actionable rather than black-box opacity.',
              triggerTimestampSec: 210
            },
            flashcards: [
              {
                id: 'fc_ibm_02',
                lectureNumber: 2,
                frontConcept: 'Model Drift Detection',
                frontQuestion: 'What is Concept Drift in production machine learning?',
                backAnswer: 'When the statistical relationship between input features and target labels changes over time, causing model degradation.',
                tag: 'watsonx'
              }
            ]
          }
        ]
      }
    ]
  }
];
