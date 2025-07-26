import { CheckCircle } from "lucide-react";

export default function About() {
  const features = [
    "100% Genuine Services",
    "24/7 Customer Support", 
    "30-Day Warranty",
    "Instant Delivery",
  ];

  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">About MTS Digital Services</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2022, MTS Digital Services started with a simple mission: make premium digital services accessible to everyone at affordable prices.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              We believe that everyone deserves access to quality entertainment, productivity tools, and digital services without breaking the bank. Our team works tirelessly to provide genuine, reliable access to premium platforms.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Modern digital office workspace" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
