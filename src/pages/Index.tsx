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

interface Product {
  id: string;
  name: string;
  category: string;
  weights: number[];
  pricePerKg: number;
  image: string;
}

interface CartItem {
  product: Product;
  weight: number;
  quantity: number;
}

const products: Product[] = [
  { id: '1', name: 'Картофель "Балтик Роуз"', category: 'Картофель', weights: [10, 20, 34], pricePerKg: 45, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/cee08871-7541-4619-a652-078ad73063d8.jpg' },
  { id: '2', name: 'Картофель "Коломбо"', category: 'Картофель', weights: [10, 20, 34], pricePerKg: 47, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/cee08871-7541-4619-a652-078ad73063d8.jpg' },
  { id: '3', name: 'Картофель "Гала Бэби"', category: 'Картофель', weights: [10, 20, 34], pricePerKg: 50, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/cee08871-7541-4619-a652-078ad73063d8.jpg' },
  { id: '4', name: 'Картофель "Ла Страда"', category: 'Картофель', weights: [10, 20, 34], pricePerKg: 48, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/cee08871-7541-4619-a652-078ad73063d8.jpg' },
  { id: '12', name: 'Картофель "Королева Анна"', category: 'Картофель', weights: [10, 20, 34], pricePerKg: 52, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/cee08871-7541-4619-a652-078ad73063d8.jpg' },
  { id: '5', name: 'Морковь', category: 'Овощи', weights: [10], pricePerKg: 35, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/b93481ec-e369-4562-955b-45910a54b7e7.jpg' },
  { id: '6', name: 'Лук репчатый', category: 'Овощи', weights: [10], pricePerKg: 30, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/4257b766-fb20-43e0-b5d7-5db9f7c7819d.jpg' },
  { id: '7', name: 'Свекла', category: 'Овощи', weights: [10], pricePerKg: 32, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/4257b766-fb20-43e0-b5d7-5db9f7c7819d.jpg' },
  { id: '13', name: 'Сборная сетка: Морковь + Лук', category: 'Сборные сетки', weights: [10], pricePerKg: 33, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/4257b766-fb20-43e0-b5d7-5db9f7c7819d.jpg' },
  { id: '14', name: 'Сборная сетка: Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 34, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/4257b766-fb20-43e0-b5d7-5db9f7c7819d.jpg' },
  { id: '15', name: 'Сборная сетка: Лук + Морковь + Свекла', category: 'Сборные сетки', weights: [10], pricePerKg: 32, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/4257b766-fb20-43e0-b5d7-5db9f7c7819d.jpg' },
  { id: '8', name: 'Капуста белокочанная', category: 'Овощи', weights: [2, 3, 5], pricePerKg: 28, image: 'https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/4257b766-fb20-43e0-b5d7-5db9f7c7819d.jpg' },
  { id: '9', name: 'Капуста квашеная', category: 'Заготовки', weights: [1, 2, 3], pricePerKg: 120, image: '🥗' },
  { id: '10', name: 'Огурчики бочковые', category: 'Заготовки', weights: [1, 2, 3], pricePerKg: 180, image: '🥒' },
  { id: '11', name: 'Аджика домашняя', category: 'Заготовки', weights: [0.5, 1], pricePerKg: 250, image: '🌶️' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState('home');

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
                          <Input id="name" placeholder="Введите ваше имя" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Телефон</Label>
                          <Input id="phone" placeholder="+7 (___) ___-__-__" />
                        </div>
                        <div>
                          <Label htmlFor="address">Адрес доставки</Label>
                          <Textarea id="address" placeholder="Улица, дом, квартира" rows={3} />
                        </div>
                      </div>
                      <Button className="w-full" size="lg" onClick={() => toast.success('Заказ оформлен! Мы свяжемся с вами в ближайшее время.')}>
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
                  <p className="text-sm font-medium">Бесплатная доставка</p>
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
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🚚</div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Бесплатная доставка</h3>
                        <p className="text-muted-foreground">
                          Доставляем заказы бесплатно прямо в вашу квартиру. Наши курьеры поднимут 
                          покупки на любой этаж.
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
                          Выберите удобное время доставки при оформлении заказа. Работаем с 9:00 до 21:00 
                          без выходных.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">📦</div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Удобная упаковка</h3>
                        <p className="text-muted-foreground">
                          Все овощи упакованы в прочные сетки, которые легко переносить и хранить. 
                          Заготовки — в герметичной таре.
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
                    <a href="tel:+79991234567" className="text-xl font-semibold hover:text-primary transition-colors">
                      +7 (999) 123-45-67
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Icon name="Mail" size={24} className="text-primary" />
                    <a href="mailto:info@fermadom.ru" className="text-xl font-semibold hover:text-primary transition-colors">
                      info@fermadom.ru
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Icon name="MapPin" size={24} className="text-primary" />
                    <p className="text-xl font-semibold">Московская область</p>
                  </div>
                  <div className="pt-6 border-t mt-6">
                    <p className="text-muted-foreground mb-4">Работаем ежедневно с 9:00 до 21:00</p>
                    <p className="text-sm text-muted-foreground">
                      Принимаем заказы по телефону, через WhatsApp и на сайте
                    </p>
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