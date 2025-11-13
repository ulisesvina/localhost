"use client";

import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './Header.module.css';
import { useIsMobile } from '@/context/ui/isMobile';

const Header = () => {
    const isMobile = useIsMobile();

    return (
        <header className={`${styles.headerDesktop} max-w-screen-md mx-auto flex justify-between items-center`}>
            <Link href="/">
                <span className="font-bold text-black text-2xl lora text-center">Ulises Viña</span>
            </Link>
            <nav>
                <ul className={`${styles.navList} flex`}>
                    {!isMobile && (
                        <>
                            <li><Link href="#about" className={styles.navLink}>About</Link></li>
                            <li><Link href="#projects" className={styles.navLink}>Projects</Link></li>
                            <li><Link href="#contact" className={styles.navLink}>Contact</Link></li>
                        </>
                    )}
                    <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.iconLink}><FaGithub size={16} /></a></li>
                    <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.iconLink}><FaLinkedin size={16} /></a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;