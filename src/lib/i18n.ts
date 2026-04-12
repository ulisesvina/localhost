import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const supportedLocales = ['en', 'es'] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = 'en';
export const LOCALE_CONTEXT = Symbol('locale');

export function toSupportedLocale(value?: string | null): Locale | null {
	const base = value?.toLowerCase().split('-')[0];
	if (base === 'en' || base === 'es') return base;
	return null;
}

export function normalizeLocale(value?: string | null): Locale {
	return toSupportedLocale(value) ?? defaultLocale;
}

export function detectLocaleFromAcceptLanguage(header?: string | null): Locale {
	if (!header) return defaultLocale;

	for (const preference of header.split(',')) {
		const candidate = toSupportedLocale(preference.trim().split(';')[0]);
		if (candidate) return candidate;
	}

	return defaultLocale;
}

export function detectLocaleFromNavigator(): Locale {
	if (!browser) return defaultLocale;

	for (const preference of navigator.languages?.length ? navigator.languages : [navigator.language]) {
		const candidate = toSupportedLocale(preference);
		if (candidate) return candidate;
	}

	return defaultLocale;
}

export function createLocaleStore(initialLocale: Locale) {
	return writable<Locale>(initialLocale);
}

export function setLocaleContext(localeStore: Writable<Locale>) {
	setContext(LOCALE_CONTEXT, localeStore);
}

export function useLocaleContext(): Writable<Locale> {
	return getContext<Writable<Locale>>(LOCALE_CONTEXT);
}

