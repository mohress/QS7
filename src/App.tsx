import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, MenuItem } from './data';
import { MenuItemCard } from './components/MenuItemCard';
import { CartDrawer } from './components/CartDrawer';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll visibility for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Update active category based on scroll position
      const sections = CATEGORIES.map(c => document.getElementById(c.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(CATEGORIES[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleAdd = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemove = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing && existing.quantity > 1) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c.item.id !== item.id);
    });
  };

  const clearCart = () => setCart([]);

  const handleConfirmOrder = () => {
    // In a real app this would send to an API.
    alert('تم إرسال طلبك إلى المطبخ بنجاح!');
    clearCart();
    setIsCartOpen(false);
  };

  const totalItems = cart.reduce((sum, current) => sum + current.quantity, 0);
  const totalPrice = cart.reduce((sum, current) => sum + (current.item.priceIQD * current.quantity), 0);
  const formattedTotalPrice = new Intl.NumberFormat('ar-IQ').format(totalPrice) + ' د.ع';

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    CATEGORIES.forEach(c => map.set(c.id, []));
    MENU_ITEMS.forEach(m => {
      const list = map.get(m.categoryId);
      if (list) list.push(m);
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen pb-32">
      {/* Header & Floating Nav */}
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'pt-2 pb-2 backdrop-blur-md bg-black/60 border-b border-white/5 shadow-xl' : 'pt-6 pb-2 bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-serif text-white uppercase tracking-widest transition-all duration-300 ${isScrolled ? 'text-lg mb-2 opacity-80 font-bold' : 'text-3xl mb-4 font-light text-[var(--color-luxury-gold)] shadow-black drop-shadow-md'}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lumière
          </motion.h1>

          <nav className="flex gap-2 overflow-x-auto hide-scrollbar w-full relative">
            <div className="flex gap-2 mx-auto justify-start sm:justify-center w-full px-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${activeCategory === cat.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className="absolute inset-0 bg-[var(--color-luxury-red)] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {cat.nameAr}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="max-w-xl mx-auto px-4 pt-36">
        {CATEGORIES.map(category => {
          const items = itemsByCategory.get(category.id) || [];
          if (items.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-12 scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">{category.nameAr}</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--color-luxury-gold)]/40 to-transparent"></div>
              </div>
              <div className="flex flex-col gap-6">
                {items.map(item => {
                  const q = cart.find(c => c.item.id === item.id)?.quantity || 0;
                  return (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      quantity={q} 
                      onAdd={handleAdd} 
                      onRemove={handleRemove} 
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating Bottom Action Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-30 max-w-xl mx-auto"
          >
            <div className="glass-effect rounded-2xl p-2 flex items-center justify-between shadow-2xl overflow-hidden">
              <div className="flex-1 px-4 py-2">
                <div className="text-xs text-gray-400 font-medium mb-0.5">الإجمالي</div>
                <div className="text-lg font-bold text-[var(--color-luxury-gold)] leading-none" dir="ltr">
                  {formattedTotalPrice}
                </div>
              </div>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-[var(--color-luxury-red)] hover:bg-[var(--color-luxury-red-dark)] py-3 px-6 rounded-xl flex items-center gap-3 transition-colors shrink-0"
              >
                <div className="relative">
                  <ShoppingBag size={20} className="text-white" />
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <span className="font-bold text-white">عرض الطلب</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
}
