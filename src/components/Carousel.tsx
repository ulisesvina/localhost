"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type CarouselProps = {
    images: string[]
    alt?: string[]
    autoPlay?: boolean
    autoPlayInterval?: number
    onIndexChange?: (index: number) => void
}

export default function Carousel({
    images,
    alt = [],
    autoPlay = true,
    autoPlayInterval = 2000,
    onIndexChange,
}: CarouselProps) {
    const [index, setIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalIndex, setModalIndex] = useState<number | null>(null)
    const timeoutRef = useRef<number | null>(null)
    const rootRef = useRef<HTMLDivElement | null>(null)
    const closeButtonRef = useRef<HTMLButtonElement | null>(null)
    const isHoveringRef = useRef(false)

    useEffect(() => {
        onIndexChange?.(index)
    }, [index, onIndexChange])

    useEffect(() => {
        if (!autoPlay) return
        const tick = () => {
            if (isHoveringRef.current) return
            if (isModalOpen) return // pause autoplay while modal is open
            setIndex((i) => (i + 1) % images.length)
        }
        timeoutRef.current = window.setInterval(tick, autoPlayInterval)
        return () => {
            if (timeoutRef.current) window.clearInterval(timeoutRef.current)
        }
    }, [autoPlay, autoPlayInterval, images.length])

    // Pause on hover
    useEffect(() => {
        const el = rootRef.current
        if (!el) return
        const onEnter = () => (isHoveringRef.current = true)
        const onLeave = () => (isHoveringRef.current = false)
        el.addEventListener("mouseenter", onEnter)
        el.addEventListener("mouseleave", onLeave)
        return () => {
            el.removeEventListener("mouseenter", onEnter)
            el.removeEventListener("mouseleave", onLeave)
        }
    }, [])

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (isModalOpen) return // modal handles its own keyboard navigation elsewhere
            if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length)
            if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [images.length])

    // Modal-specific keyboard navigation (left/right to change images)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!isModalOpen) return
            if (e.key === "ArrowLeft") setModalIndex((m) => (m === null ? null : (m - 1 + images.length) % images.length))
            if (e.key === "ArrowRight") setModalIndex((m) => (m === null ? null : (m + 1) % images.length))
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isModalOpen, images.length])

    const modalPrev = () => {
        setModalIndex((m) => (m === null ? null : (m - 1 + images.length) % images.length))
    }

    const modalNext = () => {
        setModalIndex((m) => (m === null ? null : (m + 1) % images.length))
    }

    // Touch swipe support
    useEffect(() => {
        const el = rootRef.current
        if (!el) return
        let startX: number | null = null
        const onTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX
        }
        const onTouchMove = (e: TouchEvent) => {
            if (startX === null) return
            const delta = e.touches[0].clientX - startX
            if (Math.abs(delta) > 50) {
                if (delta > 0) setIndex((i) => (i - 1 + images.length) % images.length)
                else setIndex((i) => (i + 1) % images.length)
                startX = null
            }
        }
        const onTouchEnd = () => (startX = null)
        el.addEventListener("touchstart", onTouchStart)
        el.addEventListener("touchmove", onTouchMove)
        el.addEventListener("touchend", onTouchEnd)
        return () => {
            el.removeEventListener("touchstart", onTouchStart)
            el.removeEventListener("touchmove", onTouchMove)
            el.removeEventListener("touchend", onTouchEnd)
        }
    }, [images.length])

    const goToPrevious = () => setIndex((i) => (i - 1 + images.length) % images.length)
    const goToNext = () => setIndex((i) => (i + 1) % images.length)

    const getCircularOffset = (position: number) => {
        if (images.length === 0) return 0
        let d = (position - index + images.length) % images.length
        if (d > images.length / 2) d -= images.length
        return d
    }

    const getImageStyle = (position: number) => {
        // compute shortest circular offset so slides wrap-around
        if (images.length === 0) {
            return { transform: "translateX(0%) scale(1)", zIndex: 50, opacity: 1 }
        }

        let d = (position - index + images.length) % images.length
        // use shortest signed distance
        if (d > images.length / 2) d -= images.length

        const offset = d
        const absOffset = Math.abs(offset)

        // center slide
        if (offset === 0) {
            return {
                transform: "translateX(0%) scale(1)",
                zIndex: 50,
                opacity: 1,
            }
        }

        // Only nearby slides (offset -1 or 1) will be visible — this enforces max 3 slides
        const translateX = offset * 50
        const scale = Math.max(0.6, 1 - absOffset * 0.25)
        const rotateY = offset > 0 ? -25 : 25
        const opacity = absOffset <= 1 ? 1 : 0

        return {
            transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
            zIndex: 50 - absOffset,
            opacity,
        }
    }

    // Lock body scroll when modal is open and focus management
    useEffect(() => {
        if (!isModalOpen) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        // focus the close button when modal opens
        requestAnimationFrame(() => closeButtonRef.current?.focus())
        return () => {
            document.body.style.overflow = prev
        }
    }, [isModalOpen])

    // Close modal on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!isModalOpen) return
            if (e.key === "Escape") setIsModalOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isModalOpen])

    const openModalFor = (i: number) => {
        setModalIndex(i)
        setIsModalOpen(true)
    }

    const closeModal = () => setIsModalOpen(false)

    return (
        <div ref={rootRef} className="w-full max-w-6xl mx-auto relative py-8 px-2 sm:px-4 overflow-x-hidden">
            <div className="relative h-[260px] sm:h-[360px] md:h-[480px] overflow-hidden" style={{ perspective: "2000px" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    {images.map((src, i) => {
                        const offset = getCircularOffset(i)
                        // only render center and immediate neighbors (max 3 visible)
                        if (Math.abs(offset) > 1) return null

                        const style = getImageStyle(i)

                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    if (i === index) openModalFor(i)
                                    else setIndex(i)
                                }}
                                className="absolute transition-all duration-700 ease-out cursor-pointer"
                                style={{ ...style, transformStyle: "preserve-3d" }}
                                aria-label={i === index ? `Open slide ${i + 1} in a popup` : `Go to slide ${i + 1}`}
                            >
                                <div
                                    className={`relative w-[240px] h-[150px] sm:w-[400px] sm:h-[250px] md:w-[600px] md:h-[360px] rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300`}
                                >
                                    <Image
                                        src={src || "/placeholder.svg"}
                                        alt={alt[i] ?? `carousel-${i}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 600px"
                                        className="object-contain"
                                        priority={Math.abs(i - index) <= 1}
                                        draggable={false}
                                    />
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Navigation arrows */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/80 hover:text-white p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-200 hover:scale-105 border border-white/10"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/80 hover:text-white p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-200 hover:scale-105 border border-white/10"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Modal / Lightbox */}
            {isModalOpen && modalIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Image ${modalIndex + 1} preview`}
                    className="fixed inset-0 z-70 flex items-center justify-center p-4"
                >
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={closeModal}
                        aria-hidden="true"
                    />

                    <div className="relative z-80 max-w-[90vw] max-h-[90vh] w-full flex items-center justify-center">
                        <div className="w-full h-full max-h-[90vh] max-w-5xl px-2">
                            <div className="relative w-full h-[70vh] md:h-[80vh] bg-black rounded">
                                <Image
                                    src={images[modalIndex] || "/placeholder.svg"}
                                    alt={alt[modalIndex] ?? `carousel-${modalIndex}`}
                                    fill
                                    sizes="100vw"
                                    className="object-contain"
                                />
                            </div>
                        </div>


                        <button
                            onClick={modalPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-90 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 border border-white/20"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={modalNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-90 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 border border-white/20"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <button
                            ref={closeButtonRef}
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-90 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12 p-2 border border-white/20 flex items-center justify-center"
                            aria-label="Close image preview"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}