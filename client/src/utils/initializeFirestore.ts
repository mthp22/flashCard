import { db } from '../firebase'
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore'

const CATEGORIES = [
  {
    name: 'JavaScript',
    icon: '📜',
    subcategories: [
      'Variables',
      'Functions',
      'Arrays',
      'Objects',
      'Async/Promises',
      'ES6+',
      'DOM',
      'Closures',
      'Prototypes',
      'Events',
    ],
  },
  {
    name: 'Vue.js',
    icon: '🟢',
    subcategories: [
      'Components',
      'Lifecycle',
      'Reactivity',
      'Computed',
      'Watchers',
      'Props',
      'Events',
      'Routing',
      'State Management',
    ],
  },
  {
    name: 'Angular',
    icon: '🔴',
    subcategories: [
      'Components',
      'Services',
      'RxJS',
      'Decorators',
      'Dependency Injection',
      'Routing',
      'Forms',
      'HTTP',
    ],
  },
  {
    name: '.NET',
    icon: '🟦',
    subcategories: [
      'C# Basics',
      'OOP',
      'LINQ',
      'Async/Await',
      'Entity Framework',
      'Dependency Injection',
      'SOLID',
    ],
  },
  {
    name: 'GraphQL',
    icon: '🔸',
    subcategories: ['Queries', 'Mutations', 'Subscriptions', 'Schema', 'Resolvers'],
  },
  {
    name: 'Python',
    icon: '🐍',
    subcategories: ['Basics', 'OOP', 'Decorators', 'Generators', 'Async', 'Django', 'Flask'],
  },
  {
    name: 'Java',
    icon: '☕',
    subcategories: ['OOP', 'Collections', 'Generics', 'Streams', 'Concurrency', 'JUnit'],
  },
  {
    name: 'Spring Boot',
    icon: '🍃',
    subcategories: [
      'Annotations',
      'Dependency Injection',
      'REST',
      'Data JPA',
      'Security',
      'Testing',
    ],
  },
]

