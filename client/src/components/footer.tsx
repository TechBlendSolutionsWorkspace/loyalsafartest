import { Facebook, Twitter, Instagram, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    "OTT Subscriptions",
    "AI Tools", 
    "Cloud Storage",
    "Software Licenses",
    "VPN Services",
  ];

  const support = [
    "FAQ",
    "Contact Us", 
    "Warranty",
    "Refund Policy",
    "Terms of Service",
  ];

  const legal = [
    "Privacy Policy",
    "Terms of Service", 
    "Cookie Policy",
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <i className="fas fa-digital-tachograph text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold">MTS Digital Services</span>
            </div>
            <p className="text-gray-400 mb-4">Making premium digital services accessible and affordable for everyone.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/917496067495" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              {support.map((item, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3" />
                <span>+91 74960 67495</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3" />
                <span>support@mtsdigital.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {currentYear} MTS Digital Services. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legal.map((item, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
