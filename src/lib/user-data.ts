import { supabase } from "@/integrations/supabase/client";

function today() {
  // ISO date in local time for "day" column comparisons.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const userData = {
  // -------- Mi Día: mood + goals --------
  async getToday(userId: string) {
    const day = today();
    const [mood, goals] = await Promise.all([
      supabase
        .from("user_mood_logs")
        .select("mood")
        .eq("user_id", userId)
        .eq("day", day)
        .maybeSingle(),
      supabase
        .from("user_goals")
        .select("id, text, done, position")
        .eq("user_id", userId)
        .eq("day", day)
        .order("position", { ascending: true }),
    ]);
    return {
      mood: (mood.data?.mood as string | undefined) ?? null,
      goals: goals.data ?? [],
    };
  },

  async setMood(userId: string, mood: string) {
    const day = today();
    await supabase
      .from("user_mood_logs")
      .upsert(
        { user_id: userId, day, mood, created_at: new Date().toISOString() },
        { onConflict: "user_id,day" },
      );
  },

  async getRecentMoods(userId: string, days = 7) {
    const start = new Date();
    start.setDate(start.getDate() - days);
    const { data } = await supabase
      .from("user_mood_logs")
      .select("day, mood, created_at")
      .eq("user_id", userId)
      .gte("day", start.toISOString().slice(0, 10))
      .order("day", { ascending: false });
    return data ?? [];
  },

  async addGoal(userId: string, text: string, position: number) {
    const { data, error } = await supabase
      .from("user_goals")
      .insert({ user_id: userId, day: today(), text, position })
      .select("id, text, done, position")
      .single();
    if (error) throw error;
    return data;
  },

  async removeGoal(id: string) {
    await supabase.from("user_goals").delete().eq("id", id);
  },

  async toggleGoal(id: string, done: boolean) {
    await supabase.from("user_goals").update({ done }).eq("id", id);
  },

  // -------- Goals: expiration + history --------
  async getUnratedPastGoals(userId: string) {
    const { data } = await supabase
      .from("user_goals")
      .select("id, text, done, day, rating, created_at")
      .eq("user_id", userId)
      .lt("day", today())
      .is("rating", null)
      .order("day", { ascending: false });
    return data ?? [];
  },

  async rateGoal(id: string, rating: string) {
    await supabase.from("user_goals").update({ rating }).eq("id", id);
  },

  async getHistory(userId: string, days = 7) {
    const start = new Date();
    start.setDate(start.getDate() - days);
    const startDay = start.toISOString().slice(0, 10);
    const todayStr = today();
    const { data } = await supabase
      .from("user_goals")
      .select("id, text, done, day, rating, created_at")
      .eq("user_id", userId)
      .gte("day", startDay)
      .lt("day", todayStr)
      .order("day", { ascending: false })
      .order("position", { ascending: true });
    return data ?? [];
  },

  /** Returns all rated goals since `startDay` (inclusive). Pass null for all-time. */
  async getRatedGoalsSince(userId: string, startDay: string | null) {
    let q = supabase
      .from("user_goals")
      .select("id, text, day, rating")
      .eq("user_id", userId)
      .not("rating", "is", null);
    if (startDay) q = q.gte("day", startDay);
    const { data } = await q;
    return (data ?? []) as { id: string; text: string; day: string; rating: string | null }[];
  },

  // -------- Hábitos --------
  async getHabitsToday(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from("user_habit_ratings")
      .select("habit_id, served, rated_at")
      .eq("user_id", userId)
      .gte("rated_at", startOfDay.toISOString())
      .order("rated_at", { ascending: false });
    return data ?? [];
  },

  async rateHabit(userId: string, habitId: string, served: boolean) {
    await supabase
      .from("user_habit_ratings")
      .insert({ user_id: userId, habit_id: habitId, served });
  },

  async resetHabitsToday(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    await supabase
      .from("user_habit_ratings")
      .delete()
      .eq("user_id", userId)
      .gte("rated_at", startOfDay.toISOString());
  },

  // -------- Técnicas --------
  async getTechniques(userId: string) {
    const { data } = await supabase
      .from("user_technique_log")
      .select("technique_id, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });
    return data ?? [];
  },

  async completeTechnique(userId: string, techniqueId: string) {
    await supabase
      .from("user_technique_log")
      .insert({ user_id: userId, technique_id: techniqueId });
  },

  // -------- Explora --------
  async getSaved(userId: string) {
    const { data } = await supabase
      .from("user_explora_saved")
      .select("item_id, item_type")
      .eq("user_id", userId);
    return data ?? [];
  },

  async toggleSaved(
    userId: string,
    itemId: string,
    itemType: "event" | "place",
    on: boolean,
  ) {
    if (on) {
      await supabase
        .from("user_explora_saved")
        .upsert(
          { user_id: userId, item_id: itemId, item_type: itemType },
          { onConflict: "user_id,item_id,item_type" },
        );
    } else {
      await supabase
        .from("user_explora_saved")
        .delete()
        .eq("user_id", userId)
        .eq("item_id", itemId)
        .eq("item_type", itemType);
    }
  },
};
