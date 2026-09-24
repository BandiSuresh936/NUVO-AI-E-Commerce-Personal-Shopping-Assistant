const { useState, useEffect, useRef, useMemo } = React;

/* ---------------- catalog ---------------- */
const PRODUCTS = [
  { id: 1, title: "AirWave Pro Earbuds", category: "Electronics", price: 3499, mrp: 4499, rating: 4.5, ratingCount: 812, tagline: "Active noise cancelling, 30h battery", desc: "True wireless earbuds with adaptive ANC, a 30-hour total battery life and a pocketable charging case. Tuned for clear calls and deep bass.", icon: "headphones", hue: 18 },
  { id: 2, title: "PulseFit Smart Band", category: "Electronics", price: 1899, mrp: 2399, rating: 4.2, ratingCount: 540, tagline: "Heart rate, sleep & 10-day battery", desc: "Track heart rate, sleep stages and 20+ workouts on a crisp AMOLED display that lasts up to 10 days on a single charge.", icon: "band", hue: 200 },
  { id: 3, title: "Orbit Mini Speaker", category: "Electronics", price: 1599, mrp: null, rating: 4.4, ratingCount: 301, tagline: "Pocket-sized, 12h playtime, IPX7", desc: "A palm-sized Bluetooth speaker with surprisingly big sound, IPX7 waterproofing and 12 hours of playtime for trips and showers alike.", icon: "speaker", hue: 260 },
  { id: 4, title: "SwiftCharge 65W GaN", category: "Electronics", price: 1299, mrp: 1699, rating: 4.6, ratingCount: 918, tagline: "Charges laptop & phone together", desc: "A compact GaN charger with two ports fast enough to top up a laptop and a phone at the same time, without the usual brick-sized bulk.", icon: "charger", hue: 30 },
  { id: 5, title: "Keystroke Mechanical Keyboard", category: "Electronics", price: 3299, mrp: null, rating: 4.7, ratingCount: 276, tagline: "Hot-swappable, tactile switches", desc: "A compact 75% mechanical keyboard with hot-swappable switches, per-key backlight and a machined aluminium frame for daily typing.", icon: "keyboard", hue: 210 },
  { id: 6, title: "Hushtone ANC Headphones", category: "Electronics", price: 5499, mrp: 6999, rating: 4.6, ratingCount: 455, tagline: "Studio comfort, 40h battery", desc: "Over-ear headphones with plush memory-foam cushions, adjustable noise cancelling and 40 hours of battery for long flights and workdays.", icon: "headband", hue: 250 },

  { id: 7, title: "Indigo Wash Denim Jacket", category: "Fashion", price: 2199, mrp: 2799, rating: 4.3, ratingCount: 189, tagline: "Classic fit, stonewashed cotton", desc: "A timeless denim jacket in a stonewashed indigo, cut for a relaxed classic fit that layers well over tees and shirts alike.", icon: "jacket", hue: 214 },
  { id: 8, title: "Oversized Cotton Tee", category: "Fashion", price: 799, mrp: 999, rating: 4.1, ratingCount: 402, tagline: "Heavyweight 220gsm cotton", desc: "A boxy, oversized tee in heavyweight 220gsm cotton that holds its shape wash after wash — a wardrobe staple in six colourways.", icon: "tee", hue: 350 },
  { id: 9, title: "Linen Summer Shirt", category: "Fashion", price: 1699, mrp: null, rating: 4.4, ratingCount: 233, tagline: "Breathable pure linen", desc: "Cut from pure linen for warm-weather breathability, with a relaxed collar and mother-of-pearl buttons for an easy, elevated look.", icon: "shirt", hue: 45 },
  { id: 10, title: "Tapered Fit Chinos", category: "Fashion", price: 1499, mrp: 1899, rating: 4.2, ratingCount: 310, tagline: "Stretch cotton, all-day comfort", desc: "A tapered chino in stretch cotton twill that moves with you — smart enough for the office, comfortable enough for everything else.", icon: "pants", hue: 95 },
  { id: 11, title: "Merino Blend Sweater", category: "Fashion", price: 2599, mrp: 3199, rating: 4.6, ratingCount: 168, tagline: "Soft merino wool blend", desc: "A crewneck sweater in a soft merino wool blend, fine-gauge knit for warmth without bulk under a jacket.", icon: "sweater", hue: 20 },
  { id: 12, title: "TrailRunner Sneakers", category: "Fashion", price: 2999, mrp: 3799, rating: 4.5, ratingCount: 526, tagline: "Lightweight cushioned sole", desc: "A lightweight running sneaker with a responsive cushioned sole and breathable knit upper, built for daily miles or daily errands.", icon: "shoe", hue: 355 },

  { id: 13, title: "Terra Ceramic Table Lamp", category: "Home & Living", price: 1899, mrp: null, rating: 4.5, ratingCount: 142, tagline: "Warm glow, handcrafted base", desc: "A handcrafted ceramic table lamp with a warm linen shade, casting a soft glow that suits a reading nook or bedside table.", icon: "lamp", hue: 28 },
  { id: 14, title: "Acacia Cutting Board Set", category: "Home & Living", price: 1299, mrp: 1599, rating: 4.6, ratingCount: 198, tagline: "3-piece solid acacia wood", desc: "A set of three solid acacia wood boards in graduated sizes, finished with food-safe oil and a built-in juice groove.", icon: "board", hue: 32 },
  { id: 15, title: "Amber Soy Candle", category: "Home & Living", price: 599, mrp: 799, rating: 4.4, ratingCount: 264, tagline: "45h burn, sandalwood & amber", desc: "A hand-poured soy candle in a reusable amber jar, scented with sandalwood and warm amber for a 45-hour clean burn.", icon: "candle", hue: 15 },
  { id: 16, title: "Cloudknit Throw Blanket", category: "Home & Living", price: 1499, mrp: null, rating: 4.7, ratingCount: 331, tagline: "Chunky knit, ultra soft", desc: "An oversized chunky-knit throw in brushed yarn, soft enough for movie nights and substantial enough to double as decor.", icon: "blanket", hue: 205 },
  { id: 17, title: "Stoneware Mug Set of 4", category: "Home & Living", price: 999, mrp: 1299, rating: 4.5, ratingCount: 176, tagline: "Reactive glaze, dishwasher safe", desc: "Four stoneware mugs finished in a reactive glaze so every piece is subtly one-of-a-kind, safe for dishwasher and microwave.", icon: "mug", hue: 170 },
  { id: 18, title: "Woven Seagrass Basket", category: "Home & Living", price: 1099, mrp: null, rating: 4.3, ratingCount: 121, tagline: "Handwoven storage, two sizes", desc: "A handwoven seagrass basket that tidies blankets, toys or plants — sturdy enough for daily use, good-looking enough to leave out.", icon: "basket", hue: 40 },

  { id: 19, title: "Heritage Leather Wallet", category: "Accessories", price: 1199, mrp: 1499, rating: 4.6, ratingCount: 289, tagline: "Full-grain leather, slim fit", desc: "A slim bifold wallet in full-grain leather that develops a rich patina with age, with six card slots and a hidden note pocket.", icon: "wallet", hue: 25 },
  { id: 20, title: "Meridian Minimalist Watch", category: "Accessories", price: 3999, mrp: 4999, rating: 4.7, ratingCount: 402, tagline: "Sapphire glass, 5ATM", desc: "A minimalist watch with a sapphire-coated face, stainless mesh strap and 5ATM water resistance for everyday wear.", icon: "watch", hue: 45 },
  { id: 21, title: "Horizon Aviator Sunglasses", category: "Accessories", price: 1399, mrp: null, rating: 4.4, ratingCount: 233, tagline: "Polarized, UV400 protection", desc: "Classic aviator sunglasses with polarized, UV400-rated lenses set in a lightweight metal frame that suits most face shapes.", icon: "sunglasses", hue: 205 },
  { id: 22, title: "Canvas Weekender Tote", category: "Accessories", price: 1099, mrp: 1399, rating: 4.5, ratingCount: 197, tagline: "Heavy canvas, leather trim", desc: "A roomy canvas tote with leather trim and reinforced handles, equally at home at the market or carrying a laptop to work.", icon: "tote", hue: 100 },
  { id: 23, title: "Luna Silver Hoop Earrings", category: "Accessories", price: 899, mrp: 1099, rating: 4.6, ratingCount: 164, tagline: "925 sterling silver", desc: "Lightweight hoops in 925 sterling silver with a hammered texture that catches the light — an easy everyday upgrade.", icon: "earring", hue: 220 },
  { id: 24, title: "Woven Leather Belt", category: "Accessories", price: 999, mrp: null, rating: 4.3, ratingCount: 112, tagline: "Hand-woven, brass buckle", desc: "A hand-woven leather belt with a solid brass buckle, flexible enough for daily wear and built to outlast the trend cycle.", icon: "belt", hue: 30 },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Living", "Accessories"];
const BRAND = "NUVO";
const ASSISTANT_NAME = "Nova";

function formatINR(n) {
  return "\u20B9" + Number(n).toLocaleString("en-IN");
}

/* ---------------- icons ---------------- */
const ICONS = {
  headphones: (<React.Fragment><path d="M8 26a16 16 0 0 1 32 0" /><rect x="5" y="26" width="8" height="12" rx="3" /><rect x="35" y="26" width="8" height="12" rx="3" /></React.Fragment>),
  band: (<React.Fragment><rect x="14" y="10" width="20" height="28" rx="6" /><rect x="19" y="16" width="10" height="16" rx="2" /><path d="M14 14H8M14 34H8M34 14h6M34 34h6" /></React.Fragment>),
  speaker: (<React.Fragment><rect x="10" y="8" width="28" height="32" rx="8" /><circle cx="24" cy="27" r="8" /><circle cx="24" cy="27" r="3" /><circle cx="30" cy="14" r="1.6" fill="currentColor" stroke="none" /></React.Fragment>),
  charger: (<React.Fragment><rect x="14" y="18" width="20" height="14" rx="3" /><path d="M20 18v-6M28 18v-6M24 32v8" /><path d="M18 38h12" /></React.Fragment>),
  keyboard: (<React.Fragment><rect x="6" y="16" width="36" height="20" rx="4" /><path d="M12 24h2M18 24h2M24 24h2M30 24h2M36 24h2M14 30h20" /></React.Fragment>),
  headband: (<React.Fragment><path d="M8 24a16 16 0 0 1 32 0" /><rect x="4" y="22" width="10" height="16" rx="5" /><rect x="34" y="22" width="10" height="16" rx="5" /></React.Fragment>),
  jacket: (<React.Fragment><path d="M18 8h12l3 5-6 4v23H21V17l-6-4z" /><path d="M18 8l-9 6 4 6 5-4" /><path d="M30 8l9 6-4 6-5-4" /></React.Fragment>),
  tee: (<React.Fragment><path d="M16 10l8-3 8 3 7 6-5 6-4-3v22H18V19l-4 3-5-6z" /></React.Fragment>),
  shirt: (<React.Fragment><path d="M14 10h8l2 4 2-4h8l6 6-4 5-4-3v20H16V18l-4 3-4-5z" /><path d="M24 14v8" /></React.Fragment>),
  pants: (<React.Fragment><path d="M14 8h20l1 12 3 20h-8l-2-18-2 18h-8l3-20z" /></React.Fragment>),
  sweater: (<React.Fragment><path d="M14 14l4-5h12l4 5 6 4-4 6-4-2v21H16V17l-4 2-4-6z" /><path d="M19 10a5 5 0 0 0 10 0" /></React.Fragment>),
  shoe: (<React.Fragment><path d="M6 32c0-4 3-6 7-7l9-4c2-1 4-1 6 0l10 5c3 1 5 3 5 6v3H6z" /><path d="M13 21v8M22 19v10M30 19v10" /></React.Fragment>),
  lamp: (<React.Fragment><path d="M24 6l10 14H14z" /><path d="M24 20v14" /><ellipse cx="24" cy="38" rx="9" ry="3" /></React.Fragment>),
  board: (<React.Fragment><rect x="8" y="10" width="32" height="26" rx="6" /><circle cx="34" cy="16" r="2" fill="currentColor" stroke="none" /></React.Fragment>),
  candle: (<React.Fragment><rect x="17" y="16" width="14" height="24" rx="3" /><path d="M24 16c-2-3-2-5 0-8 2 3 2 5 0 8z" /><path d="M21 22h6M21 28h6" /></React.Fragment>),
  blanket: (<React.Fragment><rect x="8" y="14" width="32" height="22" rx="4" /><path d="M8 20c4-3 8 3 12 0s8 3 12 0 8 3 8 0" /><path d="M8 27c4-3 8 3 12 0s8 3 12 0 8 3 8 0" /></React.Fragment>),
  mug: (<React.Fragment><rect x="10" y="14" width="20" height="22" rx="4" /><path d="M30 20h4a5 5 0 0 1 0 10h-4" /><path d="M15 8c0 2 2 2 2 4M22 8c0 2 2 2 2 4" /></React.Fragment>),
  basket: (<React.Fragment><path d="M10 20h28l-3 18H13z" /><path d="M10 20l4-8h20l4 8" /><path d="M16 24v10M24 24v10M32 24v10" /></React.Fragment>),
  wallet: (<React.Fragment><rect x="7" y="14" width="34" height="22" rx="4" /><path d="M7 22h34" /><rect x="28" y="24" width="9" height="7" rx="1.5" /></React.Fragment>),
  watch: (<React.Fragment><circle cx="24" cy="24" r="10" /><path d="M24 18v6l4 3" /><path d="M19 8h10l-2 6h-6zM19 40h10l-2-6h-6z" /></React.Fragment>),
  sunglasses: (<React.Fragment><circle cx="15" cy="24" r="8" /><circle cx="33" cy="24" r="8" /><path d="M23 22h2M7 20l-3-2M41 20l3-2" /></React.Fragment>),
  tote: (<React.Fragment><path d="M10 18h28l-2 22H12z" /><path d="M17 18v-4a7 7 0 0 1 14 0v4" /></React.Fragment>),
  earring: (<React.Fragment><circle cx="24" cy="20" r="10" /><path d="M24 30v8" /><circle cx="24" cy="41" r="2.4" fill="currentColor" stroke="none" /></React.Fragment>),
  belt: (<React.Fragment><rect x="6" y="20" width="36" height="8" rx="3" /><rect x="19" y="16" width="10" height="16" rx="2" /><circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" /></React.Fragment>),
};

function ProductIcon({ icon, className }) {
  const common = { className, viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" };
  return <svg {...common}>{ICONS[icon] || ICONS.headphones}</svg>;
}
const PRODUCT_IMAGES = {
  headphones: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=82",
  band: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=82",
  speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=82",
  charger: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=82",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=82",
  headband: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=82",
  jacket: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=82",
  tee: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=82",
  shirt: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=82",
  pants: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=82",
  sweater: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=82",
  shoe: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=82",
  lamp: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=82",
  board: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=82",
  candle: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=82",
  blanket: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=900&q=82",
  mug: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=82",
  basket: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=82",
  wallet: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=82",
  watch: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=82",
  sunglasses: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=82",
  tote: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=82",
  earring: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=82",
  belt: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=82",
};

function ProductMedia({ product, className }) {
  return (
    <div className={className} style={mediaStyle(product)}>
      <ProductIcon icon={product.icon} />
      <img
        className="product-image"
        src={PRODUCT_IMAGES[product.icon]}
        alt={product.title}
        loading="lazy"
        onError={event => { event.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}

const HUE_ACCENTS = {
  Electronics: [18, 30],
  Fashion: [350, 340],
  "Home & Living": [28, 20],
  Accessories: [30, 20],
};

function mediaStyle(product) {
  const h = product.hue;
  return { background: `linear-gradient(150deg, hsl(${h} 55% 46%), hsl(${(h + 35) % 360} 55% 34%))` };
}

/* ---------------- App ---------------- */
function App() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [theme, setTheme] = useState(() => {
    try {
      const saved = window.localStorage.getItem("nuvo_theme_v1");
      return saved || "light";
    } catch (e) {
      return "light";
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = window.localStorage.getItem("nuvo_wishlist_v1");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [cart, setCart] = useState([]);
  const cartRef = useRef([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(null); // null | shipping | payment | review | done
  const [shipping, setShipping] = useState({ name: "Priya Sharma", address: "221B Residency Road", city: "Bengaluru", state: "Karnataka", pincode: "560025", phone: "9876543210" });
  const [payment, setPayment] = useState({ name: "Priya Sharma", number: "4111 1111 1111 1111", expiry: "12/28", cvv: "123" });
  const [orderId, setOrderId] = useState("");
  const [addedFlash, setAddedFlash] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [upiId, setUpiId] = useState("priya@okhdfc");
  const [priceFilter, setPriceFilter] = useState("all");
  const [minRating, setMinRating] = useState(0);

  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: "welcome", text: "Welcome to NUVO! Enjoy free delivery on orders over ₹2,000.", time: "Just now", read: false }
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const dbRef = useRef(null);
  const userRef = useRef(null);
  const downloadsRef = useRef(null);
  const uidRef = useRef(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: `Hi, I'm ${ASSISTANT_NAME} 👋 Tell me what you're shopping for — a budget, an occasion, or a product name — and I'll find it and can add it to your cart.` }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSolved, setChatSolved] = useState(false);
  const sampleRef = useRef(null);
  const sampleReady = useRef(false);
  const chatBodyRef = useRef(null);

  useEffect(() => { cartRef.current = cart; }, [cart]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem("nuvo_theme_v1", theme); } catch (e) { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    try { window.localStorage.setItem("nuvo_wishlist_v1", JSON.stringify(wishlist)); } catch (e) { /* ignore */ }
  }, [wishlist]);

  // restore cart from localStorage (per-viewer convenience only)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("nuvo_cart_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (e) { /* ignore */ }
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem("nuvo_cart_v1", JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }, [cart]);

  const loadedRef = useRef(false);

  // acquire capabilities (AI chat, persistent store, user id, file download)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (window.claude && window.claude.use) {
          const [s, d, u, dl] = await Promise.all([
            window.claude.use("sample"),
            window.claude.use("db"),
            window.claude.use("user"),
            window.claude.use("downloads"),
          ]);
          if (!mounted) return;
          sampleRef.current = s; sampleReady.current = !!s;
          dbRef.current = d; userRef.current = u; downloadsRef.current = dl;
          if (d && u) {
            try {
              const uid = await u.id();
              if (uid) {
                uidRef.current = uid;
                const snap = await d.doc("data/users/" + uid + "/state").get();
                if (snap.exists) {
                  const data = snap.data() || {};
                  if (Array.isArray(data.orders)) setOrders(data.orders);
                  if (Array.isArray(data.notifications) && data.notifications.length) setNotifications(data.notifications);
                  loadedRef.current = true;
                  return;
                }
              }
            } catch (e) { /* fall through to localStorage below */ }
          }
        }
      } catch (e) { /* capabilities unavailable in this preview */ }
      try {
        const savedOrders = window.localStorage.getItem("nuvo_orders_v1");
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        const savedNotifs = window.localStorage.getItem("nuvo_notifs_v1");
        if (savedNotifs) { const parsed = JSON.parse(savedNotifs); if (parsed.length) setNotifications(parsed); }
      } catch (e) { /* ignore */ }
      loadedRef.current = true;
    })();
    return () => { mounted = false; };
  }, []);

  // persist orders + notifications: real backend (db) when available, localStorage otherwise
  useEffect(() => {
    if (!loadedRef.current) return;
    if (dbRef.current && uidRef.current) {
      dbRef.current.doc("data/users/" + uidRef.current + "/state").set({ orders, notifications }).catch(() => {});
    } else {
      try {
        window.localStorage.setItem("nuvo_orders_v1", JSON.stringify(orders));
        window.localStorage.setItem("nuvo_notifs_v1", JSON.stringify(notifications));
      } catch (e) { /* ignore */ }
    }
  }, [orders, notifications]);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatMessages, chatOpen]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => activeCategory === "All" || p.category === activeCategory);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (priceFilter === "under1000") list = list.filter(p => p.price < 1000);
    if (priceFilter === "1000to3000") list = list.filter(p => p.price >= 1000 && p.price <= 3000);
    if (priceFilter === "over3000") list = list.filter(p => p.price > 3000);
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, activeCategory, sortBy, priceFilter, minRating]);

  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter(product => product.rating >= 4.5).slice(0, 3);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const cartDetailed = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.id) })).filter(c => c.product);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cartDetailed.reduce((s, c) => s + c.product.price * c.qty, 0);
  const shippingFee = cartTotal > 2000 || cartTotal === 0 ? 0 : 79;
  const grandTotal = cartTotal + shippingFee;

  function addToCart(id, qty) {
    qty = qty || 1;
    setCart(prev => {
      const idx = prev.findIndex(c => c.id === id);
      let next;
      if (idx >= 0) next = prev.map((c, i) => i === idx ? { ...c, qty: c.qty + qty } : c);
      else next = [...prev, { id, qty }];
      cartRef.current = next;
      return next;
    });
    setAddedFlash(id);
    window.setTimeout(() => setAddedFlash(f => f === id ? null : f), 1000);
  }
  function updateQty(id, qty) {
    setCart(prev => {
      let next;
      if (qty <= 0) next = prev.filter(c => c.id !== id);
      else next = prev.map(c => c.id === id ? { ...c, qty } : c);
      cartRef.current = next;
      return next;
    });
  }
  function removeFromCart(id) { updateQty(id, 0); }

  function openProduct(id) { setSelectedId(id); setModalQty(1); }
  const selectedProduct = selectedId ? PRODUCTS.find(p => p.id === selectedId) : null;

  function startCheckout() {
    setCartOpen(false);
    setCheckoutStep("shipping");
  }
  function paymentLabel(method) {
    if (method === "upi") return "UPI (" + upiId + ")";
    if (method === "netbanking") return "Net Banking";
    if (method === "cod") return "Cash on Delivery";
    return "Card ending " + (payment.number ? payment.number.replace(/\s/g, "").slice(-4) : "----");
  }
  function placeOrder() {
    const id = "NUVO-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
    const order = {
      id,
      date: new Date().toISOString(),
      items: cartDetailed.map(c => ({ id: c.product.id, title: c.product.title, price: c.product.price, qty: c.qty })),
      subtotal: cartTotal,
      shippingFee,
      total: grandTotal,
      paymentMethod,
      paymentLabel: paymentLabel(paymentMethod),
      shipping: { ...shipping },
    };
    setOrderId(id);
    setOrders(prev => [order, ...prev].slice(0, 50));
    setNotifications(prev => [
      { id: "notif-" + id, text: `Order ${id} placed successfully — ${formatINR(grandTotal)} via ${order.paymentLabel}.`, time: "Just now", read: false },
      ...prev
    ].slice(0, 30));
    setCart([]);
    cartRef.current = [];
    setCheckoutStep("done");
  }
  function closeCheckout() {
    setCheckoutStep(null);
  }
  function markNotificationsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }
  function downloadInvoice(order) {
    if (!order) return;
    const rows = order.items.map(it =>
      `<tr><td>${it.title}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${formatINR(it.price)}</td><td style="text-align:right">${formatINR(it.price * it.qty)}</td></tr>`
    ).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${order.id}</title><style>
      body{font-family:Arial,sans-serif;color:#1C1A22;padding:40px;max-width:640px;margin:0 auto;}
      h1{font-family:Georgia,serif;font-size:26px;margin:0 0 4px;}
      .muted{color:#6B6759;font-size:13px;}
      table{width:100%;border-collapse:collapse;margin-top:24px;}
      th,td{padding:8px 6px;border-bottom:1px solid #ddd;font-size:14px;text-align:left;}
      th{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6B6759;}
      .grand td{border:none;border-top:2px solid #1C1A22;font-weight:700;font-size:16px;padding-top:10px;}
      .brand{font-family:Georgia,serif;font-size:22px;font-weight:700;}
      .brand em{color:#B5792A;font-style:normal;}
      @media print{.no-print{display:none;}}
      </style></head><body>
      <div class="brand">NUVO<em>.</em></div>
      <h1>Invoice</h1>
      <p class="muted">Order ${order.id} &middot; ${new Date(order.date).toLocaleString("en-IN")}</p>
      <p class="muted">Billed to: ${order.shipping.name}, ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.pincode} &middot; ${order.shipping.phone}</p>
      <p class="muted">Payment method: ${order.paymentLabel}</p>
      <table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <table style="margin-top:2px">
      <tr><td colspan="2"></td><td style="text-align:right;border:none">Subtotal</td><td style="text-align:right;border:none">${formatINR(order.subtotal)}</td></tr>
      <tr><td colspan="2"></td><td style="text-align:right;border:none">Shipping</td><td style="text-align:right;border:none">${order.shippingFee === 0 ? "Free" : formatINR(order.shippingFee)}</td></tr>
      <tr class="grand"><td colspan="2"></td><td style="text-align:right">Total</td><td style="text-align:right">${formatINR(order.total)}</td></tr>
      </table>
      <p class="muted" style="margin-top:30px">This is a demo invoice — no real payment was processed.</p>
      <button class="no-print" onclick="window.print()" style="margin-top:14px;padding:10px 18px;border-radius:999px;border:1px solid #1C1A22;background:#1C1A22;color:#fff;cursor:pointer;">Print / Save as PDF</button>
      </body></html>`;
    const openPrintable = () => { const w = window.open("", "_blank"); if (w) { w.document.write(html); w.document.close(); } };
    if (downloadsRef.current) {
      downloadsRef.current.save({ filename: `invoice-${order.id}.html`, data: html }).catch(() => openPrintable());
    } else {
      openPrintable();
    }
  }

  /* ---------------- AI chat ---------------- */
  const SYSTEM_TEXT = useMemo(() => {
    const catalog = PRODUCTS.map(p => ({ id: p.id, title: p.title, category: p.category, price: p.price, rating: p.rating, tagline: p.tagline }));
    return `You are ${ASSISTANT_NAME}, the helpful in-store shopping assistant for an online store called ${BRAND}. `
      + `Be warm, concise (usually under 90 words), and speak like a knowledgeable friend, not a salesperson. `
      + `Prices are in Indian Rupees (\u20B9). Only recommend products from the catalog below — never invent products, prices or stock. `
      + `When a person wants something, recommend 1-3 specific matching products by name with price. `
      + `You can use the search_catalog tool to look things up by keyword/category/budget, the add_to_cart tool when the person clearly asks to add or buy something, and view_cart to check what's already in their cart. `
      + `Always confirm in plain language what you added and its price. If nothing matches, say so honestly and suggest the closest alternative.\n\n`
      + `CATALOG (JSON):\n` + JSON.stringify(catalog);
  }, []);

  function localChatResponse(text) {
    const normalized = text.toLowerCase();
    const currentCart = cartRef.current;
    const cartItems = currentCart.map(item => {
      const product = PRODUCTS.find(candidate => candidate.id === item.id);
      return product ? `${product.title} x ${item.qty}` : null;
    }).filter(Boolean);

    if (normalized.includes("cart")) {
      if (!cartItems.length) return "Your cart is empty. Tell me what you are shopping for and I will suggest something.";
      const total = currentCart.reduce((sum, item) => {
        const product = PRODUCTS.find(candidate => candidate.id === item.id);
        return sum + (product ? product.price * item.qty : 0);
      }, 0);
      return `Your cart has ${cartItems.join(", ")}. The current total is ${formatINR(total)}.`;
    }

    const budgetMatch = normalized.match(/(?:under|below|less than)\s*(?:₹|rs\.?\s*)?(\d[\d,]*)/);
    const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, "")) : null;
    let matches = PRODUCTS.filter(product => {
      const words = normalized.split(/\s+/).filter(word => word.length > 2);
      return words.some(word => product.title.toLowerCase().includes(word) || product.tagline.toLowerCase().includes(word) || product.category.toLowerCase().includes(word));
    });
    if (normalized.includes("travel")) matches = PRODUCTS.filter(product => product.category === "Electronics");
    if (normalized.includes("cozy") || normalized.includes("winter")) matches = PRODUCTS.filter(product => /sweater|blanket|candle|lamp/i.test(product.title));
    if (normalized.includes("gift")) matches = PRODUCTS.filter(product => !budget || product.price <= budget).sort((a, b) => b.rating - a.rating);
    if (budget) matches = matches.filter(product => product.price <= budget);
    matches = matches.slice(0, 3);

    if (!matches.length) return "I could not find an exact match. Try a category, product name, or budget such as 'electronics under 2000'.";

    if (/\b(add|buy|purchase|get)\b/.test(normalized)) {
      const product = matches[0];
      const existing = currentCart.find(item => item.id === product.id);
      const next = existing
        ? currentCart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...currentCart, { id: product.id, qty: 1 }];
      cartRef.current = next;
      setCart(next);
      return `Added ${product.title} to your cart for ${formatINR(product.price)}.`;
    }

    return `Here are some good matches: ${matches.map(product => `${product.title} (${formatINR(product.price)})`).join(", ")}. Tell me if you want me to add one.`;
  }

  async function sendChat(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || chatLoading) return;
    setChatInput("");
    const history = [...chatMessages, { role: "user", content: trimmed }];
    setChatMessages(m => [...m, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);
    setChatLoading(true);

    const sampleFn = sampleRef.current;
    if (!sampleFn) {
      setChatMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: localChatResponse(trimmed) };
        return copy;
      });
      setChatLoading(false);
      return;
    }

    const tools = [
      {
        name: "search_catalog",
        description: "Search the NUVO product catalog by keyword, category and/or maximum price.",
        inputSchema: {
          type: "object",
          properties: {
            keyword: { type: "string", description: "free text keyword to match against title/tagline" },
            category: { type: "string", description: "one of: Electronics, Fashion, Home & Living, Accessories" },
            maxPrice: { type: "number", description: "maximum price in rupees" }
          }
        },
        execute: async (input) => {
          let results = PRODUCTS;
          if (input && input.category) results = results.filter(p => p.category.toLowerCase() === String(input.category).toLowerCase());
          if (input && input.keyword) {
            const k = String(input.keyword).toLowerCase();
            results = results.filter(p => p.title.toLowerCase().includes(k) || p.tagline.toLowerCase().includes(k) || p.desc.toLowerCase().includes(k));
          }
          if (input && input.maxPrice) results = results.filter(p => p.price <= Number(input.maxPrice));
          return results.slice(0, 6).map(p => ({ id: p.id, title: p.title, price: p.price, category: p.category, rating: p.rating, tagline: p.tagline }));
        }
      },
      {
        name: "add_to_cart",
        description: "Add a product to the shopper's cart by its catalog id.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "number", description: "the product id from the catalog" },
            quantity: { type: "number", description: "how many to add, defaults to 1" }
          },
          required: ["productId"]
        },
        execute: async (input) => {
          const product = PRODUCTS.find(p => p.id === Number(input && input.productId));
          if (!product) return { error: "no product with that id" };
          const qty = input && input.quantity > 0 ? Math.floor(input.quantity) : 1;
          const current = cartRef.current;
          const idx = current.findIndex(c => c.id === product.id);
          const next = idx >= 0
            ? current.map((c, i) => i === idx ? { ...c, qty: c.qty + qty } : c)
            : [...current, { id: product.id, qty }];
          cartRef.current = next;
          setCart(next);
          return { added: product.title, price: product.price, quantity: qty, cartItemCount: next.reduce((s, c) => s + c.qty, 0) };
        }
      },
      {
        name: "view_cart",
        description: "Get the shopper's current cart contents and total.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          const current = cartRef.current;
          const items = current.map(c => {
            const p = PRODUCTS.find(pp => pp.id === c.id);
            return p ? { title: p.title, quantity: c.qty, price: p.price } : null;
          }).filter(Boolean);
          const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return { items, total };
        }
      }
    ];

    try {
      const input = [
        { role: "user", content: SYSTEM_TEXT },
        { role: "assistant", content: `Got it — I'm ${ASSISTANT_NAME}, ready to help shoppers browse the ${BRAND} catalog, and I can search or add items to the cart when asked.` },
        ...history
      ];
      const result = await sampleFn(input, {
        cache: false,
        modelTier: "default",
        tools,
        onText: ({ text }) => {
          setChatMessages(m => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: text };
            return copy;
          });
        }
      });
      const finalText = (result && result.text) || "…";
      setChatMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: finalText };
        return copy;
      });
    } catch (err) {
      setChatMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Sorry, I hit a snag answering that. Could you try rephrasing?" };
        return copy;
      });
    } finally {
      setChatLoading(false);
    }
  }

  const suggestions = ["Gift under \u20B91500", "Best travel electronics", "Something cozy for winter", "What's in my cart?"];

  return (
    <React.Fragment>
      <header className="site-header">
        <div className="utility-bar">
          <span>Free delivery on orders over ₹2,000</span>
          <span className="utility-sep">·</span>
          <span onClick={() => orders.length && setOrdersOpen(true)} style={{cursor: orders.length ? "pointer" : "default"}}>{orders.length ? `${orders.length} past order${orders.length > 1 ? "s" : ""}` : "Track order"}</span>
          <span className="utility-sep">·</span>
          <span onClick={() => { setChatSolved(false); setChatOpen(true); }} style={{cursor:"pointer"}}>Help</span>
        </div>
        <div className="header-inner">
          <div className="logo">{BRAND}<em>.</em></div>
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input placeholder="Search products…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="header-actions">
            <button className="icon-btn theme-toggle" onClick={() => setTheme(t => t === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              )}
            </button>
            <button className="icon-btn wishlist-btn" onClick={() => setActiveCategory("All")} aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.length ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 21s-7.5-4.4-9.5-8.8C1.1 9.7 2.7 5 7 5c2.2 0 3.2 1.3 4 2.5.8-1.2 1.8-2.5 4-2.5 4.3 0 5.9 4.7 4.5 7.2C19.5 16.6 12 21 12 21z"/></svg>
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </button>
            <div style={{position:"relative"}}>
              <button className="icon-btn" onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markNotificationsRead(); }} aria-label="Notifications">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10a5 5 0 0 1 10 0v4l2 4H5l2-4z"/><path d="M10.5 21a1.8 1.8 0 0 0 3 0"/></svg>
                {notifications.some(n => !n.read) && <span className="badge">{notifications.filter(n => !n.read).length}</span>}
              </button>
              {notifOpen && (
                <React.Fragment>
                  <div style={{position:"fixed", inset:0, zIndex:69}} onClick={() => setNotifOpen(false)}></div>
                  <div className="notif-dropdown">
                    <div className="notif-head">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No notifications yet</div>
                    ) : notifications.map(n => (
                      <div key={n.id} className="notif-item">
                        <div>{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L4 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="category-row">
          {CATEGORIES.map(c => (
            <button key={c} className={"chip" + (activeCategory === c ? " active" : "")} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
      </header>

      <div className="wrap">
        {!query && activeCategory === "All" && (
          <section className="hero">
            <div>
              <div className="promo-badges">
                <span>Fresh drops</span>
                <span>Free shipping</span>
                <span>Curated picks</span>
              </div>
              <h1>So much better than a normal storefront.</h1>
              <p>Browse {PRODUCTS.length} handpicked products across electronics, fashion, home and accessories — or just tell {ASSISTANT_NAME} what you need and let her find it and add it to your cart.</p>
              <div className="hero-actions">
                <button className="btn accent" onClick={() => setChatOpen(true)}>Ask {ASSISTANT_NAME} to help</button>
                <button className="btn ghost" onClick={() => document.getElementById("catalog-top")?.scrollIntoView({behavior:"smooth"})}>Browse catalog</button>
              </div>
              <div className="trust-row">
                <div><strong>4.8/5</strong><span>average rating</span></div>
                <div><strong>24h</strong><span>dispatch</span></div>
                <div><strong>1.2k+</strong><span>happy shoppers</span></div>
              </div>
            </div>
            <div className="hero-panel">
              <div className="tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 5.1L19 9l-5.4 1.9L12 16l-1.6-5.1L5 9l5.4-1.9z"/></svg>
                AI shopping assistant
              </div>
              <h3>Try asking {ASSISTANT_NAME}</h3>
              <p>She can search the catalog, compare options and add things straight to your cart while you chat.</p>
              <div className="hero-prompts">
                {suggestions.map(s => (
                  <button key={s} className="hero-prompt" onClick={() => { setChatOpen(true); window.setTimeout(() => sendChat(s), 50); }}>{s}</button>
                ))}
              </div>
            </div>
          </section>
        )}

        {!query && activeCategory === "All" && (
          <section className="feature-strip">
            {featuredProducts.map(product => (
              <div key={product.id} className="feature-card">
                <div className="feature-thumb" style={mediaStyle(product)}>
                  <ProductMedia product={product} className="feature-thumb-image" />
                </div>
                <div className="feature-copy">
                  <span>{product.category}</span>
                  <h4>{product.title}</h4>
                  <div className="feature-meta">
                    <strong>{formatINR(product.price)}</strong>
                    <button onClick={() => addToCart(product.id, 1)}>Add</button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="catalog-layout">
          <aside className="filter-sidebar">
            <div className="filter-block">
              <h4>Price</h4>
              {[["all","All prices"],["under1000","Under ₹1,000"],["1000to3000","₹1,000 – ₹3,000"],["over3000","Over ₹3,000"]].map(([val,label]) => (
                <button key={val} className={"filter-opt" + (priceFilter === val ? " active" : "")} onClick={() => setPriceFilter(val)}>{label}</button>
              ))}
            </div>
            <div className="filter-block">
              <h4>Customer rating</h4>
              {[[0,"All ratings"],[4.5,"4.5★ & up"],[4,"4★ & up"],[3.5,"3.5★ & up"]].map(([val,label]) => (
                <button key={label} className={"filter-opt" + (minRating === val ? " active" : "")} onClick={() => setMinRating(val)}>{label}</button>
              ))}
            </div>
          </aside>
          <div className="catalog-main">
            <div id="catalog-top" className="section-head">
              <h2>{activeCategory === "All" ? "All products" : activeCategory}</h2>
              <div style={{display:"flex", alignItems:"center", gap:12}}>
                <span className="result-count">{filtered.length} items</span>
                <select className="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <h3>No products match that search</h3>
                <p>Try a different keyword, or ask {ASSISTANT_NAME} for a recommendation instead.</p>
              </div>
            ) : (
              <div className="grid">
                {filtered.map(p => {
                  const offPct = p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0;
                  return (
                  <div className="card" key={p.id}>
                    <div className="card-media" onClick={() => openProduct(p.id)}>
                      <div className="badge-row">
                        {offPct > 0 && <span className="prod-badge off">{offPct}% OFF</span>}
                        {p.rating >= 4.6 && <span className="prod-badge best">Bestseller</span>}
                      </div>
                      <button
                        className={"wishlist-toggle" + (wishlist.includes(p.id) ? " active" : "")}
                        onClick={(event) => { event.stopPropagation(); toggleWishlist(p.id); }}
                        aria-label={wishlist.includes(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <svg viewBox="0 0 24 24" fill={wishlist.includes(p.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 21s-7.5-4.4-9.5-8.8C1.1 9.7 2.7 5 7 5c2.2 0 3.2 1.3 4 2.5.8-1.2 1.8-2.5 4-2.5 4.3 0 5.9 4.7 4.5 7.2C19.5 16.6 12 21 12 21z"/></svg>
                      </button>
                      <ProductMedia product={p} className="card-media-image" />
                    </div>
                    <div className="card-body">
                      <span className="card-cat">{p.category}</span>
                      <div className="card-title" onClick={() => openProduct(p.id)}>{p.title}</div>
                      <span className="card-rating">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6z"/></svg>
                        {p.rating.toFixed(1)} <span style={{opacity:0.65}}>({p.ratingCount})</span>
                      </span>
                      <div className="card-foot">
                        <span className="price">{formatINR(p.price)}</span>
                        <button className={"add-btn" + (addedFlash === p.id ? " added" : "")} onClick={() => addToCart(p.id, 1)} aria-label="Add to cart">
                          {addedFlash === p.id ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 13l4 4L19 7"/></svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h5>NUVO</h5>
            <p>A demo storefront with an AI shopping assistant. No real payments are processed.</p>
          </div>
          <div>
            <h5>Shop</h5>
            {CATEGORIES.filter(c => c !== "All").map(c => <a key={c} onClick={() => setActiveCategory(c)} style={{cursor:"pointer"}}>{c}</a>)}
          </div>
          <div>
            <h5>Customer care</h5>
            <a onClick={() => orders.length && setOrdersOpen(true)} style={{cursor:"pointer"}}>Track your order</a>
            <a onClick={() => setChatOpen(true)} style={{cursor:"pointer"}}>Chat with {ASSISTANT_NAME}</a>
            <a>Returns &amp; refunds</a>
            <a>Shipping info</a>
          </div>
          <div>
            <h5>Company</h5>
            <a>About us</a>
            <a>Careers</a>
            <a>Privacy policy</a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 NUVO — a personal shopping assistant demo project.</div>
      </footer>

      {/* -------- product modal -------- */}
      {selectedProduct && (
        <div className="overlay center" onClick={() => setSelectedId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <ProductMedia product={selectedProduct} className="modal-media" />
            <div className="modal-body">
              <button className="close-btn modal-close" onClick={() => setSelectedId(null)} aria-label="Close">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
              <div className="modal-cat">{selectedProduct.category}</div>
              <h2 className="modal-title">{selectedProduct.title}</h2>
              <div className="modal-price-row">
                <div className="modal-price">
                  {formatINR(selectedProduct.price)}
                  {selectedProduct.mrp && <span style={{color:"var(--ink-soft)", fontWeight:400, fontSize:15, textDecoration:"line-through", marginLeft:8}}>{formatINR(selectedProduct.mrp)}</span>}
                </div>
                <button
                  className={"wishlist-toggle modal-wishlist" + (wishlist.includes(selectedProduct.id) ? " active" : "")}
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  aria-label={wishlist.includes(selectedProduct.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg viewBox="0 0 24 24" fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 21s-7.5-4.4-9.5-8.8C1.1 9.7 2.7 5 7 5c2.2 0 3.2 1.3 4 2.5.8-1.2 1.8-2.5 4-2.5 4.3 0 5.9 4.7 4.5 7.2C19.5 16.6 12 21 12 21z"/></svg>
                </button>
              </div>
              <span className="card-rating" style={{marginBottom:14, display:"inline-flex"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6z"/></svg>
                {selectedProduct.rating.toFixed(1)} · {selectedProduct.ratingCount} ratings
              </span>
              <p className="modal-desc">{selectedProduct.desc}</p>
              <div className="qty-select">
                <button className="qty-btn" onClick={() => setModalQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-val">{modalQty}</span>
                <button className="qty-btn" onClick={() => setModalQty(q => q + 1)}>+</button>
              </div>
              <button className="btn accent block" onClick={() => { addToCart(selectedProduct.id, modalQty); setSelectedId(null); }}>Add to cart · {formatINR(selectedProduct.price * modalQty)}</button>
            </div>
          </div>
        </div>
      )}

      {/* -------- cart drawer -------- */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="panel" onClick={e => e.stopPropagation()}>
            <div className="panel-head">
              <h3>Your cart ({cartCount})</h3>
              <button className="close-btn" onClick={() => setCartOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <div className="panel-body">
              {cartDetailed.length === 0 ? (
                <div className="empty-state" style={{padding:"30px 0"}}>
                  <h3>Your cart is empty</h3>
                  <p>Add something you like, or ask {ASSISTANT_NAME} for a suggestion.</p>
                </div>
              ) : cartDetailed.map(c => (
                <div className="cart-item" key={c.id}>
                  <ProductMedia product={c.product} className="cart-thumb" />
                  <div className="cart-info">
                    <div className="name">{c.product.title}</div>
                    <div className="meta">{formatINR(c.product.price)} each</div>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => updateQty(c.id, c.qty - 1)}>−</button>
                      <span className="qty-val">{c.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(c.id, c.qty + 1)}>+</button>
                    </div>
                    <button className="remove-link" onClick={() => removeFromCart(c.id)}>Remove</button>
                  </div>
                  <div className="cart-item-price">{formatINR(c.product.price * c.qty)}</div>
                </div>
              ))}
            </div>
            {cartDetailed.length > 0 && (
              <div className="panel-foot">
                <div className="summary-row"><span>Subtotal</span><span>{formatINR(cartTotal)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</span></div>
                <div className="summary-row total"><span>Total</span><span>{formatINR(grandTotal)}</span></div>
                <button className="btn accent block" style={{marginTop:14}} onClick={startCheckout}>Proceed to checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------- order history -------- */}
      {ordersOpen && (
        <div className="overlay" onClick={() => setOrdersOpen(false)}>
          <div className="panel" onClick={e => e.stopPropagation()}>
            <div className="panel-head">
              <h3>Your orders</h3>
              <button className="close-btn" onClick={() => setOrdersOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <div className="panel-body">
              {orders.length === 0 ? (
                <div className="empty-state" style={{padding:"30px 0"}}><h3>No orders yet</h3></div>
              ) : orders.map(o => (
                <div key={o.id} className="cart-item" style={{alignItems:"flex-start"}}>
                  <div className="cart-info">
                    <div className="name">{o.id}</div>
                    <div className="meta">{new Date(o.date).toLocaleDateString("en-IN")} · {o.items.length} item{o.items.length > 1 ? "s" : ""} · {o.paymentLabel}</div>
                    <button className="remove-link" style={{color:"var(--accent-2)"}} onClick={() => downloadInvoice(o)}>Download invoice</button>
                  </div>
                  <div className="cart-item-price">{formatINR(o.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------- checkout -------- */}
      {checkoutStep && (
        <div className="overlay center" onClick={() => {}}>
          <div className="modal" style={{flexDirection:"column", width:"min(520px,100%)"}} onClick={e => e.stopPropagation()}>
            <div className="panel-head" style={{borderBottom:"none"}}>
              <h3>{checkoutStep === "shipping" ? "Shipping details" : checkoutStep === "payment" ? "Payment" : checkoutStep === "review" ? "Review order" : "Order placed"}</h3>
              <button className="close-btn" onClick={closeCheckout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            {checkoutStep !== "done" && (
              <div className="steps">
                <div className={"step-dot" + (["shipping","payment","review"].indexOf(checkoutStep) >= 0 ? " done" : "")}></div>
                <div className={"step-dot" + (["payment","review"].indexOf(checkoutStep) >= 0 ? " done" : "")}></div>
                <div className={"step-dot" + (checkoutStep === "review" ? " done" : "")}></div>
              </div>
            )}

            <div className="panel-body" style={{maxHeight:"56vh"}}>
              {checkoutStep === "shipping" && (
                <React.Fragment>
                  <div className="field"><label>Full name</label><input value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} placeholder="Priya Sharma" /></div>
                  <div className="field"><label>Address</label><input value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} placeholder="House no, street, area" /></div>
                  <div className="field-row">
                    <div className="field"><label>City</label><input value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} placeholder="Bengaluru" /></div>
                    <div className="field"><label>State</label><input value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} placeholder="Karnataka" /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>PIN code</label><input value={shipping.pincode} onChange={e => setShipping({...shipping, pincode: e.target.value})} placeholder="560001" /></div>
                    <div className="field"><label>Phone</label><input value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} placeholder="98xxxxxxxx" /></div>
                  </div>
                </React.Fragment>
              )}

              {checkoutStep === "payment" && (
                <React.Fragment>
                  <p style={{fontSize:12.5, color:"var(--ink-soft)", marginTop:0}}>This is a demo checkout — no real payment gateway is used and no card data is transmitted.</p>
                  <div className="payment-methods">
                    {[["card","Card"],["upi","UPI"],["netbanking","Net Banking"],["cod","Cash on Delivery"]].map(([val,label]) => (
                      <button key={val} className={"pm-opt" + (paymentMethod === val ? " active" : "")} onClick={() => setPaymentMethod(val)}>{label}</button>
                    ))}
                  </div>
                  {paymentMethod === "card" && (
                    <React.Fragment>
                      <div className="field"><label>Name on card</label><input value={payment.name} onChange={e => setPayment({...payment, name: e.target.value})} placeholder="Priya Sharma" /></div>
                      <div className="field"><label>Card number</label><input value={payment.number} onChange={e => setPayment({...payment, number: e.target.value})} placeholder="4111 1111 1111 1111" /></div>
                      <div className="field-row">
                        <div className="field"><label>Expiry</label><input value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} placeholder="MM/YY" /></div>
                        <div className="field"><label>CVV</label><input value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value})} placeholder="123" /></div>
                      </div>
                    </React.Fragment>
                  )}
                  {paymentMethod === "upi" && (
                    <div className="field"><label>UPI ID</label><input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@bank" /></div>
                  )}
                  {paymentMethod === "netbanking" && (
                    <div className="field"><label>Select bank</label>
                      <select value={payment.name} onChange={e => setPayment({...payment, name: e.target.value})}>
                        <option value="">Choose your bank</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="Axis Bank">Axis Bank</option>
                      </select>
                    </div>
                  )}
                  {paymentMethod === "cod" && (
                    <p style={{fontSize:13.5}}>Pay in cash when your order is delivered. A small COD handling fee may apply on some pincodes.</p>
                  )}
                </React.Fragment>
              )}

              {checkoutStep === "review" && (
                <React.Fragment>
                  {cartDetailed.map(c => (
                    <div className="summary-row" key={c.id}><span>{c.product.title} × {c.qty}</span><span>{formatINR(c.product.price * c.qty)}</span></div>
                  ))}
                  <div className="summary-row"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</span></div>
                  <div className="summary-row total"><span>Total</span><span>{formatINR(grandTotal)}</span></div>
                  <p style={{fontSize:12.5, color:"var(--ink-soft)", marginTop:14}}>Deliver to: {shipping.name}, {shipping.address}, {shipping.city}, {shipping.state} {shipping.pincode}</p>
                  <p style={{fontSize:12.5, color:"var(--ink-soft)"}}>Pay via: {paymentLabel(paymentMethod)}</p>
                </React.Fragment>
              )}

              {checkoutStep === "done" && (
                <div className="confirm-wrap">
                  <div className="confirm-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>Thanks{shipping.name ? ", " + shipping.name.split(" ")[0] : ""}! Your order is confirmed.</div>
                  <div className="order-id">{orderId}</div>
                  <p style={{color:"var(--ink-soft)", fontSize:13.5}}>A confirmation would normally be emailed to you. Since this is a demo, nothing was really charged or shipped.</p>
                  <button className="btn ghost" onClick={() => downloadInvoice(orders.find(o => o.id === orderId))}>Download invoice</button>
                </div>
              )}
            </div>

            <div className="panel-foot" style={{display:"flex", gap:10}}>
              {checkoutStep === "shipping" && (
                <button className="btn accent block" onClick={() => setCheckoutStep("payment")} disabled={!shipping.name || !shipping.address || !shipping.city || !shipping.pincode}>Continue to payment</button>
              )}
              {checkoutStep === "payment" && (
                <React.Fragment>
                  <button className="btn ghost" onClick={() => setCheckoutStep("shipping")}>Back</button>
                  <button className="btn accent block" onClick={() => setCheckoutStep("review")} disabled={
                    paymentMethod === "card" ? (!payment.name || !payment.number || !payment.expiry || !payment.cvv) :
                    paymentMethod === "upi" ? !upiId :
                    paymentMethod === "netbanking" ? !payment.name :
                    false
                  }>Review order</button>
                </React.Fragment>
              )}
              {checkoutStep === "review" && (
                <React.Fragment>
                  <button className="btn ghost" onClick={() => setCheckoutStep("payment")}>Back</button>
                  <button className="btn accent block" onClick={placeOrder}>Place order · {formatINR(grandTotal)}</button>
                </React.Fragment>
              )}
              {checkoutStep === "done" && (
                <button className="btn accent block" onClick={closeCheckout}>Continue shopping</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------- AI chat -------- */}
      {!chatOpen && (
        <button className="fab" onClick={() => { setChatSolved(false); setChatOpen(true); }}>
          <span className="dot"></span>
          Ask {ASSISTANT_NAME}
        </button>
      )}
      {chatOpen && (
        <div className="overlay" onClick={() => setChatOpen(false)}>
          <div className="panel chat-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-head">
              <h3>{ASSISTANT_NAME} · shopping assistant</h3>
              <button className="close-btn" onClick={() => setChatOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
              {chatMessages.map((m, i) => (
                <div key={i} className={"msg " + m.role}>
                  {m.content || (chatLoading && i === chatMessages.length - 1 ? (
                    <span className="typing-dots"><span></span><span></span><span></span></span>
                  ) : "")}
                </div>
              ))}
            </div>
            {chatMessages.length <= 1 && (
              <div className="chat-suggestions">
                {suggestions.map(s => (
                  <button key={s} className="suggestion-chip" onClick={() => sendChat(s)}>{s}</button>
                ))}
              </div>
            )}
            {chatSolved && <div className="chat-solved">Your help request is marked as solved.</div>}
            <div className="chat-input-row">
              <input
                placeholder={`Message ${ASSISTANT_NAME}…`}
                value={chatInput}
                disabled={chatSolved}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendChat(chatInput); }}
              />
              <button className="send-btn" disabled={chatSolved || chatLoading || !chatInput.trim()} onClick={() => sendChat(chatInput)}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
              </button>
            </div>
            <button className="chat-solved-btn" disabled={chatSolved || chatLoading} onClick={() => { setChatSolved(true); setChatMessages(m => [...m, { role: "assistant", content: "Glad I could help. This request is now marked as solved." }]); }}>
              {chatSolved ? "Solved" : "Mark as solved"}
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
