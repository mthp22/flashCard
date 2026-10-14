import type { Card, Category } from '../stores/types'

/**
 * In-memory database.
 *
 * Everything the app needs to boot lives here as plain JS data — no Mongo,
 * no Firebase. The cards store hydrates its state from these arrays once at
 * startup, and all CRUD happens against that in-memory copy.
 */

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '📜',
    subcategories: [
      'Variables',
      'Functions',
      'Arrays',
      'Objects',
      'Async/Promises',
      'ES6+',
      'Closures',
      'Prototypes',
    ],
    cardCount: 0,
  },
  {
    id: 'vue',
    name: 'Vue.js',
    icon: '🟢',
    subcategories: [
      'Components',
      'Lifecycle',
      'Reactivity',
      'Computed',
      'Watchers',
      'State Management',
      'Animation',
    ],
    cardCount: 0,
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: '🔴',
    subcategories: ['Components', 'Services', 'RxJS', 'Decorators', 'Routing', 'Forms'],
    cardCount: 0,
  },
  {
    id: 'dotnet',
    name: '.NET',
    icon: '🟦',
    subcategories: ['C# Basics', 'OOP', 'LINQ', 'Async/Await', 'Entity Framework', 'SOLID'],
    cardCount: 0,
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: '🔸',
    subcategories: ['Queries', 'Mutations', 'Subscriptions', 'Schema', 'Resolvers'],
    cardCount: 0,
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    subcategories: ['Basics', 'OOP', 'Decorators', 'Generators', 'Async', 'Django'],
    cardCount: 0,
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    subcategories: ['OOP', 'Collections', 'Generics', 'Streams', 'Concurrency', 'JUnit'],
    cardCount: 0,
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    icon: '🍃',
    subcategories: ['Annotations', 'Dependency Injection', 'REST', 'Data JPA', 'Security'],
    cardCount: 0,
  },
]

type SeedCard = Omit<
  Card,
  'createdAt' | 'updatedAt' | 'correctCount' | 'attemptCount' | 'mastered' | 'needsReview'
>

