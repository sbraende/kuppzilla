import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const { productData } = await req.json();

    if (!productData) {
      return new Response(
        JSON.stringify({ error: "Product data is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Generating AI summary for product: ${productData.title}`);

    // Prepare context about the product
    let productContext = `
Produkt: ${productData.title}
Merke: ${productData.brand || "Ikke spesifisert"}
Beskrivelse: ${productData.description || "Ingen beskrivelse tilgjengelig"}
Pris: ${productData.salePrice || productData.price} NOK
${productData.discount ? `Rabatt: ${productData.discount}%` : ""}
Butikk: ${productData.merchant}
${productData.availability ? `Tilgjengelighet: ${productData.availability}` : ""}
    `.trim();

    // If GTIN is available, fetch additional product information from ChatGPT
    if (productData.gtin) {
      productContext += `\nGTIN: ${productData.gtin}`;
      productContext += "\n\nVennligst inkluder relevant informasjon om produktet basert på GTIN hvis mulig.";
    }

    // Call OpenAI Chat API to generate human-readable summary
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Du er en hjelpsom produktekspert. Skriv et kort, menneske-lesbart sammendrag av produktet på norsk (2-3 setninger). Fokuser på nøkkelfunksjoner, fordeler og hvem produktet passer for. Vær konsis og lettlest. Hvis GTIN er oppgitt, bruk din kunnskap om produkter med dette GTIN-nummeret til å gi mer detaljert informasjon."
          },
          {
            role: "user",
            content: productContext
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content || "";

    console.log(`Generated summary: ${summary.substring(0, 100)}...`);

    return new Response(
      JSON.stringify({
        summary,
        product: productData.title,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
