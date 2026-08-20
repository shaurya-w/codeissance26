// services/taxService.ts
import { supabase } from "@/lib/supabase";

export interface TaxDeadline {
    id: string;
    title: string;
    description: string;
    deadline_date: string;
}

export async function getUpcomingTaxDeadline(): Promise<{
    deadline: TaxDeadline | null;
    daysLeft: number | null;
}> {
    const todayStr = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("tax_deadlines")
        .select("*")
        .gte("deadline_date", todayStr)
        .order("deadline_date", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        return { deadline: null, daysLeft: null };
    }

    const targetDate = new Date(data.deadline_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { deadline: data, daysLeft };
}