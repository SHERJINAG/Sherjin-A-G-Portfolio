/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Github, 
  Linkedin, 
  Youtube,
  Mail, 
  ExternalLink, 
  ChevronRight, 
  Code2, 
  Cpu, 
  Database, 
  Layout, 
  Wrench, 
  GraduationCap, 
  Briefcase, 
  Award,
  Terminal,
  Globe,
  Zap,
  Layers,
  Sparkles,
  Twitter,
  Dribbble,
  MapPin,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

// --- 3D Components ---

const FloatingShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 0]} />
        <MeshDistortMaterial
          color="#3B82F6"
          speed={4}
          distort={0.4}
          radius={1}
          emissive="#1D4ED8"
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Outer wireframe shell */}
      <mesh rotation={[Math.PI/4, 0, Math.PI/4]}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </mesh>
    </Float>
  );
};

const Logo3D = () => {
  const [hovered, setHover] = useState(false);
  
  return (
    <div 
      className="w-10 h-10 -ml-2 cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />
        <Float 
          speed={hovered ? 12 : 4} 
          rotationIntensity={hovered ? 6 : 2} 
          floatIntensity={hovered ? 3 : 1}
        >
          <mesh>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial 
              color={hovered ? "#60A5FA" : "#3B82F6"} 
              emissive={hovered ? "#3B82F6" : "#1D4ED8"}
              emissiveIntensity={hovered ? 2 : 0.5} 
            />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
};

const RippleButton = ({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  return (
    <motion.a
      href={href}
      onClick={addRipple}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden inline-block ${className}`}
    >
      <div className="relative z-10">{children}</div>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.a>
  );
};

const ScrollSpyContent = ({ rotation }: { rotation: any }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y = rotation.get();
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1, 0.1, 16, 100]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const ScrollSpy3D = () => {
  const { scrollYProgress } = useScroll();
  const rotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);

  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-50 pointer-events-none hidden xl:block">
      <Canvas style={{ width: 100, height: 100 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={1} />
        <ScrollSpyContent rotation={rotation} />
      </Canvas>
    </div>
  );
};

const TechScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9333EA" />
        <spotLight position={[0, 5, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
        
        <FloatingShape />
        
        {/* Particle/Grid background effect in 3D */}
        <group>
          {Array.from({ length: 50 }).map((_, i) => (
            <Sphere key={i} args={[0.02, 16, 16]} position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 10
            ]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </Sphere>
          ))}
        </group>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

// --- Components ---

const ScrollReveal = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const MouseGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-30 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: useTransform(
          [mouseX, mouseY],
          ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        ),
      }}
    />
  );
};

const Card3D = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`relative group ${className}`}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-neutral-900/90 border border-white/10 rounded-xl p-0 h-full backdrop-blur-xl overflow-hidden shadow-2xl">
        {children}
      </div>
    </motion.div>
  );
};

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon: any }) => (
  <div className="flex items-center gap-6 mb-20 group">
    <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-inner group-hover:border-blue-500/50 transition-all duration-500">
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    <div className="space-y-1">
      <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-serif italic">
        {children}.
      </h2>
      <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-transparent transition-all duration-700"></div>
    </div>
  </div>
);

// --- Data ---

const SKILLS = [
  { category: 'Web Dev', icon: Layout, skills: ['React', 'Next.js', 'JavaScript', 'Tailwind', 'Node.js', 'Express', 'Vite','Bootstrap','Django','FastAPI','flask'], color: 'from-cyan-500 to-blue-500' },
  { category: 'AI / ML', icon: Cpu, skills: [ 'TensorFlow', 'NLP', 'Computer Vision', 'Deep Learning', 'Data Science'], color: 'from-purple-500 to-pink-500' },
  { category: 'Languages', icon: Code2, skills: ['Java', 'Python', 'SQL', 'C', ], color: 'from-orange-500 to-yellow-500' },
  { category: 'Databases', icon: Database, skills: [ 'MongoDB', 'Firebase','MySQL', 'SQLite'], color: 'from-green-500 to-emerald-500' },
  { category: 'Tools', icon: Wrench, skills: ['Git', 'Docker', 'Power BI', 'Excel', 'VS Code', 'Postman','GitHub'], color: 'from-red-500 to-rose-500' },
];

const PROJECTS = [
  {
    title: 'AI Document Analyzer',
    desc: 'Intelligent analysis of PDF, DOCX, and images. Features OCR, auto-summarization, keyword extraction, and sentiment analysis.',
    tags: ['HuggingFace', 'Django', 'React', 'OCR'],
    github: 'https://github.com/SHERJINAG/Document_Analyzer',
    live: 'https://document-analyzer-roea.onrender.com/',
  },
  {
    title: 'AI Learning Platform',
    desc: 'Adaptive learning path customized by Gemini AI for individual students.',
    tags: ['FastAPI', 'React', 'TinnyLlama AI'],
    github: 'https://github.com/SHERJINAG/Ai_powered_interview_preparation_platform',
    live: 'https://ai-powered-interview-preparation-platform-tand.onrender.com/',
  },
  {
    title: 'Student Learning Platform',
    desc: 'Centralized hub for course materials, assignments, and student collaboration.',
    tags: ['Web', 'Node.js', 'React'],
    github: 'https://github.com/SHERJINAG/edu-student',
    live: 'https://forntend2.onrender.com/',
  },
  {
    title: 'India Crime Data Dashboard',
    desc: 'Visual analytics of crime statistics across India using D3 and Power BI.',
    tags: ['google colab', 'Python', 'D3'],
    github: 'https://github.com/SHERJINAG/India-data-dashboards',
    live: 'https://sherjinag.github.io/India-data-dashboards/',
  },
  {
    title: 'India Election Results 2024',
    desc: 'Interactive map and results visualization dashboard.',
    tags: ['HTML', 'GeoJSON', 'Visualization'],
    github: 'https://github.com/SHERJINAG/India-data-dashboards',
    live: 'https://sherjinag.github.io/India-data-dashboards/',
  },
  {
    title: 'IPL Auction Game',
    desc: 'A real-time auction simulator for cricket enthusiasts.',
    tags: ['HTML', 'css', 'JavaScript'],
    github: 'https://github.com/SHERJINAG/ipl_auction_game',
    live: 'https://sherjinag.github.io/ipl_auction_game/auction.html',
  },
  {
    title: 'Student Attendance Tracker',
    desc: 'RFID-based or manual attendance system with automated reporting.',
    tags: ['React', 'MongoDB', 'Node.js'],
    github: 'https://github.com/SHERJINAG/Student-Attendence-Tracker',
    live: 'https://student-attendence-tracker-2gfe.onrender.com/',
  },
];

const EDUCATION = [
  { degree: 'B.E Computer Science Engineering', school: 'Ponjesly College of Engineering', period: '2021 - 2025', desc: 'GPA: 8.5/10' },
  { degree: 'Higher Secondary School (HSC)', school: 'ST.Mary Goretty Higher Secondary School', period: '2020 - 2021', desc: 'Percentage: 86%' },
  { degree: 'SSLC', school: 'ST.Mary Goretty Higher Secondary School', period: '2018 - 2019', desc: 'Percentage: 84%' },
];

const INTERNSHIPS = [
  { role: 'Full Stack Intern', company: 'Inbox Info Solutions',location: 'Nagercoil', period: '2 Months', desc: 'Developed modular UI components and integrated REST APIs.' },
  { role: 'Data Science Intern', company: 'M-Squared',location: 'Thiruvananthapuram', period: '1 Month', desc: 'Built predictive models for customer churn analysis.' },
];

const CERTIFICATIONS = [
  { title: 'Data Analytics Essentials', issuer: 'Cisco Networking Academy', year: '2024' },
  { title: 'Internship 5.0 (B4) - Optiprice', issuer: 'Infosys Springboard', year: '2025' },
  { title: 'Data Visualization using Power BI', issuer: 'Infosys Springboard', year: '2024' },
  { title: 'Data Analytics in Python', issuer: 'freeCodeCamp', year: '2024' },
  { title: 'Master of Data Analytics using SQL and Excel', issuer: 'Great Learning', year: '2024' },
  { title: 'Frontend Web Development', issuer: 'Great Learning', year: '2023' },
  { title: 'Master of Data Science in Python', issuer: 'Great Learning', year: '2024' },
];

const ContactScene3D = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial color="#3B82F6" wireframe transparent opacity={0.1} />
          </mesh>
        </Float>
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Float key={i} speed={Math.random() * 2 + 1} rotationIntensity={2}>
              <mesh position={[
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
              ]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
              </mesh>
            </Float>
          ))}
        </group>
      </Canvas>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans bg-grid relative overflow-x-hidden">
      <MouseGlow />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 accent-gradient z-50 origin-[0%]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <ScrollSpy3D />
      <nav className="fixed top-0 w-full z-40 px-6 py-8 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Logo3D />
            <div className="flex flex-col ml-4">
              <div className="text-white font-black text-2xl tracking-tighter uppercase">
                SAG<span className="text-blue-500">.</span>
              </div>
              <div className='text-[9px] uppercase tracking-[0.4em] opacity-40 font-bold'>Portfolio © 2026</div>
            </div>
          </motion.div>
          
          <div className="flex gap-10 text-[11px] uppercase tracking-[0.2em] font-bold hidden md:flex opacity-60">
            {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="hover:text-blue-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-6"
          >
             <a href="https://github.com/sherjinag" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors opacity-60 hover:opacity-100" />
            </a>
            <a href="https://www.linkedin.com/in/sherjin-a-g-30590522a/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors opacity-60 hover:opacity-100" />
            </a>
          </motion.div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-48 pb-24 relative z-10">
        
        {/* HERO SECTION */}
        <ScrollReveal id="about" className="mb-64">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-12 xl:col-span-5">
              <div className="inline-block px-3 py-1 border border-blue-500/30 rounded-full text-[10px] uppercase tracking-widest text-blue-400 bg-blue-500/5 mb-8">
                Multi-Disciplinary Designer & Engineer
              </div>
              <h1 className="text-7xl md:text-8xl font-light text-white tracking-tighter leading-[0.85] mb-8">
                Sherjin<br/>
                <span className="font-black italic text-blue-500 font-serif">A G.</span>
              </h1>
              <p className="text-base text-white/50 max-w-sm leading-relaxed mb-12">
                Crafting immersive digital experiences through precision engineering and intentional aesthetics. Based in Nagercoil, India.
              </p>
              
              <div className="flex flex-wrap gap-6 items-center">
                <RippleButton href="#projects" className="px-10 py-5 bg-blue-600 text-white font-black rounded-sm hover:bg-blue-500 transition-all duration-300 uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
                  Selected Works ↑
                </RippleButton>
                  <a 
                  href="/resume.pdf" 
                  download="Sherjin_AG_Resume.pdf"
                  className="px-10 py-5 bg-white/5 text-white font-black rounded-sm border border-white/10 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-xs flex items-center gap-3 backdrop-blur-sm"
                >
                  Download Resume <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-8 lg:col-start-3 xl:col-span-5 xl:col-start-7 relative h-[600px]">
              <TechScene />
              <div className="relative z-10 aspect-[3/4] max-w-[420px] mx-auto mt-20">
                <Card3D className="w-full h-full">
                  <div className="flex flex-col h-full justify-between p-10 relative">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Terminal className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[10px] font-mono opacity-30 tracking-widest uppercase">sys_build_v2.6</span>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-4xl font-black italic font-serif leading-none tracking-tighter">Sherjin<br/>Core.</h3>
                      <p className="text-xs opacity-40 uppercase tracking-[0.2em] font-bold">Predictive Engineering</p>
                    </div>

                    <div className="absolute -right-12 bottom-20 w-48 h-48 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm shadow-2xl"></div>
                    
                    <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                      <div className="space-y-3">
                         <div className="space-y-1">
                          <div className="text-[9px] uppercase tracking-widest opacity-30 font-black">Architecture</div>
                          <div className="text-xs font-mono text-blue-400">Scalable Microservices</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase tracking-widest opacity-30 font-black">Uptime</div>
                          <div className="text-xs font-mono text-green-400 font-bold">99.98% STABLE</div>
                        </div>
                      </div>
                      <div className="text-[10px] uppercase tracking-widest opacity-20 vertical-label absolute top-32 right-6">PRODUCTION_READY</div>
                    </div>
                  </div>
                </Card3D>
              </div>
            </div>
            
            <div className="hidden xl:flex lg:col-span-1 col-start-12 flex-col items-end gap-16">
              <div className="vertical-label text-[10px] uppercase tracking-[0.8em] opacity-20 font-light whitespace-nowrap">JUNIOR PRODUCT DESIGNER</div>
              <div className="space-y-6">
                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer opacity-40 hover:opacity-100">↗</div>
                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer opacity-40 hover:opacity-100">↘</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* BIO / ABOUT SECTION */}
        <ScrollReveal className="mb-64">
           <div className="grid lg:grid-cols-12 gap-12">
             <div className="lg:col-span-4">
               <div className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-black mb-4">Philosophy</div>
               <h2 className="text-4xl font-black italic font-serif text-white tracking-tighter leading-none mb-8">Bridging the gap between Art & Logic.</h2>
             </div>
             <div className="lg:col-span-8 flex flex-col gap-8">
               <p className="text-xl text-white/60 leading-relaxed font-light">
                 As a Computer Science Engineer with a passion for creative expression, I specialize in developing digital products that are as functional as they are beautiful. My work focuses on high-performance web systems, predictive AI models, and data-driven storytelling.
               </p>
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                 <div className="space-y-2">
                   <div className="text-[9px] uppercase tracking-widest opacity-30 font-black">Design Style</div>
                   <div className="text-sm font-bold text-white/80 uppercase tracking-widest">Swiss Minimal / Brutalist</div>
                 </div>
                 <div className="space-y-2">
                   <div className="text-[9px] uppercase tracking-widest opacity-30 font-black">Core Stack</div>
                   <div className="text-sm font-bold text-white/80 uppercase tracking-widest">JS / React / Python / SQL</div>
                 </div>
                 <div className="space-y-2">
                   <div className="text-[9px] uppercase tracking-widest opacity-30 font-black">Focus</div>
                   <div className="text-sm font-bold text-white/80 uppercase tracking-widest">WEB & AI Integration</div>
                 </div>
               </div>
             </div>
           </div>
        </ScrollReveal>

        {/* SKILLS SECTION - BENTO GRID */}
        <ScrollReveal id="skills" className="mb-64">
          <SectionHeading icon={Cpu}>Architecture & Skills</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILLS.map((item, idx) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card3D className="h-full">
                  <div className="p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                        <item.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{item.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {item.skills.map((skill) => (
                        <motion.span 
                          key={skill}
                          whileHover={{ 
                            scale: 1.05, 
                            backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                            borderColor: 'rgba(59, 130, 246, 0.5)', 
                            color: '#fff',
                            y: -2
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="px-3 py-1.5 rounded-sm bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40 border border-white/5 transition-all cursor-default"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* PROJECTS SECTION */}
        <ScrollReveal id="projects" className="mb-64">
          <SectionHeading icon={Layers}>Selected Works</SectionHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card3D className="overflow-hidden group h-full">
                  <div className="p-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-4xl font-black italic font-serif leading-none tracking-tighter text-white group-hover:text-blue-500 transition-colors">
                        {project.title}.
                      </h3>
                    </div>
                    <p className="text-white/40 mb-10 text-sm leading-relaxed group-hover:text-white/60 transition-colors max-w-sm">
                      {project.desc}
                    </p>
                    <div className="mt-auto pt-6 flex flex-wrap gap-4 items-center">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold text-blue-400/50 border border-blue-400/10 px-2 py-0.5 rounded-sm uppercase tracking-[0.2em]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex-grow"></div>
                      <div className="flex gap-3">
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 border border-white/10 rounded-full hover:border-blue-500/50 hover:bg-blue-500/10 transition-all flex items-center justify-center group/btn"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                        </a>
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center group/btn"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* EXPERIENCE & EDUCATION */}
        <ScrollReveal className="grid lg:grid-cols-2 gap-24 mb-64">
          <section id="experience">
            <SectionHeading icon={Briefcase}>Selected History</SectionHeading>
            <div className="space-y-16">
              {INTERNSHIPS.map((exp, idx) => (
                <motion.div 
                  key={exp.role} 
                  className="relative pl-12 border-l border-white/5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute left-0 top-0 w-2 h-2 bg-blue-500 rounded-full -translate-x-[4.5px] shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                  <div className="text-[10px] font-bold text-blue-500 mb-2 uppercase tracking-[0.3em]">{exp.period}</div>
                  <h3 className="text-2xl font-black italic font-serif text-white mb-2 tracking-tight">{exp.role}</h3>
                  <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">{exp.company}</div>
                  <div className="text-white/20 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5  px-2 py-1 rounded-sm">
                      <MapPin className="w-3 h-3 text-blue-500/50" /> {exp.location}
                    </div>
                  <p className="text-sm text-white/30 leading-relaxed max-w-md">{exp.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="education">
            <SectionHeading icon={GraduationCap}>Philosophy & Learning</SectionHeading>
            <div className="space-y-16">
              {EDUCATION.map((edu, idx) => (
                <motion.div 
                  key={edu.degree} 
                  className="relative pl-12 border-l border-white/5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute left-0 top-0 w-2 h-2 bg-white/20 rounded-full -translate-x-[4.5px]" />
                  <div className="text-[10px] font-bold text-white/30 mb-2 uppercase tracking-[0.3em]">{edu.period}</div>
                  <h3 className="text-2xl font-black italic font-serif text-white mb-2 tracking-tight">{edu.degree}</h3>
                  <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">{edu.school}</div>
                  <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">{edu.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* CERTIFICATES */}
        <ScrollReveal id="certificates" className="mb-64">
          <SectionHeading icon={Award}>Accolades</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATIONS.map((cert, idx) => (
              <motion.div
                key={cert.title}
                whileHover={{ y: -8 }}
                className="p-8 bg-white/5 border border-white/5 rounded-sm hover:border-blue-500/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Award className="w-12 h-12 text-blue-500" />
                </div>
                <div className="flex justify-between items-start mb-12">
                  <Award className="w-6 h-6 text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[10px] font-mono opacity-20">{cert.year}</div>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="text-[11px] text-white font-black uppercase tracking-[0.2em] leading-tight min-h-[3em]">{cert.title}</div>
                  <div className="h-[1px] w-8 bg-blue-500/30 group-hover:w-full transition-all duration-500"></div>
                  <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{cert.issuer}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* CONTACT */}
          <ScrollReveal id="contact" className="text-center relative">
          <Card3D>
            <ContactScene3D />
            <div className="py-32 px-6 flex flex-col items-center justify-center relative z-10">
              <h2 className="text-5xl md:text-7xl font-black font-serif italic text-white mb-10 tracking-tighter leading-none">
                Let's craft<br />something <span className="text-blue-500 not-italic font-sans font-black">LEGENDARY.</span>
              </h2>
              <p className="text-white/40 mb-16 max-w-sm mx-auto text-sm leading-relaxed uppercase tracking-[0.1em] font-medium">
                Currently open to precision-led <span className="text-white">opportunities</span> & <span className="text-white">creative partnerships</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                <a href="mailto:sherjinag@gmail.com" className="px-10 py-5 bg-white text-black font-black rounded-sm hover:bg-blue-600 hover:text-white transition-all transform uppercase tracking-widest text-xs">
                  Initiate Chat ↑
                </a>
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/sherjinag" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer group"
                  >
                    <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/sherjin-a-g-30590522a/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer group"
                  >
                    <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

      </main>

      <footer className="border-t border-white/5 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex flex-col md:flex-row gap-16 w-full md:w-auto">
            <div className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-black">Location</div>
              <div className="text-xs font-bold uppercase tracking-widest">Kanniya Kumari,Tamil Nadu, India</div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-black">Status</div>
              <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> 
                Available for Projects
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-black">Connect</div>
              <div className="flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <a href="https://github.com/sherjinag" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Github className="w-4 h-4" /></a>
                <a href="https://www.linkedin.com/in/sherjin-a-g-30590522a/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Linkedin className="w-4 h-4" /></a>
                <a href="https://www.youtube.com/@ProjectVerseTech" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Youtube className="w-4 h-4" /></a>
                
                {/* Behance placeholder */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><ExternalLink className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-black mb-6">Core Technology</div>
            <div className="flex gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-sm font-black italic font-serif">NEXT JS</span> 
              <span className="text-sm font-black">FAST API</span> 
              <span className="text-sm font-black tracking-tighter">MONGO DB.</span>
            </div>
            <div className="mt-12 text-[9px] font-mono opacity-20 tracking-[0.4em]">
              © 2026 SHERJIN A G. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
