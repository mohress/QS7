import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, ChefHat } from 'lucide-react';
import { MenuItem } from '../data';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
  onConfirmOrder: () => void;
}

export function CartDrawer({ isOpen, onClose, cartItems, onAdd, onRemove, onConfirmOrder }: Props) {
  const [tableNumber, setTableNumber] = useState<number | ''>(1);

  const total = cartItems.reduce((acc, { item, quantity }) => acc + item.priceIQD * quantity, 0);
  const formattedTotal = new Intl.NumberFormat('ar-IQ').format(total) + ' د.ع';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0a0a0a] border-l border-[#1f1f1f] shadow-2xl z-50 flex flex-col pt-[env(safe-area-inset-top)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1f1f1f] bg-[#111]">
              <div className="flex items-center gap-3 text-white">
                <ShoppingBag className="text-[var(--color-luxury-gold)]" size={24} />
                <h2 className="text-xl font-bold">الطلب الحالي</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-[#222] text-gray-400 hover:text-white rounded-full hover:bg-[#333] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 bg-[#050505]">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 opacity-50">
                  <ChefHat size={64} />
                  <p className="text-lg">لا توجد أطباق في الطلب</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map(({ item, quantity }) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id} 
                        className="flex gap-4 p-3 bg-[#111] rounded-2xl border border-[#222]"
                      >
                        <img 
                          src={item.image} 
                          alt={item.nameAr} 
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex flex-col flex-1 py-1">
                          <h4 className="text-white font-bold mb-0.5 leading-tight">{item.nameAr}</h4>
                          <span className="text-[var(--color-luxury-gold)] font-medium text-sm mb-auto" dir="ltr">
                            {new Intl.NumberFormat('ar-IQ').format(item.priceIQD * quantity)} د.ع
                          </span>
                          
                          <div className="flex items-center gap-3 self-end mt-2">
                            <button 
                              onClick={() => onRemove(item)}
                              className="w-7 h-7 flex items-center justify-center bg-[#222] text-gray-300 rounded-md"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                            <button 
                              onClick={() => onAdd(item)}
                              className="w-7 h-7 flex items-center justify-center bg-[var(--color-luxury-red)] text-white rounded-md"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-[#111] border-t border-[#1f1f1f] pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <div className="flex justify-between items-center mb-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a]">
                  <span className="text-white font-bold">تسلسل الطاولة</span>
                  <div className="flex items-center gap-2" dir="ltr">
                    <button 
                      onClick={() => setTableNumber(prev => Math.max(1, (typeof prev === 'number' ? prev : 1) - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-[#222] hover:bg-[#333] text-gray-300 rounded-lg transition-colors border border-[#333]"
                    >
                      <Minus size={18} />
                    </button>
                    <input 
                      id="tableNumber"
                      type="number" 
                      min="1"
                      value={tableNumber}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setTableNumber(isNaN(val) ? '' : val);
                      }}
                      placeholder="رقم" 
                      className="w-16 text-center bg-transparent text-white font-bold text-xl py-1 focus:outline-none hide-scrollbar placeholder:text-gray-600 placeholder:text-sm placeholder:font-normal"
                      style={{ MozAppearance: 'textfield' }}
                      dir="ltr"
                      required
                    />
                    <button 
                      onClick={() => setTableNumber(prev => (typeof prev === 'number' ? prev : 0) + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-[#222] hover:bg-[#333] text-gray-300 transition-colors border border-[#333] rounded-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={onConfirmOrder}
                  className="w-full py-4 bg-[var(--color-luxury-red)] hover:bg-[var(--color-luxury-red-dark)] text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <ChefHat size={20} />
                  <span>تأكيد الطلب للمطبخ</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
