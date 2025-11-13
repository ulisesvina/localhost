"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/context/ui/isMobile";

const MobileMenu = () => {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);

    if (!isMobile) {
        return null;
    } else {
        return (
            <button onClick={() => setIsOpen(true)} className="fixed bottom-5 right-5 p-5 bg-gray-500/50 backdrop-blur-md text-white rounded-full shadow-lg z-50">
                <Menu className="w-8 h-8" />
            </button>
        );
    }
}

export default MobileMenu;