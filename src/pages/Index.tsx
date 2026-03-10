import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Product {
  id: string;
  name: string;
  category: string;
  weights: number[];
  pricePerKg?: number;
  prices?: Record<number, number>;
  image: string;
  description?: string;
  isNew?: boolean;
}

interface CartItem {
  product: Product;
  weight: number;
  quantity: number;
}

const products: Product[] = [
  { id: '22', name: 'Картофель "Королева Анна" мытый', category: 'Картофель', weights: [10], prices: { 10: 800 }, image: 'https://cdn.poehali.dev/files/1002767412.jpg', description: 'Ранний сорт с тонкой кожурой и желтой нежной мякотью. Мытый, готов к приготовлению. Сладковатый вкус и кремовая текстура. Превосходен для пюре, запеканок и жарки.', isNew: true },
  { id: '1', name: 'Картофель "Балтик Роуз"', category: 'Картофель', weights: [20], prices: { 20: 1200 }, image: 'https://cdn.poehali.dev/files/1000000688.jpg', description: 'Среднеспелый сорт с розоватой кожурой и светлой мякотью. Нежный вкус и рассыпчатая текстура. Идеален для запекания, жарки, пюре и салатов. Хорошо хранится.' },

  { id: '2', name: 'Картофель "Коломбо"', category: 'Картофель', weights: [10], prices: { 10: 700 }, image: 'https://cdn.poehali.dev/files/1002767599.jpg', description: 'Среднеспелый сорт с желтой мякотью. Кремовая текстура и насыщенный вкус. Сохраняет форму при варке — идеален для первых блюд и тушения.' },
  { id: '12', name: 'Картофель "Королева Анна Супер Элита"', category: 'Картофель', weights: [20], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002767412.jpg', description: 'Ранний сорт с тонкой кожурой и желтой нежной мякотью. Сладковатый вкус и кремовая текстура. Превосходен для пюре, запеканок, жарки. Не разваливается — идеален для салатов.' },
  { id: '23', name: 'Картофель "Гала" продовольственный', category: 'Картофель', weights: [34], prices: { 34: 1550 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/ad03397e-5920-4ead-9c21-a33740852c79.jpg', description: 'Продовольственный картофель "Гала" в сетке 34 кг. Ранний высокоурожайный сорт с желтой мякотью. Не разваривается при варке, хорошие вкусовые качества.' },
  { id: '20', name: 'Картофель "Гала" семенной', category: 'Картофель', weights: [10, 20], pricePerKg: 40, image: 'https://cdn.poehali.dev/files/1002897457.jpg', description: 'Семенной картофель "Гала" - ранний, высокоурожайный сорт столового назначения. Период созревания от посадки до сбора урожая 70-80 дней. Преимущество сорта: высокая урожайность, имеет хорошие вкусовые качества, не разваривается при варке, содержит большое количество каротина. Клубни округло-овальной формы. Кожура жёлтого цвета с мелкими глазками, мякоть насыщенного желтого цвета. Урожайность с одного куста: до 25 клубней.' },
  { id: '21', name: 'Картофель "Казачок"', category: 'Картофель', weights: [20], prices: { 20: 1200 }, image: 'https://cdn.poehali.dev/files/1002862248.jpg', description: 'Картофель Казачок среднепоздний, столового назначения. Желтая мякоть, округлая форма, мелкие глазки.' },
  { id: '24', name: 'Картофель "Ла Страда"', category: 'Картофель', weights: [20], prices: { 20: 1200 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/78d78ab0-0272-42ad-ae99-25e235eba3d1.jpg', description: 'Столовый сорт шотландской селекции с белоснежной мякотью. Идеален для жарки — образует хрустящую корочку, не разваливается. Плотная текстура, насыщенный вкус.' },
  { id: '13', name: 'Сборная сетка 10кг: Лук + Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897358.jpg', description: 'Готовый набор основных овощей для борща и других блюд. Экономия времени и денег.' },
  { id: '14', name: 'Сборная сетка 10кг: Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897342.jpg', description: 'Идеальное сочетание для приготовления салатов и гарниров.' },
  { id: '15', name: 'Сборная сетка 10кг: Морковь + Лук', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897335.jpg', description: 'Базовый набор для супов, подлив и зажарок.' },
  { id: '17', name: 'Лук 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897347.jpg', description: 'Отборный репчатый лук. Крупный, плотный, долго хранится.' },
  { id: '18', name: 'Морковь 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897342.jpg', description: 'Сладкая сочная морковь. Богата каротином и витаминами.' },
  { id: '19', name: 'Свекла 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897354.jpg', description: 'Столовая свекла насыщенного бордового цвета. Для борщей, винегретов и салатов.' },
  { id: '9', name: 'Капуста квашеная', category: 'Заготовки', weights: [2], pricePerKg: 200, image: 'https://cdn.poehali.dev/files/1002520711.jpg', description: 'Хрустящая квашеная капуста по рецепту из ГОСТ 1956 года. В составе только капуста, морковь, соль.' },
  { id: '10', name: 'Огурчики бочковые', category: 'Заготовки', weights: [1.5], prices: { 1.5: 500 }, image: 'https://cdn.poehali.dev/files/1002520708.jpg', description: 'Дерзкие бочковые огурчики, традиционный рецепт без уксуса. Плотные, хрустящие. Сложно остановиться.' },
  { id: '16', name: 'Масло соевое', category: 'Заготовки', weights: [5], prices: { 5: 750 }, image: 'https://cdn.poehali.dev/files/1001628999.jpg', description: 'Масло приготовленное технологией холодного пресса-без растворителей. Янтарного цвета, густое, с ароматом сои.' },
];

const faqItems = [
  { question: 'Куда вы доставляете?', answer: 'Мы доставляем во Владивосток, Артем, Надеждинск, Большой Камень и Фокино. Бесплатная доставка от 20 кг любой продукции. Если по пути — завозим меньше, согласовываем индивидуально.' },
  { question: 'Сколько стоит доставка?', answer: 'Бесплатная доставка при заказе от 20 кг любой продукции. Привозим прямо в квартиру, поднимаем на этаж. Если ваш заказ по пути — можем доставить и меньше, согласуем индивидуально.' },
  { question: 'Как быстро привезёте?', answer: 'Время доставки согласовываем индивидуально по телефону или в мессенджере, в зависимости от маршрута и района.' },
  { question: 'Можно ли заказать меньше 20 кг?', answer: 'Да! Если ваш заказ по пути нашего маршрута — привезём меньше 20 кг. Условия согласовываем индивидуально.' },
  { question: 'Как оплатить заказ?', answer: 'Оплата наличными при получении.' },
  { question: 'Откуда ваши овощи?', answer: 'Мы выращиваем овощи на собственной ферме в Приморском крае. Без химических удобрений, только натуральные методы.' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState('home');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'both' | 'telegram' | 'whatsapp'>('both');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const weight = selectedWeights[product.id] || product.weights[0];
    const existingItem = cart.find(item => item.product.id === product.id && item.weight === weight);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id && item.weight === weight
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, weight, quantity: 1 }]);
    }
    toast.success(`${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: string, weight: number) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.weight === weight)));
  };

  const updateQuantity = (productId: string, weight: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart(cart.map(item =>
      item.product.id === productId && item.weight === weight
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getPrice = (product: Product, weight: number) => {
    if (product.prices && product.prices[weight]) {
      return product.prices[weight];
    }
    return (product.pricePerKg || 0) * weight;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (getPrice(item.product, item.weight) * item.quantity), 0);
  };

  const getTotalWeight = () => {
    return cart.reduce((total, item) => total + (item.weight * item.quantity), 0);
  };

  const isMinOrderMet = () => {
    return getTotalWeight() >= 20 || getTotalPrice() >= 2000;
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderSubmit = () => {
    if (!isMinOrderMet()) {
      toast.error('Минимальный заказ — от 20 кг или от 2 000 ₽');
      return;
    }
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    let orderText = `🛒 Новый заказ\n\n`;
    orderText += `👤 Имя: ${customerName}\n`;
    orderText += `📱 Телефон: ${customerPhone}\n`;
    orderText += `📍 Адрес: ${customerAddress}\n\n`;
    orderText += `Состав заказа:\n`;
    
    cart.forEach((item, index) => {
      let weightLabel = `${item.weight}кг`;
      if (item.product.id === '11' && item.weight === 0.5) weightLabel = '500мл';
      if (item.product.id === '16' && item.weight === 5) weightLabel = '5л';
      orderText += `${index + 1}. ${item.product.name} — ${weightLabel} × ${item.quantity}шт = ${getPrice(item.product, item.weight) * item.quantity}₽\n`;
    });
    
    orderText += `\n💰 Итого: ${getTotalPrice()}₽`;

    const encodedText = encodeURIComponent(orderText);
    const phone = '79025553558';
    
    if (deliveryMethod === 'both' || deliveryMethod === 'telegram') {
      window.open(`https://t.me/FermaVDK?text=${encodedText}`, '_blank');
    }
    
    if (deliveryMethod === 'both' || deliveryMethod === 'whatsapp') {
      window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
    }
    
    toast.success('Спасибо за заказ! Оператор ответит Вам в ближайшее время!', {
      duration: 5000,
    });
    
    setCart([]);
    localStorage.removeItem('cart');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <div className="text-2xl font-bold text-primary">ФермаВДК</div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('home')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'home' ? 'text-primary' : 'text-foreground'}`}>Главная</button>
            <button onClick={() => scrollToSection('catalog')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'catalog' ? 'text-primary' : 'text-foreground'}`}>Каталог</button>
            <button onClick={() => scrollToSection('about')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'about' ? 'text-primary' : 'text-foreground'}`}>О нас</button>
            <button onClick={() => scrollToSection('delivery')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'delivery' ? 'text-primary' : 'text-foreground'}`}>Доставка</button>
            <button onClick={() => scrollToSection('faq')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'faq' ? 'text-primary' : 'text-foreground'}`}>FAQ</button>
            <button onClick={() => scrollToSection('contacts')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'contacts' ? 'text-primary' : 'text-foreground'}`}>Контакты</button>
            <div className="flex items-center gap-2 ml-2">
              <a href="tel:+79025553558" className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Icon name="Phone" size={18} />
              </a>
              <a href="https://wa.me/79025553558" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors">
                <Icon name="MessageCircle" size={18} />
              </a>
              <a href="https://t.me/FermaVDK" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#0088cc] text-white hover:bg-[#0077b5] transition-colors">
                <Icon name="Send" size={18} />
              </a>
            </div>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <div key={`${item.product.id}-${item.weight}-${index}`} className="flex items-center gap-4 p-4 bg-accent rounded-lg">
                        <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                          {item.product.image.startsWith('http') ? (
                            <img 
                              src={item.product.image} 
                              alt={`${item.product.name} в корзине`} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-3xl">{item.product.image}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.product.id === '11' && item.weight === 0.5 ? '500 мл' : `${item.weight} кг`} × {getPrice(item.product, item.weight)} ₽</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.weight, item.quantity - 1)}>
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.weight, item.quantity + 1)}>
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{getPrice(item.product, item.weight) * item.quantity} ₽</p>
                          <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.product.id, item.weight)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-primary">{getTotalPrice()} ₽</span>
                      </div>
                      <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                        <span>Общий вес:</span>
                        <span>{getTotalWeight()} кг</span>
                      </div>
                      {!isMinOrderMet() && (
                        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
                          Минимальный заказ — от 20 кг или от 2 000 ₽. Сейчас: {getTotalWeight()} кг / {getTotalPrice()} ₽
                        </div>
                      )}
                      <div className="space-y-3 mb-4">
                        <div>
                          <Label htmlFor="name">Имя</Label>
                          <Input id="name" placeholder="Введите ваше имя" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="phone">Телефон</Label>
                          <InputMask 
                            mask="+7 (999) 999-99-99" 
                            value={customerPhone} 
                            onChange={(e) => setCustomerPhone(e.target.value)}
                          >
                            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => <Input {...inputProps} id="phone" placeholder="+7 (___) ___-__-__" />}
                          </InputMask>
                        </div>
                        <div>
                          <Label htmlFor="address">Адрес доставки</Label>
                          <Textarea id="address" placeholder="Улица, дом, квартира" rows={3} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                        </div>
                        <div>
                          <Label>Способ отправки</Label>
                          <div className="flex gap-2">
                            <Button 
                              type="button"
                              variant={deliveryMethod === 'both' ? 'default' : 'outline'} 
                              className="flex-1 text-sm"
                              onClick={() => setDeliveryMethod('both')}
                            >
                              Оба
                            </Button>
                            <Button 
                              type="button"
                              variant={deliveryMethod === 'telegram' ? 'default' : 'outline'} 
                              className="flex-1 text-sm"
                              onClick={() => setDeliveryMethod('telegram')}
                            >
                              <Icon name="Send" size={16} className="mr-1" />
                              Telegram
                            </Button>
                            <Button 
                              type="button"
                              variant={deliveryMethod === 'whatsapp' ? 'default' : 'outline'} 
                              className="flex-1 text-sm"
                              onClick={() => setDeliveryMethod('whatsapp')}
                            >
                              <Icon name="MessageCircle" size={16} className="mr-1" />
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full" size="lg" onClick={handleOrderSubmit} disabled={!isMinOrderMet()}>
                        Оформить заказ
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">🚚 Бесплатная доставка в квартиру</p>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>
        <section id="home" className="py-20 bg-gradient-to-b from-accent to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
                Свежие овощи от фермера
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Доставляем натуральные продукты напрямую с полей. Без посредников, без химии, только польза природы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => scrollToSection('catalog')} className="text-lg">
                  <Icon name="ShoppingBag" size={20} className="mr-2" />
                  Смотреть каталог
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg">
                  <a href="tel:+79025553558">
                    <Icon name="Phone" size={20} className="mr-2" />
                    Позвонить
                  </a>
                </Button>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
                <a 
                  href="https://chat.whatsapp.com/KUNWRMPsweQ7K6YIOj7TTL?mode=wwt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#22c55e] transition-colors text-sm font-medium"
                >
                  <Icon name="MessageCircle" size={18} />
                  <span>Группа WhatsApp</span>
                </a>
                <a 
                  href="https://max.ru/id251004790824_biz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-sm font-medium"
                >
                  <Icon name="MessageSquare" size={18} />
                  <span>Канал MAX</span>
                </a>
                <a 
                  href="https://t.me/FermaVladivostok" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-colors text-sm font-medium"
                >
                  <Icon name="Send" size={18} />
                  <span>Канал Telegram</span>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="text-sm font-medium">100% натурально</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🚚</div>
                  <p className="text-sm font-medium">Бесплатная доставка от 20кг</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="text-sm font-medium">Прямо от фермера</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">Наш ассортимент</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className={`overflow-hidden hover:shadow-lg transition-shadow animate-scale-in flex flex-col ${product.isNew ? 'ring-2 ring-red-500 shadow-lg shadow-red-100' : ''}`}>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="mb-4 aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-accent relative">
                      {product.isNew && (
                        <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-500 text-white font-bold text-sm px-3 py-1 animate-pulse shadow-md">Новинка</Badge>
                      )}
                      {product.image.startsWith('http') ? (
                        <img 
                          src={product.image} 
                          alt={`${product.name} - ${product.description || 'фермерские продукты с доставкой во Владивостоке'}`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-6xl">{product.image}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <Badge variant="secondary" className="mb-3">{product.category}</Badge>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex-1">{product.description}</p>
                    )}
                    <div className="space-y-3 mt-auto">
                      <div>
                        <Label className="text-xs text-muted-foreground">Выберите вес</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.weights.map((weight) => {
                            const price = getPrice(product, weight);
                            const pricePerKg = product.prices && product.prices[weight] ? Math.round(product.prices[weight] / weight) : product.pricePerKg;
                            let weightLabel = `${weight} кг`;
                            if (product.id === '11' && weight === 0.5) weightLabel = '500 мл';
                            if (product.id === '16' && weight === 5) weightLabel = '5 л';
                            return (
                              <Button
                                key={weight}
                                size="sm"
                                variant={selectedWeights[product.id] === weight ? 'default' : 'outline'}
                                onClick={() => setSelectedWeights({ ...selectedWeights, [product.id]: weight })}
                                className="flex-1 min-w-[80px] flex flex-col items-center gap-0 h-auto py-2"
                              >
                                <span className="font-bold">{weightLabel}</span>
                                <span className="text-xs">{price}₽</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-primary">О нас</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Мы — семейная ферма с 11-летним опытом выращивания и доставки экологически чистых овощей во Владивостоке, Артеме, Надеждинске, Большом Камне и Фокино. 
                Наши поля расположены в экологически чистом районе Приморского края, вдали от промышленных предприятий.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Мы не используем химические удобрения и пестициды. Только натуральные органические подкормки 
                и традиционные методы земледелия. Каждый овощ выращен с любовью и заботой о вашем здоровье. 
                Доставляем свежие овощи и заготовки по всему Приморью.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-white rounded-lg">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="font-bold mb-2">11 лет опыта</h3>
                  <p className="text-sm text-muted-foreground">Знаем всё о выращивании качественных овощей</p>
                </div>
                <div className="p-6 bg-white rounded-lg">
                  <div className="text-4xl mb-3">🌿</div>
                  <h3 className="font-bold mb-2">Без химии</h3>
                  <p className="text-sm text-muted-foreground">Только натуральные удобрения и уход</p>
                </div>
                <div className="p-6 bg-white rounded-lg">
                  <div className="text-4xl mb-3">❤️</div>
                  <h3 className="font-bold mb-2">С любовью</h3>
                  <p className="text-sm text-muted-foreground">Заботимся о каждом растении</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="delivery" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-primary">Доставка</h2>
              <div className="space-y-6">
                <Card className="border-2 border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🚚</div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Бесплатная доставка от 20 кг</h3>
                        <p className="text-muted-foreground mb-2">
                          Бесплатная доставка от 20 кг любой продукции прямо в вашу квартиру. 
                          Если ваш заказ по пути — привезём меньше, условия согласуем индивидуально.
                        </p>
                        <p className="text-sm font-medium text-primary">
                          📞 Звоните: 8-902-555-35-58
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">📍</div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">География доставки</h3>
                        <p className="text-muted-foreground mb-3">
                          Доставляем по Владивостоку и Приморскому краю:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Владивосток</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Артём</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Надеждинск</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Большой Камень</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Фокино</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Де-Фриз</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>о. Русский</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Большой Камень</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Фокино</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>п. Новый</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Раздольное</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>Кипарисово</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Уточните возможность доставки по телефону: 8-902-555-35-58
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-primary">Часто задаваемые вопросы</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-primary">Контакты</h2>
              <Card className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Icon name="Phone" size={24} className="text-primary" />
                    <a href="tel:+79025553558" className="text-xl font-semibold hover:text-primary transition-colors">
                      8-902-555-35-58
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Icon name="MapPin" size={24} className="text-primary" />
                    <p className="text-xl font-semibold">Приморский край, п. Заводской</p>
                  </div>
                  <div className="pt-6 border-t mt-6">
                    <p className="text-muted-foreground mb-6">Работаем ежедневно с 9:00 до 19:00</p>
                    <div className="flex flex-col gap-3">
                      <a 
                        href="https://chat.whatsapp.com/KUNWRMPsweQ7K6YIOj7TTL?mode=wwt" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#22c55e] transition-colors"
                      >
                        <Icon name="MessageCircle" size={20} />
                        <span className="font-semibold">Группа WhatsApp</span>
                      </a>
                      <a 
                        href="https://max.ru/join/A0Im7QSZxCi4-ehXt_uTDyD12VSnqUwiYonh_uM3KJI" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                      >
                        <Icon name="MessageSquare" size={20} />
                        <span className="font-semibold">Чат MAX</span>
                      </a>
                      <a 
                        href="https://t.me/FermaVladivostok" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-colors"
                      >
                        <Icon name="Send" size={20} />
                        <span className="font-semibold">Канал Telegram</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <Icon name="ArrowUp" size={24} />
        </Button>
      )}

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🌾</span>
            <h3 className="text-2xl font-bold">ФермаВДК</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">
            © 2024 ФермаВДК. Свежие овощи от фермера.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://metrika.yandex.ru/stat/?id=105797153&from=informer" 
              target="_blank" 
              rel="nofollow noopener noreferrer"
            >
              <img 
                src="https://informer.yandex.ru/informer/105797153/3_1_FFFFFFFF_EFEFEFFF_0_pageviews" 
                style={{width: '88px', height: '31px', border: '0'}} 
                alt="Яндекс.Метрика" 
                title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/79025553558?text=Здравствуйте!%20Хочу%20заказать%20овощи%20с%20фермы"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Заказать в WhatsApp"
      >
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Заказать в WhatsApp
        </span>
      </a>
    </div>
  );
}