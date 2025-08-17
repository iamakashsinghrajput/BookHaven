import Hero from "./components/Hero";
import QuickActions from "./components/QuickActions";
import NewArrivals from "./components/NewArrivals";
import ExamPrepHub from "./components/ExamPrepHub";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function HomePage() {
  return (
    <div>
      <Header />
      <Hero />
      <QuickActions />
      <NewArrivals />
      <ExamPrepHub />
      <CtaSection />
      <Footer />
    </div>
  );
}