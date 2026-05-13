import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, Award, ArrowRight, ShieldCheck } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary-500 selection:text-white transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-2xl"
          >
            <BookOpen className="h-8 w-8" />
            School LMS
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary-600/30">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen filter animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold border border-primary-100 dark:border-primary-800/50">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-ping"></span>
              The Future of Education
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold tracking-tight">
              Manage your school with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">absolute ease.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              An all-in-one platform connecting teachers, students, and admins. Streamline assignments, track attendance, and process fees—all in one beautiful workspace.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                Explore Platform <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold">Everything you need to run a modern school</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Powerful features wrapped in an intuitive, beautifully designed interface.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: BookOpen, title: 'Course Management', desc: 'Create rich, multimedia courses with chapters, lessons, and interactive content.' },
              { icon: Award, title: 'Auto-Graded Quizzes', desc: 'Build multiple-choice quizzes that grade themselves instantly upon student submission.' },
              { icon: Calendar, title: 'Attendance Tracking', desc: 'Take class attendance in seconds with our rapid-toggle roster system.' },
              { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Dedicated, secure portals tailored perfectly for Admins, Teachers, and Students.' },
              { icon: Users, title: 'Fee Processing', desc: 'Assign and track tuition, print receipts, and manage outstanding balances.' },
              { icon: ArrowRight, title: 'Real-time Notifications', desc: 'Keep everyone in the loop with instant global announcements and read-receipts.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10"
              >
                <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 dark:bg-primary-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Ready to transform your classroom?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-primary-100 mb-10"
          >
            Join thousands of modern educators using School LMS today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/login" className="inline-block bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Log in to your Workspace
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center text-sm">
        <p>© 2026 School LMS. All rights reserved. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}
