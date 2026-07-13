import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const uname = username.trim();
        if (uname.length < 2) {
          toast.error("Elegí un nombre de usuario.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: uname, full_name: uname },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisá tu correo para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    const target = email.trim();
    if (!target || !/^\S+@\S+\.\S+$/.test(target)) {
      toast.error("Ingresá tu correo arriba y volvé a tocar el enlace.");
      return;
    }
    setResetting(true);
    try {
      // Log request so admins can see it in /admin
      await supabase.from("password_reset_requests").insert({ email: target });
      // Send Supabase recovery email
      const { error } = await supabase.auth.resetPasswordForEmail(target, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Te enviamos un enlace de recuperación a tu correo.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No pudimos enviar el enlace.");
    } finally {
      setResetting(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("No pudimos iniciar con Google.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-10 pt-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Vida Tranquila</p>
          <h1 className="mt-2 font-display text-4xl leading-tight">
            {mode === "signin" ? "Bienvenida/o de vuelta" : "Empezá tu calma"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Ingresá para retomar tu día tranquilo."
              : "Creá tu cuenta para guardar tu progreso."}
          </p>
        </header>

        <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <Button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <GoogleIcon />
            Continuar con Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            o con tu correo
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                required
                className="rounded-full h-11"
              />
            )}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              className="rounded-full h-11"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              minLength={6}
              required
              className="rounded-full h-11"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
            </Button>
          </form>

          {mode === "signin" && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetting}
              className="mt-3 w-full text-center text-xs text-primary hover:underline disabled:opacity-50"
            >
              {resetting ? "Enviando…" : "¿Olvidaste tu contraseña?"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin"
              ? "¿No tenés cuenta? Registrate"
              : "Ya tengo cuenta · Iniciar sesión"}
          </button>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Tu progreso queda guardado y sincronizado.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.2 14.6 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c6.9 0 9.4-4.8 9.4-7.3 0-.5-.1-.9-.1-1.3H12z"/>
    </svg>
  );
}
