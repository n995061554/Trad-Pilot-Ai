
import React, { useState } from 'react';
import { studyGuideData } from '../data/studyGuideData';
import { translations } from '../translations';
import { BackArrowIcon } from './icons';
import { Page } from '../types';

const AccordionItem: React.FC<{
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}> = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border-b border-accent">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-accent/50 transition-colors"
                aria-expanded={isOpen}
            >
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                <svg
                    className={`w-6 h-6 text-brand transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div
                className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 text-text-secondary leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StudyGuideProps {
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
}

const StudyGuide: React.FC<StudyGuideProps> = ({ t, setActivePage }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleAccordionClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <header className="mb-6">
                <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                  <BackArrowIcon />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold text-text-primary">Foundation Study Guide</h1>
                <p className="text-md text-text-secondary">Learn the step-by-step blueprint for a successful export business.</p>
            </header>

            <div className="bg-primary rounded-lg shadow-lg">
                {studyGuideData.map((item, index) => (
                    <AccordionItem
                        key={index}
                        title={item.title}
                        isOpen={openIndex === index}
                        onClick={() => handleAccordionClick(index)}
                    >
                        {item.content}
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};

export default StudyGuide;
