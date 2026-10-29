
import { useMemo, useState } from "react";
import {
  Search, ShoppingBag, Heart, Menu, X, Mic, UserRound,
  ChevronDown, Trash2, Plus, Minus, ArrowRight, Check,
  Truck, ShieldCheck, RotateCcw, SlidersHorizontal
} from "lucide-react";
import "./index.css";

const products = [
  { id: 1, name: "Elegant Red Midi Dress", category: "Women", price: 4999, old: 7999, color: "Red", sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85", tag: "Bestseller" },
  { id: 2, name: "Classic Beige Blazer", category: "Men", price: 6499, old: 8999, color: "Beige", sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85", tag: "New" },
  { id: 3, name: "Leather Gold-Detail Handbag", category: "Bags", price: 6999, old: 8999, color: "Black", sizes: ["One Size"], image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85", tag: "Popular" },
  { id: 4, name: "Minimal White Sneakers", category: "Footwear", price: 3499, old: 4499, color: "White", sizes: ["6", "7", "8", "9", "10"], image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85", tag: "Everyday" },
  { id: 5, name: "Golden Statement Earrings", category: "Accessories", price: 1499, old: 1999, color: "Gold", sizes: ["One Size"], image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85", tag: "Elegant" },
  { id: 6, name: "Midnight Black Evening Dress", category: "Women", price: 5499, old: 7499, color: "Black", sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85", tag: "Bestseller" },
  { id: 7, name: "Tailored Men's Suit", category: "Men", price: 9999, old: 12999, color: "Black", sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=700&q=85", tag: "Premium" },
  { id: 8, name: "Everyday Crossbody Bag", category: "Bags", price: 3999, old: 4999, color: "Brown", sizes: ["One Size"], image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85", tag: "New" },
  { id: 9, name: "Luxury Gold Watch", category: "Accessories", price: 5999, old: 7999, color: "Gold", sizes: ["One Size"], image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=85", tag: "Premium" },
  { id: 10, name: "Classic Denim Jacket", category: "Men", price: 4299, old: 5499, color: "Blue", sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=700&q=85", tag: "New" },
  { id: 11, name: "Summer Floral Dress", category: "Women", price: 3299, old: 4499, color: "Floral", sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=700&q=85", tag: "Summer" },
  { id: 12, name: "Classic Leather Loafers", category: "Footwear", price: 4599, old: 5999, color: "Brown", sizes: ["6", "7", "8", "9", "10"], image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=700&q=85", tag: "Premium" }
];

const categories = ["All", "Women", "Men", "Bags", "Footwear", "Accessories"];
const money = n => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(n);

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [checkoutDone, setCheckoutDone] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchesSearch =
        `${p.name} ${p.category} ${p.color} ${p.tag}`
          .toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (category === "All" || p.category === category)
        && p.price <= maxPrice;
    });
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, category, maxPrice, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;

  function addToCart(product, buyNow = false) {
    const size = selectedSizes[product.id] || product.sizes[0];
    setCart(old => {
      const found = old.find(item => item.id === product.id && item.size === size);
      return found
        ? old.map(item => item.id === product.id && item.size === size
            ? { ...item, qty: item.qty + 1 } : item)
        : [...old, { ...product, size, qty: 1 }];
    });
    setNotice(`${product.name} added to your bag`);
    if (buyNow) {
      setCartOpen(true);
    }
  }

  function changeQty(id, size, amount) {
    setCart(old => old
      .map(item => item.id === id && item.size === size
        ? { ...item, qty: item.qty + amount } : item)
      .filter(item => item.qty > 0));
  }

  function toggleFavorite(id) {
    setFavorites(old => old.includes(id)
      ? old.filter(x => x !== id) : [...old, id]);
  }

  function voiceSearch() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNotice("Voice search is not supported in this browser. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onstart = () => setNotice("Listening… say a product name");
    recognition.onresult = event => {
      setSearch(event.results[0][0].transcript);
      setNotice(`Searching for: ${event.results[0][0].transcript}`);
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    };
    recognition.onerror = () => setNotice("Couldn't hear you. Please try again.");
    recognition.start();
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!cart.length) return;
    setCheckoutDone(true);
    setCart([]);
  }

  return (
    <div className="app">
      <div className="announcement">
        Complimentary shipping on orders above ₹999 · Discover timeless luxury
      </div>

      <header className="header">
        <button className="icon-button mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
          {mobileMenu ? <X /> : <Menu />}
        </button>
        <a className="brand" href="#home">
          <span>MAISON ÉLAN</span>
          <small>FASHION & ACCESSORIES</small>
        </a>
        <nav className={mobileMenu ? "nav nav-open" : "nav"}>
          <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
          <a href="#shop" onClick={() => setMobileMenu(false)}>Shop</a>
          <a href="#categories" onClick={() => setMobileMenu(false)}>Collections</a>
          <a href="#story" onClick={() => setMobileMenu(false)}>Our Story</a>
          <a href="#footer" onClick={() => setMobileMenu(false)}>Contact</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={() => {
            document.getElementById("product-search")?.focus();
            document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
          }}><Search /></button>
          <button className="icon-button voice-top" aria-label="Voice search" onClick={voiceSearch}><Mic /></button>
          <button className="icon-button account-button" aria-label="Account" onClick={() => setNotice("Account sign-in can be connected to an authentication service.")}><UserRound /></button>
          <button className="icon-button cart-trigger" aria-label="Open shopping bag" onClick={() => setCartOpen(true)}>
            <ShoppingBag /> <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={15} /></button></div>}

      <main>
        <section className="hero" id="home">
          <img className="hero-image" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2000&q=90" alt="Luxury fashion collection" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">THE ART OF EVERYDAY LUXURY</p>
            <h1>Style that speaks.<br /><em>Elegance that lasts.</em></h1>
            <p>Discover thoughtfully selected fashion and accessories for your most memorable moments.</p>
            <a className="gold-button" href="#shop">Explore the collection <ArrowRight size={17} /></a>
          </div>
          <span className="hero-caption">THE NEW SEASON · 2026</span>
        </section>

        <section className="benefits">
          <div><Truck /><span><b>Complimentary Shipping</b><small>On orders above ₹999</small></span></div>
          <div><RotateCcw /><span><b>Easy Returns</b><small>Within 7 days</small></span></div>
          <div><ShieldCheck /><span><b>Secure Checkout</b><small>Your privacy matters</small></span></div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="section-heading">
            <div><p className="eyebrow">CURATED FOR YOU</p><h2>Shop by collection</h2></div>
            <p>Pieces to make every day extraordinary.</p>
          </div>
          <div className="category-grid">
            {[
              ["Women", "photo-1483985988355-763728e1935b"],
              ["Men", "photo-1617137968427-85924c800a22"],
              ["Bags", "photo-1584917865442-de89df76afd3"],
              ["Footwear", "photo-1542291026-7eec264c27ff"],
              ["Accessories", "photo-1535632066927-ab7c9ab60908"]
            ].map(([name, photo]) => (
              <button className="category-card" key={name} onClick={() => {
                setCategory(name);
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
              }}>
                <img src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=80`} alt={name} />
                <span>{name}<ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="section shop-section" id="shop">
          <div className="section-heading shop-heading">
            <div><p className="eyebrow">THE MAISON EDIT</p><h2>Find your signature style</h2></div>
            <span className="product-count">{filteredProducts.length} pieces</span>
          </div>

          <div className="shop-tools">
            <div className="search-wrap">
              <Search size={19} />
              <input id="product-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dresses, bags, shoes..." aria-label="Search products" />
              {search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}
              <button className="voice-search" onClick={voiceSearch} aria-label="Search using voice"><Mic size={18} /><span>Voice</span></button>
            </div>
            <label className="filter-select"><SlidersHorizontal size={17} />
              <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter category">
                {categories.map(c => <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>)}
              </select>
            </label>
            <label className="filter-select sort-select">
              <span>Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>

          <div className="price-filter">
            <label htmlFor="price-range">Maximum price: <b>{money(maxPrice)}</b></label>
            <input id="price-range" type="range" min="1500" max="15000" step="500" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
            <button onClick={() => { setCategory("All"); setSearch(""); setMaxPrice(15000); setSort("featured"); }}>Reset filters</button>
          </div>

          {filteredProducts.length ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="product-tag">{product.tag}</span>
                    <button className={`favorite-button ${favorites.includes(product.id) ? "is-favorite" : ""}`} onClick={() => toggleFavorite(product.id)} aria-label="Toggle favorite">
                      <Heart size={19} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                    </button>
                    <button className="quick-view" onClick={() => setNotice(`${product.name} · ${money(product.price)} · Available sizes: ${product.sizes.join(", ")}`)}>Quick view</button>
                  </div>
                  <div className="product-info">
                    <p className="product-category">{product.category} · {product.color}</p>
                    <h3>{product.name}</h3>
                    <div className="product-prices"><b>{money(product.price)}</b><del>{money(product.old)}</del><span>{Math.round((1 - product.price / product.old) * 100)}% OFF</span></div>
                    <label className="size-label">Size
                      <select value={selectedSizes[product.id] || product.sizes[0]} onChange={e => setSelectedSizes(old => ({ ...old, [product.id]: e.target.value }))}>
                        {product.sizes.map(size => <option key={size}>{size}</option>)}
                      </select>
                    </label>
                    <div className="product-buttons">
                      <button className="add-button" onClick={() => addToCart(product)}><ShoppingBag size={16} /> Add to Bag</button>
                      <button className="buy-button" onClick={() => { addToCart(product, true); setCheckoutOpen(false); }}>Buy Now</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results"><Search size={32} /><h3>No pieces found</h3><p>Try another search term or reset your filters.</p><button className="dark-button" onClick={() => { setSearch(""); setCategory("All"); setMaxPrice(15000); }}>Show all products</button></div>
          )}
        </section>

        <section className="editorial" id="story">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85" alt="A carefully styled fashion collection" loading="lazy" />
          <div className="editorial-copy">
            <p className="eyebrow">LESS, BUT BETTER</p>
            <h2>Considered style.<br /><em>Lasting impressions.</em></h2>
            <p>Discover versatile pieces, refined details, and timeless silhouettes selected to become part of your story.</p>
            <a href="#shop" className="text-link">Discover the edit <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="app-promo">
          <div className="app-promo-icon"><ShoppingBag size={30} /></div>
          <div><p className="eyebrow">MAISON ÉLAN, ON THE GO</p><h2>Your style, wherever you are.</h2><p>Enjoy a seamless mobile shopping experience, quick access to your bag, and new collection updates.</p></div>
          <a className="gold-button" href="#shop">Shop on mobile <ArrowRight size={16} /></a>
          <small>Mobile-friendly website · App-store publishing available separately</small>
        </section>
      </main>

      <footer id="footer" className="footer">
        <a className="brand footer-brand" href="#home"><span>MAISON ÉLAN</span><small>FASHION & ACCESSORIES</small></a>
        <p>Style · Quality · You</p>
        <div className="footer-links"><a href="#shop">Shop</a><a href="#categories">Collections</a><a href="mailto:hello@example.com">Contact</a></div>
        <small>© 2026 Maison Élan. Demo storefront.</small>
      </footer>

      {cartOpen && (
        <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
          <aside className="side-panel">
            <div className="panel-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag ({cartCount})</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X /></button></div>
            {!cart.length ? <div className="empty-cart"><ShoppingBag size={38} /><h3>Your bag is waiting</h3><p>Find something you love in our collection.</p><button className="dark-button" onClick={() => setCartOpen(false)}>Continue shopping</button></div> : <>
              <div className="cart-items">{cart.map(item => <div className="cart-item" key={`${item.id}-${item.size}`}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info"><h3>{item.name}</h3><p>Size: {item.size}</p><b>{money(item.price)}</b><div className="quantity"><button onClick={() => changeQty(item.id, item.size, -1)} aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, item.size, 1)} aria-label="Increase quantity"><Plus size={14} /></button></div></div>
                <button className="remove-item" onClick={() => setCart(old => old.filter(x => !(x.id === item.id && x.size === item.size)))} aria-label="Remove item"><Trash2 size={17} /></button>
              </div>)}</div>
              <div className="cart-summary"><p><span>Subtotal</span><b>{money(subtotal)}</b></p><p><span>Shipping</span><b>{shipping ? money(shipping) : "Complimentary"}</b></p><p className="summary-total"><span>Total</span><b>{money(subtotal + shipping)}</b></p><button className="gold-button checkout-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); setCheckoutDone(false); }}>Proceed to checkout <ArrowRight size={17} /></button><small>Checkout is a demonstration; no payment will be collected.</small></div>
            </>}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="overlay checkout-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCheckoutOpen(false); }}>
          <section className="checkout-panel">
            <div className="panel-heading"><div><p className="eyebrow">ALMOST YOURS</p><h2>Checkout</h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button></div>
            {checkoutDone ? <div className="success-state"><div className="success-icon"><Check size={30} /></div><h2>Thank you!</h2><p>Your demo order has been completed successfully. No payment was taken.</p><button className="dark-button" onClick={() => { setCheckoutOpen(false); setCheckoutDone(false); }}>Continue shopping</button></div> : <>
              <div className="checkout-summary"><span>{cartCount} item(s)</span><b>{money(subtotal + shipping)}</b></div>
              <form className="checkout-form" onSubmit={placeOrder}>
                <h3>Shipping information</h3>
                <label>Full name<input required placeholder="Your full name" /></label>
                <label>Email address<input type="email" required placeholder="you@example.com" /></label>
                <label>Phone number<input type="tel" required pattern="[0-9+() -]{8,18}" placeholder="Your phone number" /></label>
                <label>Delivery address<textarea required rows="3" placeholder="House number, street, area" /></label>
                <div className="form-row"><label>City<input required placeholder="City" /></label><label>PIN code<input required inputMode="numeric" pattern="[0-9]{6}" placeholder="6-digit PIN" /></label></div>
                <h3>Payment method</h3>
                <label className="payment-choice"><input type="radio" name="payment" defaultChecked /> Cash on delivery <small>Demo option</small></label>
                <label className="payment-choice"><input type="radio" name="payment" /> UPI / Card <small>Demo only — no payment is processed</small></label>
                <button className="gold-button checkout-button" type="submit">Place demo order · {money(subtotal + shipping)}</button>
                <p className="demo-warning">This is a front-end demonstration. Connect a secure backend and payment provider before accepting real orders.</p>
              </form>
            </>}
          </section>
        </div>
      )}
    </div>
  );
}


function voiceSearch() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setNotice(
      "Voice search is not supported by this browser. Please try Google Chrome."
    );
    return;
  }

  try {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setNotice("Listening... Speak a product name now.");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      setSearch(spokenText);
      setNotice(`Searching for: ${spokenText}`);

      document.getElementById("shop")?.scrollIntoView({
        behavior: "smooth"
      });
    };

    recognition.onerror = (event) => {
      const messages = {
        "not-allowed": "Microphone access denied. Allow it in Chrome settings.",
        "audio-capture": "No microphone detected. Check your microphone.",
        "no-speech": "No speech detected. Please try again.",
        "network": "Voice recognition network error. Check your internet connection.",
        "service-not-allowed": "Voice recognition is blocked by the browser."
      };

      setNotice(
        messages[event.error] ||
        `Voice search failed: ${event.error}. Please try again.`
      );
    };

    recognition.onend = () => {
      console.log("Voice recognition ended.");
    };

    recognition.start();
  } catch (error) {
    setNotice(`Unable to start voice search: ${error.message}`);
  }
}


function addToCart(product, buyNow = false) {
  const size = selectedSizes[product.id] || product.sizes[0];

  setCart(old => {
    const found = old.find(
      item => item.id === product.id && item.size === size
    );

    return found
      ? old.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      : [...old, { ...product, size, qty: 1 }];
  });

  setNotice(`✓ ${product.name} added successfully!`);

  if (buyNow) {
    setCartOpen(true);
  }
}
