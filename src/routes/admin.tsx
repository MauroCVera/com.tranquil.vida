import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { refreshPremium } from "@/lib/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Vida Tranquila" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminGate,
});

function AdminGate() {
  const [pwd, setPwd] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(false);
  if (ok) return <AdminPage />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pwd === "MacVivy1234") {
            setOk(true);
          } else {
            setErr(true);
          }
        }}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-card"
      >
        <h1 className="font-display text-2xl">Admin</h1>
        <p className="mt-1 text-xs text-muted-foreground">Ingresá la contraseña para continuar.</p>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setErr(false); }}
          className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="Contraseña"
        />
        {err && <p className="mt-2 text-xs text-destructive">Contraseña incorrecta</p>}
        <Button type="submit" className="mt-4 w-full rounded-full">Entrar</Button>
      </form>
    </div>
  );
}

type Row = {
  id: string;
  email: string | null;
  username: string;
  premium_until: string | null;
};

type ResetReq = {
  id: string;
  email: string;
  requested_at: string;
  notified: boolean;
};

function fmt(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("es-AR");
  } catch {
    return d;
  }
}

function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [requests, setRequests] = useState<ResetReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [resetBusy, setResetBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [profilesRes, reqRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, username, premium_until")
        .order("created_at", { ascending: false }),
      supabase
        .from("password_reset_requests")
        .select("id, email, requested_at, notified")
        .order("requested_at", { ascending: false })
        .limit(50),
    ]);
    if (profilesRes.error) toast.error("No se pudieron cargar los usuarios");
    else setRows((profilesRes.data ?? []) as Row[]);
    if (!reqRes.error) setRequests((reqRes.data ?? []) as ResetReq[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function grant(userId: string) {
    setBusyId(userId);
    const { data, error } = await supabase.rpc("grant_premium_30_days", {
      target_user_id: userId,
    });
    setBusyId(null);
    if (error) {
      toast.error("No se pudo otorgar Premium");
      return;
    }
    const until = data as string | null;
    setRows((prev) =>
      prev.map((r) => (r.id === userId ? { ...r, premium_until: until } : r))
    );
    toast.success("Premium otorgado por 30 días");
    void refreshPremium();
  }

  async function sendReset(email: string | null, userId: string) {
    if (!email) {
      toast.error("Este usuario no tiene email registrado.");
      return;
    }
    setResetBusy(userId);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetBusy(null);
    if (error) {
      toast.error("No se pudo enviar el enlace de recuperación.");
      return;
    }
    toast.success(`Enlace de recuperación enviado a ${email}`);
  }

  async function markNotified(id: string) {
    const { error } = await supabase
      .from("password_reset_requests")
      .update({ notified: true })
      .eq("id", id);
    if (error) {
      toast.error("No se pudo marcar como resuelta.");
      return;
    }
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, notified: true } : r)));
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Gestión manual de Premium y recuperación de contraseñas · ruta oculta
          </p>
        </div>

        <section>
          <h2 className="font-display text-xl mb-3">Solicitudes de recuperación</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-secondary-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Solicitada</th>
                  <th className="text-right px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                      Sin solicitudes recientes.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className={r.notified ? "opacity-60" : ""}>
                      <td className="px-4 py-3 font-medium">{r.email}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {fmt(r.requested_at)}
                        {r.notified && (
                          <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[10px] text-mint-foreground">
                            resuelta
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendReset(r.email, r.id)}
                          disabled={resetBusy === r.id}
                          className="rounded-full"
                        >
                          {resetBusy === r.id ? "…" : "Enviar enlace"}
                        </Button>
                        {!r.notified && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markNotified(r.id)}
                            className="rounded-full"
                          >
                            Marcar resuelta
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Usuarios</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-secondary-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Premium hasta</th>
                  <th className="text-right px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                      Cargando…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                      Sin usuarios.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const active =
                      r.premium_until && new Date(r.premium_until).getTime() > Date.now();
                    return (
                      <tr key={r.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{r.email ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">@{r.username}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={active ? "text-foreground" : "text-muted-foreground"}>
                            {fmt(r.premium_until)}
                          </span>
                          {active && (
                            <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[10px] text-mint-foreground">
                              activo
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReset(r.email, r.id)}
                            disabled={resetBusy === r.id}
                            className="rounded-full"
                          >
                            {resetBusy === r.id ? "…" : "Resetear contraseña"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => grant(r.id)}
                            disabled={busyId === r.id}
                            className="rounded-full"
                          >
                            {busyId === r.id ? "…" : "Premium +30 días"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

