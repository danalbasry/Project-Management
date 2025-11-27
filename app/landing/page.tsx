'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-cosmic-dark text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cosmic-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cosmic-primary to-cosmic-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold">FlowBoard</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors hidden sm:block">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors hidden sm:block">How it Works</a>
            <Link
              href="/"
              className="bg-cosmic-primary hover:bg-cosmic-primary-light px-5 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-cosmic-primary/25"
            >
              Open App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cosmic-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-cosmic-accent/20 rounded-full blur-3xl" />

        <div className={`max-w-5xl mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">No signup required</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Project management
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-primary to-cosmic-accent">
              that just works
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A beautiful Kanban board that runs entirely in your browser.
            No accounts, no setup, no complexity. Just drag, drop, and get stuff done.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-cosmic-primary hover:bg-cosmic-primary-light px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:shadow-cosmic-primary/30 hover:scale-105"
            >
              Start Organizing Now
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/5 transition-all"
            >
              See Features
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Free forever. Your data stays in your browser.
          </p>
        </div>
      </section>

      {/* App Preview */}
      <section className="px-6 pb-20">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cosmic-primary/10">
            {/* Browser chrome mockup */}
            <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-800 rounded-lg px-4 py-1.5 text-sm text-gray-400 text-center">
                  flowboard.app
                </div>
              </div>
            </div>

            {/* Mock Kanban board */}
            <div className="bg-gradient-to-br from-[#1a1625] to-[#0f0d1d] p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Backlog Column */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-200">Backlog</h3>
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">3</span>
                  </div>
                  <div className="space-y-3">
                    <MockCard title="Research competitors" priority="low" tag="Research" />
                    <MockCard title="Design system updates" priority="medium" tag="Design" />
                    <MockCard title="User interviews" priority="low" tag="Research" />
                  </div>
                </div>

                {/* To Do Column */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-200">To Do</h3>
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">2</span>
                  </div>
                  <div className="space-y-3">
                    <MockCard title="Setup CI/CD pipeline" priority="high" tag="DevOps" />
                    <MockCard title="Write documentation" priority="medium" tag="Docs" />
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-200">In Progress</h3>
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">2</span>
                  </div>
                  <div className="space-y-3">
                    <MockCard title="Implement auth flow" priority="high" tag="Feature" highlighted />
                    <MockCard title="API integration" priority="medium" tag="Backend" />
                  </div>
                </div>

                {/* Done Column */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-200">Done</h3>
                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">4</span>
                  </div>
                  <div className="space-y-3">
                    <MockCard title="Landing page design" priority="done" tag="Design" />
                    <MockCard title="Database schema" priority="done" tag="Backend" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-primary/5 to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need.
              <br />
              <span className="text-gray-400">Nothing you don&apos;t.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              FlowBoard is intentionally simple. We focused on what matters and left out the bloat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="lightning"
              title="Instant Start"
              description="No signup, no onboarding, no waiting. Open the app and start organizing immediately."
            />
            <FeatureCard
              icon="drag"
              title="Smooth Drag & Drop"
              description="Intuitive card movement with satisfying animations. Built with the industry-leading dnd-kit library."
            />
            <FeatureCard
              icon="priority"
              title="Visual Priorities"
              description="Color-coded priority badges let you see what needs attention at a glance."
            />
            <FeatureCard
              icon="privacy"
              title="Privacy First"
              description="Your data never leaves your browser. No tracking, no analytics, no data mining."
            />
            <FeatureCard
              icon="offline"
              title="Works Offline"
              description="No internet? No problem. FlowBoard works completely offline using localStorage."
            />
            <FeatureCard
              icon="customize"
              title="Fully Customizable"
              description="Create unlimited columns, add tags, write descriptions. Make it work your way."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Three steps to organized
            </h2>
            <p className="text-gray-400 text-lg">
              Getting started takes less time than reading this sentence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Open FlowBoard"
              description="Click the button. That's it. No account creation, no email verification, no credit card."
            />
            <StepCard
              number="2"
              title="Add Your Tasks"
              description="Click the + button to create cards. Add titles, descriptions, priorities, and tags."
            />
            <StepCard
              number="3"
              title="Drag to Done"
              description="Move cards between columns as you make progress. Watch your tasks flow to completion."
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-accent/5 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              FlowBoard vs. The Others
            </h2>
            <p className="text-gray-400">
              See why simple wins.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold text-cosmic-primary">FlowBoard</th>
                  <th className="p-4 font-semibold text-gray-400">Others</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <ComparisonRow feature="Time to start" flowboard="0 seconds" others="5-30 minutes" />
                <ComparisonRow feature="Account required" flowboard="No" others="Yes" />
                <ComparisonRow feature="Learning curve" flowboard="None" others="Hours to days" />
                <ComparisonRow feature="Data privacy" flowboard="100% local" others="Cloud stored" />
                <ComparisonRow feature="Works offline" flowboard="Yes" others="Usually no" />
                <ComparisonRow feature="Price" flowboard="Free forever" others="$0-25/mo" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial/Social Proof Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">&ldquo;</div>
          <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            Finally, a Kanban board that doesn&apos;t require a PhD in project management to use.
            I opened it and immediately started working.
          </blockquote>
          <p className="text-gray-400">
            - Every developer tired of enterprise software
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-primary/10 to-transparent" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get organized?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of productive people who chose simplicity over complexity.
          </p>

          <Link
            href="/"
            className="inline-block bg-cosmic-primary hover:bg-cosmic-primary-light px-10 py-5 rounded-xl font-semibold text-xl transition-all hover:shadow-xl hover:shadow-cosmic-primary/30 hover:scale-105"
          >
            Start Now - It&apos;s Free
          </Link>

          <p className="text-sm text-gray-500 mt-6">
            No signup. No credit card. No catch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cosmic-primary to-cosmic-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold">FlowBoard</span>
          </div>

          <p className="text-gray-500 text-sm">
            Built with Next.js, TypeScript, and a love for simplicity.
          </p>

          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Helper Components

function MockCard({ title, priority, tag, highlighted }: { title: string; priority: string; tag: string; highlighted?: boolean }) {
  const priorityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
    done: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <div className={`bg-white rounded-lg p-3 shadow-sm ${highlighted ? 'ring-2 ring-cosmic-primary' : ''}`}>
      <p className="text-gray-800 text-sm font-medium mb-2">{title}</p>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
          {priority === 'done' ? 'Done' : priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-cosmic-primary/20 text-cosmic-primary">
          {tag}
        </span>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const icons: Record<string, JSX.Element> = {
    lightning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    drag: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    priority: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ),
    privacy: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    offline: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
      </svg>
    ),
    customize: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group">
      <div className="w-12 h-12 bg-cosmic-primary/20 rounded-lg flex items-center justify-center text-cosmic-primary mb-4 group-hover:bg-cosmic-primary group-hover:text-white transition-colors">
        {icons[icon]}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-cosmic-primary to-cosmic-accent rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function ComparisonRow({ feature, flowboard, others }: { feature: string; flowboard: string; others: string }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5">
      <td className="p-4 text-gray-300">{feature}</td>
      <td className="p-4 text-center text-cosmic-primary font-medium">{flowboard}</td>
      <td className="p-4 text-center text-gray-500">{others}</td>
    </tr>
  )
}