export const translations = {
	en: {
		siteTitle: 'Ulises Viña | Fullstack Developer',
		siteDescription:
			'Portfolio website of Ulises Viña, fullstack developer focused on design, AI, and product experiences.',
		header: {
			openMenu: 'Open menu',
			closeMenu: 'Close menu',
			closeOverlay: 'Close mobile menu overlay',
			socialLinks: {
				linkedin: 'LinkedIn',
				github: 'GitHub',
				x: 'X (formerly Twitter)'
			}
		},
		hero: {
			title: {
				lead: 'Design',
				connector: 'that',
				emphasis: 'speaks',
				tail: 'for itself.'
			},
			subtitle:
				"Hi, I'm Ulises, a fullstack developer crafting digital experiences that balance utility and emotion.",
			contactCta: 'Get in Touch',
			resumeCta: 'Get my Resume'
		},
		scroll: {
			ariaLabel: 'Hero section with scroll animation',
			title: 'Design. Develop. Ship.',
			features: [
				{
					id: 1,
					title: 'Modern, yet timeless.',
					text: 'Designs that feel fresh today and still relevant in years to come.',
					image: 'https://static.ulisesv.com/imgs/projects/skyhorus.png?v=1'
				},
				{
					id: 2,
					title: 'A design that resonates.',
					text: 'Crafting identities that connect and leave a lasting impression for your brand.',
					image: 'https://static.ulisesv.com/imgs/projects/chilangohacks.png?v=1'
				},
				{
					id: 3,
					title: 'Intuitive, smart and accessible.',
					text: 'Finetuned for accessibility and ease of use, ensuring a seamless experience for all users.',
					image: 'https://static.ulisesv.com/imgs/projects/celuzen.png'
				}
			]
		},
		resume: {
			heading: 'Who am I?',
			sections: {
				education: 'Education',
				experience: 'Experience',
				achievements: 'Achievements',
				strengths: 'Technical strengths'
			},
			education: {
				school: 'Universidad Nacional Autónoma de México (UNAM)',
				degree: 'B.S. in Mathematics - Focus on Machine Learning / Algorithms',
				date: 'Expected 2029',
				location: 'Mexico City, MX'
			},
			experience: [
				{
					company: 'SkyHorus',
					role: 'Co-Founder',
					date: 'June 2024 - Present',
					location: 'Mexico City, MX',
					bullets: [
						'Engineered a premium UI/UX experience for a security suite using React and Tailwind CSS, increasing user retention by 35% through intuitive threat visualization.',
						"Architected a multi-agent AI orchestration layer using Apple's MLX and Llama 3, automating the classification of 100+ monthly security reports with 94% accuracy.",
						'Optimized inference latency by 13% by fine-tuning DistilBERT models for real-time edge deployment on localized hardware.'
					]
				},
				{
					company: 'Celuzen, LLC',
					role: 'Lead Developer',
					date: 'July 2025 - Present',
					location: 'California, US (Remote)',
					bullets: [
						'Developed a full-stack telecommunications comparison engine, integrating OpenCellID APIs and custom scrapers to index 100+ carrier plans in real-time.',
						"Built an LLM-powered sales agent using OpenAI's GPT-4 API and TypeScript, resulting in a 22% increase in conversion rates.",
						'Implemented a robust CI/CD pipeline using Docker and AWS, reducing deployment downtime by 23% for the core web application.'
					]
				}
			],
			achievements: [
				{
					title: 'Technical Leadership & Dissemination',
					date: 'October 2023 - Present',
					bullets: [
						'Conducted cybersecurity seminars for 200+ students at ENP-UNAM; post-session assessments showed a 60% improvement in technical topic retention through active recall methodologies.',
						"Spearheaded web development workshops for UNAM's Associate's Degree program, mentoring 40+ students on industry-standard stacks (MERN/PERN)."
					]
				},
				{
					title: 'Competitive Programming',
					date: 'April 2025',
					bullets: [
						"Secured 1st Place (Gold Medal) at UNAM's Interschool Programming Contest among nine campuses, solving complex algorithmic challenges under strict time constraints."
					]
				}
			],
			strengths: [
				{
					label: 'Languages',
					value: 'JavaScript/TypeScript (ES6+), Go, Python, C/C++, LaTeX'
				},
				{
					label: 'AI/ML',
					value: 'OpenAI API, LangChain, Apple MLX, HuggingFace (Transformers), Llama 3'
				},
				{
					label: 'Databases',
					value: 'PostgreSQL, MySQL, MongoDB, Redis'
				},
				{
					label: 'Tools/DevOps',
					value: 'Git, Linux (Debian/Arch), Docker, Bun, Node.js, AWS, GCP, CI/CD'
				}
			],
			downloadResume: 'Download Full Resume'
		},
		contact: {
			heading: 'Like what you see?',
			intro:
				"Let's get in touch and create something great together. Whether you have a project in mind or just want to say hi, I'm all ears.",
			emailPlaceholder: 'Your email address',
			continue: 'Continue',
			modalTitle: 'Tell me about your project',
			namePlaceholder: 'Your name',
			subjectPlaceholder: 'Subject',
			messagePlaceholder: 'Message',
			cancel: 'Cancel',
			send: 'Send Message',
			close: 'Close contact form'
		},
        footer: {
            headline: "Made with ❤️ in Mexico 🇲🇽",
            license: "Licensed under"
        }
	},
	es: {
		siteTitle: 'Ulises Viña | Desarrollador Fullstack',
		siteDescription:
			'Sitio de portafolio de Ulises Viña, desarrollador fullstack enfocado en diseño, IA y experiencias de producto.',
		header: {
			openMenu: 'Abrir menú',
			closeMenu: 'Cerrar menú',
			closeOverlay: 'Cerrar superposición del menú móvil',
			socialLinks: {
				linkedin: 'LinkedIn',
				github: 'GitHub',
				x: 'X (antes Twitter)'
			}
		},
		hero: {
			title: {
				lead: 'Diseño',
				connector: 'que',
				emphasis: 'habla',
				tail: 'por sí mismo.'
			},
			subtitle:
				'Soy Ulises, desarrollador fullstack que crea experiencias digitales que equilibran utilidad y emoción.',
			contactCta: 'Hablemos',
			resumeCta: 'Ver mi currículum'
		},
		scroll: {
			ariaLabel: 'Sección principal con animación de desplazamiento',
			title: 'Diseñar. Desarrollar. Lanzar.',
			features: [
				{
					id: 1,
					title: 'Moderno, pero atemporal.',
					text: 'Diseños que se sienten frescos hoy y siguen siendo relevantes con el paso de los años.',
					image: 'https://static.ulisesv.com/imgs/projects/skyhorus.png?v=1'
				},
				{
					id: 2,
					title: 'Un diseño que conecta.',
					text: 'Construyendo identidades que conectan y dejan una impresión duradera en tu marca.',
					image: 'https://static.ulisesv.com/imgs/projects/chilangohacks.png?v=1'
				},
				{
					id: 3,
					title: 'Intuitivo, inteligente y accesible.',
					text: 'Ajustado para accesibilidad y facilidad de uso, garantizando una experiencia fluida para todas las personas.',
					image: 'https://static.ulisesv.com/imgs/projects/celuzen.png'
				}
			]
		},
		resume: {
			heading: '¿Quién soy?',
			sections: {
				education: 'Educación',
				experience: 'Experiencia',
				achievements: 'Logros',
				strengths: 'Fortalezas técnicas'
			},
			education: {
				school: 'Universidad Nacional Autónoma de México (UNAM)',
				degree: 'Licenciatura en Matemáticas - Enfoque en Machine Learning/Inteligencia Artificial',
				date: 'Estimado para 2029',
				location: 'Ciudad de México, MX'
			},
			experience: [
				{
					company: 'SkyHorus',
					role: 'Cofundador',
					date: 'Junio 2024 - Presente',
					location: 'Ciudad de México, MX',
					bullets: [
						'Desarrollé una experiencia premium de UI/UX para una suite de seguridad usando React y Tailwind CSS, aumentando la retención de usuarios en un 35% mediante visualizaciones intuitivas de amenazas.',
						'Arquitecté una capa de orquestación de IA multiagente usando MLX de Apple y Llama 3, automatizando la clasificación de más de 100 informes de seguridad mensuales con una precisión del 94%.',
						'Optimicé la latencia de inferencia en un 13% ajustando modelos DistilBERT para despliegues en tiempo real en hardware local.'
					]
				},
				{
					company: 'Celuzen, LLC',
					role: 'Desarrollador principal',
					date: 'Julio 2025 - Presente',
					location: 'California, EE. UU. (Remoto)',
					bullets: [
						'Desarrollé un motor de comparación de telecomunicaciones fullstack, integrando APIs de OpenCellID y scrapers personalizados para indexar más de 100 planes de operadores en tiempo real.',
						'Construí un agente de ventas impulsado por LLM usando la API GPT-4 de OpenAI y TypeScript, logrando un aumento del 22% en las tasas de conversión.',
						'Implementé una canalización CI/CD robusta usando Docker y AWS, reduciendo el tiempo de inactividad de despliegues en un 23% para la aplicación web principal.'
					]
				}
			],
			achievements: [
				{
					title: 'Liderazgo técnico y divulgación',
					date: 'Octubre 2023 - Presente',
					bullets: [
						'Impartí seminarios de ciberseguridad para más de 200 estudiantes en la ENP-UNAM; las evaluaciones posteriores mostraron una mejora del 60% en la retención de temas técnicos mediante metodologías de recuerdo activo.',
						'Encabecé talleres de desarrollo web para el programa de carrera asociada de la UNAM, orientando a más de 40 estudiantes en stacks estándar de la industria (MERN/PERN).'
					]
				},
				{
					title: 'Programación competitiva',
					date: 'Abril 2025',
					bullets: [
						'Obtuve el 1er lugar (medalla de oro) en el Concurso Interescolar de Programación de la UNAM entre nueve campus, resolviendo retos algorítmicos complejos bajo estrictos límites de tiempo.'
					]
				}
			],
			strengths: [
				{
					label: 'Lenguajes',
					value: 'JavaScript/TypeScript (ES6+), Go, Python, C/C++, LaTeX'
				},
				{
					label: 'IA/ML',
					value: 'OpenAI API, LangChain, Apple MLX, HuggingFace (Transformers), Llama 3'
				},
				{
					label: 'Bases de datos',
					value: 'PostgreSQL, MySQL, MongoDB, Redis'
				},
				{
					label: 'Herramientas/DevOps',
					value: 'Git, Linux (Debian/Arch), Docker, Bun, Node.js, AWS, GCP, CI/CD'
				}
			],
			downloadResume: 'Descargar currículum completo'
		},
		contact: {
			heading: '¿Te gusta lo que ves?',
			intro:
				'Conectemos y construyamos algo grande juntos. Si tienes un proyecto en mente o solo quieres saludar, te leo con gusto.',
			emailPlaceholder: 'Tu correo electrónico',
			continue: 'Continuar',
			modalTitle: 'Cuéntame sobre tu proyecto',
			namePlaceholder: 'Tu nombre',
			subjectPlaceholder: 'Asunto',
			messagePlaceholder: 'Mensaje',
			cancel: 'Cancelar',
			send: 'Enviar mensaje',
			close: 'Cerrar formulario de contacto'
		},
        footer: {
            headline: "Hecho con ❤️ en México 🇲🇽",
            license: "Con licencia"
        }
	}
} as const satisfies Record<Locale, {
	siteTitle: string;
	siteDescription: string;
	header: {
		openMenu: string;
		closeMenu: string;
		closeOverlay: string;
		socialLinks: Record<'linkedin' | 'github' | 'x', string>;
	};
	hero: {
		title: { lead: string; connector: string; emphasis: string; tail: string };
		subtitle: string;
		contactCta: string;
		resumeCta: string;
	};
	scroll: {
		ariaLabel: string;
		title: string;
		features: Array<{ id: number; title: string; text: string; image: string }>;
	};
	resume: {
		heading: string;
		sections: Record<'education' | 'experience' | 'achievements' | 'strengths', string>;
		education: { school: string; degree: string; date: string; location: string };
		experience: Array<{
			company: string;
			role: string;
			date: string;
			location: string;
			bullets: string[];
		}>;
		achievements: Array<{ title: string; date: string; bullets: string[] }>;
		strengths: Array<{ label: string; value: string }>;
		downloadResume: string;
	};
	contact: {
		heading: string;
		intro: string;
		emailPlaceholder: string;
		continue: string;
		modalTitle: string;
		namePlaceholder: string;
		subjectPlaceholder: string;
		messagePlaceholder: string;
		cancel: string;
		send: string;
		close: string;
	};
    footer: {
        headline: string;
        license: string;
    }
}>;