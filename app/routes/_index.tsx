import {
  LandingContainer,
  LandingCTA,
  LandingFAQ,
  LandingFeatures,
  LandingHero,
  LandingHowItWorks,
  LandingPainPoints,
  LandingPricing,
  LandingSocialProof,
  LandingSocialRating,
  LandingTestimonials,
} from '~/designSystem'

export default function LandingPage() {
  const features = [
    {
      heading: `Intelligent Task Management`,
      description: `Optimize workload distribution with AI-driven task allocation, ensuring efficient resource utilization and improved productivity.`,
      icon: <i className="las la-tasks"></i>,
    },
    {
      heading: `Precision Time Tracking`,
      description: `Capture billable hours accurately with our intuitive time tracking system, maximizing revenue and improving client transparency.`,
      icon: <i className="las la-clock"></i>,
    },
    {
      heading: `Seamless Collaboration`,
      description: `Foster teamwork with integrated communication tools, file sharing, and real-time updates, enhancing firm-wide efficiency.`,
      icon: <i className="las la-users"></i>,
    },
    {
      heading: `Financial Oversight`,
      description: `Gain comprehensive financial insights with advanced reporting and analytics, empowering data-driven decision-making.`,
      icon: <i className="las la-chart-line"></i>,
    },
    {
      heading: `Role-Based Access Control`,
      description: `Ensure data security and streamline workflows with customizable access levels for different roles within your firm.`,
      icon: <i className="las la-user-lock"></i>,
    },
    {
      heading: `Integrations Ecosystem`,
      description: `Seamlessly connect with your existing tools and systems, creating a unified platform for all your practice management needs.`,
      icon: <i className="las la-plug"></i>,
    },
  ]

  const testimonials = [
    {
      name: `Sarah Thompson`,
      designation: `Managing Partner, Thompson & Associates`,
      content: `LawManage Pro revolutionized our firm's operations. We've seen a 25% increase in billable hours and significantly improved client satisfaction.`,
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
      name: `Michael Chen`,
      designation: `Senior Associate, Chen Legal Group`,
      content: `The task management features have transformed how we handle cases. Our team collaboration has never been stronger.`,
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
      name: `Emily Rodriguez`,
      designation: `Legal Operations Manager, Rodriguez Law Firm`,
      content: `The financial insights provided by LawManage Pro have been invaluable. We've optimized our pricing strategy and improved profitability.`,
      avatar: 'https://randomuser.me/api/portraits/women/27.jpg',
    },
    {
      name: `David Patel`,
      designation: `IT Director, Patel & Partners`,
      content: `Implementing LawManage Pro was seamless. The integrations with our existing systems have created a unified, efficient workflow.`,
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    },
    {
      name: `Lisa Johnson`,
      designation: `HR Manager, Johnson Legal Solutions`,
      content: `The role-based access control has simplified our onboarding process and enhanced data security. It's a game-changer for HR.`,
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    },
    {
      name: `Robert Williams`,
      designation: `Founding Partner, Williams Law Group`,
      content: `Since adopting LawManage Pro, we've reduced non-billable hours by 30% and seen a significant boost in overall firm productivity.`,
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ]

  const navItems = [
    {
      title: `Features`,
      link: `#features`,
    },
    {
      title: `Pricing`,
      link: `#pricing`,
    },
    {
      title: `FAQ`,
      link: `#faq`,
    },
  ]

  const packages = [
    {
      title: `Starter`,
      description: `Perfect for small practices looking to streamline operations`,
      monthly: 99,
      yearly: 990,
      features: [
        `Up to 10 users`,
        `Basic task management`,
        `Time tracking`,
        `Financial reporting`,
      ],
    },
    {
      title: `Professional`,
      description: `Ideal for growing firms with advanced management needs`,
      monthly: 249,
      yearly: 2490,
      features: [
        `Up to 50 users`,
        `Advanced task management`,
        `AI-driven insights`,
        `Full financial suite`,
        `Priority support`,
      ],
      highlight: true,
    },
    {
      title: `Enterprise`,
      description: `Tailored solutions for large, multi-practice firms`,
      monthly: 599,
      yearly: 5990,
      features: [
        `Unlimited users`,
        `Custom integrations`,
        `Dedicated account manager`,
        `Advanced security features`,
        `24/7 premium support`,
      ],
    },
  ]

  const questionAnswers = [
    {
      question: `How does LawManage Pro improve time tracking accuracy?`,
      answer: `LawManage Pro uses intelligent time capture technology that automatically tracks activities, reminds users to log time, and provides easy-to-use interfaces for manual entry. This comprehensive approach significantly reduces missed billable hours and improves overall accuracy.`,
    },
    {
      question: `Can LawManage Pro integrate with our existing software?`,
      answer: `Yes, LawManage Pro is designed with a robust API and pre-built integrations for many popular legal and business software solutions. Our team can work with you to ensure seamless integration with your current tech stack.`,
    },
    {
      question: `How secure is our firm's data with LawManage Pro?`,
      answer: `We take data security seriously. LawManage Pro employs bank-level encryption, regular security audits, and role-based access controls. We are compliant with industry standards and can provide detailed information on our security measures upon request.`,
    },
    {
      question: `What kind of support does LawManage Pro offer?`,
      answer: `We offer tiered support based on your package. All clients receive access to our comprehensive knowledge base and email support. Professional and Enterprise plans include priority support with faster response times, and Enterprise clients benefit from a dedicated account manager and 24/7 premium support.`,
    },
  ]

  const logos = [
    { url: 'https://i.imgur.com/afwBIFK.png' },
    { url: 'https://i.imgur.com/LlloOPa.png' },
    { url: 'https://i.imgur.com/j8jPb4H.png' },
    { url: 'https://i.imgur.com/mJ1sZFv.png' },
  ]

  const steps = [
    {
      heading: `Seamless Onboarding`,
      description: `Our team guides you through a smooth setup process, ensuring your data is migrated securely and your team is trained effectively.`,
    },
    {
      heading: `Customized Configuration`,
      description: `We tailor LawManage Pro to your firm's specific needs, setting up workflows, access controls, and integrations to match your processes.`,
    },
    {
      heading: `Optimize Operations`,
      description: `Leverage our AI-driven insights to refine task allocation, improve time tracking, and enhance overall firm efficiency.`,
    },
    {
      heading: `Scale with Confidence`,
      description: `As your firm grows, LawManage Pro adapts, providing the tools and support you need to manage increasing complexity and drive success.`,
    },
  ]

  const painPoints = [
    {
      emoji: `😓`,
      title: `Struggling with inefficient time tracking and billing`,
    },
    {
      emoji: `🤯`,
      title: `Overwhelmed by complex case management`,
    },
    {
      emoji: `💸`,
      title: `Losing revenue due to poor resource allocation`,
    },
  ]

  const avatarItems = [
    {
      src: 'https://randomuser.me/api/portraits/men/51.jpg',
    },
    {
      src: 'https://randomuser.me/api/portraits/women/9.jpg',
    },
    {
      src: 'https://randomuser.me/api/portraits/women/52.jpg',
    },
    {
      src: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
      src: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
  ]

  return (
    <LandingContainer navItems={navItems}>
      <LandingHero
        title={`Empower Your Law Firm with Intelligent Practice Management`}
        subtitle={`Streamline operations, boost productivity, and maximize profitability with LawManage Pro's comprehensive solution.`}
        buttonText={`Start Your Free Trial`}
        pictureUrl={`https://marblism-dashboard-api--production-public.s3.us-west-1.amazonaws.com/IGicH2-lawmanagepro-yLV8`}
        socialProof={
          <LandingSocialRating
            avatarItems={avatarItems}
            numberOfUsers={1000}
            suffixText={`from thriving law firms`}
          />
        }
      />
      <LandingSocialProof
        logos={logos}
        title={`Trusted by Leading Legal Institutions`}
      />
      <LandingPainPoints
        title={`Are You Losing 30% of Your Potential Revenue to Inefficient Practice Management?`}
        painPoints={painPoints}
      />
      <LandingHowItWorks
        title={`Transform Your Practice in Four Simple Steps`}
        steps={steps}
      />
      <LandingFeatures
        id="features"
        title={`Unlock Your Firm's Full Potential`}
        subtitle={`Discover how LawManage Pro's powerful features can revolutionize your practice management.`}
        features={features}
      />
      <LandingTestimonials
        title={`Success Stories from Firms Like Yours`}
        subtitle={`See how LawManage Pro has transformed legal practices across the nation.`}
        testimonials={testimonials}
      />
      <LandingPricing
        id="pricing"
        title={`Invest in Your Firm's Future`}
        subtitle={`Choose the plan that best fits your practice and watch your efficiency soar.`}
        packages={packages}
      />
      <LandingFAQ
        id="faq"
        title={`Got Questions? We've Got Answers`}
        subtitle={`Learn more about how LawManage Pro can address your specific needs.`}
        questionAnswers={questionAnswers}
      />
      <LandingCTA
        title={`Ready to Revolutionize Your Law Practice?`}
        subtitle={`Join thousands of successful firms already benefiting from LawManage Pro.`}
        buttonText={`Start Your Free Trial Now`}
        buttonLink={`/register`}
      />
    </LandingContainer>
  )
}
