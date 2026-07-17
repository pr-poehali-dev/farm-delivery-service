import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const PageNotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4"
      style={{
        backgroundImage: `url('https://cdn.poehali.dev/projects/37d25151-dc28-4c37-b88b-0704483fea6f/bucket/f150df60-353c-49d5-b8b2-e4dbd9857dd9.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      <div className="relative text-center bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-10 max-w-md w-full">
        <div className="text-6xl mb-4">🌾</div>
        <h1 className="text-6xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-foreground font-semibold mb-2">
          Такой страницы не существует
        </p>
        <p className="text-muted-foreground mb-8">
          Возможно, она была перемещена или удалена. Загляните в наш каталог свежих овощей!
        </p>
        <Button
          asChild
          className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition-all text-lg px-6 py-6"
        >
          <Link to="/">
            <Icon name="Home" size={20} className="mr-2" />
            Вернуться на главную
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
