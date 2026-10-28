import type {ReactNode} from "react";
import {HeadContent, Outlet, Scripts, createRootRoute} from "@tanstack/react-router";
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {PLATFORM_META, PLATFORM_SCRIPTS} from "@/platform/scripts.gen";
import {HMR_CLIENT} from "@/platform/dev-hmr";
import {JSON_LD_BLOCKS} from "@/lib/structured-data";
import PageNotFound from "@/pages/PageNotFound";
import appCss from "@/index.css?url";

const SITE_URL = "https://фермавдк.рф/";
const TITLE = "Купить картофель во Владивостоке с доставкой — ФермаВДК | Картофель от фермера";
const DESCRIPTION =
    "Купить картофель во Владивостоке напрямую от фермера: Беллароза, Королева Анна, Ла Страда и другие сорта. Бесплатная доставка от 20 кг по Владивостоку, Артёму, Находке и Приморью. Заказ по телефону.";
const KEYWORDS =
    "купить картофель Владивосток, картофель от фермера Владивосток, картофель оптом Владивосток, картофель с доставкой на дом Владивосток, купить овощи Владивосток, фермерские продукты Артем, картофель Надеждинск, овощи Большой Камень, доставка овощей Фокино, квашеная капуста Владивосток, бочковые огурцы Артем, натуральные овощи Приморский край, купить картофель с доставкой Владивосток, семенной картофель Владивосток, купить семенной картофель Приморский край, картофель Гала семенной, картофель Коломбо семенной, картофель Балтик Роуз семенной, посадочный картофель Владивосток";
const OG_TITLE = "Купить картофель во Владивостоке с доставкой — ФермаВДК";
const OG_DESCRIPTION =
    "Фермерские овощи и заготовки от производителя. Бесплатная доставка от 20кг. Натуральные продукты напрямую с фермы.";
const TWITTER_DESCRIPTION = "Фермерские овощи и заготовки от производителя. Бесплатная доставка от 20кг.";
const OG_IMAGE = "https://cdn.poehali.dev/projects/***/files/og-image-1765455030512.jpg";
const FAVICON = "https://cdn.poehali.dev/projects/***/files/favicon-1765454962816.jpg";

const METRIKA = `(function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () {
        (m[i].a = m[i].a || []).push(arguments)
    };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
            return;
        }
    }
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(105797153, "init", {
    trustedDomains: ["poehali.dev"],
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    trackHash: true
});`;

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {charSet: "utf-8"},
            {name: "viewport", content: "width=device-width, initial-scale=1.0"},
            {title: TITLE},
            {name: "description", content: DESCRIPTION},
            {name: "keywords", content: KEYWORDS},
            {name: "author", content: "ФермаВДК"},
            {name: "robots", content: "index, follow"},
            {name: "language", content: "Russian"},
            {name: "yandex-verification", content: "554d0b2e0711a7f1"},
            {name: "google-site-verification", content: "vcq23blygmI9i51vqRaLf7w4_c3nH6wZ16Bil7ULf24"},
            {property: "og:type", content: "website"},
            {property: "og:url", content: SITE_URL},
            {property: "og:title", content: OG_TITLE},
            {property: "og:description", content: OG_DESCRIPTION},
            {property: "og:image", content: OG_IMAGE},
            {property: "og:image:width", content: "1200"},
            {property: "og:image:height", content: "630"},
            {property: "og:image:alt", content: "ФермаВДК — натуральные овощи и заготовки с фермы"},
            {property: "og:locale", content: "ru_RU"},
            {property: "og:site_name", content: "ФермаВДК"},
            {name: "twitter:card", content: "summary_large_image"},
            {name: "twitter:url", content: SITE_URL},
            {name: "twitter:title", content: OG_TITLE},
            {name: "twitter:description", content: TWITTER_DESCRIPTION},
            {name: "twitter:image", content: OG_IMAGE},
            {name: "geo.region", content: "RU-PRI"},
            {name: "geo.placename", content: "Владивосток, Артем, Надеждинск, Большой Камень, Фокино"},
            {name: "geo.position", content: "43.115536;131.885485"},
            {name: "ICBM", content: "43.115536, 131.885485"},
            ...PLATFORM_META,
        ],
        links: [
            {rel: "stylesheet", href: appCss},
            {rel: "canonical", href: SITE_URL},
            {rel: "sitemap", type: "application/xml", href: "/sitemap.xml"},
            {rel: "icon", type: "image/jpg", href: FAVICON},
        ],
        // IMPORTANT: DO NOT REMOVE PLATFORM SCRIPTS AND THE DEV HMR CLIENT!
        scripts: [
            ...(import.meta.env.DEV ? [{children: HMR_CLIENT}] : []),
            ...PLATFORM_SCRIPTS,
            ...JSON_LD_BLOCKS.map((json) => ({type: "application/ld+json", children: json})),
            {children: METRIKA},
        ],
    }),
    component: RootComponent,
    notFoundComponent: PageNotFound,
});

function RootComponent() {
    return (
        <RootDocument>
            <TooltipProvider>
                <Toaster/>
                <Sonner/>
                <Outlet/>
            </TooltipProvider>
        </RootDocument>
    );
}

function RootDocument({children}: { children: ReactNode }) {
    return (
        <html lang="ru">
        <head>
            <HeadContent/>
        </head>
        <body>
        {children}
        <noscript>
            <div><img src="https://mc.yandex.ru/watch/105797153" style={{position: "absolute", left: "-9999px"}} alt=""/></div>
        </noscript>
        <Scripts/>
        </body>
        </html>
    );
}
