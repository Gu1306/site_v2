import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AVALIACOES: Record<number, string> = {
  1: "Insatisfatório",
  2: "Abaixo do esperado",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const body = await req.json();
    const {
      nome,
      prova,
      data_prova,
      distancia,
      tipo,
      tempo,
      avaliacao,
      rpe,
      observacoes,
      num_arquivos,
    } = body;

    // Build email HTML (notification only, no attachments)
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0E3C41; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🏃 Resultado Enviado</h1>
        </div>
        <div style="padding: 24px; background: #f9f9f9; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Atleta:</td><td style="padding: 8px 0;">${nome}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Prova:</td><td style="padding: 8px 0;">${prova}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Data:</td><td style="padding: 8px 0;">${data_prova}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Distância:</td><td style="padding: 8px 0;">${distancia}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Tipo:</td><td style="padding: 8px 0;">${tipo}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Tempo:</td><td style="padding: 8px 0; font-size: 18px; font-weight: bold;">${tempo}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Avaliação:</td><td style="padding: 8px 0;">${avaliacao}/5 – ${AVALIACOES[avaliacao] || ""}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">RPE:</td><td style="padding: 8px 0;">${rpe}/10</td></tr>
            ${observacoes ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #0E3C41;">Observações:</td><td style="padding: 8px 0;">${observacoes}</td></tr>` : ""}
          </table>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 13px;">
            📎 ${num_arquivos || 0} arquivo(s) salvos no Storage (bucket: resultados-atletas)
          </p>
          <p style="color: #666; font-size: 13px;">
            Acesse o <a href="https://supabase.com/dashboard/project/tmkoxpzrjzwccahzaedf/storage/buckets/resultados-atletas" style="color: #0E3C41;">Supabase Storage</a> para ver os arquivos.
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 16px;">
            Enviado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
          </p>
        </div>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CareFit Run Base <onboarding@resend.dev>",
        to: ["gustavo@carefitrunbase.com.br"],
        subject: `Resultado enviado – ${nome} – ${prova}`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      throw new Error(resendData?.message || "Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notificação enviada!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
