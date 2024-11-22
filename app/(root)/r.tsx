// import Link from 'next/link'
// import Image from 'next/image'
// import { ArrowRight, Users, MessageSquare, CheckCircle, Globe } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
//
//
// export default function HomePage() {
//   return (
//       <div className="bg-background text-foreground">
//         <HeroSection />
//         <FeaturesGrid />
//         <ProcessSection />
//         <GlobalSection />
//         <CTASection />
//       </div>
//   )
// }
//
// async function HeroSection() {
//
//
//
//
//
//   return (
//       <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
//         <Image
//             src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
//             alt="Hero background"
//             fill
//             className="object-cover"
//             priority
//         />
//         <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
//         <div className="relative z-10 container mx-auto px-4 py-20 text-center">
//           <div className="max-w-4xl mx-auto">
//             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
//               Revolutionize Your Collaboration
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto">
//               Connect, collaborate, and create with teams across the globe in our
//               innovative virtual workspace.
//             </p>
//             <Button asChild size="lg" className="rounded-full">
//               <Link href="/signup">
//                 Get Started <ArrowRight className="ml-2 h-5 w-5" />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>
//   )
// }
//
// function FeaturesGrid() {
//   const features = [
//     {
//       icon: <Users className="h-8 w-8" />,
//       title: 'Global Collaboration',
//       description: 'Connect with team members across different time zones and locations seamlessly.',
//     },
//     {
//       icon: <MessageSquare className="h-8 w-8" />,
//       title: 'Virtual Rooms',
//       description: 'Create dedicated spaces for projects, discussions, and brainstorming sessions.',
//     },
//     {
//       icon: <CheckCircle className="h-8 w-8" />,
//       title: 'Real-time Validation',
//       description: 'Get instant feedback and validate ideas with your team in real-time.',
//     },
//   ]
//
//   return (
//       <section className="py-20 px-4 bg-muted/50">
//         <div className="container mx-auto max-w-6xl">
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//                 <Card key={index}>
//                   <CardContent className="p-6">
//                     <div className="text-primary mb-4">{feature.icon}</div>
//                     <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
//                     <p className="text-muted-foreground">{feature.description}</p>
//                   </CardContent>
//                 </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//   )
// }
//
// function ProcessSection() {
//   const steps = [
//     {
//       number: '01',
//       title: 'Create Your Space',
//       description: "Set up your virtual workspace in seconds and customize it for your team's needs.",
//     },
//     {
//       number: '02',
//       title: 'Invite Your Team',
//       description: 'Bring your team together, no matter where they are located around the world.',
//     },
//     {
//       number: '03',
//       title: 'Collaborate & Create',
//       description: 'Use our powerful tools to brainstorm, plan, and execute projects together.',
//     },
//   ]
//
//   return (
//       <section className="py-20 px-4">
//         <div className="container mx-auto max-w-6xl">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
//             How It Works
//           </h2>
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8">
//               {steps.map((step, index) => (
//                   <div key={index} className="flex gap-6">
//                     <div className="text-4xl font-bold text-primary opacity-50">
//                       {step.number}
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold mb-2">{step.title}</h3>
//                       <p className="text-muted-foreground">{step.description}</p>
//                     </div>
//                   </div>
//               ))}
//             </div>
//             <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
//               <div className="aspect-square rounded-xl bg-background shadow-lg p-6 relative overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
//                 <div className="relative z-10 h-full flex flex-col justify-between">
//                   <div className="space-y-4">
//                     <div className="w-1/2 h-3 bg-primary/20 rounded" />
//                     <div className="w-3/4 h-3 bg-primary/10 rounded" />
//                     <div className="w-2/3 h-3 bg-primary/5 rounded" />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     {[...Array(4)].map((_, i) => (
//                         <div key={i} className="aspect-video bg-muted rounded-lg" />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//   )
// }
//
// function GlobalSection() {
//   return (
//       <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
//         <div className="container mx-auto max-w-6xl">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold mb-6">
//                 Connect Globally, Collaborate Locally
//               </h2>
//               <p className="text-muted-foreground mb-8">
//                 Our platform breaks down geographical barriers, allowing teams to
//                 work together as if they were in the same room. Experience the
//                 future of remote collaboration with our innovative virtual
//                 workspace.
//               </p>
//               <div className="flex items-center gap-4">
//                 <Globe className="h-12 w-12 text-primary" />
//                 <div className="text-sm text-muted-foreground">
//                   Trusted by teams across
//                   <br />
//                   <span className="text-lg font-semibold text-foreground">
//                   150+ countries
//                 </span>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               {[...Array(4)].map((_, i) => (
//                   <div
//                       key={i}
//                       className="aspect-square bg-background rounded-2xl shadow-lg p-6 flex items-center justify-center"
//                   >
//                     <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl" />
//                   </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//   )
// }
//
// function CTASection() {
//   return (
//       <section className="py-20 px-4">
//         <div className="container mx-auto max-w-4xl text-center">
//           <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-2xl p-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-6">
//               Ready to Transform Your Team Collaboration?
//             </h2>
//             <p className="text-xl mb-8 opacity-90">
//               Join thousands of teams already using our platform to work better
//               together.
//             </p>
//             <Button asChild size="lg" variant="secondary" className="rounded-full">
//               <Link href="/signup">
//                 Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>
//   )
// }