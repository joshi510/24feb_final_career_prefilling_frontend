import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Brain, Zap, Sparkles, Rocket, User, BarChart3, FileText, TrendingUp } from 'lucide-react';

const CareerProfilingVideo = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenes = [
    {
      title: "Discover Your Perfect Career Match",
      subtitle: "Career Profiling System by TOPS TECHNOLOGIES",
      icon: Target,
      color: "from-blue-600 to-indigo-700"
    },
    {
      title: "RIASEC-Based Assessment",
      subtitle: "6 Personality Dimensions",
      items: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"],
      icon: Brain,
      color: "from-indigo-600 to-blue-700"
    },
    {
      title: "How It Works",
      steps: [
        { step: "1", text: "Complete Your Profile" },
        { step: "2", text: "Take Assessment" },
        { step: "3", text: "Get Results" }
      ],
      icon: Zap,
      color: "from-blue-600 to-purple-700"
    },
    {
      title: "Key Features",
      features: [
        "Personality Type Analysis",
        "Career Pathway Matching",
        "Performance Insights",
        "Detailed PDF Reports"
      ],
      icon: Sparkles,
      color: "from-purple-600 to-pink-700"
    },
    {
      title: "Start Your Journey Today",
      subtitle: "Register now and discover your career potential",
      icon: Rocket,
      color: "from-pink-600 to-red-700"
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentScene((prev) => {
          if (prev >= scenes.length - 1) {
            // Loop back to start instead of stopping
            return 0;
          }
          return prev + 1;
        });
      }, 3000); // 3 seconds per scene

      return () => clearInterval(interval);
    }
  }, [isPlaying, scenes.length]);


  const currentSceneData = scenes[currentScene];

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl overflow-hidden">

      {/* Scene Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`w-full h-full bg-gradient-to-br ${currentSceneData.color} p-6 flex flex-col items-center justify-center text-white`}
        >
          {/* Scene Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            {React.createElement(currentSceneData.icon, {
              className: "w-16 h-16 text-white",
              strokeWidth: 1.5
            })}
          </motion.div>

          {/* Scene Title */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-center mb-2"
          >
            {currentSceneData.title}
          </motion.h3>

          {/* Scene Subtitle */}
          {currentSceneData.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-white/80 text-center"
            >
              {currentSceneData.subtitle}
            </motion.p>
          )}

          {/* Items List */}
          {currentSceneData.items && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-2 mt-4 w-full max-w-md"
            >
              {currentSceneData.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center text-xs font-medium"
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Steps */}
          {currentSceneData.steps && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 mt-6"
            >
              {currentSceneData.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.2, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-lg font-bold mb-2">
                    {step.step}
                  </div>
                  <p className="text-xs text-center">{step.text}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Features */}
          {currentSceneData.features && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3 mt-4 w-full max-w-md"
            >
              {currentSceneData.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-xs font-medium"
                >
                  {feature}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Scene Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {scenes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentScene(idx);
              setIsPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentScene ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CareerProfilingVideo;

