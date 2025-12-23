import {Banner} from '@/shared/Banner/Banner'
import {Faq} from '@/shared/Faq/Faq'
import {Highlights} from '@/shared/Highlights/Highlights'
import {Overview} from '@/shared/Overview/Overview'
import {Footer} from '@/shared/Footer/Footer'
import {Comparison} from '@/shared/Comparison/Comparison'

export default function Home() {
  return (
    <main>
      <Banner />
      <Comparison />
      <Overview />
      <Highlights />
      <Faq />
      <Footer />
    </main>
  )
}
