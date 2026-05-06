import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit2, Trash2, Save, Image as ImageIcon, Database } from 'lucide-react';
import { doc, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '../firebase';
import { MenuItem, CATEGORIES, MENU_ITEMS as INITIAL_MENU_ITEMS } from '../data';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export function AdminPanel({ isOpen, onClose, menuItems }: AdminPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSystemLoading, setIsSystemLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (isOpen && !u) {
        try {
          const cred = await signInAnonymously(auth);
          setUser(cred.user);
        } catch (err: any) {
          setError('فشل تأمين الجلسة: ' + err.message);
        }
      } else {
        setUser(u);
      }
      setIsSystemLoading(false);
    });
    return () => unsubscribe();
  }, [isOpen]);
  
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
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطبق؟')) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteDoc(doc(db, 'menu', id));
        if (editingId === id) {
          setEditingId(null);
          setFormData(initialFormState);
        }
      } catch (err: any) {
        setError('خطأ في الحذف: ' + (err.code === 'permission-denied' ? 'غير مصرح لك بالقيام بهذه العملية' : err.message));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setEditingId('new');
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await setDoc(doc(db, 'menu', formData.id), formData);
      setEditingId(null);
      setFormData(initialFormState);
    } catch (err: any) {
      setError('خطأ في الحفظ: ' + (err.code === 'permission-denied' ? 'غير مصرح لك بالقيام بهذه العملية' : err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeMenu = async () => {
    if (confirm('سيتم تحميل القائمة الافتراضية إلى قاعدة البيانات. هل تريد الاستمرار؟')) {
      setIsLoading(true);
      setError(null);
      try {
        const batch = writeBatch(db);
        INITIAL_MENU_ITEMS.forEach((item) => {
          const docRef = doc(db, 'menu', item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
        alert('تم تهيئة القائمة بنجاح');
      } catch (err: any) {
        setError('خطأ في التهيئة: ' + (err.code === 'permission-denied' ? 'غير مصرح لك بالقيام بهذه العملية' : err.message));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col md:flex-row overflow-hidden backdrop-blur-xl">
      {/* List Section */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-l border-[#2a2a2a] flex flex-col bg-[#050505]">
        <div className="p-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#0a0a0a]">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white">إدارة قائمة الطعام</h2>
            {user && (
              <div className="text-[8px] text-gray-500 font-sans mt-1">{user.email}</div>
            )}
          </div>
          <div className="flex gap-2">
            {user && (
              <button
                onClick={handleAddNew}
                className="bg-[var(--color-luxury-red)] hover:bg-[var(--color-luxury-red-dark)] text-white p-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">إضافة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-[#222] hover:bg-[#333] text-white p-2 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 text-red-400 p-3 text-sm border-b border-red-900/50 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)}><X size={14} /></button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 hide-scrollbar">
          {menuItems.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <Database size={48} className="text-gray-700" />
              <p className="text-gray-500 text-center text-sm">قاعدة البيانات فارغة</p>
              {user && (
                <button 
                  onClick={handleInitializeMenu}
                  className="bg-[#1a1a1a] border border-[#333] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#222] transition-all text-xs"
                >
                  تحميل القائمة الافتراضية
                </button>
              )}
            </div>
          )}
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
                  disabled={!user || isLoading}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-[#222] hover:bg-[#333] text-red-500 rounded-lg transition-colors"
                  disabled={!user || isLoading}
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
                disabled={isLoading}
                className="flex-1 bg-[var(--color-luxury-red)] hover:bg-[var(--color-luxury-red-dark)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'جاري الحفظ...' : <><Save size={18} /> حفظ</>}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-[#222] hover:bg-[#333] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50 gap-4">
            {isSystemLoading ? (
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-luxury-gold)]" />
            ) : (
              <>
                <ImageIcon size={64} />
                <p className="text-lg text-center">اختر طبقاً للتعديل أو أضف طبقاً جديداً</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
