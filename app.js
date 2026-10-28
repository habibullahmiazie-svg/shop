"use strict";
const { useState, useEffect, createContext, useContext } = React;
// ===== data.js =====
// দোকানের ডেমো ডেটা। পরে এখানে আসল পণ্য বা সার্ভারের ডেটা বসবে।
const CURRENCY = '৳';
const categories = [
    { id: 'components', icon: '🖥️', tint: '#dfece4' },
    { id: 'keyboard', icon: '⌨️', tint: '#e3ebf4' },
    { id: 'mouse', icon: '🖱️', tint: '#f3ead4' },
    { id: 'headphones', icon: '🎧', tint: '#efe4ee' },
    { id: 'bluetooth', icon: '📶', tint: '#dff0f0' },
    { id: 'speakers', icon: '🔊', tint: '#f4e5df' },
    { id: 'ssd', icon: '💾', tint: '#e4eadb' },
    { id: 'ram', icon: '🧩', tint: '#e9e6f4' },
    { id: 'others', icon: '🔌', tint: '#ebece8' },
];
const tintOf = (id) => categories.find((c) => c.id === id).tint;
// price = বর্তমান দাম, old = আগের দাম (ছাড় থাকলে), badge = hot | new | top
const products = [
    { id: 1, name: 'Logitech MX Master 3S Wireless Mouse', cat: 'mouse', price: 11500, old: 12900, rating: 4.9, reviews: 214, badge: 'hot', icon: '🖱️' },
    { id: 2, name: 'Keychron K2 Wireless Mechanical Keyboard', cat: 'keyboard', price: 9800, rating: 4.8, reviews: 128, badge: 'new', icon: '⌨️' },
    { id: 3, name: 'Sony WH-1000XM5 Noise Cancelling Headphones', cat: 'headphones', price: 38500, old: 42000, rating: 4.9, reviews: 96, badge: 'top', icon: '🎧' },
    { id: 4, name: 'Samsung 990 EVO 1TB NVMe SSD', cat: 'ssd', price: 11200, old: 12500, rating: 4.8, reviews: 305, icon: '💾' },
    { id: 5, name: 'Corsair Vengeance 32GB (2x16) DDR5 RAM', cat: 'ram', price: 15900, rating: 4.7, reviews: 87, badge: 'hot', icon: '🧩' },
    { id: 6, name: 'JBL Flip 6 Portable Bluetooth Speaker', cat: 'speakers', price: 12500, old: 14000, rating: 4.7, reviews: 172, icon: '🔊' },
    { id: 7, name: 'ASUS Prime B760M-A Motherboard', cat: 'components', price: 17500, rating: 4.6, reviews: 64, icon: '🖥️' },
    { id: 8, name: 'TP-Link UB500 Bluetooth 5.3 USB Adapter', cat: 'bluetooth', price: 850, old: 1100, rating: 4.5, reviews: 241, badge: 'new', icon: '📶' },
].map((p) => ({ ...p, tint: tintOf(p.cat) }));
// ===== i18n.jsx =====
// বাংলা ও ইংরেজি লেখা — নতুন লেখা যোগ করলে দুই ভাষাতেই যোগ করবেন
const dict = {
    bn: {
        brand: 'টেকনেস্ট', search: 'পণ্য খুঁজুন', cart: 'কার্ট', home: 'হোম', categories: 'ক্যাটাগরি', profile: 'প্রোফাইল',
        hero_title: 'পিসির সব দরকারি জিনিস, এক দোকানেই',
        hero_sub: 'র\u200d্যাম, এসএসডি, কিবোর্ড, মাউস, হেডফোন — সবই অরিজিনাল, ওয়ারেন্টিসহ।',
        mode_pickup: 'দোকান থেকে নেব', mode_delivery: 'বাসায় নেব',
        mode_pickup_d: 'অর্ডার করুন, তৈরি হলে দোকান থেকে নিয়ে যান।',
        mode_delivery_d: 'আপনার ঠিকানায় পৌঁছে দেব। ৫,০০০ টাকার ওপরে ডেলিভারি ফ্রি।',
        shop_now: 'পণ্য দেখুন', featured: 'জনপ্রিয় পণ্য', see_all: 'সব দেখুন', add: 'কার্টে দিন', added: 'যোগ হয়েছে',
        badge_hot: 'বেশি বিক্রি', badge_new: 'নতুন', badge_top: 'সেরা রেটিং',
        c_components: 'পিসি কম্পোনেন্ট', c_keyboard: 'কিবোর্ড', c_mouse: 'মাউস', c_headphones: 'হেডফোন',
        c_bluetooth: 'ব্লুটুথ ডিভাইস', c_speakers: 'স্পিকার', c_ssd: 'এসএসডি', c_ram: 'র\u200d্যাম', c_others: 'অন্যান্য',
        sv_pickup_t: 'দোকান থেকে সংগ্রহ', sv_pickup_d: 'অর্ডার করে নিজে এসে নিয়ে যান।',
        sv_delivery_t: 'হোম ডেলিভারি', sv_delivery_d: 'নিরাপদ প্যাকেজিংয়ে আপনার দরজায়।',
        sv_warranty_t: 'ওয়ারেন্টি', sv_warranty_d: 'প্রতিটি পণ্যে অরিজিনাল ওয়ারেন্টি।',
        sv_support_t: 'বাছাইয়ে সাহায্য', sv_support_d: 'কোনটা আপনার পিসির সাথে মানাবে, জিজ্ঞেস করুন।',
        footer: 'সর্বস্বত্ব সংরক্ষিত।',
    },
    en: {
        brand: 'TechNest', search: 'Search products', cart: 'Cart', home: 'Home', categories: 'Categories', profile: 'Profile',
        hero_title: 'Everything your PC needs, under one roof',
        hero_sub: 'RAM, SSDs, keyboards, mice, headphones — all genuine, all with warranty.',
        mode_pickup: 'Pick up in store', mode_delivery: 'Deliver to me',
        mode_pickup_d: 'Place your order and collect it from our shop when it is ready.',
        mode_delivery_d: 'We bring it to your address. Free delivery over ৳5,000.',
        shop_now: 'Shop products', featured: 'Popular products', see_all: 'See all', add: 'Add to cart', added: 'Added',
        badge_hot: 'Best seller', badge_new: 'New', badge_top: 'Top rated',
        c_components: 'PC Components', c_keyboard: 'Keyboards', c_mouse: 'Mouse', c_headphones: 'Headphones',
        c_bluetooth: 'Bluetooth Devices', c_speakers: 'Speakers', c_ssd: 'SSD', c_ram: 'RAM', c_others: 'Others',
        sv_pickup_t: 'Store pickup', sv_pickup_d: 'Order online, collect in person.',
        sv_delivery_t: 'Home delivery', sv_delivery_d: 'Safely packed, at your door.',
        sv_warranty_t: 'Warranty', sv_warranty_d: 'Genuine warranty on every product.',
        sv_support_t: 'Help choosing', sv_support_d: 'Ask what fits your PC.',
        footer: 'All rights reserved.',
    },
};
const Ctx = createContext(null);
const useLang = () => useContext(Ctx);
function LangProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'bn');
    useEffect(() => {
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);
    const t = (key) => { var _a; return (_a = dict[lang][key]) !== null && _a !== void 0 ? _a : key; }; // লেখা অনুবাদ করে
    const num = (n) => new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US').format(n); // বাংলা অঙ্ক
    return React.createElement(Ctx.Provider, { value: { lang, setLang, t, num } }, children);
}
// ===== components/Header.jsx =====
function CartBadge({ n }) {
    const { num } = useLang();
    if (!n)
        return null;
    // key বদলালে অ্যানিমেশন আবার চলে
    return (React.createElement("span", { key: n, className: "absolute -right-1.5 -top-1.5 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-pcb" }, num(n)));
}
function Header({ cart }) {
    const { lang, setLang, t } = useLang();
    return (React.createElement("header", { className: "sticky top-0 z-40 border-b border-mist bg-board/85 backdrop-blur" },
        React.createElement("div", { className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3" },
            React.createElement("a", { href: "#", className: "flex shrink-0 items-center gap-2 text-lg font-bold" },
                React.createElement("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-pcb font-extrabold text-gold" }, "T"),
                React.createElement("span", { className: "hidden sm:inline" }, t('brand'))),
            React.createElement("input", { type: "search", placeholder: t('search'), "aria-label": t('search'), className: "min-w-0 flex-1 rounded-md border border-mist bg-white px-4 py-2 text-sm placeholder:text-ink/50 focus:border-pcb-2" }),
            React.createElement("button", { onClick: () => setLang(lang === 'bn' ? 'en' : 'bn'), className: "shrink-0 rounded-md border border-mist bg-white px-3 py-2 text-sm font-semibold hover:border-pcb-2" }, lang === 'bn' ? 'English' : 'বাংলা'),
            React.createElement("a", { href: "#", className: "relative hidden shrink-0 rounded-md bg-pcb px-3 py-2 text-sm font-semibold text-white md:block" },
                "\uD83D\uDED2 ",
                t('cart'),
                React.createElement(CartBadge, { n: cart })))));
}
// মোবাইলে নিচের নেভিগেশন বার
function BottomNav({ cart }) {
    const { t } = useLang();
    const items = [['🏠', 'home'], ['🗂️', 'categories'], ['🛒', 'cart'], ['👤', 'profile']];
    return (React.createElement("nav", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" },
        React.createElement("ul", { className: "grid grid-cols-4" }, items.map(([icon, key]) => (React.createElement("li", { key: key },
            React.createElement("a", { href: "#", className: "relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium" },
                React.createElement("span", { className: "relative text-xl" },
                    icon,
                    key === 'cart' && React.createElement(CartBadge, { n: cart })),
                t(key))))))));
}
// ===== components/Hero.jsx =====
function Hero() {
    const { t } = useLang();
    const [mode, setMode] = useState('pickup'); // pickup = দোকান থেকে, delivery = বাসায়
    const delay = (ms) => ({ animationDelay: `${ms}ms` });
    return (React.createElement("section", { className: "pcb-grid text-white" },
        React.createElement("div", { className: "mx-auto max-w-6xl px-4 py-14 md:py-24" },
            React.createElement("h1", { className: "max-w-2xl animate-rise text-4xl font-extrabold leading-snug md:text-6xl" }, t('hero_title')),
            React.createElement("p", { className: "mt-4 max-w-lg animate-rise text-lg text-white/80", style: delay(120) }, t('hero_sub')),
            React.createElement("div", { className: "mt-8 max-w-md animate-rise", style: delay(240) },
                React.createElement("div", { role: "tablist", className: "grid grid-cols-2 rounded-md bg-black/25 p-1" }, ['pickup', 'delivery'].map((m) => (React.createElement("button", { key: m, role: "tab", "aria-selected": mode === m, onClick: () => setMode(m), className: `rounded px-3 py-2 text-sm font-semibold transition ${mode === m ? 'bg-gold text-pcb' : 'text-white/80 hover:text-white'}` },
                    m === 'pickup' ? '🏬 ' : '🚚 ',
                    t('mode_' + m))))),
                React.createElement("p", { className: "mt-3 min-h-12 text-sm text-white/75" }, t('mode_' + mode + '_d'))),
            React.createElement("a", { href: "#products", className: "mt-4 inline-block animate-rise rounded-md bg-gold px-6 py-3 font-bold text-pcb transition hover:brightness-110 active:scale-95", style: delay(360) }, t('shop_now')))));
}
// ===== components/Categories.jsx =====
function Categories() {
    const { t } = useLang();
    return (React.createElement("section", { id: "categories", className: "mx-auto max-w-6xl px-4 pt-10" },
        React.createElement("h2", { className: "text-2xl font-bold" }, t('categories')),
        React.createElement("ul", { className: "-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2" }, categories.map((c) => (React.createElement("li", { key: c.id, className: "snap-start" },
            React.createElement("a", { href: "#products", className: "flex w-24 flex-col items-center gap-2 rounded-lg border border-mist bg-white px-2 py-3 text-center text-xs font-medium transition hover:border-pcb-2 sm:w-28 sm:text-sm" },
                React.createElement("span", { className: "grid h-12 w-12 place-items-center rounded-md text-2xl", style: { background: c.tint } }, c.icon),
                t('c_' + c.id))))))));
}
// ===== components/ProductCard.jsx =====
function ProductCard({ p, onAdd }) {
    const { t, num } = useLang();
    const [done, setDone] = useState(false);
    const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    const add = () => {
        onAdd(p);
        setDone(true); // বোতামে ✓ দেখাবে
        setTimeout(() => setDone(false), 1200);
    };
    return (React.createElement("article", { className: "group flex flex-col overflow-hidden rounded-lg border border-mist bg-white transition hover:border-pcb-2" },
        React.createElement("div", { className: "relative grid aspect-square place-items-center", style: { background: p.tint } },
            React.createElement("span", { className: "text-6xl transition duration-300 group-hover:scale-110 sm:text-7xl" }, p.icon),
            p.badge && React.createElement("span", { className: "absolute left-2 top-2 rounded-sm bg-pcb px-2 py-0.5 text-xs font-semibold text-gold" }, t('badge_' + p.badge)),
            off > 0 && React.createElement("span", { className: "absolute right-2 top-2 rounded-sm bg-flag px-2 py-0.5 text-xs font-bold text-white" },
                "-",
                num(off),
                "%")),
        React.createElement("div", { className: "flex flex-1 flex-col p-3 sm:p-4" },
            React.createElement("p", { className: "text-xs text-ink/60" }, t('c_' + p.cat)),
            React.createElement("h3", { className: "mt-0.5 line-clamp-2 min-h-11 text-sm font-semibold leading-snug sm:text-base" }, p.name),
            React.createElement("p", { className: "mt-1 text-xs text-ink/70" },
                React.createElement("span", { className: "text-gold" }, "\u2605"),
                " ",
                num(p.rating),
                " (",
                num(p.reviews),
                ")"),
            React.createElement("div", { className: "mt-auto pt-3" },
                React.createElement("p", { className: "text-lg font-bold" },
                    CURRENCY,
                    num(p.price),
                    p.old && React.createElement("span", { className: "ml-1.5 text-xs font-normal text-ink/50 line-through" },
                        CURRENCY,
                        num(p.old))),
                React.createElement("button", { onClick: add, className: `mt-2 w-full rounded-md py-2 text-sm font-semibold text-white transition active:scale-95 ${done ? 'bg-pcb-2' : 'bg-pcb hover:bg-pcb-2'}` }, done ? '✓ ' + t('added') : t('add'))))));
}
// ===== components/Footer.jsx =====
function Footer() {
    const { t } = useLang();
    return (React.createElement("footer", { className: "bg-pcb py-8 text-center text-sm text-white/70" },
        React.createElement("p", { className: "font-bold text-gold" }, t('brand')),
        React.createElement("p", { className: "mt-1" }, t('footer'))));
}
// ===== pages/Home.jsx =====
const services = [['🏬', 'pickup'], ['🚚', 'delivery'], ['🛡️', 'warranty'], ['💬', 'support']];
function Home({ onAdd }) {
    const { t } = useLang();
    return (React.createElement(React.Fragment, null,
        React.createElement(Hero, null),
        React.createElement(Categories, null),
        React.createElement("section", { id: "products", className: "mx-auto max-w-6xl scroll-mt-20 px-4 pt-10" },
            React.createElement("div", { className: "flex items-baseline justify-between" },
                React.createElement("h2", { className: "text-2xl font-bold" }, t('featured')),
                React.createElement("a", { href: "#", className: "text-sm font-semibold text-pcb-2 hover:underline" }, t('see_all'))),
            React.createElement("div", { className: "mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" }, products.map((p) => (React.createElement(ProductCard, { key: p.id, p: p, onAdd: onAdd }))))),
        React.createElement("section", { className: "mt-14 border-t border-mist bg-white" },
            React.createElement("div", { className: "mx-auto grid max-w-6xl gap-px bg-mist sm:grid-cols-2 lg:grid-cols-4" }, services.map(([icon, k]) => (React.createElement("div", { key: k, className: "flex gap-3 bg-white p-5" },
                React.createElement("span", { className: "text-2xl" }, icon),
                React.createElement("div", null,
                    React.createElement("h3", { className: "font-semibold" }, t(`sv_${k}_t`)),
                    React.createElement("p", { className: "text-sm text-ink/70" }, t(`sv_${k}_d`))))))))));
}
// ===== App.jsx =====
function App() {
    const [cart, setCart] = useState(0); // কার্টে কয়টি পণ্য (পরের ধাপে সম্পূর্ণ কার্ট হবে)
    return (React.createElement(LangProvider, null,
        React.createElement("div", { className: "pb-16 md:pb-0" },
            React.createElement(Header, { cart: cart }),
            React.createElement("main", null,
                React.createElement(Home, { onAdd: () => setCart((c) => c + 1) })),
            React.createElement(Footer, null)),
        React.createElement(BottomNav, { cart: cart })));
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App))
