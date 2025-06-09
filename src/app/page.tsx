'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Github, Linkedin, Download, Moon, Sun, Menu, X } from 'lucide-react'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [publications, setPublications] = useState<any[]>([])
  const [software, setSoftware] = useState<any[]>([])
  const [datasets, setDatasets] = useState<any[]>([])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    // Load data from JSON files
    const loadData = async () => {
      try {
        const [pubRes, softRes, dataRes] = await Promise.all([
          fetch('./data/publications.json'),
          fetch('./data/software.json'),
          fetch('./data/datasets.json')
        ])
        
        if (!pubRes.ok || !softRes.ok || !dataRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const pubData = await pubRes.json()
        const softData = await softRes.json()
        const dataData = await dataRes.json()

        // Sort by date (newest first)
        const sortedPub = pubData.sort((a: any, b: any) => new Date(b.date || b.year).getTime() - new Date(a.date || a.year).getTime())
        const sortedSoft = softData.sort((a: any, b: any) => new Date(b.date || b.year).getTime() - new Date(a.date || a.year).getTime())
        const sortedData = dataData.sort((a: any, b: any) => new Date(b.lastUpdated || b.date || b.year).getTime() - new Date(a.lastUpdated || a.date || a.year).getTime())

        setPublications(sortedPub)
        setSoftware(sortedSoft)
        setDatasets(sortedData)
      } catch (error) {
        console.error('Error loading data:', error)
        // Set fallback data or empty arrays
        setPublications([])
        setSoftware([])
        setDatasets([])
      }
    }

    loadData()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  }

  const navigationItems = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Publications', href: '#publications' },
    { name: 'Software', href: '#software' },
    { name: 'Data', href: '#data' }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/images/background.jpg)',
        }}
      />
      {/* Background Overlay */}
      <div className={`fixed inset-0 z-10 ${darkMode ? 'bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90' : 'bg-gradient-to-br from-white/85 via-blue-50/90 to-white/85'}`} />

      {/* Content */}
      <div className="relative z-20">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${darkMode ? 'bg-white/95' : 'bg-slate-900/95'} backdrop-blur-md border-b ${darkMode ? 'border-gray-200' : 'border-slate-700'}`}>
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className={`text-2xl font-bold ${darkMode ? 'text-gray-900' : 'text-white'} flex items-center`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {!imageError ? (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                  <Image
                    src="/assets/images/headshot-2022.jpg"
                    alt="Andre Assumpcao"
                    width={32}
                    height={32}
                    className="profile-image"
                    priority
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-200' : 'bg-slate-700'} flex items-center justify-center mr-3`}>
                  <span className={`text-xs font-bold ${darkMode ? 'text-gray-900' : 'text-white'}`}>AA</span>
                </div>
              )}
              Andre Assumpcao
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${darkMode ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'} transition-all duration-200 font-medium`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.name}
                </motion.a>
              ))}

              {/* Contact Shortcuts */}
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-gray-500">
                <a
                  href="mailto:andre.assumpcao@gmail.com"
                  className={`${darkMode ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-colors`}
                >
                  <Mail size={20} />
                </a>
                <a
                  href="https://github.com/aassumpcao"
                  target="_blank"
                  className={`${darkMode ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-colors`}
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/aassumpcao"
                  target="_blank"
                  className={`${darkMode ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-colors`}
                >
                  <Linkedin size={20} />
                </a>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-100 text-gray-600' : 'bg-slate-800 text-yellow-400'} hover:scale-110 transition-all duration-200`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-100 text-gray-600' : 'bg-slate-800 text-yellow-400'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 ${darkMode ? 'text-gray-900' : 'text-white'}`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="lg:hidden mt-4 pb-4 border-t border-gray-500"
            >
              <div className="flex flex-col space-y-4 pt-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${darkMode ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'} transition-colors font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-500">
                  <a href="mailto:andre.assumpcao@gmail.com" className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Mail size={20} />
                  </a>
                  <a href="https://github.com/aassumpcao" target="_blank" className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Github size={20} />
                  </a>
                  <a href="https://linkedin.com/in/aassumpcao" target="_blank" className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      <main className="pt-20">
        {/* About Section - Starting section */}
        <section id="about" className="py-20 px-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <h1 className={`text-4xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    About Me
                  </h1>
                  <div className={`w-20 h-1 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'} mb-8`}></div>
                </div>

                <div className="space-y-6">
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    I am a data scientist at the National Center for State Courts (NCSC), where I am contributing new data science tools (data dashboards, database management, predictive and causal inference) to the NCSC's core products. Prior to the NCSC, I held research positions in government and think tanks, such as UNC’s Criminal Justice Innovation Lab, the Center for International Development at the Harvard Kennedy School, the U.K. Foreign and Commonwealth Office, the Brookings Institution, and the Center of Politics and Public Economics (CEPESP-FGV).
                  </p>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    With a strong background in quantitative methods and programming, I bridge the gap between
                    theoretical research and practical applications in data science.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="/data/aassumpcao-resume-20250609.pdf"
                    target="_blank"
                    className={`inline-flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors font-medium`}
                  >
                    <Download size={18} />
                    Download Resume
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {!imageError ? (
                  <Image
                    src="/assets/images/headshot-2022.jpg"
                    alt="Andre Assumpcao"
                    width={500}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-xl"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-full h-96 ${darkMode ? 'bg-slate-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
                    <span className={`text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AA</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className={`py-20 px-6 ${darkMode ? 'bg-gradient-to-r from-yellow-900/20 via-transparent to-orange-900/20' : 'bg-gradient-to-r from-yellow-50/50 via-transparent to-orange-50/50'}`}>
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Experience & Education</h2>
              <div className={`w-20 h-1 ${darkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-yellow-500 to-orange-500'} mb-6 opacity-80`}></div>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  title: "Data Scientist",
                  organization: "National Center for State Courts (NCSC)",
                  period: "Sep 2022 - Present",
                  description: "Created 5+ apps integrating AI large language models into data extraction tasks. Led the NCSC Data Dives publication series. Led workshops on AI in state courts and implemented the NCSC's first large data warehouse.",
                  type: "experience"
                },
                {
                  title: "Post-Doctoral Fellow",
                  organization: "The Criminal Justice Innovation Lab (CJIL), UNC Chapel Hill",
                  period: "July 2021 - Sep 2022",
                  description: "Spearheaded development of the Measuring Justice Data Dashboard with 35+ criminal justice metrics. Optimized data analysis pipelines reducing processing time from 2 weeks to 48 hours.",
                  type: "experience"
                },
                {
                  title: "Post-Doctoral Fellow",
                  organization: "The Growth Lab, Harvard University",
                  period: "June 2020 - May 2021",
                  description: "Co-authored papers on occupational tasks and computerization. Designed algorithms for extractive summarization. Managed survey experiments with 15,000+ respondents on Colombian migration factors.",
                  type: "experience"
                },
                {
                  title: "Ph.D. in Public Policy",
                  organization: "The University of North Carolina at Chapel Hill",
                  period: "2015 - 2020",
                  description: "Completed 5+ research projects, managed advisor-led research using experimental methods. Independently taught graduate and undergraduate courses on political economy and quantitative analysis.",
                  type: "education"
                },
                {
                  title: "Economics Officer",
                  organization: "UK Foreign, Commonwealth & Development Office",
                  period: "April 2013 - July 2015",
                  description: "Secured 6x funding increases for finance and transparency projects (£50K to £300K). Organized workshops on Brazil's financial sector and 5 Ministerial visits between UK and Brazil.",
                  type: "experience"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-yellow-500/60 pl-8 py-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{item.title}</h3>
                      <p className={`text-lg ${darkMode ? 'text-yellow-300' : 'text-yellow-700'} font-medium`}>{item.organization}</p>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                      {item.period}
                    </span>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className={`py-20 px-6 ${darkMode ? 'bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20' : 'bg-gradient-to-r from-purple-50/50 via-transparent to-blue-50/50'}`}>
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Publications</h2>
              <div className={`w-20 h-1 ${darkMode ? 'bg-gradient-to-r from-purple-400 to-blue-400' : 'bg-gradient-to-r from-purple-500 to-blue-500'} mb-6 opacity-80`}></div>
            </motion.div>

            <div className="space-y-12">
              {publications.map((pub, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-purple-500/60 pl-8 py-4"
                >
                  <div className="space-y-4">
                    <h3 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {pub.link ? (
                        <a 
                          href={pub.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`hover:underline ${darkMode ? 'hover:text-purple-300' : 'hover:text-purple-600'} transition-colors`}
                        >
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'} font-medium`}>
                      {pub.authors} • {pub.year} • {pub.journal}
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {pub.abstract}
                    </p>
                    {pub.link && (
                      <a 
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} transition-colors font-medium text-sm`}
                      >
                        📄 Read Paper
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Software Section */}
        <section id="software" className={`py-20 px-6 ${darkMode ? 'bg-gradient-to-r from-green-900/20 via-transparent to-teal-900/20' : 'bg-gradient-to-r from-green-50/50 via-transparent to-teal-50/50'}`}>
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Software</h2>
              <div className={`w-20 h-1 ${darkMode ? 'bg-gradient-to-r from-green-400 to-teal-400' : 'bg-gradient-to-r from-green-500 to-teal-500'} mb-6 opacity-80`}></div>
            </motion.div>

            <div className="space-y-12">
              {software.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-green-500/60 pl-8 py-4"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      <span className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'} font-medium`}>
                        {item.language}
                      </span>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {item.description}
                    </p>
                    <a
                      href={item.github}
                      target="_blank"
                      className={`inline-flex items-center gap-2 ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors font-medium`}
                    >
                      <Github size={18} />
                      View on GitHub
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Section */}
        <section id="data" className={`py-20 px-6 ${darkMode ? 'bg-gradient-to-r from-blue-900/20 via-transparent to-indigo-900/20' : 'bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/50'}`}>
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Data</h2>
              <div className={`w-20 h-1 ${darkMode ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} mb-6 opacity-80`}></div>
            </motion.div>

            <div className="space-y-12">
              {datasets.map((dataset, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-blue-500/60 pl-8 py-4"
                >
                  <div className="space-y-4">
                    <h3 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dataset.name}
                    </h3>
                    <div className="flex gap-4 text-sm">
                      <span className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-medium`}>Size: {dataset.size}</span>
                      <span className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-medium`}>Observations: {dataset.observations}</span>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {dataset.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Footer */}
        <footer className={`py-12 px-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="w-full max-w-7xl mx-auto text-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              © 2025 Andre Assumpcao. Built with Next.js and Tailwind CSS.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="mailto:andre.assumpcao@gmail.com"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                <Mail size={24} />
              </a>
              <a
                href="https://github.com/aassumpcao"
                target="_blank"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/in/aassumpcao"
                target="_blank"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </footer>
      </main>
      </div>
    </div>
  )
}
