import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "contact@neurodetect.ai",
      action: "Send Email",
      link: "mailto:contact@neurodetect.ai",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Available 24/7",
      action: "Start Chat",
      link: "#",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "+1 (555) 123-4567",
      action: "Call Us",
      link: "tel:+15551234567",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our AI detection platform? We're here to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-border hover:border-primary/50 transition-all hover:shadow-glow-primary h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-glow">
                    <method.icon className="w-6 h-6 text-background" />
                  </div>
                  <CardTitle>{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="medical"
                    className="w-full"
                    asChild
                  >
                    <a href={method.link}>{method.action}</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">How accurate is the AI detection?</h3>
                <p className="text-muted-foreground">
                  Our models achieve 90-95% accuracy on test datasets, but results should always 
                  be confirmed by medical professionals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, we use enterprise-grade encryption and never store your medical images on 
                  our servers. All processing happens in real-time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What file formats are supported?</h3>
                <p className="text-muted-foreground">
                  We support all common image formats including JPG, PNG, DICOM, and NIfTI files.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
