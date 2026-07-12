
import React from 'react';

export const studyGuideData = [
    {
        title: "1️⃣ Clear 12-Month Financial Goal",
        content: (
            <>
                <p>The first step is setting a clear, measurable financial target. This gives you a destination to work towards.</p>
                <p className="font-bold mt-2">Example Goal: ₹1 Crore in 12 months.</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>This breaks down to a monthly profit target of ₹8,33,333 (₹1 Crore / 12).</li>
                    <li>To achieve this, you must calculate the required monthly sales (billing) based on your profit margin.</li>
                </ul>
                <div className="mt-4 p-3 bg-primary rounded-md">
                    <p className="font-mono text-brand">Required Billing = Target Profit ÷ Profit %</p>
                    <p className="mt-2">If your average profit margin is 10%, you need billing of ₹83,33,330 per month.</p>
                    <p>If your margin is 20%, you need billing of ₹41,66,665 per month.</p>
                </div>
            </>
        )
    },
    {
        title: "2️⃣ Never Depend on One Product",
        content: (
            <>
                <p>Diversification is key to building a resilient export business. Relying on a single product exposes you to significant risks.</p>
                <p className="font-bold mt-2">Why you should diversify:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong className="text-text-primary">Policy Changes:</strong> Governments can change export/import policies unexpectedly.</li>
                    <li><strong className="text-text-primary">Buyer Changes:</strong> Your main buyer could switch suppliers or go out of business.</li>
                    <li><strong className="text-text-primary">Country Regulations:</strong> A target country might introduce new regulations or trade barriers.</li>
                    <li><strong className="text-text-primary">Demand Fluctuation:</strong> Market demand for a product can change seasonally or due to trends.</li>
                </ul>
                <p className="mt-4"><strong className="text-brand">✅ Actionable Strategy:</strong> Always work with a portfolio of 3-5 products and focus on those that have high potential for repeat orders.</p>
            </>
        )
    },
    {
        title: "3️⃣ Product Selection Framework",
        content: (
            <>
                <p>Choose your products based on data, not emotion. A solid framework involves checking three key areas:</p>
                <ul className="list-decimal list-inside mt-2 space-y-2">
                    <li><strong className="text-text-primary">Turnover:</strong> Is the product already being exported successfully? Is there stable demand and available import data?</li>
                    <li><strong className="text-text-primary">Data Analysis:</strong> Use tools like Volza or Trade Map to analyze import data. Look for repeated buyers, identify which countries are importing the most, and see who the current suppliers are.</li>
                    <li><strong className="text-text-primary">Geography Expansion:</strong> Research which countries are buying the product. Is the demand seasonal or year-round? This helps in planning your market entry strategy.</li>
                </ul>
            </>
        )
    },
    {
        title: "4️⃣ Profitability Check Formula",
        content: (
            <>
                <p>Before committing to any shipment, you must know your exact profit. The core formula is simple:</p>
                <div className="my-4 p-3 bg-primary rounded-md text-center">
                    <p className="font-mono text-brand text-lg">Net Profit = Selling Price – Total Cost</p>
                </div>
                <p>To get here, follow these steps:</p>
                <ul className="list-decimal list-inside mt-2 space-y-2">
                    <li><strong className="text-text-primary">Gather Sales Data:</strong> Research the import price (FOB) buyers are paying in your target market and the typical volumes.</li>
                    <li><strong className="text-text-primary">Determine Purchase Price:</strong> Contact at least 50 manufacturers to get quotations. Shortlist the best 5 and negotiate for the best price. Do NOT sign any agreements yet.</li>
                    <li><strong className="text-text-primary">Add All Costs:</strong> Meticulously account for every expense, including Freight, Duties, Documentation, Bank Charges, Courier (for samples), and Commissions.</li>
                </ul>
            </>
        )
    },
    {
        title: "5️⃣ Government & Registration Foundation",
        content: (
            <>
                <p>To operate legally as an exporter in India, there are two mandatory registrations you must complete.</p>
                <ul className="list-disc list-inside mt-2 space-y-2">
                    <li>
                        <strong className="text-text-primary">IEC (Import Export Code):</strong> This is a unique 10-digit code issued by the DGFT (Directorate General of Foreign Trade). It's mandatory for any entity undertaking import or export activities. You need to understand the charges, process, and eligibility criteria.
                    </li>
                    <li>
                        <strong className="text-text-primary">EPC (Export Promotion Council):</strong> Joining the relevant EPC for your product category is crucial. EPCs provide benefits like market insights, networking events, and assistance in connecting with international buyers.
                    </li>
                </ul>
            </>
        )
    },
    {
        title: "6️⃣ Bank Setup",
        content: (
            <>
                <p>Your choice of bank can significantly impact your profitability and ease of operations. Don't just go with your existing bank; shop around.</p>
                <p className="mt-2"><strong className="text-brand">✅ Actionable Strategy:</strong> Visit a minimum of 5 different banks and ask them about the following:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Forex (Foreign Exchange) charges</li>
                    <li>Interest rate on export credit (like Export Packing Credit)</li>
                    <li>Minimum balance requirements for a current account</li>
                    <li>SWIFT charges for international transfers</li>
                </ul>
                <p className="mt-2">Choose a bank that is known to be export-friendly and has a dedicated trade finance department.</p>
            </>
        )
    },
    {
        title: "7️⃣ Freight Forwarder Selection",
        content: (
            <>
                 <p>Your freight forwarder is a critical partner who handles the logistics of your shipment. Build a relationship before you have a shipment ready.</p>
                <p className="mt-2"><strong className="text-brand">✅ Actionable Strategy:</strong> Contact at least 5 freight forwarders and ask:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Do they have experience handling your specific product?</li>
                    <li>How much support do they provide with documentation?</li>
                    <li>What is their network coverage in your target city/country?</li>
                    <li>What are their rates? (Get detailed quotes)</li>
                    <li>Do they offer door-to-door service?</li>
                </ul>
            </>
        )
    },
    {
        title: "8️⃣ International Courier (For Samples)",
        content: (
            <>
                <p>Sending samples is a crucial step in securing an order. The cost and reliability of your courier service matter.</p>
                <p className="mt-2"><strong className="text-brand">✅ Actionable Strategy:</strong> Compare rates and services from at least 5 couriers:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>DHL</li>
                    <li>FedEx</li>
                    <li>UPS</li>
                    <li>Aramex</li>
                    <li>Reputable local couriers with international tie-ups</li>
                </ul>
                <p className="mt-2">Check their rate per kg, typical delivery times to your target countries, and if they help with sample documentation.</p>
            </>
        )
    },
    {
        title: "9️⃣ Buyer Finding System",
        content: (
            <>
                 <p>Finding genuine buyers is the engine of your export business. Use a multi-pronged approach.</p>
                <p className="font-bold mt-2">Methods for finding buyers:</p>
                <ul className="list-decimal list-inside mt-2 space-y-2">
                    <li><strong className="text-text-primary">Indian Embassy:</strong> Email the commercial wing of the Indian Embassy in your target country. Share your product details and ask for a database of relevant importers.</li>
                    <li><strong className="text-text-primary">Organic Search:</strong> Use Google with specific search terms like "Importer of [Product] in [Country]". Explore online yellow pages, trade directories, and lists of exhibitors from past trade fairs.</li>
                    <li><strong className="text-text-primary">Data Tools:</strong> Use paid services like Volza, Import Genius, or Trade Map to get actual shipment data, which reveals who is importing your product, from where, and in what quantity.</li>
                </ul>
                <div className="mt-4 p-3 bg-primary rounded-md">
                    <p className="font-bold text-brand">Goal: Build a master list of at least 50 potential buyers per product, then focus your efforts on converting the 5 most serious prospects.</p>
                </div>
            </>
        )
    },
    {
        title: "🔟 Procurement Flow Chart",
        content: (
             <>
                <p>Finding reliable suppliers is just as important as finding buyers. Follow a structured process to vet and select the right manufacturing partners.</p>
                <p className="font-bold mt-2">The Ideal Procurement Flow:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Organic search & import data research to identify potential suppliers.</li>
                    <li>Search supplier associations and directories.</li>
                    <li>Visit trade fairs to meet manufacturers in person.</li>
                    <li>Conduct direct factory visits for shortlisted suppliers.</li>
                    <li>Collect samples for quality evaluation.</li>
                    <li>Negotiate price, payment terms, and delivery schedules.</li>
                    <li>Sign a clear and detailed agreement.</li>
                    <li>Place the order and manage the shipment.</li>
                </ol>
            </>
        )
    },
     {
        title: "1️⃣1️⃣ Product Categories for Beginners",
        content: (
            <>
                <p>When starting, it's wise to choose products with lower risk and complexity.</p>
                <p className="font-bold mt-2">Start with products that are:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Non-perishable (long shelf life)</li>
                    <li>Have high repeat order potential</li>
                    <li>In high demand globally</li>
                    <li>Have low compliance and regulatory hurdles</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-green-900/50 rounded-md">
                        <p className="font-bold text-green-300">✅ Best Beginner Categories:</p>
                        <ul className="list-disc list-inside text-green-300">
                            <li>Spices (e.g., Turmeric, Cumin)</li>
                            <li>Rice (especially Basmati)</li>
                            <li>Pulses (Lentils, Chickpeas)</li>
                            <li>Dehydrated Products (Onion Powder)</li>
                            <li>Papad</li>
                        </ul>
                    </div>
                    <div className="p-3 bg-red-900/50 rounded-md">
                        <p className="font-bold text-red-300">⚠️ Avoid Initially:</p>
                         <ul className="list-disc list-inside text-red-300">
                            <li>Pharmaceuticals</li>
                            <li>Cosmetics</li>
                            <li>Fertilizer</li>
                            <li>Seafood (high risk of spoilage)</li>
                        </ul>
                    </div>
                </div>
            </>
        )
    },
     {
        title: "1️⃣2️⃣ Passive Income in Export",
        content: (
             <>
                <p>True "passive" income in exporting is a myth, but you can build a "semi-passive" system through repeat orders. This is the ultimate goal.</p>
                <p className="font-bold mt-2">How to achieve repeat orders:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Choose a product with regular, high consumption (like spices, rice).</li>
                    <li>Build strong relationships with at least 5 regular, reliable buyers.</li>
                    <li>Establish monthly supply contracts to ensure predictable order flow.</li>
                    <li>Maintain stable pricing and consistent quality.</li>
                </ul>
                <p className="mt-2">An export business becomes semi-passive when your systems are well-established: fixed suppliers, fixed freight forwarders, and smooth documentation processes.</p>
            </>
        )
    },
     {
        title: "1️⃣3️⃣ 3 Business Models in Export",
        content: (
            <>
                <p>There are several ways to structure your export business. The best one to start with is clear.</p>
                <ul className="list-disc list-inside mt-2 space-y-2">
                    <li><strong className="text-text-primary">Manufacturer Exporter:</strong> You manufacture the goods yourself and export them. High control, but also high investment and risk.</li>
                    <li><strong className="text-text-primary">Merchant Exporter:</strong> You source goods from manufacturers and export them under your own company. This is the recommended model for beginners.</li>
                    <li><strong className="text-text-primary">Joint Venture:</strong> Partnering with another company, often an international one, to share resources and risks.</li>
                </ul>
                 <div className="mt-4 p-3 bg-primary rounded-md">
                    <p className="font-bold text-brand">Best for Beginners: Merchant Exporter</p>
                    <p>It offers low risk, requires low initial investment, and is highly scalable.</p>
                </div>
            </>
        )
    },
     {
        title: "1️⃣4️⃣ Final Foundation Rule",
        content: (
            <>
                <p>This is the most important rule to remember throughout your export journey. It governs all successful export businesses.</p>
                <div className="my-4 p-4 bg-primary rounded-lg text-center">
                    <p className="font-bold text-2xl text-brand tracking-wider">Data Before Decision</p>
                </div>
                <p>This means:</p>
                 <ul className="list-disc list-inside mt-2 space-y-2">
                    <li>Analyze data from 50 suppliers before shortlisting 5.</li>
                    <li>Build a list of 50 buyers before focusing on 5 serious ones.</li>
                    <li>Never make decisions based on emotion, hope, or gut feelings.</li>
                    <li><strong className="text-red-400">Always calculate your exact profit before a shipment is dispatched.</strong> If the numbers don't work, don't ship.</li>
                </ul>
            </>
        )
    },
];
