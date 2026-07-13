import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { useAuth } from "@/lib/use-auth";
import { AuthScreen } from "@/components/AuthScreen";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Esta página se perdió en la calma.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Volver al inicio</Link>
      </div>
    </div>
  );
}

function AuthGate() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-6 w-6 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" />
      </div>
    );
  }
  if (!session) return <AuthScreen />;
  return <Outlet />;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Vida Tranquila — Bienestar diario" },
      { name: "description", content: "Una app minimalista de bienestar: registrá tu ánimo, formá hábitos y descubrí calma en Buenos Aires." },
      { name: "theme-color", content: "#f5f1e8" },
      { property: "og:title", content: "Vida Tranquila — Bienestar diario" },
      { name: "twitter:title", content: "Vida Tranquila — Bienestar diario" },
      { property: "og:description", content: "Una app minimalista de bienestar: registrá tu ánimo, formá hábitos y descubrí calma en Buenos Aires." },
      { name: "twitter:description", content: "Una app minimalista de bienestar: registrá tu ánimo, formá hábitos y descubrí calma en Buenos Aires." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/TMZy1QjS4gQjZwX1ONPma8j6JeI3/social-images/social-1782080203562-descarga_(1).webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/TMZy1QjS4gQjZwX1ONPma8j6JeI3/social-images/social-1782080203562-descarga_(1).webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: AuthGate,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
