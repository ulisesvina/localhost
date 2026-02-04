"use client";

import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './Header.module.css';
import { useIsMobile } from '@/context/ui/isMobile';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const Header = () => {
    const isMobile = useIsMobile();
    const { t, i18n } = useTranslation();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <header className={`${styles.headerDesktop} max-w-screen-md mx-auto flex justify-between items-center`}>
            <Link href="/" className="flex flex-col leading-tight">
                <span className="font-bold text-black text-2xl classic">
                    Ulises Viña
                </span>
                <span className="text-gray-600 text-xs tracking-wide">
                    {t('navigation.title')}
                </span>
            </Link>

            <nav>
                <ul className={`${styles.navList} flex`}>
                    {!isMobile && isClient && (
                        <>
                            <li><Link href="#about" className={styles.navLink}>{t('navigation.about')}</Link></li>
                            <li><Link href="#projects" className={styles.navLink}>{t('navigation.projects')}</Link></li>
                            <li><Link href="#contact" className={styles.navLink}>{t('navigation.contact')}</Link></li>
                        </>
                    )}
                    {isClient && (
                        <li>
                            <button
                                onClick={toggleLanguage}
                                className={`${styles.navLink} flex items-center gap-1`}
                                aria-label="Toggle language"
                            >
                                {i18n.language === 'en' ? 'ES' : 'EN'}
                            </button>
                        </li>
                    )}
                    <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.iconLink}><FaGithub size={16} /></a></li>
                    <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.iconLink}><FaLinkedin size={16} /></a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;