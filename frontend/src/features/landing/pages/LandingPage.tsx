import Customize from '../components/Customize'
import Faq from '../components/Faq'
import Features from '../components/Features'
import FinalCta from '../components/FinalCta'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import ShareSection from '../components/ShareSection'
import Showcase from '../components/Showcase'
import WhoFor from '../components/WhoFor'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Showcase />
      <Features />
      <ShareSection />
      <Customize />
      <WhoFor />
      <Faq />
      <FinalCta />
    </>
  )
}