const SAMPLE_CARDS = [
  // JavaScript
  {
    question: 'What is hoisting in JavaScript?',
    answer:
      'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope. Variable declarations with `var` are hoisted and initialized with `undefined`, while function declarations are fully hoisted.',
    category: 'JavaScript',
    subcategory: 'Variables',
    difficulty: 'easy',
  },
  {
    question: 'What is the difference between `let` and `var`?',
    answer:
      '`var` is function-scoped and gets hoisted, while `let` is block-scoped and follows the temporal dead zone. `let` is preferred in modern JavaScript.',
    category: 'JavaScript',
    subcategory: 'Variables',
    difficulty: 'medium',
  },
  {
    question: 'Explain closures in JavaScript.',
    answer:
      'A closure is a function that has access to variables from its outer scope even after the outer function has returned. This happens because functions in JavaScript form closures around the data they need to work with.',
    category: 'JavaScript',
    subcategory: 'Closures',
    difficulty: 'hard',
  },
  {
    question: 'What are promises in JavaScript?',
    answer:
      'Promises represent the eventual completion or failure of an asynchronous operation and its resulting value. They have three states: pending, fulfilled, and rejected.',
    category: 'JavaScript',
    subcategory: 'Async/Promises',
    difficulty: 'medium',
  },
  {
    question: 'What is async/await?',
    answer:
      'async/await is syntactic sugar over promises that makes asynchronous code look more like synchronous code. An async function always returns a promise, and await pauses execution until the promise settles.',
    category: 'JavaScript',
    subcategory: 'Async/Promises',
    difficulty: 'medium',
  },

  // Vue.js
  {
    question: 'What is Vue.js?',
    answer:
      'Vue.js is a progressive JavaScript framework for building user interfaces. It uses a reactive data model and component-based architecture, making it easy to build interactive and dynamic web applications.',
    category: 'Vue.js',
    subcategory: 'Components',
    difficulty: 'easy',
  },
  {
    question: 'Explain Vue lifecycle hooks.',
    answer:
      'Vue components have lifecycle hooks like created, mounted, updated, and unmounted. These hooks allow you to run code at specific stages of the component\'s life, from creation to destruction.',
    category: 'Vue.js',
    subcategory: 'Lifecycle',
    difficulty: 'medium',
  },
  {
    question: 'What is reactivity in Vue?',
    answer:
      'Reactivity in Vue means that when data changes, the view automatically updates. Vue tracks dependencies and re-renders components when their reactive data changes using a proxy-based system.',
    category: 'Vue.js',
    subcategory: 'Reactivity',
    difficulty: 'medium',
  },
  {
    question: 'What is Pinia?',
    answer:
      'Pinia is the official state management library for Vue 3. It provides a simpler and more intuitive API than Vuex, with better TypeScript support and a smaller learning curve.',
    category: 'Vue.js',
    subcategory: 'State Management',
    difficulty: 'medium',
  },

  // .NET
  {
    question: 'What is LINQ?',
    answer:
      'LINQ (Language Integrated Query) is a feature in C# that provides a uniform way to query different data sources like arrays, collections, and databases using familiar C# syntax.',
    category: '.NET',
    subcategory: 'LINQ',
    difficulty: 'medium',
  },
  {
    question: 'Explain async/await in C#.',
    answer:
      'async/await in C# allows you to write asynchronous code that looks synchronous. An async method can use the await keyword to pause execution until an awaitable task completes.',
    category: '.NET',
    subcategory: 'Async/Await',
    difficulty: 'medium',
  },
  {
    question: 'What is Entity Framework?',
    answer:
      'Entity Framework is an Object-Relational Mapping (ORM) framework for .NET that simplifies database operations by allowing you to work with databases using object-oriented code instead of raw SQL.',
    category: '.NET',
    subcategory: 'Entity Framework',
    difficulty: 'easy',
  },

  // GraphQL
  {
    question: 'What is GraphQL?',
    answer:
      'GraphQL is a query language and runtime for APIs. It allows clients to request exactly the data they need, making it more efficient than REST APIs by reducing over-fetching and under-fetching.',
    category: 'GraphQL',
    subcategory: 'Queries',
    difficulty: 'easy',
  },
  {
    question: 'What is the difference between queries and mutations in GraphQL?',
    answer:
      'Queries are used to fetch data from the GraphQL server, while mutations are used to modify data (create, update, delete). Mutations explicitly show intent to modify data.',
    category: 'GraphQL',
    subcategory: 'Mutations',
    difficulty: 'medium',
  },

  // Python
  {
    question: 'What are decorators in Python?',
    answer:
      'Decorators are functions that modify or enhance other functions or classes without permanently changing their source code. They use the @ symbol and are applied before the function definition.',
    category: 'Python',
    subcategory: 'Decorators',
    difficulty: 'hard',
  },
  {
    question: 'What is a generator in Python?',
    answer:
      'A generator is a function that uses the yield keyword to return values one at a time, maintaining state between calls. Generators are memory-efficient and useful for working with large datasets.',
    category: 'Python',
    subcategory: 'Generators',
    difficulty: 'medium',
  },
]

export async function initializeCategories() {
  try {
    const categorySnapshot = await getDocs(collection(db, 'categories'))

    if (categorySnapshot.empty) {
      console.log('Initializing categories...')
      const batch = writeBatch(db)
      const categoriesRef = collection(db, 'categories')

      for (const category of CATEGORIES) {
        const docRef = doc(categoriesRef)
        batch.set(docRef, {
          ...category,
          cardCount: 0,
        })
      }

      await batch.commit()
      console.log('Categories initialized')
    }
  } catch (error) {
    console.error('Error initializing categories:', error)
  }
}

export async function initializeCards() {
  try {
    const cardSnapshot = await getDocs(collection(db, 'cards'))

    if (cardSnapshot.empty) {
      console.log('Initializing sample cards...')
      const batch = writeBatch(db)
      const cardsRef = collection(db, 'cards')

      for (const card of SAMPLE_CARDS) {
        const docRef = doc(cardsRef)
        batch.set(docRef, {
          ...card,
          correctCount: 0,
          attemptCount: 0,
          mastered: false,
          needsReview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      await batch.commit()
      console.log('Sample cards initialized')
    }
  } catch (error) {
    console.error('Error initializing cards:', error)
  }
}

export async function initializeFirestore() {
  await initializeCategories()
  await initializeCards()
}
