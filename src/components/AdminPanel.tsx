import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit2, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { MenuItem, CATEGORIES } from '../data';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

export function AdminPanel({ isOpen, onClose, menuItems, setMenuItems }: AdminPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState: MenuItem = {
    id: '',
    categoryId: CATEGORIES[0].id,
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    priceIQD: 0,
    image: '',
    isOffer: false
  };

  const [formData, setFormData] = useState<MenuItem>(initialFormState);

  const handleEdit = (item: MenuItem) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطبق؟')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData(initialFormState);
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setEditingId('new');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === 'new') {
      setMenuItems(prev => [...prev, formData]);
    } else {
      setMenuItems(prev => prev.map(item => item.id === editingId ? formData : item));
    }
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col md:flex-row overflow-hidden backdrop-blur-md">
      {/* List Section */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-l border-[#2a2a2a] flex flex-col bg-[#050505]">
        <div className="p-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#0a0a0a]">
          <h2 className="text-xl font-bold text-white">إدارة قائمة الطعام</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAddNew}
              className="bg-[var(--color-luxury-red)] hover:bg-[var(--color-luxury-red-dark)] text-white p-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">إضافة طبق جديد</span>
            </button>
            <button
              onClick={onClose}
              className="bg-[#222] hover:bg-[#333] text-white p-2 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 hide-scrollbar">
          {menuItems.map(item => (
            <div key={item.id} className="bg-[#121212] border border-[#2a2a2a] p-3 rounded-xl flex items-center gap-4">
              <img src={item.image} alt={item.nameAr} className="w-16 h-16 rounded-lg object-cover bg-[#222]" />
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">{item.nameAr}</h3>
                <p className="text-gray-400 text-xs font-sans">{item.nameEn}</p>
                <div className="text-[var(--color-luxury-gold)] text-xs mt-1 font-bold" dir="ltr">
                  {new Intl.NumberFormat('ar-IQ').format(item.priceIQD)} د.ع
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-[#222] hover:bg-[#333] text-blue-400 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-[#222] hover:bg-[#333] text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form Section */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-[#111] p-4 hide-scrollbar">
        {editingId ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-lg mx-auto pb-8">
            <h3 className="text-xl font-bold text-[var(--color-luxury-gold)] mb-4 border-b border-[#2a2a2a] pb-2">
              {editingId === 'new' ? 'إضافة طبق جديد' : 'تعديل الطبق'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">الاسم (عربي)</label>
                <input
                  required
                  value={formData.nameAr}
                  onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                  className="bg-[#050505] border border-[#333] rounded-lg p-2 text-white text-sm focus:border-[var(--color-luxury-gold)] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">الاسم (انجليزي)</label>
                <input
                  required
                  value={formData.nameEn}
                  onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                  dir="ltr"
                  className="bg-[#050505] border border-[#333] rounded-lg p-2 text-white text-sm focus:border-[var(--color-luxury-gold)] focus:outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">الفئة</label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="bg-[#050505] border border-[#333] rounded-lg p-2 text-white text-sm focus:border-[var(--color-luxury-gold)] focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">السعر (دينار عراقي)</label>
              <input
                required
                type="number"
                min="0"
                value={formData.priceIQD}
                onChange={e => setFormData({ ...formData, priceIQD: Number(e.target.value) })}
                dir="ltr"
                className="bg-[#050505] border border-[#333] rounded-lg p-2 text-white text-sm focus:border-[var(--color-luxury-gold)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">رابط الصورة</label>
              <input
                required
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                dir="ltr"
                placeholder="https://..."
                className="bg-[#050505] border border-[#333] rounded-lg p-2 text-white text-sm focus:border-[var(--color-luxury-gold)] focus:outline-none font-sans"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border border-[#333]" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">الوصف (عربي)</label>
              <textarea
                required
                value={formData.descriptionAr}
                onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                className="bg-[#050505] border border-[#333] rounded-lg p-2 text-white text-sm focus:border-[var(--color-luxury-gold)] focus:outline-none min-h-[80px]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">الوصف (انجليزي)</label>
              <textarea
                required
                value={formData.descriptionEn}
                onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                dir="ltr"
                className="bg-[#050505] border border-[#333] rounded-lg p-2 text-white text-sm focus:border-[var(--color-luxury-gold)] focus:outline-none min-h-[80px] font-sans"
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isOffer"
                checked={formData.isOffer}
                onChange={e => setFormData({ ...formData, isOffer: e.target.checked })}
                className="w-4 h-4 accent-[var(--color-luxury-red)]"
              />
              <label htmlFor="isOffer" className="text-sm text-white font-bold cursor-pointer">تصنيف كـ "عرض مميز"</label>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-[#2a2a2a]">
              <button
                type="submit"
                className="flex-1 bg-[var(--color-luxury-red)] hover:bg-[var(--color-luxury-red-dark)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={18} />
                حفظ
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-[#222] hover:bg-[#333] text-white font-bold py-3 rounded-xl transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50 gap-4">
            <ImageIcon size={64} />
            <p className="text-lg">اختر طبقاً للتعديل أو أضف طبقاً جديداً</p>
          </div>
        )}
      </div>
    </div>
  );
}
