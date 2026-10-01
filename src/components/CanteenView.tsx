import React, { useState } from 'react';
import {
  Utensils,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Receipt,
  QrCode,
  Tag,
  Star,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_CANTEEN_MENU } from '../data/initialData';
import { CanteenItem } from '../types/attendance';

export const CanteenView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Snacks' | 'Meals' | 'Beverages' | 'Specials'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state: itemId -> quantity
  const [cart, setCart] = useState<Record<string, number>>({});
  
  // Generated token state
  const [activeToken, setActiveToken] = useState<{
    tokenNumber: string;
    items: { item: CanteenItem; qty: number }[];
    total: number;
    pickupTime: string;
    timestamp: string;
  } | null>(null);

  const categories: ('All' | 'Snacks' | 'Meals' | 'Beverages' | 'Specials')[] = [
    'All',
    'Snacks',
    'Meals',
    'Beverages',
    'Specials'
  ];

  const filteredItems = INITIAL_CANTEEN_MENU.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.nameMr.includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const addToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return {
        ...prev,
        [id]: current - 1
      };
    });
  };

  const clearCart = () => setCart({});

  // Cart calculations
  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const item = INITIAL_CANTEEN_MENU.find(i => i.id === id);
      return item ? { item, qty } : null;
    })
    .filter((entry): entry is { item: CanteenItem; qty: number } => entry !== null);

  const cartTotal = cartEntries.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0);
  const cartCount = cartEntries.reduce((acc, curr) => acc + curr.qty, 0);

  const handleGenerateToken = () => {
    if (cartEntries.length === 0) return;
    const tokenNum = `BCOE-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const pickupMinutes = Math.max(...cartEntries.map(e => parseInt(e.item.prepTime) || 3));
    now.setMinutes(now.getMinutes() + pickupMinutes);
    const pickupTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setActiveToken({
      tokenNumber: tokenNum,
      items: cartEntries,
      total: cartTotal,
      pickupTime: pickupTimeStr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setCart({});
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Canteen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-medium">
            <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">BCOE Food Court &amp; Cafeteria</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Kitchen Open (08:00 AM - 06:00 PM)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Utensils className="w-6 h-6" />
            </div>
            <span>BCOE Canteen &amp; Refreshment Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Freshly prepared snacks, breakfast, meals, and beverages with digital order tokens.
          </p>
        </div>

        {/* Cart Quick Status Pill */}
        {cartCount > 0 && (
          <div className="flex items-center gap-3 p-2 pl-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">{cartCount} items in token</span>
              <span className="font-mono font-black text-amber-600 dark:text-amber-400">Total: ₹{cartTotal}</span>
            </div>
            <button
              onClick={handleGenerateToken}
              className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
            >
              Get Token
            </button>
          </div>
        )}
      </div>

      {/* Generated Token Alert Modal/Banner */}
      <AnimatePresence>
        {activeToken && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-500/15 via-slate-900 to-[#0b1329] border border-amber-500/40 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Token Confirmed
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Canteen Token Generated: <span className="text-amber-400 font-mono">{activeToken.tokenNumber}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Show this token at <strong>Counter 1 (Main Food Counter)</strong> when your number is called.
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-mono">Estimated Ready At</div>
                <div className="text-2xl font-black font-mono text-cyan-400">{activeToken.pickupTime}</div>
              </div>
            </div>

            {/* Token Order Items */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap gap-2">
                {activeToken.items.map(({ item, qty }) => (
                  <span key={item.id} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 font-medium">
                    {qty}x {item.name} (₹{item.price * qty})
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black text-amber-300">
                  Total Bill: ₹{activeToken.total}
                </span>
                <button
                  onClick={() => setActiveToken(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Dismiss Token
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Pills & Search */}
      <div className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Vada Pav, Misal, Chai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-slate-50 dark:bg-[#070c18] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const qtyInCart = cart[item.id] || 0;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    PURE VEG
                  </span>

                  <span className="text-[11px] font-mono text-amber-500 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{item.rating}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {item.nameMr}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.prepTime} prep</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Price & Cart Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-indigo-950 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">College Price</span>
                  <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                    ₹{item.price}
                  </span>
                </div>

                {qtyInCart > 0 ? (
                  <div className="flex items-center gap-2 bg-amber-500 text-slate-950 px-2 py-1 rounded-xl font-bold text-xs">
                    <button onClick={() => removeFromCart(item.id)} className="p-0.5 hover:opacity-75">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-black">{qtyInCart}</span>
                    <button onClick={() => addToCart(item.id)} className="p-0.5 hover:opacity-75">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item.id)}
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-800 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Token</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
