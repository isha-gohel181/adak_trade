import Hero from '../components/Hero'
import FeatureHighlightBar from '../components/FeatureHighlightBar'
import TestimonialSection from '../components/TestimonialSection'
import ConsultationBanner from '../components/consultation/ConsultationBanner'
import AboutSnapshot from '../components/AboutSnapshot'
import EventHero from '../components/EventHero'
import StatsBanner from '../components/StatsBanner'
import { eventData } from '../constants/events'
import CourseSlider from '../components/CourseSlider'

import MentorSection from '../components/MentorSection'

const Home = ({ isLoaded }) => {
  return (
    <div className="w-full">
      <Hero isLoaded={isLoaded} />
      <StatsBanner />
      <AboutSnapshot />
      <CourseSlider />
      <MentorSection />

      {/* Dynamic Event Showcase */}
      {/* <EventHero events={eventData} /> */}
      
      <TestimonialSection />
      <ConsultationBanner />
    </div>
  )
}

export default Home
