import Hero from '../components/home/Hero'
import ImageCarousel from '../components/home/ImageCarousel'
import ImpactStats from '../components/home/ImpactStats'
import PDFSection from '../components/home/PDFSection'
import WhatsAppButton from '../components/home/WhatsAppButton'

export default function Home() {
  return (
    <>
      <Hero />
      <ImageCarousel />
      <ImpactStats />
      <PDFSection />
      <WhatsAppButton />
    </>
  )
}
