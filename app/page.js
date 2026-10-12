import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Brands from "@/components/sections/Brands";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Projects";
import Workflow from "@/components/sections/Workflow";
import Contact from "@/components/sections/Contact";
import ProductShowcase from "@/components/sections/ProductShowcase";
export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <About />
        <Brands />
        <Services />
        <Portfolio />
        <ProductShowcase />
        <Workflow />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
