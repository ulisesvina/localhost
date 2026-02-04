"use client"
import styles from "./Home.module.css"
import Carousel from "../../Carousel"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

import { Atom, Brush, MonitorSmartphone, MoveRight } from "lucide-react"

const Home = () => {
  const { t, ready } = useTranslation()
  const [words, setWords] = useState<string[]>(["DISTINCT", "by", "design"])
  const [isClient, setIsClient] = useState(false)
  const displayProjectsCanonicalNames = ["chilangohacks", "protego247", "celuzen", "shelly"]
  const [displayedWords, setDisplayedWords] = useState<string[]>(["oabf3d", "a1", "nxj4#@%"])
  const [loaded, setLoaded] = useState<boolean[]>(() => Array(displayProjectsCanonicalNames.length).fill(false))

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) {
      setDisplayedWords(words)
      return
    }

    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const totalDuration = 750
    const frameRate = 60
    const intervalDelay = 1000 / frameRate
    const totalFrames = Math.floor(totalDuration / intervalDelay)

    let currentFrame = 0

    const interval = setInterval(() => {
      currentFrame++
      setDisplayedWords(() =>
        words.map((targetWord) => {
          const progress = currentFrame / totalFrames
          const revealedCount = Math.floor(progress * targetWord.length)
          return targetWord
            .split("")
            .map((char, index) => (index < revealedCount ? char : charset[Math.floor(Math.random() * charset.length)]))
            .join("")
        }),
      )

      if (currentFrame >= totalFrames) {
        setDisplayedWords(words)
        clearInterval(interval)
      }
    }, intervalDelay)

    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    const handleImageLoad = (index: number) => {
      setLoaded((prev) => {
        const newLoaded = [...prev]
        newLoaded[index] = true
        return newLoaded
      }
      )
    }

    displayProjectsCanonicalNames.forEach((_, index) => {
      const img: HTMLImageElement = new window.Image()
      img.src = `https://static.ulisesv.com/imgs/${displayProjectsCanonicalNames[index]}.png`
      img.onload = () => handleImageLoad(index)
    })
  }, [displayProjectsCanonicalNames])

  useEffect(() => {
    setWords([
      t("hero.word1"),
      t("hero.word2"),
      t("hero.word3"),
    ])
  }, [t])


  const boxStyles = ["min-w-[9ch]", "min-w-[3ch]", "min-w-[6ch]"]

  const defaultSkills = ["React", "Next.js", "TypeScript", "Tailwind CSS", "UI/UX Design", "Responsive Design"]
  const skillBadges = [
    { label: isClient && ready ? t("techStack.skills.0") : defaultSkills[0], color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    { label: isClient && ready ? t("techStack.skills.1") : defaultSkills[1], color: "bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300" },
    { label: isClient && ready ? t("techStack.skills.2") : defaultSkills[2], color: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
    { label: isClient && ready ? t("techStack.skills.3") : defaultSkills[3], color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" },
    { label: isClient && ready ? t("techStack.skills.4") : defaultSkills[4], color: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
    { label: isClient && ready ? t("techStack.skills.5") : defaultSkills[5], color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  ]

  return (
    <>
      <div className={`${styles.grid} absolute inset-0 z-0`} />
      <main className="relative min-h-screen flex flex-col items-center justify-center gap-3 px-6 md:px-12 py-24 z-10">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 text-center">
          <span
            className={`${styles.word} ${boxStyles[0]} relative inline-block transform skew-x-6 border-4 border-cyan-500 bg-cyan-500 classic text-white px-6 py-3 shadow-xl`}
          >
            <span className="-skew-x-6 block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight italic">
              {displayedWords[0]}
            </span>
          </span>
          <span
            className={`${styles.word} ${boxStyles[1]} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold bg-teal-700/60 text-white px-5 py-2 rounded-md backdrop-blur-md shadow-lg`}
          >
            {displayedWords[1]}
          </span>
          <span
            className={`${styles.word} ${boxStyles[2]} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight fraunces md:tracking-wide dark:bg-white dark:text-black bg-gray-900 text-white px-6 py-3 shadow-xl`}
          >
            {displayedWords[2]}
          </span>
        </div>
        <div className="w-screen flex justify-center">
          <Carousel
            images={displayProjectsCanonicalNames.map((name) => `https://static.ulisesv.com/imgs/${name}.png`)}
            alt={displayProjectsCanonicalNames}
            autoPlay
            autoPlayInterval={4500}
          />
        </div>
      </main>
      <section
        className={`${styles.hero} relative min-h-screen flex items-center justify-center px-6 py-16 md:px-12 overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 via-50% to-background/100 dark:from-background/0 dark:via-background/20 dark:via-50% dark:to-background/100 pointer-events-none" />

        <div className="relative z-10 max-w-7xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex justify-center md:justify-start lg:justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <div
                  className={`${styles.glowCircle} absolute inset-0 bg-black md:bg-gradient-to-br from-cyan-400/30 via-purple-400/20 to-transparent rounded-full blur-3xl`}
                />
                <Image
                  src="https://static.ulisesv.com/imgs/headshot.jpeg"
                  alt="Ulises Avatar"
                  width={320}
                  height={320}
                  className="relative rounded-full shadow-2xl border-4 border-background dark:border-slate-800 w-full h-full object-cover"
                />
                <div
                  className={`
                    absolute inset-0 bg-neutral-800/40 
                    transition-opacity duration-200
                    rounded-full
                    ${loaded[0] ? "opacity-0 pointer-events-none" : "opacity-100"}
                  `}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-10">
              <div className="space-y-3">
                <h2 className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
                  {isClient && ready ? t('hero.greeting') : 'Hello, I\'m Ulises 👋'}
                </h2>
                <p className="text-lg md:text-xl text-foreground/75 dark:text-foreground/65 leading-relaxed max-w-md">
                  {isClient && ready ? t('hero.description') : 'I craft beautiful, functional digital experiences with modern technologies.'}
                </p>
                <a href="https://static.ulisesv.com/docs/Resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="my-2 cursor-pointer">
                    {isClient && ready ? t('hero.resumeButton') : 'Check my Resume'}
                    <MoveRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">{isClient && ready ? t('techStack.label') : 'Tech Stack'}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillBadges.map((skill, index) => (
                    <Badge
                      key={skill.label}
                      className={`${skill.color} px-3 py-2 text-xs font-semibold border-0 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 ${styles[`skill${index}`]}`}
                    >
                      {skill.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative w-full px-6 md:px-12 py-32 flex flex-col items-center bg-gradient-to-b from-background to-background/50"
      >
        <div className="max-w-4xl w-full">
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-balance leading-tight">{isClient && ready ? t('about.title') : 'About'}</h2>
              <p className="text-xl md:text-2xl text-foreground/70 font-light max-w-2xl text-balance">
                {isClient && ready ? t('about.subtitle') : 'I specialize in building digital experiences that merge stunning design with robust engineering.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`${styles.aboutCard} p-8 rounded-xl border border-foreground/10 hover:border-cyan-500/50 transition-colors duration-300`}
              >
                <h3 className="font-bold mb-1 uppercase text-sm text-gray-400 dark:text-gray-600 ">
                  <Atom className="inline-block mr-2 mb-1 w-4 h-4 text-cyan-400" />
                  {isClient && ready ? t('about.cards.interactive.title') : 'Interactive'}</h3>
                <p className="text-foreground/70 leading-relaxed text-balance">
                  {isClient && ready ? t('about.cards.interactive.description') : 'I prioritize user engagement through intuitive interfaces and seamless interactions.'}
                </p>
              </div>
              <div
                className={`${styles.aboutCard} p-8 rounded-xl border border-foreground/10 hover:border-cyan-500/50 transition-colors duration-300`}
              >
                <h3 className="font-bold mb-1 uppercase text-sm text-gray-400 dark:text-gray-600 ">
                  <Brush className="inline-block mr-2 mb-1 w-4 h-4 text-cyan-400" />
                  {isClient && ready ? t('about.cards.design.title') : 'Design'}</h3>
                <p className="text-foreground/70 leading-relaxed text-balance">
                  {isClient && ready ? t('about.cards.design.description') : 'My designs focus on clarity, aesthetics, and user-centric principles to create memorable experiences.'}
                </p>
              </div>
              <div
                className={`${styles.aboutCard} p-8 rounded-xl border border-foreground/10 hover:border-cyan-500/50 transition-colors duration-300`}
              >
                <h3 className="font-bold mb-1 uppercase text-sm text-gray-400 dark:text-gray-600 ">
                  <MonitorSmartphone className="inline-block mr-2 mb-1 w-4 h-4 text-cyan-400" />
                  {isClient && ready ? t('about.cards.responsiveness.title') : 'Responsiveness'}</h3>
                <p className="text-foreground/70 leading-relaxed text-balance">
                  {isClient && ready ? t('about.cards.responsiveness.description') : 'I ensure that every project is optimized for performance and accessibility across all devices.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="relative w-full px-6 md:px-12 py-32 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-balance leading-tight">{isClient && ready ? t('projects.title') : 'Projects'}</h2>
              <p className="text-xl md:text-2xl text-foreground/70 font-light text-balance">
                {isClient && ready ? t('projects.subtitle') : 'A selection of work that showcases my approach to design and development.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayProjectsCanonicalNames.map((projectName, index) => (
                <div
                  key={projectName}
                  className={`${styles.projectCard} group relative overflow-hidden rounded-xl border border-foreground/10 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900">
                    <Image
                      src={`https://static.ulisesv.com/imgs/${projectName}.png`}
                      alt={projectName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold capitalize text-balance">{projectName}</h3>
                    <p className="text-foreground/70">
                      {isClient && ready ? t('projects.projectDescription') : 'Innovative web experience combining design excellence with technical precision.'}
                    </p>
                    <div className="pt-3 flex gap-2">
                      <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 text-xs">
                        {isClient && ready ? t('projects.badges.design') : 'Design'}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs">
                        {isClient && ready ? t('projects.badges.development') : 'Development'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative w-full px-6 md:px-12 py-32 flex flex-col items-center bg-gradient-to-b from-background/50 to-background"
      >
        <div className="max-w-3xl w-full text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-balance leading-tight">{isClient && ready ? t('contact.title') : 'Let\'s Talk'}</h2>
            <p className="text-xl md:text-2xl text-foreground/70 font-light text-balance">
              {isClient && ready ? t('contact.subtitle') : 'Have an idea or opportunity? I\'d love to hear from you.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href="mailto:your-email@example.com"
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
            >
              {isClient && ready ? t('contact.emailButton') : 'Send Email'}
            </a>
            <a
              href="#"
              className="px-10 py-4 border-2 border-foreground/20 text-foreground font-semibold rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200 text-center"
            >
              {isClient && ready ? t('contact.resumeButton') : 'View Resume'}
            </a>
          </div>

          <div className="pt-8 space-y-6">
            <p className="text-foreground/60 text-sm uppercase tracking-widest">{isClient && ready ? t('contact.findMeLabel') : 'Or find me on'}</p>
            <div className="flex justify-center gap-6">
              <a
                href="#"
                className="text-foreground/70 hover:text-cyan-500 transition-colors duration-200 font-semibold hover:scale-110"
              >
                {isClient && ready ? t('contact.socials.github') : 'GitHub'}
              </a>
              <a
                href="#"
                className="text-foreground/70 hover:text-cyan-500 transition-colors duration-200 font-semibold hover:scale-110"
              >
                {isClient && ready ? t('contact.socials.linkedin') : 'LinkedIn'}
              </a>
              <a
                href="#"
                className="text-foreground/70 hover:text-cyan-500 transition-colors duration-200 font-semibold hover:scale-110"
              >
                {isClient && ready ? t('contact.socials.twitter') : 'Twitter'}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export { Home }
