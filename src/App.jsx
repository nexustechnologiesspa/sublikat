import Header from './components/Header/Header.jsx';
import Portada from './components/Portada/Portada.jsx';
import ReadingProgress from './components/ReadingProgress/ReadingProgress.jsx';
import WhatsAppWidget from './components/WhatsAppWidget/WhatsAppWidget.jsx';
import Benefits from './sections/Benefits/Benefits.jsx';
import Catalog from './sections/Catalog/Catalog.jsx';
import Contact from './sections/Contact/Contact.jsx';
import Footer from './sections/Footer/Footer.jsx';
import Gallery from './sections/Gallery/Gallery.jsx';
import Hero from './sections/Hero/Hero.jsx';
import Process from './sections/Process/Process.jsx';
import Reviews from './sections/Reviews/Reviews.jsx';
import WorkshopNotice from './sections/WorkshopNotice/WorkshopNotice.jsx';

export default function App() {
  return (
    <>
      <ReadingProgress />
      <Header />
      <Portada />
      <main>
        <div className="od-secciones w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <Hero />
          <Benefits />
          <WorkshopNotice />
          <Catalog />
          <Gallery />
          <Process />
          <Reviews />
          <Contact />
        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
