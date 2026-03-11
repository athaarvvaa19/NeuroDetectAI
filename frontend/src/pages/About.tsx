import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Cpu, Database, Shield } from "lucide-react";

export default function About() {
  const technologies = [
    {
      icon: Brain,
      title: "Deep Learning",
      description: "Advanced neural networks trained on millions of medical scans",
    },
    {
      icon: Cpu,
      title: "Real-time Processing",
      description: "Instant analysis powered by optimized AI models",
    },
    {
      icon: Database,
      title: "Comprehensive Dataset",
      description: "Models trained on diverse, high-quality medical imaging data",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security and privacy protection",
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
            About <span className="bg-gradient-primary bg-clip-text text-transparent">NeuroDetect AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're revolutionizing brain disease detection through artificial intelligence, 
            making advanced medical diagnostics accessible to healthcare providers worldwide.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-3xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-muted-foreground space-y-4">
                <p>
                  NeuroDetect AI was founded with a singular mission: to democratize access to 
                  advanced brain disease detection technology. We believe that everyone, regardless 
                  of location or resources, should have access to world-class medical diagnostics.
                </p>
                <p>
                  Our platform leverages cutting-edge deep learning algorithms to analyze brain scans 
                  with unprecedented accuracy, helping healthcare professionals make faster, more 
                  informed decisions about patient care.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Our Technology</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="border-border hover:border-primary/50 transition-all hover:shadow-glow-primary h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                        <tech.icon className="w-6 h-6 text-background" />
                      </div>
                      <CardTitle>{tech.title}</CardTitle>
                      <CardDescription>{tech.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-border bg-gradient-primary">
              <CardHeader>
                <CardTitle className="text-3xl text-background">Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-background/90 space-y-4">
                <p>
                  NeuroDetect AI is an assistive technology designed to support medical 
                  professionals in their diagnostic process. Our AI models provide detection 
                  suggestions based on image analysis, but they should never replace 
                  professional medical judgment.
                </p>
                <p className="font-semibold">
                  All results should be reviewed and confirmed by qualified healthcare 
                  professionals before any medical decisions are made.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
