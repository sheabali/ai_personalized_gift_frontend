"use client";

import { useState } from "react";
import { useGetAiGiftRecommendationsMutation } from "@/redux/api/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/module/Product/ProductCard";

const QUIZ_STEPS = [
  {
    question: "Who are you buying this gift for?",
    options: ["Him", "Her", "Kids", "Friend", "Colleague"],
    key: "recipient"
  },
  {
    question: "What is the occasion?",
    options: ["Birthday", "Anniversary", "Wedding", "Just Because", "Corporate", "Valentine"],
    key: "occasion"
  },
  {
    question: "What is your budget?",
    options: ["Under ৳500", "৳500 - ৳2000", "৳2000+"],
    key: "budget"
  }
];

export default function GiftFinderQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{
    recipient: string;
    occasion: string;
    budget: string;
    interests: string;
  }>({
    recipient: "",
    occasion: "",
    budget: "",
    interests: ""
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const [getRecommendations, { isLoading }] = useGetAiGiftRecommendationsMutation();

  const handleOptionSelect = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step < QUIZ_STEPS.length) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const handleInterestSubmit = async () => {
    if (!answers.interests) return;

    try {
      setShowResults(true);
      const res = await getRecommendations(answers).unwrap();
      if (res.success) {
        setResults(res.data || []);
      }
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({ recipient: "", occasion: "", budget: "", interests: "" });
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="bg-neutral-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white shadow-2xl">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-bold text-white border border-white/20 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Gift Finder</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Find the Perfect Gift</h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">Answer a few quick questions and let our AI magic suggest the most thoughtful personalized gifts.</p>
        </div>

        {/* Quiz Area */}
        <div className="bg-white text-neutral-900 rounded-3xl p-8 md:p-12 shadow-xl min-h-[400px] flex flex-col justify-center relative">

          <AnimatePresence mode="wait">

            {/* Steps 1-3 */}
            {!showResults && step < QUIZ_STEPS.length && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Step {step + 1} of 4</div>
                <h3 className="text-3xl font-extrabold text-neutral-900">{QUIZ_STEPS[step].question}</h3>

                <div className="flex flex-wrap justify-center gap-4">
                  {QUIZ_STEPS[step].options.map(option => (
                    <Button
                      key={option}
                      variant={answers[QUIZ_STEPS[step].key as keyof typeof answers] === option ? "default" : "outline"}
                      className={`h-14 px-8 rounded-2xl text-lg font-bold transition-all ${answers[QUIZ_STEPS[step].key as keyof typeof answers] === option ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-neutral-600 hover:border-primary/50 border-neutral-200'}`}
                      onClick={() => handleOptionSelect(QUIZ_STEPS[step].key, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {/* Custom Budget Input for Step 3 */}
                {step === 2 && (
                  <div className="mt-8 flex flex-col items-center gap-3 pt-4 border-t border-neutral-100">
                    <p className="text-neutral-500 font-medium">Or enter a custom amount</p>
                    <div className="flex gap-2 max-w-sm w-full">
                      <Input
                        placeholder="e.g. 1500"
                        type="number"
                        value={answers.budget && !QUIZ_STEPS[2].options.includes(answers.budget) ? answers.budget.replace(/[^0-9]/g, '') : ""}
                        onChange={(e) => setAnswers(prev => ({ ...prev, budget: e.target.value ? `৳${e.target.value}` : "" }))}
                        className="h-12 text-center rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white text-lg"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && answers.budget) {
                            setTimeout(() => setStep(step + 1), 200);
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (answers.budget) {
                            setTimeout(() => setStep(step + 1), 200);
                          }
                        }}
                        disabled={!answers.budget || QUIZ_STEPS[2].options.includes(answers.budget)}
                        className="h-12 px-6 rounded-xl font-bold"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Interests */}
            {!showResults && step === QUIZ_STEPS.length && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center max-w-lg mx-auto w-full"
              >
                <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Final Step</div>
                <h3 className="text-3xl font-extrabold text-neutral-900">Any specific interests?</h3>
                <p className="text-neutral-500">e.g. "Loves dogs, drinks a lot of coffee, plays guitar"</p>

                <div className="space-y-6">
                  <Input
                    placeholder='e.g. "Loves dogs, drinks coffee, plays guitar"'
                    value={answers.interests}
                    onChange={(e) => setAnswers(prev => ({ ...prev, interests: e.target.value }))}
                    className="h-16 text-lg rounded-2xl bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-primary shadow-inner text-center"
                    onKeyDown={(e) => e.key === 'Enter' && handleInterestSubmit()}
                  />

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {["Loves dogs", "Drinks coffee", "Plays guitar", "Tech geek"].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setAnswers(prev => ({ ...prev, interests: prev.interests ? `${prev.interests}, ${suggestion}` : suggestion }))}
                        className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-3 py-1.5 rounded-full transition-colors border border-neutral-200"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleInterestSubmit}
                    disabled={!answers.interests}
                    className="w-full h-16 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-lg font-bold shadow-xl gap-2"
                  >
                    Find My Gift
                    <Sparkles className="w-5 h-5 text-primary" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Loading / Results */}
            {showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary animate-spin-slow" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 text-center animate-pulse">
                      AI is finding the perfect gifts...
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-extrabold text-neutral-900">We found {results.length} perfect matches!</h3>
                      <p className="text-neutral-500 mt-2">Based on your answers, here is what our AI recommends.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {results.map((product, idx) => (
                        <div key={idx} className="flex flex-col">
                          <ProductCard product={product} />
                          <div className="mt-4 bg-primary/5 p-4 rounded-2xl border border-primary/10 text-sm">
                            <span className="font-bold text-primary flex items-center gap-1 mb-1">
                              <Sparkles className="w-3 h-3" /> AI Reason:
                            </span>
                            <span className="text-neutral-700 italic">{product.aiReason}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={resetQuiz} className="h-12 px-8 rounded-xl font-bold text-neutral-600">
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls */}
          {!showResults && step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="absolute top-8 left-8 text-neutral-400 hover:text-neutral-900 flex items-center gap-2 font-bold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
