const CONTENT = {
  meta: {
    title: 'Krishna Chitrala · AI & Software Developer',
    logo: 'KC://dev',
    year: '2025'
  },

  hero: {
    availability: 'Available for opportunities · Rugby, UK',
    firstName: 'KRISHNA',
    lastName: 'CHITRALA',
    role: 'AI & Software Developer',
    degree: 'MSc Computer Games & AI',
    location: '◈ Open to UK & India',
    buttons: [
      { text: 'View Projects', href: '#projects', style: 'primary' },
      { text: 'Ask AI About Me', href: '#chat', style: 'ghost' },
      { text: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/bhargav-rama-krishna-chitrala-1b36a2189', style: 'ghost', target: '_blank' }
    ]
  },

  about: {
    stats: [
      { num: 'MSc', label: 'distinction · kingston university' },
      { num: '2+', label: 'years building & shipping' },
      { num: '10+', label: 'ai & software projects' },
      { num: '2', label: 'certifications earned' }
    ],
    education: [
      {
        school: 'Kingston University London',
        degree: 'MSc Computer Games & AI Programming',
        detail: 'Sep 2023 – Sep 2024 · Grade: Distinction'
      },
      {
        school: 'SRK Institute of Technology',
        degree: 'Computer Science Engineering',
        detail: 'Sep 2018 – Sep 2022 · Grade: First class'
      }
    ],
    paragraphs: [
      "I'm an <strong>AI & Software Developer</strong> specialising in building innovative AI systems and software solutions. My work focuses on <strong>LLM-powered applications</strong>, RAG pipelines, reinforcement learning agents, and backend APIs.",
      "I completed my <strong>MSc in Computer Games & AI Programming</strong> at Kingston University with a Distinction, where my dissertation explored <strong>NPC decision-making using Utility AI and Deep Q-Learning</strong> — a project that really shaped how I think about intelligent systems.",
      "I use AI-powered development tools like <strong>Claude, Cursor, and GitHub Copilot</strong> to move fast, while grounding every project in solid engineering fundamentals — clean structure, debugging discipline, and code I can defend and maintain.",
      "Previously a <strong>Head Teacher at Code Camp</strong>, I taught 24–30 students per class in coding and computational thinking, boosting engagement by ~35–40%. That experience sharpened my communication and leadership skills in ways I bring to every team."
    ]
  },

  skills: [
    {
      category: '// AI & Machine Learning',
      items: ['Python', 'PyTorch', 'LangChain', 'Hugging Face', 'RAG Pipelines', 'Deep Q-Learning', 'DCGAN', 'Genetic Algorithms', 'Reinforcement Learning']
    },
    {
      category: '// Backend & APIs',
      items: ['FastAPI', 'SQL', 'Vector Databases', 'Git', 'GitHub Copilot']
    },
    {
      category: '// Game Development',
      items: ['Unity', 'Unreal Engine', 'C++', 'C#', 'Procedural Generation', 'Game AI']
    },
    {
      category: '// Web & Tools',
      items: ['HTML / CSS', 'JavaScript', 'Full Stack Dev', 'Claude', 'Cursor', 'v0']
    }
  ],

  experience: [
    {
      date: 'FEB 2025 — PRESENT',
      company: 'Independent',
      type: 'Freelance · Remote',
      role: 'Freelance AI & Software Developer',
      bullets: [
        'Built and shipped websites and web applications end-to-end using AI-assisted development tools with custom code',
        'Developed LLM and RAG prototypes using LangChain, Hugging Face, and vector databases',
        'Created backend APIs and automation scripts in Python and FastAPI',
        'Experimented with Reinforcement Learning and agent-based AI systems',
        'Delivered game development projects in Unity and Unreal Engine using C++ and C#'
      ]
    },
    {
      date: 'APR 2024 — JUL 2025',
      company: 'Code Camp',
      type: 'Part-time · On-site',
      role: 'Head Teacher',
      bullets: [
        'Independently taught 24–30 students per class across multiple locations in coding and computational thinking',
        'Increased student engagement and participation by ~35–40% through interactive coding exercises',
        'Designed and delivered structured lesson plans ensuring consistent progress and measurable skill development'
      ]
    },
    {
      date: 'SEP 2024 — JAN 2025',
      company: '[P1] Games',
      type: 'Freelance · Remote',
      role: 'Game Programmer',
      bullets: [
        'Led development of 3 complete game projects, overseeing programming tasks and code quality',
        'Implemented and optimised core gameplay systems in Unity and C#, improving performance by 25–30%',
        'Collaborated with designers, artists, and QA teams to deliver engaging gameplay within tight deadlines',
        'Mentored junior developers through code reviews, debugging support, and technical guidance'
      ]
    }
  ],

  certs: [
    { issuer: 'Forage · Quantium', name: 'Software Engineering Job Simulation', date: 'Dec 2025 · ID: GtrSggzuCghjM7cEG' },
    { issuer: 'Dubai Future Foundation', name: '1 Million Prompters — Prompt Engineering', date: 'Sep 2025' },
    { issuer: 'VMware · IT Academy', name: 'Network Virtualization Concepts', date: '2021' },
    { issuer: 'NxtWave · CCBP 4.0', name: 'Full Stack Development Intensive', date: 'Sep 2021 – Nov 2022' }
  ],

  projects: [
    {
      icon: 'DCGAN',
      title: 'AI Dungeon Generator',
      tags: ['Unreal Engine', 'Python', 'DCGAN', 'Deep Learning', 'A* Pathfinding', 'Procedural Gen'],
      desc: 'AI-driven dungeon generation using Deep Convolutional GANs and procedural algorithms inside Unreal Engine.',
      fullDesc: "Developed an AI-driven dungeon generation system using deep learning and procedural algorithms to automatically create coherent dungeon layouts within Unreal Engine. The system utilised a DCGAN to generate dungeon and room layouts from training data. The dataset was preprocessed and augmented through rotation techniques to improve model generalisation.\n\nCustom corrective systems enforced room boundaries, cleaned invalid tile data, identified and connected dungeon regions, automatically placed doors, and used A* pathfinding to connect isolated areas efficiently. The final system allowed users to visualise procedurally generated dungeons that combined AI-driven generation with rule-based validation.",
      github: null,
      live: null,
      period: 'Jun 2024 – Aug 2024'
    },
    {
      icon: 'GA',
      title: 'GA Enemies — Adaptive Game AI',
      tags: ['Unity', 'C#', 'Genetic Algorithms', 'Game AI', 'Adaptive Difficulty'],
      desc: 'Enemy AI that evolves using a Genetic Algorithm based on player performance, creating dynamic difficulty scaling.',
      fullDesc: "Developed a game AI system using a Genetic Algorithm where enemy strength dynamically evolves based on player performance. As the player defeats enemies, the algorithm adapts future enemies by increasing their attributes — strength, speed, and difficulty — creating a progressively challenging gameplay experience.\n\nAlso implemented a loot-based stat system where players receive bonus attributes from enemy drops, allowing for adaptive player progression alongside evolving enemies. This project demonstrates the application of evolutionary algorithms in game design, balancing difficulty, and enhancing replayability through dynamic scaling.",
      github: null,
      live: null,
      period: 'Feb 2024 – Apr 2024'
    },
    {
      icon: 'LLM',
      title: 'LLM & RAG Prototypes',
      tags: ['Python', 'LangChain', 'Hugging Face', 'FastAPI', 'Vector Databases'],
      desc: 'Series of LLM-powered applications and RAG pipelines built during freelance AI development work.',
      fullDesc: "As part of independent freelance AI engineering work, developed multiple LLM and RAG prototypes using LangChain, Hugging Face transformers, and vector databases. Built backend APIs in FastAPI to expose these AI systems, along with automation scripts in Python.\n\nAlso experimented with Reinforcement Learning and agent-based AI systems, exploring how intelligent agents can be designed to operate in dynamic environments.",
      github: null,
      live: null,
      period: 'Feb 2025 – Present'
    },
    {
      icon: 'NPC',
      title: 'NPC AI — Utility AI & Deep Q-Learning',
      tags: ['Python', 'Deep Q-Learning', 'Utility AI', 'Game AI', 'Neural Networks'],
      desc: 'MSc dissertation: NPC decision-making system combining Utility AI and Deep Q-Learning for smarter game behaviour.',
      fullDesc: "Conducted dissertation research on Non-Player Character decision-making using Utility AI and Deep Q-Learning as part of the MSc at Kingston University. The project explored innovative approaches to game AI behaviour, combining classical utility-based AI with modern deep reinforcement learning.\n\nThe system enabled NPCs to make context-aware decisions by weighing multiple competing goals via utility functions, while the DQL component allowed them to learn optimal strategies through gameplay experience. This research contributed to Kingston University's MSc programme and earned a Distinction grade.",
      github: null,
      live: null,
      period: '2023 – 2024'
    }
  ],

  contact: {
    sub: 'Open to full-time roles, freelance projects, and interesting collaborations in AI, software, or game development.',
    email: 'bhargavramkrishna@gmail.com',
    linkedin: 'https://www.linkedin.com/in/bhargav-rama-krishna-chitrala-1b36a2189',
    github: '#'
  },

  faqs: {
    education: "Krishna completed his MSc in Computer Games & AI Programming at Kingston University London, graduating with a Distinction in 2024. His modules included 3D Game Programming, Machine Learning & AI, Connected Games Development, and Industry Tools & Practices. His dissertation focused on NPC decision-making using Utility AI and Deep Q-Learning.",
    projects: "Krishna has built some really interesting projects! His standouts include: an AI Dungeon Generator using DCGANs inside Unreal Engine, a Genetic Algorithm enemy AI system in Unity that adapts to player skill, LLM & RAG prototypes using LangChain and Hugging Face, and his MSc dissertation on NPC AI using Deep Q-Learning. Click any project card above to see the full details!",
    ai: "Absolutely! AI and ML are Krishna's core specialisation. He works with PyTorch, LangChain, Hugging Face, RAG pipelines, Deep Q-Learning, DCGANs, Genetic Algorithms, and Reinforcement Learning. He's built LLM-powered apps, procedural AI systems for games, and intelligent NPC behaviour systems.",
    ml: "Yes! Krishna's ML expertise includes Deep Q-Learning (used in his MSc dissertation), DCGANs (used in his AI Dungeon Generator), Genetic Algorithms (used for adaptive game AI), Reinforcement Learning, and RAG pipeline development. He uses PyTorch and Hugging Face as his main ML frameworks.",
    hire: "Yes! Krishna is currently open to full-time roles and freelance projects in AI engineering, software development, and game development. He's based in Rugby, England and open to on-site, hybrid, or remote opportunities. Reach out via LinkedIn or email!",
    experience: "Krishna has 3 roles on his CV: Freelance AI & Software Developer (Feb 2025–present, independent), Head Teacher at Code Camp (Apr 2024–Jul 2025, teaching coding to 24–30 students per class), and Game Programmer at [P1] Games (Sep 2024–Jan 2025, leading 3 complete game projects in Unity/C#).",
    games: "Krishna has solid game dev experience! He built an AI Dungeon Generator in Unreal Engine, a Genetic Algorithm enemy system in Unity, and led 3 complete game projects at [P1] Games as a Game Programmer, improving performance by 25–30%. His MSc specialised in Computer Games & AI Programming.",
    skills: "Krishna's main tech stack: Python, PyTorch, LangChain, Hugging Face, FastAPI, RAG Pipelines, Deep Q-Learning, DCGAN, Unity, Unreal Engine, C++, C#, SQL, Git, and AI dev tools like Claude, Cursor, GitHub Copilot, and v0.",
    location: "Krishna is based in Rugby, England, United Kingdom. He's open to on-site, hybrid, and remote roles.",
    certs: "Krishna holds certifications in: Software Engineering Job Simulation (Forage/Quantium, Dec 2025), 1 Million Prompters — Prompt Engineering (Dubai Future Foundation, Sep 2025), Network Virtualization Concepts (VMware IT Academy), and CCBP 4.0 Full Stack Development Intensive (NxtWave).",
    default: "Great question! Krishna is an AI & Software Developer based in Rugby, UK, with an MSc Distinction from Kingston University. He specialises in LLM apps, RAG pipelines, game AI, and full-stack development. Try asking about his education, projects, skills, or availability!"
  }
};
