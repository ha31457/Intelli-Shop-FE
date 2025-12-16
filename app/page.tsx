import Link from "next/link";
import {motion} from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section - IntelliShop Brand First */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-primary/20 to-background">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-primary">
          IntelliShop
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-muted-foreground mb-8">
          Smart Shopping. Smarter Management.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg hover:scale-105 transition-transform">
            <Link href="/login">Get Started</Link>
          </button>
          <button className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium shadow-lg hover:scale-105 transition-transform">
            Learn More
          </button>
        </div>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* About IntelliShop */}
      <section id="features" className="py-20 px-6 md:px-16 bg-card text-card-foreground">
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-semibold mb-6">About IntelliShop</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              IntelliShop is your one-stop platform that bridges customers and shop owners. 
              Customers enjoy seamless shopping, real-time tracking, and personalized experiences, 
              while shop owners gain advanced tools to manage products, employees, and orders—all in one place.
            </p>
            <ul className="space-y-4 text-muted-foreground">
              <li>✔️ Easy inventory & order management</li>
              <li>✔️ Real-time customer shopping experience</li>
              <li>✔️ Tools that save time and reduce errors</li>
            </ul>
          </div>
          <div className="rounded-2xl shadow-xl bg-muted h-80 flex items-center justify-center">
            <span className="text-xl text-muted-foreground">[Product Mockup / Illustration]</span>
          </div>
        </div>
      </section>

      {/* About Nymera (mirroring IntelliShop format) */}
      {/* <section id="about-Nymera" className="py-20 px-6 md:px-16 bg-background text-foreground"> */}
        {/* <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"> */}
          {/* Illustration on left for contrast */}
          {/* <div className="rounded-2xl shadow-xl bg-muted h-80 w-80 flex items-center justify-center"> */}
            {/* <span className="text-xl text-muted-foreground"> */}
              {/* <img  */}
                {/* src="./Nymera_Light.png"  */}
                {/* alt="Nymera Logo" */}
                {/* className="rounded-2xl max-h-80 max-w-100"/> */}
            {/* </span> */}
          {/* </div> */}
          {/* <div className="order-1 md:order-2"> */}
            {/* <h2 className="text-4xl font-semibold mb-6">About Nymera</h2> */}
            {/* <p className="text-muted-foreground leading-relaxed mb-6"> */}
              {/* Founded by <span className="font-medium text-primary">Harsh Dushyantbhai Pandya</span>,  */}
              {/* Nymera is dedicated to crafting innovative digital products  */}
              {/* that reduce human intervention, minimize errors, and unlock insights that go  */}
              {/* beyond human capabilities. */}
            {/* </p> */}
            {/* <ul className="space-y-4 text-muted-foreground"> */}
              {/* <li>✔️ Innovative SaaS product development</li> */}
              {/* <li>✔️ Focus on automation & efficiency</li> */}
              {/* <li>✔️ Mission to help businesses save time & grow</li> */}
            {/* </ul> */}
          {/* </div> */}
        {/* </div> */}
      {/* </section> */}
    </div>
  );
}
