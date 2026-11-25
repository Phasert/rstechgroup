// Service definitions. The `summary` lines come from the Website Master Brief.
// Detail copy (problems, solutions, benefits, FAQs) is DRAFT copy written for this
// build from the brief's scope; it makes no guarantees and needs owner review.

export type ServiceSlug =
  | "it-support"
  | "networking"
  | "website-development"
  | "social-media-setup"
  | "google-business-profile"
  | "technology-health-checks";

export interface Service {
  slug: ServiceSlug;
  title: string;
  short: string;
  summary: string;
  icon: "Wrench" | "Network" | "MonitorSmartphone" | "Share2" | "MapPin" | "Activity";
  /** Longer plain-language overview for the detail page (draft, owner review). */
  description: string;
  /** Practical, typical situations this service covers (draft, owner review). No claims of past jobs. */
  examples: { title: string; body: string }[];
  problems: string[];
  solutions: string[];
  benefits: string[];
  faqs: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: "it-support",
    title: "Home & Business IT Support",
    short: "IT Support",
    icon: "Wrench",
    summary:
      "Computer troubleshooting, hardware and software issues, device configuration and everyday technology challenges.",
    description:
      "When a computer, printer or device stops doing what it should, it holds up your day. We diagnose the cause, fix what can be fixed, set things up properly and explain in plain language what was done, for households and for businesses that don't have their own IT staff.",
    examples: [
      { title: "A laptop that has slowed to a crawl", body: "Checking startup programs, storage, updates and hardware health to find out why, then fixing the cause rather than the symptom." },
      { title: "Setting up a new computer", body: "Moving files across, installing the software you use and configuring email, printers and backups so it's ready to work." },
      { title: "A printer nobody can print to", body: "Getting a shared printer or scanner working again for every computer and phone that needs it." },
      { title: "Software errors and failed updates", body: "Resolving programs that crash, won't install or won't update, and making sure the system is left in a stable state." },
    ],
    problems: [
      "Slow or unresponsive computers",
      "Software that won't install, update or open",
      "Printers, peripherals and devices that won't connect",
      "New devices that need setting up properly",
    ],
    solutions: [
      "Diagnosis of hardware and software faults",
      "Operating system and application configuration",
      "Device and peripheral setup",
      "Clear explanations of what was done and why",
    ],
    benefits: ["Less downtime", "Practical, honest advice", "Support for homes and businesses"],
    faqs: [
      {
        q: "Do you support both homes and businesses?",
        a: "Yes. RS Technology Group works with residential and commercial customers.",
      },
      {
        q: "How do I request support?",
        a: "Send a quote request, call or message on WhatsApp with a short description of the issue.",
      },
    ],
  },
  {
    slug: "networking",
    title: "Networking & Infrastructure",
    short: "Networking",
    icon: "Network",
    summary:
      "Network solutions, wireless connectivity, Wi-Fi coverage improvements, wireless bridging and infrastructure configuration.",
    description:
      "A good network is one you never have to think about. We look at how your home or building is laid out and how you use it, then plan and configure the routers, switches, access points and wireless links that give you steady, secure coverage where you need it.",
    examples: [
      { title: "Wi-Fi that doesn't reach upstairs or the back rooms", body: "Assessing the space and positioning or adding access points so coverage is even, instead of relying on one router." },
      { title: "Connecting a second building", body: "Linking an office, garage or outbuilding to the main network with a point-to-point wireless bridge, without trenching cable." },
      { title: "A small office network that grew without a plan", body: "Reorganising and configuring routers and switches, labelling connections and separating guest access from business devices." },
      { title: "Connections that keep dropping", body: "Tracing the cause, whether it's interference, placement, configuration or equipment, and recommending a practical fix." },
    ],
    problems: [
      "Wi-Fi dead zones in parts of a home or office",
      "Unreliable or dropping connections",
      "Buildings or outdoor areas that need linking",
      "Network equipment that was never configured properly",
    ],
    solutions: [
      "Wireless coverage assessment and improvement",
      "Access point placement and configuration",
      "Wireless bridging between buildings or areas",
      "Router, switch and infrastructure configuration",
    ],
    benefits: ["More consistent coverage", "A tidier, documented network", "Room to grow"],
    faqs: [
      {
        q: "Can you fix weak Wi-Fi in one part of my building?",
        a: "Often, yes. The right fix depends on the layout and equipment, so we assess the space before recommending anything.",
      },
      {
        q: "What is wireless bridging?",
        a: "A point-to-point wireless link that connects two locations, such as separate buildings, without running cable between them.",
      },
    ],
  },
  {
    slug: "website-development",
    title: "Website Design & Development",
    short: "Websites",
    icon: "MonitorSmartphone",
    summary:
      "Modern, responsive websites that help businesses establish credibility and strengthen their online presence.",
    description:
      "Your website is often the first thing a customer sees. We design and build clear, modern sites that work on phones, tablets and desktops, are structured around how your customers find and contact you, and are straightforward to keep up to date.",
    examples: [
      { title: "A first website for a new business", body: "A clean, professional site that explains what you do, where you work and how to reach you." },
      { title: "Replacing an outdated site", body: "Rebuilding an old or hard-to-use website so it looks current and works properly on mobile." },
      { title: "Making it easy to get in touch", body: "Clear calls to action, click-to-call and WhatsApp links, and an enquiry form placed where customers look for them." },
      { title: "Domain and business email", body: "Help configuring your domain and a professional email address to match, depending on the project scope." },
    ],
    problems: [
      "No website, or one that looks outdated",
      "A site that doesn't work well on phones",
      "Customers can't easily find contact details or services",
    ],
    solutions: [
      "Responsive design for phones, tablets and desktops",
      "Clear structure built around how customers contact you",
      "Hosting, maintenance, domain and business email configuration, subject to scope",
    ],
    benefits: ["Professional first impression", "Easier for customers to reach you", "Works on every screen size"],
    faqs: [
      {
        q: "How much does a website cost?",
        a: "Pricing depends on the project scope: the number of pages, the content and features you need, and any hosting or email setup. Request a quote and we'll recommend the right option.",
      },
      {
        q: "Do you provide hosting and email?",
        a: "Hosting, maintenance, domain and business email configuration may be offered depending on the project scope.",
      },
    ],
  },
  {
    slug: "social-media-setup",
    title: "Social Media Setup",
    short: "Social Media",
    icon: "Share2",
    summary: "Business profile creation, branding consistency and initial configuration across relevant platforms.",
    description:
      "Customers often look for you on social media before they call. We set up your business profiles on the platforms that suit you, with consistent names, logos, descriptions and contact details, so you start from a clean, professional base.",
    examples: [
      { title: "Starting from scratch", body: "Creating business pages on the platforms that make sense for your customers, with your branding and details in place." },
      { title: "Tidying up mismatched profiles", body: "Bringing names, logos, bios and contact information into line across the profiles you already have." },
      { title: "Linking everything together", body: "Connecting your profiles to your website, WhatsApp and Google Business Profile so customers can move between them easily." },
    ],
    problems: [
      "No business presence on social platforms",
      "Inconsistent names, logos or details across profiles",
      "Profiles missing contact details or business information",
    ],
    solutions: [
      "Business profile creation on relevant platforms",
      "Consistent branding across profiles",
      "Initial configuration of contact and business details",
    ],
    benefits: ["A consistent brand", "Easier for customers to find you", "A clean starting point"],
    faqs: [
      {
        q: "Do you manage posting afterwards?",
        a: "This service covers setup and initial configuration. Ask us if you need something beyond that.",
      },
    ],
  },
  {
    slug: "google-business-profile",
    title: "Google Business Profile Setup",
    short: "Google Profile",
    icon: "MapPin",
    summary: "Establish and optimise a business presence on Google Search and Maps.",
    description:
      "When someone searches for a business like yours, your Google Business Profile is often what they see first. We help you create or claim it and fill it in accurately, so customers find the right hours, location and contact details.",
    examples: [
      { title: "Getting on the map", body: "Creating a new profile and walking you through Google's verification steps." },
      { title: "Fixing wrong information", body: "Correcting outdated hours, phone numbers, addresses or categories on an existing profile." },
      { title: "Completing a bare profile", body: "Adding a clear description, services, photos you supply and links to your website and contact channels." },
    ],
    problems: [
      "Your business doesn't appear on Google Maps",
      "Incorrect hours, phone numbers or location details",
      "An unclaimed or incomplete profile",
    ],
    solutions: [
      "Profile creation or claiming",
      "Accurate business details, categories and hours",
      "Profile optimisation for clarity and completeness",
    ],
    benefits: ["Visible on Search and Maps", "Accurate information for customers", "More professional presence"],
    faqs: [
      {
        q: "Can you guarantee a top ranking on Google?",
        a: "No one can honestly guarantee rankings. We set up a complete, accurate profile that gives you the best starting point.",
      },
    ],
  },
  {
    slug: "technology-health-checks",
    title: "Technology Health Checks",
    short: "Health Checks",
    icon: "Activity",
    summary:
      "Assess existing technology environments to identify potential issues, performance limitations and improvement opportunities.",
    description:
      "Not every technology problem announces itself. A health check is a structured look at your computers, network and setup to spot weak points, performance limits and risks early, with a plain-language summary of what we found and what we'd prioritise.",
    examples: [
      { title: "Before you grow", body: "Checking whether your network and devices can handle more staff, more devices or a new location." },
      { title: "When things feel slow", body: "Reviewing devices, connections and configuration to find where performance is being lost." },
      { title: "Taking over an inherited setup", body: "Documenting what's in place, its condition and what should be addressed first." },
    ],
    problems: [
      "Not sure whether your setup is reliable",
      "Systems that feel slower than they should",
      "Equipment of unknown age or condition",
    ],
    solutions: [
      "Review of devices, network and configuration",
      "Identification of issues and performance limitations",
      "Clear, prioritised improvement recommendations",
    ],
    benefits: ["Spot problems early", "Know where to invest", "A clear picture of your setup"],
    faqs: [
      {
        q: "What do I get at the end?",
        a: "A clear summary of what was found and practical recommendations, in plain language.",
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
