import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../data';

interface Props {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
}

export function MenuItemCard({ item, quantity, onAdd, onRemove }: Props) {
  const formattedPrice = new Intl.NumberFormat('ar-IQ').format(item.priceIQD) + ' د.ع';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.nameAr} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
        {item.isOffer && (
          <div className="absolute top-3 right-3 bg-[var(--color-luxury-red)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 hidden sm:block">
            مميز
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 tracking-wide">{item.nameAr}</h3>
            <h4 className="text-sm text-gray-400 font-medium tracking-wide font-sans">{item.nameEn}</h4>
          </div>
          <div className="text-lg font-bold text-[var(--color-luxury-gold)] shrink-0 pr-4" dir="ltr">
            {formattedPrice}
          </div>
        </div>
        
        <div className="mt-2 mb-4">
          <p className="text-sm text-gray-300 leading-relaxed opacity-90">{item.descriptionAr}</p>
          <p className="text-xs text-gray-500 mt-1 font-sans">{item.descriptionEn}</p>
        </div>
        
        <div className="mt-auto pt-4 flex justify-between items-center border-t border-[#2a2a2a]">
          {quantity > 0 ? (
            <div className="flex items-center gap-4 w-full bg-[#1a1a1a] p-1.5 rounded-xl border border-[#333]">
              <button 
                onClick={() => onRemove(item)}
                className="w-10 h-10 flex items-center justify-center bg-[#252525] hover:bg-[#333] text-white rounded-lg transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="font-bold flex-1 text-center text-lg">{quantity}</span>
              <button 
                onClick={() => onAdd(item)}
                className="w-10 h-10 flex items-center justify-center bg-[var(--color-luxury-red)] hover:bg-[var(--color-luxury-red-dark)] text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAdd(item)}
              className="w-full py-3 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-[var(--color-luxury-gold)] rounded-xl border border-[#333] font-bold transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>إضافة للطلب</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
