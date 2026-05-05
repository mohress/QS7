export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priceIQD: number;
  image: string;
  isOffer?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: 'dishes', nameAr: 'أطباق رئيسية', nameEn: 'Dishes' },
  { id: 'drinks', nameAr: 'مشروبات', nameEn: 'Drinks' },
  { id: 'desserts', nameAr: 'حلويات', nameEn: 'Desserts' },
  { id: 'offers', nameAr: 'عروض', nameEn: 'Offers' },
];

export const MENU_ITEMS: MenuItem[] = [
  // Offers
  {
    id: 'offer1',
    categoryId: 'offers',
    nameAr: 'عرض شيف لوميير',
    nameEn: "Lumière Chef's Special",
    descriptionAr: 'ستيك ريب آي مع بطاطا مهروسة بالكمأة، ويشمل مشروب من اختيارك.',
    descriptionEn: 'Ribeye steak with truffle mashed potatoes, includes a drink of your choice.',
    priceIQD: 45000,
    image: 'https://images.unsplash.com/photo-1544025162-831550febcfl?auto=format&fit=crop&q=80&w=800&h=450',
    isOffer: true
  },
  {
    id: 'offer2',
    categoryId: 'offers',
    nameAr: 'العشاء الرومانسي',
    nameEn: 'Romantic Dinner Set',
    descriptionAr: 'طبقين رئيسيين، نوعين مقبلات، وحلويات لشخصين.',
    descriptionEn: 'Two main courses, two appetizers, and dessert for two.',
    priceIQD: 85000,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800&h=450',
    isOffer: true
  },

  // Dishes
  {
    id: 'dish1',
    categoryId: 'dishes',
    nameAr: 'ستيك تندرلوين',
    nameEn: 'Tenderloin Steak',
    descriptionAr: 'قطعة لحم تندرلوين فاخرة مشوية حسب اختيارك مع صلصة الفلفل الأسود.',
    descriptionEn: 'Premium grilled tenderloin cut cooked to your preference with black pepper sauce.',
    priceIQD: 38000,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800&h=450',
  },
  {
    id: 'dish2',
    categoryId: 'dishes',
    nameAr: 'سلمون مشوي',
    nameEn: 'Grilled Salmon',
    descriptionAr: 'فيليه سلمون نرويجي משوي مع خضار سوتيه وصلصة الليمون بالزبدة.',
    descriptionEn: 'Grilled Norwegian salmon fillet with sautéed vegetables and lemon butter sauce.',
    priceIQD: 32000,
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800&h=450',
  },
  {
    id: 'dish3',
    categoryId: 'dishes',
    nameAr: 'ريزوتو الفطر والكمأة',
    nameEn: 'Truffle Mushroom Risotto',
    descriptionAr: 'ريزوتو إيطالي أصيل محضر مع الفطر البري وزيت الكمأة الطازج.',
    descriptionEn: 'Authentic Italian risotto prepared with wild mushrooms and fresh truffle oil.',
    priceIQD: 26000,
    image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&q=80&w=800&h=450',
  },

  // Drinks
  {
    id: 'drink1',
    categoryId: 'drinks',
    nameAr: 'موخيتو التوت البري',
    nameEn: 'Wild Berry Mojito',
    descriptionAr: 'مزيج منعش من التوت البري، النعناع، الليمون والصودا.',
    descriptionEn: 'Refreshing blend of wild berries, mint, lime, and soda.',
    priceIQD: 8000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800&h=450',
  },
  {
    id: 'drink2',
    categoryId: 'drinks',
    nameAr: 'قهوة مختصة (V60)',
    nameEn: 'Specialty Coffee (V60)',
    descriptionAr: 'قهوة مقطرة بعناية من أفضل حبوب البن الكولومبية.',
    descriptionEn: 'Carefully drip coffee made from the finest Colombian beans.',
    priceIQD: 7000,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800&h=450',
  },
  {
    id: 'drink3',
    categoryId: 'drinks',
    nameAr: 'عصير برتقال طازج',
    nameEn: 'Fresh Orange Juice',
    descriptionAr: 'عصير برتقال معصور طازجاً بدون إضافات.',
    descriptionEn: 'Freshly squeezed orange juice, no additives.',
    priceIQD: 6000,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800&h=450',
  },

  // Desserts
  {
    id: 'dessert1',
    categoryId: 'desserts',
    nameAr: 'تيراميسو الكلاسيكي',
    nameEn: 'Classic Tiramisu',
    descriptionAr: 'حلوى التيراميسو الإيطالية الأصيلة مع طبقات الماسكاربوني والإسبريسو.',
    descriptionEn: 'Authentic Italian Tiramisu with layers of mascarpone and espresso.',
    priceIQD: 12000,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800&h=450',
  },
  {
    id: 'dessert2',
    categoryId: 'desserts',
    nameAr: 'كيك الشوكولاتة الذائبة',
    nameEn: 'Molten Chocolate Cake',
    descriptionAr: 'كيكة الشوكولاتة الدافئة مع قلب غني ومحشوة بآيس كريم الفانيليا.',
    descriptionEn: 'Warm chocolate cake with a rich molten center, served with vanilla ice cream.',
    priceIQD: 14000,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800&h=450',
  }
];