const RAW_CARDS: SeedCard[] = [
  // JavaScript
  {
    id: 'js-hoisting',
    question: 'What is hoisting in JavaScript?',
    answer:
      "Hoisting is JavaScript's behavior of moving declarations to the top of their scope. Variable declarations with `var` are hoisted and initialized with `undefined`, while function declarations are fully hoisted.",
    category: 'javascript',
    subcategory: 'Variables',
    difficulty: 'easy',
  },
  {
    id: 'js-let-var',
    question: 'What is the difference between `let` and `var`?',
    answer:
      '`var` is function-scoped and gets hoisted, while `let` is block-scoped and follows the temporal dead zone. `let` is preferred in modern JavaScript.',
    category: 'javascript',
    subcategory: 'Variables',
    difficulty: 'medium',
  },
  {
    id: 'js-closures',
    question: 'Explain closures in JavaScript.',
    answer:
      'A closure is a function that has access to variables from its outer scope even after the outer function has returned. Functions in JavaScript form closures around the data they need to work with.',
    category: 'javascript',
    subcategory: 'Closures',
    difficulty: 'hard',
  },
  {
    id: 'js-promises',
    question: 'What are promises in JavaScript?',
    answer:
      'Promises represent the eventual completion or failure of an asynchronous operation and its resulting value. They have three states: pending, fulfilled, and rejected.',
    category: 'javascript',
    subcategory: 'Async/Promises',
    difficulty: 'medium',
  },
  {
    id: 'js-async-await',
    question: 'What is async/await?',
    answer:
      'async/await is syntactic sugar over promises that makes asynchronous code look more like synchronous code. An async function always returns a promise, and await pauses execution until the promise settles.',
    category: 'javascript',
    subcategory: 'Async/Promises',
    difficulty: 'medium',
  },
  {
    id: 'js-event-loop',
    question: 'What is the event loop?',
    answer:
      'The event loop continuously checks the call stack: when it is empty, it pulls the first callback from the task queue (or microtask queue for promises) and pushes it onto the stack.',
    category: 'javascript',
    subcategory: 'Async/Promises',
    difficulty: 'hard',
  },

  // Vue.js
  {
    id: 'vue-what',
    question: 'What is Vue.js?',
    answer:
      'Vue.js is a progressive JavaScript framework for building user interfaces. It uses a reactive data model and component-based architecture, making it easy to build interactive and dynamic web applications.',
    category: 'vue',
    subcategory: 'Components',
    difficulty: 'easy',
  },
  {
    id: 'vue-lifecycle',
    question: 'Explain Vue lifecycle hooks.',
    answer:
      'Vue components have lifecycle hooks like setup (Composition API), mounted, updated, and unmounted. These hooks run code at specific stages of the component\u2019s life, from creation to destruction.',
    category: 'vue',
    subcategory: 'Lifecycle',
    difficulty: 'medium',
  },
  {
    id: 'vue-reactivity',
    question: 'What is reactivity in Vue?',
    answer:
      'Reactivity in Vue means that when data changes, the view automatically updates. Vue tracks dependencies and re-renders components when their reactive data changes using a proxy-based system.',
    category: 'vue',
    subcategory: 'Reactivity',
    difficulty: 'medium',
  },
  {
    id: 'vue-pinia',
    question: 'What is Pinia?',
    answer:
      'Pinia is the official state management library for Vue 3. It provides a simpler and more intuitive API than Vuex, with first-class TypeScript support, devtools, and store plugins.',
    category: 'vue',
    subcategory: 'State Management',
    difficulty: 'medium',
  },
  {
    id: 'vue-transition',
    question: 'What built-in components does Vue provide for animations?',
    answer:
      '<Transition> animates a single element on enter/leave, <TransitionGroup> animates lists rendered with v-for, and <KeepAlive> caches inactive components. All are built into Vue core.',
    category: 'vue',
    subcategory: 'Animation',
    difficulty: 'medium',
  },

  // Angular
  {
    id: 'ng-change-detection',
    question: 'How does Angular change detection work?',
    answer:
      'Angular runs change detection over the component tree when an event or async task triggers it, comparing bindings to their previous values. Zone.js triggers it by default; OnPush components only check when inputs or events change.',
    category: 'angular',
    subcategory: 'Components',
    difficulty: 'hard',
  },

  // .NET
  {
    id: 'dotnet-linq',
    question: 'What is LINQ?',
    answer:
      'LINQ (Language Integrated Query) is a feature in C# that provides a uniform way to query different data sources like arrays, collections, and databases using familiar C# syntax.',
    category: 'dotnet',
    subcategory: 'LINQ',
    difficulty: 'medium',
  },
  {
    id: 'dotnet-async',
    question: 'Explain async/await in C#.',
    answer:
      'async/await in C# allows you to write asynchronous code that looks synchronous. An async method can use the await keyword to pause execution until an awaitable task completes.',
    category: 'dotnet',
    subcategory: 'Async/Await',
    difficulty: 'medium',
  },
  {
    id: 'dotnet-ef',
    question: 'What is Entity Framework?',
    answer:
      'Entity Framework is an Object-Relational Mapping (ORM) framework for .NET that simplifies database operations by allowing you to work with databases using object-oriented code instead of raw SQL.',
    category: 'dotnet',
    subcategory: 'Entity Framework',
    difficulty: 'easy',
  },

  // GraphQL
  {
    id: 'graphql-what',
    question: 'What is GraphQL?',
    answer:
      'GraphQL is a query language and runtime for APIs. It allows clients to request exactly the data they need, making it more efficient than REST APIs by reducing over-fetching and under-fetching.',
    category: 'graphql',
    subcategory: 'Queries',
    difficulty: 'easy',
  },
  {
    id: 'graphql-query-mutation',
    question: 'What is the difference between queries and mutations in GraphQL?',
    answer:
      'Queries are used to fetch data from the GraphQL server, while mutations are used to modify data (create, update, delete). Mutations explicitly show intent to modify data.',
    category: 'graphql',
    subcategory: 'Mutations',
    difficulty: 'medium',
  },

  // Python
  {
    id: 'py-decorators',
    question: 'What are decorators in Python?',
    answer:
      'Decorators are functions that modify or enhance other functions or classes without permanently changing their source code. They use the @ symbol and are applied before the function definition.',
    category: 'python',
    subcategory: 'Decorators',
    difficulty: 'hard',
  },
  {
    id: 'py-generators',
    question: 'What is a generator in Python?',
    answer:
      'A generator is a function that uses the yield keyword to return values one at a time, maintaining state between calls. Generators are memory-efficient and useful for working with large datasets.',
    category: 'python',
    subcategory: 'Generators',
    difficulty: 'medium',
  },

  // Java
  {
    id: 'java-streams',
    question: 'What are streams in Java?',
    answer:
      'A Stream is a sequence of elements supporting aggregate operations like filter, map, and reduce. Streams do not store data; they process data from a source such as a collection on demand.',
    category: 'java',
    subcategory: 'Streams',
    difficulty: 'medium',
  },

  // Spring Boot
  {
    id: 'spring-di',
    question: 'What is Dependency Injection in Spring Boot?',
    answer:
      'Dependency Injection lets Spring instantiate and wire collaborators into your beans instead of you creating them manually. Spring resolves constructor or @Autowired parameters from the application context.',
    category: 'spring',
    subcategory: 'Dependency Injection',
    difficulty: 'medium',
  },
]

const now = Date.now()

export const SEED_CARDS: Card[] = RAW_CARDS.map((card) => ({
  ...card,
  createdAt: now,
  updatedAt: now,
  correctCount: 0,
  attemptCount: 0,
  mastered: false,
  needsReview: false,
}))
