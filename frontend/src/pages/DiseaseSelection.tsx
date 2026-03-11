import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BrainCog, Activity, Heart, ScanEye, ArrowRight } from "lucide-react";
import { diseases } from "@/types/diseases";

const iconMap = {
  Brain,
  BrainCog,
  Activity,
  Heart,
  ScanEye,
};

export default function DiseaseSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            Select <span className="bg-gradient-primary bg-clip-text text-transparent">Detection Type</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the type of brain disease detection you want to perform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {diseases.map((disease, index) => {
            const Icon = iconMap[disease.icon as keyof typeof iconMap];
            
            return (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border hover:border-primary/50 transition-all hover:shadow-glow-primary group cursor-pointer">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-glow">
                      <Icon className="w-8 h-8 text-background" />
                    </div>
                    <CardTitle className="text-2xl">{disease.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {disease.scanType}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{disease.description}</p>
                    <Button
                      variant="medical"
                      className="w-full group/btn"
                      onClick={() => navigate(`/detect/${disease.id}`)}
                    >
                      Detect Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
