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
import { getContent } from "@/lib/content";
import RobotGuide from "@/components/RobotGuide";
export default async function Home() {
  const { projects, categories, products, texts } = await getContent();
  return (
    <>
      <Header />
      <main id="top">
        <Hero t={texts.hero} />
        <About t={texts.about} />
        <Brands rows={texts.brands} />
        <Services items={texts.services} />
        <Portfolio projects={projects} categories={categories} />
        <ProductShowcase products={products} />
        <Workflow items={texts.steps} />
        <Contact t={texts.contact} />
      </main>
      <Footer />
  <RobotGuide whatsapp={texts.contact.whatsapp} />
    </>
  );
}
