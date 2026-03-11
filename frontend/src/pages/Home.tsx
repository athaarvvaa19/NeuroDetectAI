import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Shield, TrendingUp } from "lucide-react";
import heroBrain from "@/assets/hero-brain.png";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Models",
      description: "State-of-the-art deep learning models trained on millions of medical scans",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get detection results in seconds with high accuracy and confidence scores",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical data is encrypted and never stored on our servers",
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "Our models are constantly updated with the latest medical research",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-50" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                AI-Powered <span className="bg-gradient-primary bg-clip-text text-transparent">Brain Disease</span> Detection
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Upload MRI scans to detect various brain conditions using advanced deep learning models. 
                Fast, accurate, and secure medical image analysis.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate("/detect")}
                  className="group"
                >
                  Get Started
                  <Zap className="ml-2 w-4 h-4 group-hover:animate-pulse-glow" />
                </Button>
                <Button 
                  variant="medical" 
                  size="lg"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-glow" />
              <img 
                src={heroBrain} 
                alt="AI Brain Scan Visualization" 
                className="relative w-full h-auto rounded-lg shadow-glow-primary"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose NeuroDetect AI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets medical expertise for accurate brain disease detection
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-glow-primary group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-glow">
                  <feature.icon className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-primary rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4 text-background">Ready to Get Started?</h2>
              <p className="text-xl text-background/90 mb-8 max-w-2xl mx-auto">
                Upload your brain scan and get instant AI-powered detection results
              </p>
              <Button 
                variant="medical" 
                size="lg"
                onClick={() => navigate("/detect")}
                className="bg-background hover:bg-background/90"
              >
                Start Detection Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
