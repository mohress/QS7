import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Lock } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { CATEGORIES, MENU_ITEMS as INITIAL_MENU_ITEMS, MenuItem } from './data';
import { MenuItemCard } from './components/MenuItemCard';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // الرمز الافتراضي المكون من 7 أحرف وأرقام
    // يمكنك تغييره هنا أو ربطه بقاعدة بيانات لاحقاً
    if (pin.toUpperCase() === 'LMR8899') {
      setIsAdminOpen(true);
      setShowPinEntry(false);
      setPin('');
    } else {
      alert('الرمز السري غير صحيح');
      setPin('');
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'menu'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: MenuItem[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as MenuItem);
      });
      if (items.length === 0 && INITIAL_MENU_ITEMS.length > 0) {
        // Fallback or initial data loading logic if needed, but usually we just wait
        setMenuItems(items);
      } else {
        setMenuItems(items);
      }
    }, (error) => {
      console.error('Error fetching menu:', error);
    });
    return () => unsubscribe();
  }, []);

  // Removed localStorage effect as it's now handled by Firestore

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
    menuItems.forEach(m => {
      const list = map.get(m.categoryId);
      if (list) list.push(m);
    });
    return map;
  }, [menuItems]);

  return (
    <div className="min-h-screen pb-32">
      {/* Header & Floating Nav */}
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'pt-2 pb-2 backdrop-blur-md bg-black/60 border-b border-white/5 shadow-xl' : 'pt-6 pb-2 bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 transition-all duration-300 ${isScrolled ? 'mb-2' : 'mb-4'}`}
          >
            <svg 
              className={`transition-all duration-300 text-[var(--color-luxury-gold)] ${isScrolled ? 'w-5 h-5' : 'w-8 h-8'}`} 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              stroke="none"
            >
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <h1 
              className={`font-serif text-white uppercase tracking-widest transition-all duration-300 ${isScrolled ? 'text-lg opacity-80 font-bold' : 'text-3xl font-light text-[var(--color-luxury-gold)] shadow-black drop-shadow-md'}`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lumière
            </h1>
          </motion.div>

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

      {/* Footer with Admin button */}
      <footer className="mt-12 mb-32 py-8 text-center border-t border-[#1a1a1a] max-w-xl mx-auto flex flex-col items-center gap-4">
        <button 
          onClick={() => setShowPinEntry(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-300 transition-colors text-sm font-sans"
        >
          <Lock size={14} />
          <span>Admin</span>
        </button>
        <p className="text-[10px] text-gray-800 font-sans tracking-widest uppercase">Lumière Dining &copy; 2024</p>
      </footer>

      {/* PIN Entry Modal */}
      <AnimatePresence>
        {showPinEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-[#222] p-8 rounded-3xl w-full max-w-xs text-center shadow-2xl"
            >
              <Lock className="mx-auto mb-4 text-[var(--color-luxury-gold)]" size={32} />
              <h3 className="text-xl font-bold text-white mb-6">لوحة الإدارة</h3>
              <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
                <input
                  autoFocus
                  type="text"
                  maxLength={7}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="الرمز السري"
                  className="bg-[#050505] border border-[#333] text-white text-center text-2xl tracking-[0.2em] py-3 rounded-xl focus:border-[var(--color-luxury-gold)] focus:outline-none uppercase"
                  dir="ltr"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[var(--color-luxury-red)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-luxury-red-dark)] transition-colors"
                  >
                    دخول
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinEntry(false);
                      setPin('');
                    }}
                    className="px-4 bg-[#222] text-white rounded-xl hover:bg-[#333] transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
      />
    </div>
  );
}
