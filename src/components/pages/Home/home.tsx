"use client";
import styles from "./Home.module.css";
import Carousel from "../../Carousel";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const Home = () => {
    const words = ["distinct", "by", "DESIGN"];
    const displayProjectsCanonicalNames = ["chilangohacks", "protego247", "celuzen", "shelly"];

    const [displayedWords, setDisplayedWords] = useState<string[]>(Array(words.length).fill(""));

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) {
            setDisplayedWords(words);
            return;
        }

        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const totalDuration = 750;
        const frameRate = 60;
        const intervalDelay = 1000 / frameRate;
        const totalFrames = Math.floor(totalDuration / intervalDelay);
        let currentFrame = 0;

        const interval = setInterval(() => {
            currentFrame++;
            setDisplayedWords(() =>
                words.map((targetWord) => {
                    const progress = currentFrame / totalFrames;
                    const revealedCount = Math.floor(progress * targetWord.length);
                    return targetWord
                        .split("")
                        .map((char, index) =>
                            index < revealedCount
                                ? char
                                : charset[Math.floor(Math.random() * charset.length)]
                        )
                        .join("");
                })
            );
            if (currentFrame >= totalFrames) {
                setDisplayedWords(words);
                clearInterval(interval);
            }
        }, intervalDelay);

        return () => clearInterval(interval);
    }, []);

    const boxStyles = ["min-w-[9ch]", "min-w-[3ch]", "min-w-[6ch]"];

    return (
        <>
            <div className={`${styles.grid} absolute inset-0 z-0`} />

            <main className="relative min-h-screen flex flex-col items-center justify-center gap-3 px-6 md:px-12 py-24 z-10">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 text-center">
                    <span
                        className={`${styles.word} ${boxStyles[0]} relative inline-block transform skew-x-6 border-4 border-cyan-500 bg-cyan-500 text-white px-6 py-3 shadow-xl`}
                    >
                        <span className="-skew-x-6 block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight lora not-italic">
                            {displayedWords[0]}
                        </span>
                    </span>
                    <span
                        className={`${styles.word} ${boxStyles[1]} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold bg-teal-700/60 text-white px-5 py-2 rounded-md backdrop-blur-md shadow-lg`}
                    >
                        {displayedWords[1]}
                    </span>
                    <span
                        className={`${styles.word} ${boxStyles[2]} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight lora dark:bg-white dark:text-black bg-gray-900 text-white px-6 py-3 shadow-xl`}
                    >
                        {displayedWords[2]}
                    </span>
                </div>

                 <div className="w-screen flex justify-center">
                    <Carousel
                        images={displayProjectsCanonicalNames.map(
                            (name) => `https://static.ulisesv.com/imgs/${name}.png`
                        )}
                        alt={displayProjectsCanonicalNames}
                        autoPlay
                        autoPlayInterval={4500}
                    />
                </div>
{/* 
                <LaptopModel /> */}
            </main>
            <section className={`${styles.hero} h-screen flex items-center justify-center px-6 py-12 md:px-12`}>
                <div>
                    <Image
                        src="https://static.ulisesv.com/imgs/headshot.jpeg"
                        alt="Ulises Vina profile picture"
    
                        className="rounded-full mx-auto mb-6 shadow-lg"
                    />
                </div>
                <div className="max-w-4xl text-center space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold ">
                        Hey, I'm Ulises 👋
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                        I am a dedicated web developer specializing in creating visually stunning and highly functional websites. My expertise lies in front-end development, UI/UX design, and responsive web design, ensuring that every project I undertake is not only beautiful but also user-friendly and accessible across all devices.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Badge className="px-4 py-2 text-lg bg-cyan-100 text-cyan-800">React</Badge>
                        <Badge className="px-4 py- 2 text-lg bg-cyan-100 text-cyan-800">Next.js</Badge>
                        <Badge className="px-4 py-2 text-lg bg-cyan-100 text-cyan-800">TypeScript</Badge>
                        <Badge className="px-4 py-2 text-lg bg-cyan-100 text-cyan-800">Tailwind CSS</Badge>
                        <Badge className="px-4 py-2 text-lg bg-cyan-100 text-cyan-800">UI/UX Design</Badge>
                        <Badge className="px-4 py-2 text-lg bg-cyan-100 text-cyan-800">Responsive Design</Badge>
                    </div>
                </div>
            </section>
        </>
    );
};

export { Home };