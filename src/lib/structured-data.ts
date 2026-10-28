// JSON-LD structured data moved from the old index.html
export const JSON_LD_BLOCKS: string[] = [
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ФермаВДК",
    "description": "Купить картофель во Владивостоке напрямую от фермера с бесплатной доставкой от 20 кг",
    "openingHours": "Mo-Su 09:00-20:00",
    "paymentAccepted": "Наличные",
    "currenciesAccepted": "RUB",
    "image": "https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/files/og-image-1765455030512.jpg",
    "telephone": "8-902-555-35-58",
    "priceRange": "₽₽",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Владивосток",
      "addressRegion": "Приморский край",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.115536,
      "longitude": 131.885485
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Владивосток"
      },
      {
        "@type": "City",
        "name": "Артем"
      },
      {
        "@type": "City",
        "name": "Надеждинск"
      },
      {
        "@type": "City",
        "name": "Большой Камень"
      },
      {
        "@type": "City",
        "name": "Фокино"
      }
    ],
    "url": "https://фермавдк.рф/",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Фермерские продукты",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Картофель",
            "description": "Натуральный картофель с фермы"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Овощи",
            "description": "Свежие овощи: морковь, лук, свекла"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Заготовки",
            "description": "Домашние заготовки: квашеная капуста, огурцы, аджика"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Картофель с доставкой по Владивостоку",
            "description": "Картофель от фермера: Беллароза, Королева Анна, Ла Страда, Балтик Роуз. Бесплатная доставка от 20 кг"
          }
        }
      ]
    }
  }),
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Где купить картофель во Владивостоке?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Картофель от фермера можно заказать на сайте ФермаВДК или по телефону 8-902-555-35-58. Бесплатная доставка по Владивостоку от 20 кг."
        }
      },
      {
        "@type": "Question",
        "name": "Куда вы доставляете?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Мы доставляем во Владивосток, Артем, Надеждинск, Большой Камень и Фокино. Бесплатная доставка от 20 кг любой продукции. Если по пути — завозим меньше, согласовываем индивидуально."
        }
      },
      {
        "@type": "Question",
        "name": "Сколько стоит доставка?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Бесплатная доставка при заказе от 20 кг любой продукции. Привозим прямо в квартиру, поднимаем на этаж. Если ваш заказ по пути — можем доставить и меньше, согласуем индивидуально."
        }
      },
      {
        "@type": "Question",
        "name": "Как быстро привезёте?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Время доставки согласовываем индивидуально по телефону или в мессенджере, в зависимости от маршрута и района."
        }
      },
      {
        "@type": "Question",
        "name": "Можно ли заказать меньше 20 кг?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да! Если ваш заказ по пути нашего маршрута — привезём меньше 20 кг. Условия согласовываем индивидуально."
        }
      },
      {
        "@type": "Question",
        "name": "Как оплатить заказ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Оплата наличными при получении."
        }
      },
      {
        "@type": "Question",
        "name": "Откуда ваши овощи?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Мы выращиваем овощи на собственной ферме в Приморском крае. Без химических удобрений, только натуральные методы."
        }
      }
    ]
  }),
];
