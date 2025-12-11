import { useState } from 'react';
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

interface Product {
  id: string;
  name: string;
  category: string;
  weights: number[];
  pricePerKg: number;
  image: string;
  description?: string;
}

interface CartItem {
  product: Product;
  weight: number;
  quantity: number;
}

const products: Product[] = [
  { id: '1', name: 'Картофель "Балтик Роуз"', category: 'Картофель', weights: [20, 34], pricePerKg: 50, image: 'https://cdn.poehali.dev/files/1000000688.jpg', description: 'Среднеспелый сорт с розоватой кожурой и светлой мякотью. Нежный вкус и рассыпчатая текстура. Идеален для запекания, жарки, пюре и салатов. Хорошо хранится.' },
  { id: '2', name: 'Картофель "Коломбо"', category: 'Картофель', weights: [10, 20, 34], pricePerKg: 42, image: 'https://cdn.poehali.dev/files/1002862244.jpg', description: 'Среднеспелый сорт с желтой мякотью. Кремовая текстура и насыщенный вкус. Сохраняет форму при варке — отлично для салатов, запекания, жарки и пюре.' },
  { id: '12', name: 'Картофель "Королева Анна Супер Элита"', category: 'Картофель', weights: [20], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002767412.jpg', description: 'Ранний сорт с тонкой кожурой и желтой нежной мякотью. Сладковатый вкус и кремовая текстура. Превосходен для пюре, запеканок, жарки. Не разваливается — идеален для салатов.' },
  { id: '13', name: 'Сборная сетка 10кг: Лук + Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897358.jpg', description: 'Готовый набор основных овощей для борща и других блюд. Экономия времени и денег.' },
  { id: '14', name: 'Сборная сетка 10кг: Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897342.jpg', description: 'Идеальное сочетание для приготовления салатов и гарниров.' },
  { id: '15', name: 'Сборная сетка 10кг: Морковь + Лук', category: 'Сборные сетки', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897335.jpg', description: 'Базовый набор для супов, подлив и зажарок.' },
  { id: '17', name: 'Лук 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897347.jpg', description: 'Отборный репчатый лук. Крупный, плотный, долго хранится.' },
  { id: '18', name: 'Морковь 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897342.jpg', description: 'Сладкая сочная морковь. Богата каротином и витаминами.' },
  { id: '19', name: 'Свекла 10кг', category: 'Овощи', weights: [10], pricePerKg: 70, image: 'https://cdn.poehali.dev/files/1002897354.jpg', description: 'Столовая свекла насыщенного бордового цвета. Для борщей, винегретов и салатов.' },
  { id: '16', name: 'Масло соевое', category: 'Заготовки', weights: [5], pricePerKg: 130, image: 'https://cdn.poehali.dev/files/1001628999.jpg', description: 'Мы используем технологию холодного отжима - зерна сои проходят пресс, масло отжимается естественным путем и фильтруется. При этом процессе его производства сохраняются ценные жиры, антиоксиданты, лецитин и витамины. Минимальное воздействие на сырье, без использования химических средств. При промышленном производстве, для большего отделения масла используют растворитель, это может быть бензин, этанол, гексан. Далее, происходит удаление свободных жирных кислот при помощи щелочи, отбеливание белой глиной или углем и на выходе получается масло без вкуса, без запаха, то, что предлагается на полках магазинов. Соевое масло содержит лецитин, до 3800мг на 100гр, это вещество можно употреблять капсулами, так и в натуральном виде. Он предотвращает образование бляшек на стенках сосудов и снижает уровень холестерина в крови, защищает клетки печени и участвует в их восстановлении, а так же стимулирует мозговую деятельность. При нагревании, вредные вещества образуются ТОЛЬКО после перегревания, то есть при пересечении точки дымления. Большинство наших клиентов используют масло и для жарки, кто то разбавляя подсолнечным, кто то в чистом виде. Подведём итог: Отличие нашего масла от промышленного - чистый отжим, без использования бензина. Окисление происходит только при перегревании масла! Если вы отвлеклись, и масло на сковороде задымилось, лучше его заменить. Выделение вредных веществ, которые при длительном регулярном употреблении могут негативно влиять на организм происходит и из рафинированного масла, если его перегреть до образования дыма.' },
  { id: '8', name: 'Капуста Сибирь', category: 'Овощи', weights: [20], pricePerKg: 65, image: 'https://cdn.poehali.dev/files/1002646994.jpg', description: 'Сибирский сорт белокочанной капусты. Плотные кочаны, отлично подходит для квашения.' },
  { id: '9', name: 'Капуста квашеная', category: 'Заготовки', weights: [2], pricePerKg: 200, image: 'https://cdn.poehali.dev/files/1002520711.jpg', description: 'Хрустящая квашеная капуста по рецепту из ГОСТ 1956 года. В составе только капуста, морковь, соль.' },
  { id: '10', name: 'Огурчики бочковые', category: 'Заготовки', weights: [1.5], pricePerKg: 333, image: 'https://cdn.poehali.dev/files/1002520708.jpg', description: 'Дерзкие бочковые огурчики, традиционный рецепт без уксуса. Плотные, хрустящие. Сложно остановиться.' },
  { id: '11', name: 'Аджика домашняя', category: 'Заготовки', weights: [0.5], pricePerKg: 600, image: 'https://cdn.poehali.dev/files/1000101387.jpg', description: 'Бодрящая домашняя аджика из свежих томатов, с хреном, чесноком и перцем. Соль и ничего лишнего. Насыщенный вкус и аромат, бодрящая, но не обжигающая.' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState('home');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

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

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.pricePerKg * item.weight * item.quantity), 0);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderSubmit = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    let orderText = `🛒 *Новый заказ*\n\n`;
    orderText += `👤 *Имя:* ${customerName}\n`;
    orderText += `📱 *Телефон:* ${customerPhone}\n`;
    orderText += `📍 *Адрес:* ${customerAddress}\n\n`;
    orderText += `*Состав заказа:*\n`;
    
    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${item.product.name} — ${item.weight}кг × ${item.quantity}шт = ${item.product.pricePerKg * item.weight * item.quantity}₽\n`;
    });
    
    orderText += `\n💰 *Итого: ${getTotalPrice()}₽*`;

    const encodedText = encodeURIComponent(orderText);
    const phone = '79025553558';
    
    const telegramUrl = `https://t.me/+${phone}?text=${encodedText}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;
    
    window.open(telegramUrl, '_blank');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
    
    toast.success('Заказ отправлен! Мы свяжемся с вами в ближайшее время.');
    
    setCart([]);
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
            <h1 className="text-2xl font-bold text-primary">ФермаВДК</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('home')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'home' ? 'text-primary' : 'text-foreground'}`}>Главная</button>
            <button onClick={() => scrollToSection('catalog')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'catalog' ? 'text-primary' : 'text-foreground'}`}>Каталог</button>
            <button onClick={() => scrollToSection('about')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'about' ? 'text-primary' : 'text-foreground'}`}>О нас</button>
            <button onClick={() => scrollToSection('delivery')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'delivery' ? 'text-primary' : 'text-foreground'}`}>Доставка</button>
            <button onClick={() => scrollToSection('contacts')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'contacts' ? 'text-primary' : 'text-foreground'}`}>Контакты</button>
            <div className="flex items-center gap-2 ml-2">
              <a href="tel:+79025553558" className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Icon name="Phone" size={18} />
              </a>
              <a href="https://wa.me/79025553558" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors">
                <Icon name="MessageCircle" size={18} />
              </a>
              <a href="https://t.me/+79025553558" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#0088cc] text-white hover:bg-[#0077b5] transition-colors">
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
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{item.product.image}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.weight} кг × {item.product.pricePerKg} ₽</p>
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
                          <p className="font-bold">{item.product.pricePerKg * item.weight * item.quantity} ₽</p>
                          <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.product.id, item.weight)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-primary">{getTotalPrice()} ₽</span>
                      </div>
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
                            {(inputProps: any) => <Input {...inputProps} id="phone" placeholder="+7 (___) ___-__-__" />}
                          </InputMask>
                        </div>
                        <div>
                          <Label htmlFor="address">Адрес доставки</Label>
                          <Textarea id="address" placeholder="Улица, дом, квартира" rows={3} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                        </div>
                      </div>
                      <Button className="w-full" size="lg" onClick={handleOrderSubmit}>
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
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
                Свежие овощи от фермера
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Доставляем натуральные продукты напрямую с полей. Без посредников, без химии, только польза природы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => scrollToSection('catalog')} className="text-lg">
                  <Icon name="ShoppingBag" size={20} className="mr-2" />
                  Смотреть каталог
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('about')} className="text-lg">
                  Узнать больше
                </Button>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-8">
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
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-scale-in">
                  <CardContent className="p-6">
                    <div className="mb-4 aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-accent">
                      {product.image.startsWith('http') ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">{product.image}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <Badge variant="secondary" className="mb-3">{product.category}</Badge>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{product.description}</p>
                    )}
                    <p className="text-2xl font-bold text-primary mb-4">{product.pricePerKg} ₽/кг</p>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Выберите вес</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.weights.map((weight) => (
                            <Button
                              key={weight}
                              size="sm"
                              variant={selectedWeights[product.id] === weight ? 'default' : 'outline'}
                              onClick={() => setSelectedWeights({ ...selectedWeights, [product.id]: weight })}
                              className="flex-1 min-w-[60px]"
                            >
                              {weight} кг
                            </Button>
                          ))}
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
                Мы — семейная ферма с 11-летним опытом выращивания и доставки экологически чистых овощей нашим клиентам. 
                Наши поля расположены в экологически чистом районе, вдали от промышленных предприятий.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Мы не используем химические удобрения и пестициды. Только натуральные органические подкормки 
                и традиционные методы земледелия. Каждый овощ выращен с любовью и заботой о вашем здоровье.
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
                          При заказе от 20 кг доставляем бесплатно прямо в вашу квартиру. 
                          Наши курьеры поднимут покупки на любой этаж.
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
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">⏰</div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Удобное время</h3>
                        <p className="text-muted-foreground">
                          Доставляем в любое удобное для вас время. Работаем без выходных.
                          Звоните и согласуем удобное время!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-20 bg-accent">
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
                    <div className="flex justify-center gap-4">
                      <a 
                        href="https://wa.me/79025553558" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#22c55e] transition-colors"
                      >
                        <Icon name="MessageCircle" size={20} />
                        <span className="font-semibold">WhatsApp</span>
                      </a>
                      <a 
                        href="https://t.me/+79025553558" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-colors"
                      >
                        <Icon name="Send" size={20} />
                        <span className="font-semibold">Telegram</span>
                      </a>
                      <a 
                        href="https://vk.com/im" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#0077FF] text-white rounded-lg hover:bg-[#0066dd] transition-colors"
                      >
                        <Icon name="MessageSquare" size={20} />
                        <span className="font-semibold">ВКонтакте</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🌾</span>
            <h3 className="text-2xl font-bold">ФермаВДК</h3>
          </div>
          <p className="text-sm opacity-90">
            © 2024 ФермаВДК. Свежие овощи от фермера.
          </p>
        </div>
      </footer>
    </div>
  );
}