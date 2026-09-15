import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import News from '../models/News.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Seed] Database already contains ${userCount} users and existing news. Skipping initial seed.`);
      return;
    }

    console.log('[Seed] Database is empty. Seeding initial demo users and curated news articles...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create demo users
    const users = await User.insertMany([
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@chronicle.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        bio: 'Senior Investigative Tech & Global Affairs Journalist with over 10 years covering Silicon Valley & international summits.',
        role: 'admin',
      },
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@chronicle.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        bio: 'Financial analyst, business economics editor, and market strategist.',
        role: 'journalist',
      },
      {
        name: 'Maya Lin',
        email: 'maya.lin@chronicle.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Culture, Arts & Entertainment correspondent covering global cinema and music trends.',
        role: 'journalist',
      },
    ]);

    const [sarah, alex, maya] = users;

    const sampleNews = [
      {
        title: 'Next-Gen Autonomous AI Models Achieve Historic Reasoning Benchmarks',
        summary: 'Researchers reveal autonomous reasoning systems capable of multi-step logical deduction, opening new frontiers in science and medicine.',
        content: `In an unprecedented breakthrough for computational intelligence, a collaborative consortium of artificial intelligence laboratories today announced the release of next-generation reasoning architectures. 

Unlike previous statistical text predictors, these models formulate hypothesis graphs, critique their own intermediate deductions, and eliminate hallucinated conclusions with mathematically verified certainty.

Dr. Elena Vance, lead scientist on the project, emphasized the seismic implications for global research: "We are moving from conversational synthesizers to rigorous synthetic reasoning partners. In initial trials, these systems solved 40-year-old molecular folding conjectures in under three days."

Industry leaders have responded with both excitement and calls for standardized international alignment frameworks. As commercial deployments begin later this quarter, tech institutions worldwide are preparing for an evolutionary leap in automated engineering, automated medicine, and algorithmic discovery.`,
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        tags: ['AI', 'Tech', 'Innovation', 'Future'],
        author: sarah._id,
        authorName: sarah.name,
        views: 1420,
        readTime: '4 min read',
        isFeatured: true,
        comments: [
          {
            user: alex._id,
            name: alex.name,
            avatar: alex.avatar,
            text: 'This changes the timeline for computational chemistry completely. Fascinating read!',
            createdAt: new Date(Date.now() - 3600000 * 5),
          },
        ],
      },
      {
        title: 'Global Renewable Energy Investments Surge Past $2 Trillion Milestone',
        summary: 'Solar and wind infrastructure outpace legacy fossil fuels as sovereign funds and private capital accelerate clean energy grids.',
        content: `Global capital allocation toward sustainable energy transition has crossed the watershed $2 trillion mark, according to the latest international economic energy monitor.

The acceleration is driven primarily by offshore floating wind turbines in the North Sea and ultra-scale solar farms across equatorial regions, where power production costs have plunged to historic lows.

"Clean energy is no longer an ethical concession; it is an undeniable economic powerhouse with superior risk-adjusted yields," said sovereign wealth strategist Marcus Thorne. 

Manufacturing capacity for next-generation solid-state storage has tripled year-over-year, resolving longtime grid intermittency challenges and creating hundreds of thousands of engineering jobs across five continents.`,
        category: 'Business',
        imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
        tags: ['Energy', 'Economy', 'Sustainability', 'GreenTech'],
        author: alex._id,
        authorName: alex.name,
        views: 1180,
        readTime: '3 min read',
        isFeatured: true,
        comments: [],
      },
      {
        title: 'Historic Climate Accord Ratified at International Summit in Geneva',
        summary: 'Over 140 nations unite on stringent carbon accountability standards with automated satellite-verified emission penalties.',
        content: `Delegates from 140 nations concluded a grueling two-week marathon negotiation in Geneva today, establishing the first binding planetary treaty with automated spaceborne compliance tracking.

Under the new covenant, independent synthetic aperture radar satellites will measure greenhouse gas plumes in real time, triggering transparent international tariffs on unauthorized industrial emissions.

"Diplomacy has finally combined moral duty with verifiable data," stated the UN High Commissioner for Environmental Governance. "No state or corporation will be able to camouflage ecological damage behind altered spreadsheets."`,
        category: 'Politics',
        imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        tags: ['Politics', 'Diplomacy', 'Climate', 'Geneva'],
        author: sarah._id,
        authorName: sarah.name,
        views: 950,
        readTime: '4 min read',
        isFeatured: true,
        comments: [],
      },
      {
        title: 'Championship Drama: Underdogs Clinch Epic 94th-Minute Victory',
        summary: 'In an unforgettable final showdown, the visiting side completed an improbable three-goal comeback in front of 85,000 spectators.',
        content: `Sports lore was written in neon letters on Sunday night as the underdogs engineered one of the most staggering comebacks in international football history.

Trailing 2-0 with fewer than fifteen minutes remaining on the game clock, the squad unleashed a blistering high-press counterattack. A curling free-kick in the 81st minute sparked hope, followed by a thunderous header off a corner in the 89th.

Then, deep into stoppage time at 93:42, forward Julian Ortiz stripped the ball in midfield and curled a miraculous 25-yard strike into the top right stanchion, sending fans into jubilation.`,
        category: 'Sports',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
        tags: ['Football', 'Champions', 'Sports', 'Drama'],
        author: alex._id,
        authorName: alex.name,
        views: 1320,
        readTime: '3 min read',
        isFeatured: true,
        comments: [],
      },
      {
        title: 'Cinematic Masterpiece Sweeps Venice Film Festival Awards',
        summary: 'Director Clara Moreau’s visually hypnotic psychological drama wins the coveted Golden Lion amidst a standing ovation.',
        content: `The 83rd Venice International Film Festival culminated with an emotional triumph for French visionary Clara Moreau, whose surreal epic "Echoes of the Solstice" took home the prestigious Golden Lion.

Shot entirely on 70mm analog film on the windswept volcanic shores of Iceland, the film tells an intricate multi-generational story of memory, loss, and scientific rediscovery.

Critics hailed the production as a masterclass in atmospheric cinematography and spatial acoustic design, marking a glorious resurgence of pure cinema in an age of formulaic digital franchise filmmaking.`,
        category: 'Entertainment',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
        tags: ['Cinema', 'Film', 'Venice', 'Culture'],
        author: maya._id,
        authorName: maya.name,
        views: 890,
        readTime: '3 min read',
        isFeatured: true,
        comments: [],
      },
      {
        title: 'Breakthrough Targeted Cell Therapy Reverses Chronic Autoimmune Disorders',
        summary: 'Clinical phase-3 trials demonstrate 91% remission in patients with severe autoimmune conditions using personalized cellular reprogrammers.',
        content: `A medical revolution has taken root at the National Institute of Health Sciences, where doctors announced remarkable phase-3 trial results for an engineered cell therapy.

By reprogramming a patient's own regulatory T-cells to specifically disarm self-destructive autoimmune responses while preserving normal pathogen defenses, scientists achieved unprecedented therapeutic outcomes.

Over 90% of participating patients suffering from refractory lupus and rheumatoid disease achieved sustained drug-free remission after a single intravenous infusion.`,
        category: 'Health',
        imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
        tags: ['Medicine', 'Health', 'Biotech', 'Research'],
        author: sarah._id,
        authorName: sarah.name,
        views: 1250,
        readTime: '4 min read',
        isFeatured: true,
        comments: [],
      },
      {
        title: 'Deep-Sea Robotic Explorers Discover Thriving Hydrothermal Ecosystem',
        summary: 'Automated submersibles at 6,000 meters depth in the Pacific Trench uncover previously undocumented crystalline organisms.',
        content: `Autonomous deep-submergence exploration vehicles surveying the unexplored abyssal plains of the Mariana Trench have transmitted telemetry revealing a bizarre hydrothermal biosphere.

Colonies of bio-luminescent organisms utilizing chemosynthetic sulfur metabolism thrive in superheated mineral-rich water at temperatures exceeding 380 degrees Celsius.

Marine biologists believe the genetic enzymes discovered within these resilient organisms could yield invaluable applications in biotechnology, extreme-environment polymers, and the search for extraterrestrial life on ice moons such as Europa.`,
        category: 'World',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        tags: ['Ocean', 'Science', 'Discovery', 'World'],
        author: maya._id,
        authorName: maya.name,
        views: 780,
        readTime: '4 min read',
        isFeatured: false,
        comments: [],
      },
      {
        title: 'Central Banks Pioneer Interoperable Quantum-Resistant Digital Currency Networks',
        summary: 'A consortium of premier monetary institutions tests frictionless cross-border liquidity settlements resistant to future cryptographic threats.',
        content: `Financial architecture underwent a fundamental upgrade today as seven central reserve banks completed live settlement trials on a unified quantum-proof distributed ledger.

The protocol processes high-volume cross-border remittances within 400 milliseconds, eliminating multi-day clearing hurdles and exorbitant currency exchange fees.

Financial technology analysts expect this infrastructure to slash friction for multinational trade while establishing a military-grade cryptographic shield against emerging quantum decryption computing.`,
        category: 'Business',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
        tags: ['Fintech', 'Banking', 'Crypto', 'Economy'],
        author: alex._id,
        authorName: alex.name,
        views: 820,
        readTime: '3 min read',
        isFeatured: false,
        comments: [],
      },
      {
        title: 'Commercial Space Station Welcomes First International Module in Orbit',
        summary: 'The orbital habitat marks the successful transition from government-led space programs to privatized commercial orbital research parks.',
        content: `Two hundred and fifty miles above Earth, docking latches engaged smoothly as the inaugural commercial science module joined the expanding Orbital Reef complex.

Engineers and astronauts celebrated the milestone, which expands zero-gravity pharmaceutical crystallographic testing capacity fivefold.

With several private commercial entities scheduled to send laboratory missions over the coming months, low-Earth orbit has officially transformed into an accessible manufacturing incubator.`,
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        tags: ['Space', 'Tech', 'Orbit', 'Aerospace'],
        author: sarah._id,
        authorName: sarah.name,
        views: 1105,
        readTime: '4 min read',
        isFeatured: false,
        comments: [],
      },
      {
        title: 'Modern Architecture Trends Embrace Living Mycelium and Bio-Concrete',
        summary: 'Architects across global metropolises are building self-healing urban structures that sequester carbon and clean ambient air.',
        content: `Urban skylines are preparing for an organic metamorphosis. Leading architectural firms have begun erecting commercial pavilions made with structural mycelium blocks and bacterial self-repairing concrete.

When micro-cracks form from environmental thermal stress, embedded dormant bacterial spores wake up upon contact with rainwater, producing limestone calcification that naturally seals fractures within 48 hours.

The buildings effectively act as urban carbon sponges, turning urban centers into active environmental filters.`,
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        tags: ['Architecture', 'BioTech', 'Green', 'Cities'],
        author: maya._id,
        authorName: maya.name,
        views: 670,
        readTime: '3 min read',
        isFeatured: false,
        comments: [],
      },
      {
        title: 'The Neurological Benefits of Micro-Rest: What Science Says About Deep Sleep',
        summary: 'New neuroimaging scans show how brief 20-minute cyclical rest periods flush metabolic toxins from the prefrontal cortex.',
        content: `Neuroscientists at Oxford and Stanford have published a comprehensive map of how targeted micro-rest intervals dramatically enhance cognitive resilience.

Using non-invasive high-resolution fMRI scans, researchers observed that intentional sensory deprivation pauses activate glymphatic cleaning cycles previously believed to occur exclusively during deep nighttime REM phases.

Corporate campuses and athletic training facilities are swiftly installing sleep sanctuaries, acknowledging the proven links between cognitive longevity, emotional balance, and restorative rest.`,
        category: 'Health',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
        tags: ['Sleep', 'Neuroscience', 'Wellness', 'Health'],
        author: sarah._id,
        authorName: sarah.name,
        views: 940,
        readTime: '3 min read',
        isFeatured: false,
        comments: [],
      },
      {
        title: 'Global Tennis Masters: Next-Gen Phenom Topples World Number One in Thriller',
        summary: 'Nineteen-year-old sensation displays breathtaking baseline power and defensive wizardry in a five-set masterclass.',
        content: `A generational changing of the guard reverberated across the tennis world as 19-year-old Lucas Vance claimed victory over the reigning world number one in a breathtaking five-hour and twelve-minute marathon.

Down two sets to love, Vance shifted tactics, utilizing aggressive kick serves and audacious drop shots to unsettle the veteran champion before taking the deciding set tiebreak 10-8.`,
        category: 'Sports',
        imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
        tags: ['Tennis', 'Sports', 'Masters', 'Athletics'],
        author: alex._id,
        authorName: alex.name,
        views: 890,
        readTime: '3 min read',
        isFeatured: false,
        comments: [],
      },
    ];

    await News.insertMany(sampleNews);
    console.log(`[Seed] Successfully seeded ${users.length} users and ${sampleNews.length} news articles.`);
  } catch (error) {
    console.error('[Seed] Seeding error:', error.message);
  }
};
