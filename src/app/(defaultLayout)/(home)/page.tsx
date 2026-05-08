"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, FileText, Target, Zap, FileSearch, Sparkles, TrendingUp, BarChart, AlertTriangle, Crosshair } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 max-w-screen-xl relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground mb-6 max-w-4xl mx-auto">
              Your resume deserves better than <span className="text-primary">ATS rejection</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Stop guessing what hiring managers want. Get a comprehensive AI analysis of your resume and unlock your true career potential in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-8 rounded-full" asChild>
                <Link href="/login">Analyze My Resume Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full" asChild>
                <Link href="#how-it-works">See How it Works</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required. Free forever plan available.</p>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/50" id="problem">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why resumes fail the ATS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">75% of resumes are rejected by Applicant Tracking Systems before a human even sees them. Here's why.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: AlertTriangle, title: "Missing Keywords", desc: "Your resume lacks the specific industry jargon and keywords the ATS is programmed to find." },
              { icon: FileSearch, title: "Poor Formatting", desc: "Complex layouts, tables, and certain fonts completely break the parser's ability to read your text." },
              { icon: Target, title: "Weak Action Verbs", desc: "Passive language and generic descriptions fail to highlight your true impact and achievements." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-background p-8 rounded-2xl border border-border shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" id="how-it-works">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How CareerAI works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Get your personalized resume feedback in 3 simple steps.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-border z-0"></div>
            
            {[
              { step: "01", title: "Upload your Resume", desc: "Drag and drop your PDF or DOCX file securely.", icon: FileText },
              { step: "02", title: "AI Analysis", desc: "Our engine scans your resume against millions of data points.", icon: Zap },
              { step: "03", title: "Get Actionable Results", desc: "Receive your ATS score and a step-by-step improvement plan.", icon: TrendingUp }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 shadow-sm">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="text-sm font-bold text-primary mb-2 tracking-widest uppercase">STEP {item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50" id="features">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Everything you need to land the job</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 gap-8">
            {[
              { icon: BarChart, title: "ATS Score", desc: "Get a clear 0-100 score showing exactly how your resume performs against Applicant Tracking Systems." },
              { icon: Crosshair, title: "Keyword Optimization", desc: "Identify the exact keywords missing from your resume based on your target job description." },
              { icon: CheckCircle, title: "Formatting Check", desc: "Ensure your resume layout, fonts, and structure are 100% readable by ATS software." },
              { icon: Sparkles, title: "Action Plan", desc: "Receive specific, line-by-line recommendations on how to rewrite bullet points for maximum impact." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-background p-8 rounded-2xl border border-border flex gap-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex-shrink-0 flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="grid md:grid-cols-3 gap-8 text-center mb-16">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-heading">50K+</div>
              <div className="text-primary-foreground/80">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-heading">92%</div>
              <div className="text-primary-foreground/80">More Interviews</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-heading">4.9/5</div>
              <div className="text-primary-foreground/80">Average Rating</div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", role: "Product Manager", text: "CareerAI completely transformed my job search. After fixing the formatting errors it found, I got 3 interviews in one week." },
              { name: "David L.", role: "Software Engineer", text: "The keyword optimization feature is brilliant. It told me exactly which skills I was missing for the roles I wanted." },
              { name: "Elena R.", role: "Marketing Director", text: "I thought my resume was perfect until I saw my 65 ATS score. Using the action plan, I got it to 95 and landed my dream job." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-background/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, j) => <Sparkles key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg italic mb-6">"{item.text}"</p>
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-primary-foreground/70 text-sm">{item.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20" id="pricing-preview">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl border border-border bg-background">
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <div className="text-4xl font-bold mb-6 font-heading">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Basic ATS Scoring', '1 Resume Upload', 'General Feedback', 'Standard Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </motion.div>

            {/* Pro Tier */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl border-2 border-primary bg-primary/5 relative">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold mb-6 font-heading">$19<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Advanced ATS Scoring', 'Unlimited Uploads', 'Line-by-line AI Action Plan', 'Job Description Matching', 'Priority Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/pricing">View Full Pricing</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50" id="faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <Accordion type="single" collapsible className="w-full bg-background rounded-2xl border border-border p-4">
              {[
                { q: "What is an ATS score?", a: "An ATS (Applicant Tracking System) score indicates how well your resume matches the job requirements and how easily the software can parse your information." },
                { q: "Is CareerAI really free?", a: "Yes! We offer a completely free plan that gives you a basic ATS score and general feedback. You can upgrade to Pro for deeper insights." },
                { q: "How does the AI analyze my resume?", a: "Our AI uses natural language processing to read your resume just like enterprise ATS software does, evaluating keywords, formatting, and impact." },
                { q: "Can I cancel my Pro subscription anytime?", a: "Absolutely. You can cancel your subscription at any time from your account dashboard with one click." },
                { q: "Is my data secure?", a: "We take your privacy seriously. We never sell your personal data, and your uploaded resumes are encrypted and securely stored." },
                { q: "Do you offer refunds?", a: "Yes, we offer a 14-day money-back guarantee if you are not completely satisfied with our Pro plan features." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-semibold text-lg">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-5"></div>
        <div className="container mx-auto px-4 max-w-screen-xl relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to land your dream job?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Join thousands of job seekers who have optimized their resumes and doubled their interview rates.</p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl h-16 px-10 rounded-full" asChild>
              <Link href="/login">Analyze My Resume Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
