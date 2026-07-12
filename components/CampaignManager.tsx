
import React, { useState, useEffect } from 'react';
import { generateCreativeAiResponse } from '../services/geminiService';
import { CampaignContact, Page } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { translations } from '../translations';
import { GmailIcon, BackArrowIcon } from './icons';

interface CampaignManagerProps {
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
}

const CampaignManager: React.FC<CampaignManagerProps> = ({ t, setActivePage }) => {
    const [activeTab, setActiveTab] = useState<'lists' | 'generator'>('lists');
    const [contacts, setContacts] = useState<CampaignContact[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [form, setForm] = useState({
        product: 'Basmati Rice',
        tone: 'Professional',
        channel: 'Email',
    });

    useEffect(() => {
        const savedContactsJSON = localStorage.getItem('campaignContactList');
        if (savedContactsJSON) {
            setContacts(JSON.parse(savedContactsJSON));
        } else {
            // Default list if nothing is saved
            setContacts([
                { id: 1, companyName: 'Global Foods Inc.', contactPerson: 'John Doe', email: 'john.d@globalfoods.com', phone: '+12025550174', country: 'USA', type: 'Buyer', product: 'Basmati Rice' },
                { id: 2, companyName: 'Euro Spices Co.', contactPerson: 'Jane Smith', email: 'jane.s@eurospices.co.uk', phone: '+442079460958', country: 'UK', type: 'Buyer', product: 'Turmeric Powder' },
            ]);
        }
    }, []);

    useEffect(() => {
        if (selectedContacts.length > 0) {
            const selected = contacts.filter(c => selectedContacts.includes(c.id));
            const firstProduct = selected[0]?.product;
            if (firstProduct) {
                const allSameProduct = selected.every(c => c.product === firstProduct);
                if (allSameProduct) {
                    setForm(prev => ({ ...prev, product: firstProduct }));
                }
            }
        }
    }, [selectedContacts, contacts]);


    const removeContact = (id: number) => {
        const updatedContacts = contacts.filter(c => c.id !== id);
        setContacts(updatedContacts);
        setSelectedContacts(prev => prev.filter(cId => cId !== id));
        localStorage.setItem('campaignContactList', JSON.stringify(updatedContacts));
    };
    
    const handleSelectContact = (id: number) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedContacts(contacts.map(c => c.id));
        } else {
            setSelectedContacts([]);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachment(e.target.files[0]);
        } else {
            setAttachment(null);
        }
    };
    
    const removeAttachment = () => {
        setAttachment(null);
        // Also clear the file input value
        const fileInput = document.getElementById('file-attachment') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const generateMessage = async () => {
        setIsLoading(true);
        setGeneratedMessage('');

        const selected = contacts.filter(c => selectedContacts.includes(c.id));
        if (selected.length === 0) {
            alert("Please select at least one contact to generate a message.");
            setIsLoading(false);
            return;
        }

        const contactTypes = new Set(selected.map(c => c.type));
        if (contactTypes.size > 1) {
            alert("Please select contacts of only one type (e.g., all Buyers) for a targeted message.");
            setIsLoading(false);
            return;
        }
        
        const targetAudience = contactTypes.values().next().value;

        let promptContext = '';
        switch (targetAudience) {
            case 'Buyer':
                promptContext = 'The message is for a potential international buyer. The goal is to introduce our company and the product we export, aiming to start a business relationship.';
                break;
            case 'Supplier':
                promptContext = 'The message is for a potential domestic supplier. The goal is to inquire about their manufacturing capacity, quality, and pricing for the product we want to source for export.';
                break;
            case 'OEM':
                promptContext = 'The message is for a potential Original Equipment Manufacturer (OEM). The goal is to inquire about their capabilities for private label manufacturing of our product.';
                break;
            default:
                promptContext = 'The message is for a business contact.';
        }
        
        if (attachment) {
            promptContext += ` The user has selected a file named "${attachment.name}" to attach. Please include a sentence in the message mentioning this attachment, for example, "Please find our product catalog attached for your reference."`;
        }


        const savedDetails = localStorage.getItem('companyProfile');
        let companySignature = '';
        if (savedDetails) {
            const details = JSON.parse(savedDetails);
            companySignature = `

Best Regards,

The Team at ${details.companyName || '[Company Name not set]'}
${details.address || '[Address not set]'}
Email: ${details.email || '[Email not set]'} | Phone: ${details.phone || '[Phone not set]'}
`;
        } else {
            companySignature = `

(Set your 'Company Profile' to automatically add your signature!)
`;
        }

        const prompt = `
        You are an expert B2B sales copywriter. Generate an outreach message for the following scenario:
        - Target Audience: ${targetAudience}
        - Product: "${form.product}"
        - Tone: "${form.tone}"
        - Channel: "${form.channel}"
        
        ${promptContext}
        
        If the channel is WhatsApp, make the message shorter and more direct. If it's Email, use a standard professional format. 
        The message should be compelling and aim to get a response. Do not include a signature block or sign-off like "Best Regards,"; it will be added automatically.
        `;
        
        try {
            const response = await generateCreativeAiResponse(prompt);
            const fullMessage = response.trim() + (form.channel === 'Email' ? companySignature : '');
            setGeneratedMessage(fullMessage);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
            const userFriendlyError = `Error: Could not generate message. ${errorMessage}`;
            setGeneratedMessage(userFriendlyError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleComposeInGmail = () => {
        const selected = contacts.filter(c => selectedContacts.includes(c.id));
        if (selected.length === 0) return;

        const emails = selected.map(c => c.email).filter(Boolean);
        if (emails.length > 0) {
            const bcc = emails.join(',');
            const gmailUrl = new URL("https://mail.google.com/mail/");
            gmailUrl.searchParams.append('view', 'cm');
            gmailUrl.searchParams.append('fs', '1');
            gmailUrl.searchParams.append('bcc', bcc);
            gmailUrl.searchParams.append('su', 'Business Inquiry'); // Generic subject
            // No body to allow user to write from scratch
            window.open(gmailUrl.toString(), '_blank');
        } else {
            alert("No selected contacts have an email address.");
        }
    };

    const sendViaDefaultClient = () => {
        const selected = contacts.filter(c => selectedContacts.includes(c.id));
        if (selected.length === 0 || !generatedMessage) return;

        const emails = selected.map(c => c.email).filter(Boolean);
        if (emails.length > 0) {
            const bcc = emails.join(',');
            const body = attachment 
                ? `${generatedMessage}\n\n[Reminder: Please attach the file '${attachment.name}' before sending.]`
                : generatedMessage;
            const mailtoLink = `mailto:?bcc=${bcc}&subject=${encodeURIComponent(`Inquiry regarding ${form.product}`)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        } else {
            alert("No selected contacts have an email address.");
        }
    };
    
    const sendViaGmail = () => {
        const selected = contacts.filter(c => selectedContacts.includes(c.id));
        if (selected.length === 0 || !generatedMessage) return;

        const emails = selected.map(c => c.email).filter(Boolean);
        if (emails.length > 0) {
            const bcc = emails.join(',');
            const body = attachment 
                ? `${generatedMessage}\n\n[Reminder: Please attach the file '${attachment.name}' before sending.]`
                : generatedMessage;
            
            const gmailUrl = new URL("https://mail.google.com/mail/");
            gmailUrl.searchParams.append('view', 'cm');
            gmailUrl.searchParams.append('fs', '1');
            gmailUrl.searchParams.append('bcc', bcc);
            gmailUrl.searchParams.append('su', `Inquiry regarding ${form.product}`);
            gmailUrl.searchParams.append('body', body);
            
            window.open(gmailUrl.toString(), '_blank');
        } else {
            alert("No selected contacts have an email address.");
        }
    };


    const sendMessage = () => {
        if (form.channel === 'Email') {
            sendViaDefaultClient();
        } else if (form.channel === 'WhatsApp') {
            const selected = contacts.filter(c => selectedContacts.includes(c.id));
            const phones = selected.map(c => c.phone).filter(Boolean);
            if (phones.length > 0) {
                const firstPhone = phones[0].replace(/[^0-9]/g, '');
                const whatsappLink = `https://wa.me/${firstPhone}?text=${encodeURIComponent(generatedMessage)}`;
                window.open(whatsappLink, '_blank');
                
                if (phones.length > 1) {
                    navigator.clipboard.writeText(generatedMessage);
                    alert(`WhatsApp opened for the first contact. Your message has been copied to the clipboard to easily paste it for the other ${phones.length - 1} contacts.`);
                }

            } else {
                alert("No selected contacts have a phone number.");
            }
        }
    };

    const getRecipientList = () => {
        const selected = contacts.filter(c => selectedContacts.includes(c.id));
        if (form.channel === 'Email') {
            return selected.map(c => c.email).filter(Boolean).join(', ');
        }
        return selected.map(c => c.phone).filter(Boolean).join(', ');
    };

    return (
        <div>
            <header className="mb-6">
                <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                  <BackArrowIcon />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold text-text-primary">{t('campaignManager')}</h1>
                <p className="text-md text-text-secondary">{t('campaignManagerSubheading')}</p>
            </header>

            <div className="flex border-b border-accent mb-6">
                <button onClick={() => setActiveTab('lists')} className={`px-4 py-2 font-semibold ${activeTab === 'lists' ? 'border-b-2 border-brand text-brand' : 'text-text-secondary'}`}>
                    Contact Lists ({selectedContacts.length} selected)
                </button>
                <button onClick={() => setActiveTab('generator')} className={`px-4 py-2 font-semibold ${activeTab === 'generator' ? 'border-b-2 border-brand text-brand' : 'text-text-secondary'}`}>
                    Message Generator
                </button>
            </div>

            {activeTab === 'lists' && (
                <div className="bg-primary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Your Contact List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-accent">
                                    <th className="p-2 w-10">
                                        <input 
                                            type="checkbox" 
                                            className="h-4 w-4 rounded bg-accent border-highlight text-brand focus:ring-brand"
                                            onChange={handleSelectAll}
                                            checked={contacts.length > 0 && selectedContacts.length === contacts.length}
                                        />
                                    </th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Company Name</th>
                                    <th className="p-2">Product Interest</th>
                                    <th className="p-2">Contact Person</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Phone</th>
                                    <th className="p-2">Country</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(contact => {
                                    const typeColor = contact.type === 'Buyer' ? 'bg-blue-500/20 text-blue-300' : contact.type === 'Supplier' ? 'bg-green-500/20 text-green-300' : 'bg-purple-500/20 text-purple-300';
                                    return (
                                        <tr key={contact.id} className={`border-b border-accent/50 hover:bg-accent/20 ${selectedContacts.includes(contact.id) ? 'bg-brand/20' : ''}`}>
                                            <td className="p-2">
                                                <input 
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded bg-accent border-highlight text-brand focus:ring-brand"
                                                    checked={selectedContacts.includes(contact.id)}
                                                    onChange={() => handleSelectContact(contact.id)}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColor}`}>{contact.type}</span>
                                            </td>
                                            <td className="p-2">{contact.companyName}</td>
                                            <td className="p-2 text-highlight">{contact.product || 'N/A'}</td>
                                            <td className="p-2">{contact.contactPerson}</td>
                                            <td className="p-2 text-brand">{contact.email || 'N/A'}</td>
                                            <td className="p-2 text-text-secondary">{contact.phone || 'N/A'}</td>
                                            <td className="p-2">{contact.country}</td>
                                            <td className="p-2">
                                                <button onClick={() => removeContact(contact.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Remove</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                     {contacts.length === 0 && <p className="text-center text-text-secondary mt-4">Your contact list is empty. Use the Finder tools to discover and add new leads.</p>}
                     {selectedContacts.length > 0 && (
                        <div className="sticky bottom-4 w-full flex justify-center items-center z-20 mt-4">
                            <div className="bg-secondary p-3 rounded-lg shadow-2xl flex items-center gap-4 border border-brand animate-fadeInUp">
                                <p className="text-text-primary font-semibold">{selectedContacts.length} contact(s) selected.</p>
                                <button
                                    onClick={handleComposeInGmail}
                                    className="flex items-center justify-center gap-2 bg-red-600 text-primary font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition"
                                    title="Compose a new email in Gmail for selected contacts"
                                >
                                    <GmailIcon /> Compose in Gmail
                                </button>
                                <button
                                    onClick={() => setActiveTab('generator')}
                                    className="bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition"
                                    title="Go to the message generator to create a template"
                                >
                                    Use Message Generator
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'generator' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-primary p-6 rounded-lg shadow-lg space-y-4">
                        <h2 className="text-xl font-semibold text-text-primary">Generate Message</h2>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary">Product</label>
                            <input name="product" value={form.product} onChange={handleFormChange} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary">Tone</label>
                            <select name="tone" value={form.tone} onChange={handleFormChange} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm">
                                <option>Professional</option>
                                <option>Friendly</option>
                                <option>Direct</option>
                                <option>Formal</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary">Channel</label>
                            <select name="channel" value={form.channel} onChange={handleFormChange} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm">
                                <option>Email</option>
                                <option>WhatsApp</option>
                            </select>
                        </div>
                        {form.channel === 'Email' && (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Attachment</label>
                                <div className="mt-1 flex items-center">
                                    <label htmlFor="file-attachment" className="cursor-pointer bg-highlight text-text-primary text-sm font-semibold py-2 px-4 rounded-lg hover:bg-brand hover:text-primary transition">
                                        Attach File
                                    </label>
                                    <input id="file-attachment" type="file" className="sr-only" onChange={handleFileChange} />
                                    {attachment && (
                                        <div className="ml-3 text-sm text-text-secondary flex items-center gap-2">
                                            <span className="truncate max-w-xs">{attachment.name}</span>
                                            <button onClick={removeAttachment} className="text-red-400 hover:text-red-600 font-bold">&times;</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                         <div className="pt-2 space-y-2">
                             <button onClick={generateMessage} disabled={isLoading} className="w-full bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition disabled:bg-gray-500">
                               {isLoading ? <LoadingSpinner/> : 'Generate Message'}
                            </button>
                             {form.channel === 'Email' ? (
                                <div className="flex gap-2">
                                    <button onClick={sendMessage} disabled={isLoading || selectedContacts.length === 0 || !generatedMessage} className="w-full bg-green-600 text-primary font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                                        Send (Default)
                                    </button>
                                    <button onClick={sendViaGmail} disabled={isLoading || selectedContacts.length === 0 || !generatedMessage} className="flex items-center justify-center gap-2 w-full bg-red-600 text-primary font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                                        <GmailIcon /> Send via Gmail
                                    </button>
                                </div>
                             ) : (
                                <button onClick={sendMessage} disabled={isLoading || selectedContacts.length === 0 || !generatedMessage} className="w-full bg-green-600 text-primary font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                                    Send Message
                                </button>
                             )}
                         </div>
                    </div>

                    <div className="bg-primary p-6 rounded-lg shadow-lg">
                         <div className="bg-secondary p-4 rounded-md mb-4">
                            <h3 className="text-lg font-semibold text-text-primary">Recipients ({selectedContacts.length}) for {form.channel}</h3>
                            {selectedContacts.length > 0 ? (
                                <p className="text-sm text-text-secondary break-words">{getRecipientList()}</p>
                            ) : (
                                <p className="text-sm text-text-secondary">Select contacts from the 'Contact Lists' tab.</p>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold mb-4 text-text-primary">Message for {form.channel}</h2>
                        {isLoading && <LoadingSpinner />}
                        <textarea
                            className="w-full h-64 bg-secondary p-4 rounded-md text-text-secondary font-sans whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-brand"
                            value={generatedMessage}
                            onChange={(e) => setGeneratedMessage(e.target.value)}
                            placeholder="Your generated and editable message will appear here..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignManager;
