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
  awaiting?: boolean;
  tag?: string;
}

interface CartItem {
  product: Product;
  weight: number;
  quantity: number;
}

const products: Product[] = [
  { id: '12', name: 'Картофель "Королева Анна"', category: 'Картофель', weights: [35], prices: { 35: 1750 }, image: 'https://cdn.poehali.dev/files/1002767412.jpg', description: 'Прекрасно подходит для варки и жарки. Универсальный сорт.', isNew: true, tag: 'Универсальный' },
  { id: '27', name: 'Картофель Лили', category: 'Картофель', weights: [20], prices: { 20: 1400 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/64821ca3-fbed-4fdd-a1d9-cf7bd1501177.jpeg', description: 'Картофель «Лили» — универсальный сорт, родственный знаменитой «Андретте». Крупные ровные клубни с коричневой шкуркой и жёлтой мякотью отлично подходят для варки, нежного пюре и запекания.', isNew: true, tag: 'Для варки' },
  { id: '29', name: 'Помидоры солёные, традиционный рецепт', category: 'Заготовки', weights: [3], prices: { 3: 700 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/1851bf8f-7434-4bc6-9f41-6e05d753a819.jpeg', description: 'Сочные домашние помидоры, солёные по традиционному рецепту с хреном, чесночком и дубовым листиком. Натуральный состав, насыщенный вкус и аппетитный аромат.', isNew: true, awaiting: true },
  { id: '28', name: 'Картофель молодой "Беллароза" урожай 2026г', category: 'Картофель', weights: [20], prices: { 20: 1400 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/533f13b0-061b-437c-8660-ac97d387c565.jpeg', description: 'Молодой картофель сорта Беллароза, урожай 2026 года. Нежная тонкая кожица, рассыпчатая мякоть. Прекрасно подходит для варки и запекания.', isNew: true, awaiting: true },
  { id: '16', name: 'Масло соевое', category: 'Заготовки', weights: [5], prices: { 5: 750 }, image: 'https://cdn.poehali.dev/files/1001628999.jpg', description: 'Масло приготовленное технологией холодного пресса-без растворителей. Янтарного цвета, густое, с ароматом сои.' },

  { id: '22', name: 'Картофель "Королева Анна" мытый', category: 'Картофель', weights: [10], prices: { 10: 800 }, image: 'https://cdn.poehali.dev/files/1002767412.jpg', description: 'Мытый, готов к приготовлению. Прекрасно подходит для варки и жарки. Универсальный сорт.', isNew: true, awaiting: true },
  { id: '23', name: 'Картофель "Гала" продовольственный', category: 'Картофель', weights: [34], prices: { 34: 1550 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/ad03397e-5920-4ead-9c21-a33740852c79.jpg', description: 'Продовольственный картофель "Гала" в сетке 34 кг. Ранний высокоурожайный сорт с желтой мякотью. Не разваривается при варке, хорошие вкусовые качества.', awaiting: true },
  { id: '26', name: 'Картофель "Гала" семенной, 1-я репродукция', category: 'Семенной картофель', weights: [10], prices: { 10: 400 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/ad03397e-5920-4ead-9c21-a33740852c79.jpg', description: 'Семенной картофель "Гала" 1-й репродукции. Ранний высокоурожайный сорт с жёлтой мякотью. Не разваривается при варке, отличные вкусовые качества.', awaiting: true },
  { id: '25', name: 'Картофель Балтик роуз', category: 'Картофель', weights: [20], prices: { 20: 1400 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/733d80c1-c33b-482b-ba2a-b7523e83b2d6.jpg', description: '"Балтик Роуз" — поздний сорт для длительного хранения. Яркая розовая кожура, насыщенно жёлтая мякоть. Отличные вкусовые качества' },
  { id: '20', name: 'Картофель "Коломбо" семенной', category: 'Семенной картофель', weights: [10, 20], pricePerKg: 40, image: 'https://cdn.poehali.dev/files/1002897457.jpg', description: 'Семенной картофель "Коломбо" - ранний, высокоурожайный сорт столового назначения. Период созревания от посадки до сбора урожая 70-80 дней. Преимущество сорта: высокая урожайность, имеет хорошие вкусовые качества, не разваривается при варке. Клубни округло-овальной формы. Кожура светло-жёлтого цвета с мелкими глазками, мякоть светло-жёлтого цвета.', awaiting: true },

  { id: '24', name: 'Картофель "Ла Страда"', category: 'Картофель', weights: [35], prices: { 35: 1600 }, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/78d78ab0-0272-42ad-ae99-25e235eba3d1.jpg', description: 'Крупный картофель, с белой мякотью и насыщенным вкусом и ароматом. Кремовая текстура.', isNew: true, tag: 'Для жарки' },
  { id: '13', name: 'Сборная сетка 10кг: Лук + Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897358.jpg', description: 'Готовый набор основных овощей для борща и других блюд. Экономия времени и денег.', awaiting: true },
  { id: '14', name: 'Сборная сетка 10кг: Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897342.jpg', description: 'Идеальное сочетание для приготовления салатов и гарниров.', awaiting: true },
  { id: '15', name: 'Сборная сетка 10кг: Морковь + Лук', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897335.jpg', description: 'Базовый набор для супов, подлив и зажарок.', awaiting: true },
  { id: '17', name: 'Лук 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897347.jpg', description: 'Отборный репчатый лук. Крупный, плотный, долго хранится.', awaiting: true },
  { id: '18', name: 'Морковь 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897342.jpg', description: 'Сладкая сочная морковь. Богата каротином и витаминами.', awaiting: true },
  { id: '19', name: 'Свекла 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897354.jpg', description: 'Столовая свекла насыщенного бордового цвета. Для борщей, винегретов и салатов.', awaiting: true },
  { id: '9', name: 'Капуста квашеная', category: 'Заготовки', weights: [2], pricePerKg: 200, image: 'https://cdn.poehali.dev/files/1002520711.jpg', description: 'Хрустящая квашеная капуста по рецепту из ГОСТ 1956 года. В составе только капуста, морковь, соль.', awaiting: true },
  { id: '10', name: 'Огурчики бочковые', category: 'Заготовки', weights: [1.5], prices: { 1.5: 500 }, image: 'https://cdn.poehali.dev/files/1002520708.jpg', description: 'Дерзкие бочковые огурчики, традиционный рецепт без уксуса. Плотные, хрустящие. Сложно остановиться.', awaiting: true },
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
  const [deliveryMethod, setDeliveryMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [pendingOrder, setPendingOrder] = useState<{ method: 'sms' | 'whatsapp'; text: string } | null>(() => {
    try {
      const saved = localStorage.getItem('pendingOrder');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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

    let orderText = `Новый заказ! Имя: ${customerName}, Тел: ${customerPhone}, Адрес: ${customerAddress}. Состав: `;
    
    cart.forEach((item, index) => {
      let weightLabel = `${item.weight}кг`;
      if (item.product.id === '11' && item.weight === 0.5) weightLabel = '500мл';
      if (item.product.id === '16' && item.weight === 5) weightLabel = '5л';
      orderText += `${item.product.name} ${weightLabel}x${item.quantity}=${getPrice(item.product, item.weight) * item.quantity}р`;
      if (index < cart.length - 1) orderText += ', ';
    });
    
    orderText += `. Итого: ${getTotalPrice()}р`;

    const order = { method: deliveryMethod, text: orderText };
    fetch('https://functions.poehali.dev/f26cdb87-1963-44cc-ba6c-0abace57a592', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: orderText })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          confirmOrderSent();
        } else {
          throw new Error('send failed');
        }
      })
      .catch(() => {
        localStorage.setItem('pendingOrder', JSON.stringify(order));
        setPendingOrder(order);
        openOrderChannel(order);
      });
  };

  const openOrderChannel = (order: { method: 'sms' | 'whatsapp'; text: string }) => {
    const operatorPhone = '79025553558';
    const encodedText = encodeURIComponent(order.text);
    if (order.method === 'sms') {
      window.location.href = `sms:${operatorPhone}?body=${encodedText}`;
    } else {
      window.open(`https://wa.me/${operatorPhone}?text=${encodedText}`, '_blank');
    }
  };

  const closePendingOrder = () => {
    localStorage.removeItem('pendingOrder');
    setPendingOrder(null);
  };

  const confirmOrderSent = () => {
    toast.success('Спасибо за заказ! Оператор свяжется с вами в ближайшее время! В связи с нестабильной связью, если вы не получили от нас ответа, перезвоните пожалуйста: 8902-555-35-58', {
      duration: 10000,
    });
    setCart([]);
    localStorage.removeItem('cart');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    closePendingOrder();
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/f150df60-353c-49d5-b8b2-e4dbd9857dd9.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {pendingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-2">
              {pendingOrder.method === 'sms' ? 'Вы отправили SMS с заказом?' : 'Вы отправили заказ в WhatsApp?'}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Заказ дойдёт до нас, только когда вы нажмёте «Отправить». Пока вы не подтвердили, заказ сохранён.
            </p>
            <div className="flex flex-col gap-2">
              <Button size="lg" onClick={confirmOrderSent}>Да, отправил</Button>
              <Button size="lg" variant="secondary" onClick={() => openOrderChannel(pendingOrder)}>Открыть сообщение ещё раз</Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+79025553558">
                  <Icon name="Phone" size={16} className="mr-2" />
                  Позвонить оператору 8-902-555-35-58
                </a>
              </Button>
              <Button size="lg" variant="ghost" onClick={closePendingOrder}>Вернуться к заказу</Button>
            </div>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 glass shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">ФермаВДК</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('home')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'home' ? 'text-primary' : 'text-foreground'}`}>Главная</button>
            <button onClick={() => scrollToSection('catalog')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'catalog' ? 'text-primary' : 'text-foreground'}`}>Каталог</button>
            <button onClick={() => scrollToSection('seeds')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'seeds' ? 'text-primary' : 'text-foreground'}`}>Семенной</button>
            <button onClick={() => scrollToSection('about')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'about' ? 'text-primary' : 'text-foreground'}`}>О нас</button>
            <button onClick={() => scrollToSection('delivery')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'delivery' ? 'text-primary' : 'text-foreground'}`}>Доставка</button>
            <button onClick={() => scrollToSection('faq')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'faq' ? 'text-primary' : 'text-foreground'}`}>FAQ</button>
            <button onClick={() => scrollToSection('contacts')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'contacts' ? 'text-primary' : 'text-foreground'}`}>Контакты</button>
            <div className="flex items-center gap-2 ml-2">
              <a href="tel:+79025553558" className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all font-medium text-sm">
                <Icon name="Phone" size={16} />
                Позвонить 8-902-555-35-58
              </a>
            </div>
          </nav>
          <a href="tel:+79025553558" className="md:hidden flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm shadow-md">
            <Icon name="Phone" size={16} />
            Позвонить
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative rounded-full">
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
                      <Button className="w-full" size="lg" variant="outline" asChild>
                        <a href="tel:+79025553558">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Позвонить оператору 8-902-555-35-58
                        </a>
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
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-6">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-white/20 bg-white/95 backdrop-blur-sm grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <img
                  src="https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/1851bf8f-7434-4bc6-9f41-6e05d753a819.jpeg"
                  alt="Солёные помидоры по традиционному рецепту"
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-secondary to-orange-500 text-white font-bold text-sm px-3 py-1 shadow-md">✨ Новинка сезона</Badge>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-foreground">Сочные домашние помидоры</h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Солёные по традиционному рецепту с хреном, чесночком и дубовым листиком. Натуральный состав, насыщенный вкус и аппетитный аромат — идеальная закуска к любому столу.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="home" 
          className="relative py-24 overflow-hidden"
          style={{ background: `linear-gradient(180deg, rgba(20,30,15,0.45) 0%, rgba(20,30,15,0.6) 100%)` }}
        >
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-semibold mb-6 border border-white/20">
                🌾 Прямо с фермы в Приморье
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight leading-[1.05] drop-shadow-lg">
                Свежие овощи от фермера
              </h1>
              <p className="text-xl text-white/90 mb-8 drop-shadow">
                Доставляем натуральные продукты напрямую с полей. Без посредников, без химии, только польза природы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => scrollToSection('catalog')} className="text-lg rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/40 hover:shadow-xl hover:shadow-secondary/50 transition-all">
                  <Icon name="ShoppingBag" size={20} className="mr-2" />
                  Смотреть каталог
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg rounded-full bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                  <a href="tel:+79025553558">
                    <Icon name="Phone" size={20} className="mr-2" />
                    Позвонить
                  </a>
                </Button>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
                <a 
                  href="https://max.ru/id251004790824_biz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-sm font-medium"
                >
                  <Icon name="MessageSquare" size={18} />
                  <span>Канал MAX</span>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="text-sm font-medium text-white drop-shadow">100% натурально</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🚚</div>
                  <p className="text-sm font-medium text-white drop-shadow">Бесплатная доставка от 20кг</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="text-sm font-medium text-white drop-shadow">Прямо от фермера</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-20 bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">Наш ассортимент</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.filter(p => !p.hidden && p.category !== 'Семенной картофель' && !p.awaiting).map((product) => (
                <Card key={product.id} className={`group overflow-hidden card-hover border-none shadow-md rounded-3xl animate-scale-in flex flex-col ${product.isNew ? 'ring-2 ring-secondary shadow-lg shadow-secondary/20' : ''}`}>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="mb-4 aspect-square flex items-center justify-center overflow-hidden rounded-2xl bg-accent relative">
                      {product.isNew && (
                        <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-secondary to-orange-500 text-white font-bold text-sm px-3 py-1 shadow-md">✨ Новинка</Badge>
                      )}
                      {product.tag && (
                        <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground font-bold text-sm px-3 py-1 shadow-md">{product.tag}</Badge>
                      )}
                      {product.image.startsWith('http') ? (
                        <img 
                          src={product.image} 
                          alt={`${product.name} - ${product.description || 'фермерские продукты с доставкой во Владивостоке'}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <span className="text-6xl">{product.image}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <Badge variant="secondary" className="mb-3 rounded-full">{product.category}</Badge>
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
                                {!product.awaiting && <span className="text-xs">{price}₽</span>}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition-all" onClick={() => !product.awaiting && addToCart(product)} disabled={product.awaiting}>
                      <Icon name={product.awaiting ? "Clock" : "ShoppingCart"} size={18} className="mr-2" />
                      {product.awaiting ? 'Ожидание урожая' : 'В корзину'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border"></div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span className="text-sm font-medium">Ожидание урожая</span>
                </div>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
                {products.filter(p => !p.hidden && p.category !== 'Семенной картофель' && p.awaiting).map((product) => (
                  <Card key={product.id} className="overflow-hidden flex flex-col border-none shadow-md rounded-2xl">
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-accent relative">
                        {product.image.startsWith('http') ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale" />
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
                              let weightLabel = `${weight} кг`;
                              if (product.id === '11' && weight === 0.5) weightLabel = '500 мл';
                              if (product.id === '16' && weight === 5) weightLabel = '5 л';
                              return (
                                <Button key={weight} size="sm" variant="outline" disabled className="flex-1 min-w-[80px] flex flex-col items-center gap-0 h-auto py-2">
                                  <span className="font-bold">{weightLabel}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" disabled>
                        <Icon name="Clock" size={18} className="mr-2" />
                        Ожидание урожая
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-16" id="seeds">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-2xl font-bold text-primary whitespace-nowrap">🌱 Семенной картофель</h3>
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-center text-muted-foreground mb-8">Отборный посадочный материал для вашего огорода</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.filter(p => !p.hidden && p.category === 'Семенной картофель').map((product) => (
                  <Card key={product.id} className={`group overflow-hidden card-hover border-none shadow-md rounded-3xl animate-scale-in flex flex-col ${product.isNew ? 'ring-2 ring-secondary shadow-lg shadow-secondary/20' : ''}`}>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 aspect-square flex items-center justify-center overflow-hidden rounded-2xl bg-accent relative">
                        {product.isNew && (
                          <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-secondary to-orange-500 text-white font-bold text-sm px-3 py-1 shadow-md">✨ Новинка</Badge>
                        )}
                        {product.image.startsWith('http') ? (
                          <img src={product.image} alt={`${product.name} - ${product.description || 'семенной картофель'}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                              const weightLabel = `${weight} кг`;
                              return (
                                <Button
                                  key={weight}
                                  variant={selectedWeights[product.id] === weight || (!selectedWeights[product.id] && product.weights[0] === weight) ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setSelectedWeights(prev => ({ ...prev, [product.id]: weight }))}
                                  className="flex flex-col h-auto py-1 px-3"
                                >
                                  <span>{weightLabel}</span>
                                  {!product.awaiting && <span className="text-xs opacity-80">{price} ₽{pricePerKg && !product.prices ? `/кг` : ''}</span>}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                        <Button className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition-all" onClick={() => !product.awaiting && addToCart(product)} disabled={product.awaiting}>
                          <Icon name={product.awaiting ? "Clock" : "ShoppingCart"} size={16} className="mr-2" />
                          {product.awaiting ? 'Ожидание урожая' : 'В корзину'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-accent/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">О нас</h2>
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
                <div className="p-6 bg-white rounded-2xl shadow-sm card-hover">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="font-bold mb-2">11 лет опыта</h3>
                  <p className="text-sm text-muted-foreground">Знаем всё о выращивании качественных овощей</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm card-hover">
                  <div className="text-4xl mb-3">🌿</div>
                  <h3 className="font-bold mb-2">Без химии</h3>
                  <p className="text-sm text-muted-foreground">Только натуральные удобрения и уход</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm card-hover">
                  <div className="text-4xl mb-3">❤️</div>
                  <h3 className="font-bold mb-2">С любовью</h3>
                  <p className="text-sm text-muted-foreground">Заботимся о каждом растении</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="delivery" className="py-20 bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">Доставка</h2>
              <div className="space-y-6">
                <Card className="border-2 border-primary rounded-2xl">
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

        <section id="faq" className="py-20 bg-accent/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">Часто задаваемые вопросы</h2>
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

        <section id="contacts" className="py-20 bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">Контакты</h2>
              <Card className="p-8 rounded-2xl shadow-md border-none">
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
                        href="https://max.ru/join/A0Im7QSZxCi4-ehXt_uTDyD12VSnqUwiYonh_uM3KJI" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                      >
                        <Icon name="MessageSquare" size={20} />
                        <span className="font-semibold">Чат MAX</span>
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
          className="fixed bottom-8 right-8 z-40 rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-secondary/40 hover:scale-110 transition-all"
          size="icon"
        >
          <Icon name="ArrowUp" size={24} />
        </Button>
      )}

      <footer className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🌾</span>
            <h3 className="text-2xl font-bold">ФермаВДК</h3>
          </div>
          <a href="tel:+79025553558" className="flex items-center justify-center gap-2 text-lg font-bold opacity-90 hover:opacity-100 transition-opacity mb-3">
            <Icon name="Phone" size={18} />
            8902-555-35-58
          </a>
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

    </div>
  );
}