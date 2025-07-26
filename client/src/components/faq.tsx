import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: "faq1",
      question: "Are these accounts genuine and legal?",
      answer: "Yes, all our accounts are 100% genuine and obtained through legitimate means. We follow all terms of service and provide legal access to premium services.",
    },
    {
      id: "faq2",
      question: "How quickly will I receive my account details?",
      answer: "Most orders are processed within 2-5 minutes after payment confirmation. You'll receive your account details via WhatsApp automatically.",
    },
    {
      id: "faq3",
      question: "What if my account stops working?",
      answer: "We provide 30-day warranty on all accounts. If any account stops working within the warranty period, we'll provide a free replacement immediately.",
    },
    {
      id: "faq4",
      question: "Can I share the account with others?",
      answer: "Our accounts are meant for personal use only. Sharing accounts may violate platform terms and could lead to account suspension. We recommend individual subscriptions for each user.",
    },
    {
      id: "faq5",
      question: "What payment methods do you accept?",
      answer: "We accept UPI, Google Pay, Paytm, and other popular digital payment methods. All payments are processed securely through encrypted channels.",
    },
  ];

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Get answers to common questions about our services</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-border rounded-lg">
              <button
                className="w-full text-left p-6 focus:outline-none"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground transform transition-transform duration-200 ${
                      openFaq === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              {openFaq === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
