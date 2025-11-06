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

    const { productData, question } = await req.json();

    if (!productData || !question) {
      return new Response(
        JSON.stringify({ error: "Product data and question are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Answering question about product: ${productData.title}`);

    // Prepare context about the product
    const productContext = `
Produkt: ${productData.title}
Merke: ${productData.brand || "Ikke spesifisert"}
Beskrivelse: ${productData.description || "Ingen beskrivelse tilgjengelig"}
Pris: ${productData.salePrice || productData.price} NOK
${productData.discount ? `Rabatt: ${productData.discount}%` : ""}
Butikk: ${productData.merchant}
${productData.availability ? `Tilgjengelighet: ${productData.availability}` : ""}
    `.trim();

    // Call OpenAI Chat API
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
            content: "Du er en hjelpsom produktekspert som svarer på spørsmål om produkter. Gi korte, nøyaktige svar på norsk basert på produktinformasjonen som er gitt. Hvis du ikke har nok informasjon til å svare, si det tydelig. Hold svarene under 3-4 setninger."
          },
          {
            role: "user",
            content: `${productContext}\n\nSpørsmål: ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || "";

    console.log(`Generated answer: ${answer.substring(0, 100)}...`);

    return new Response(
      JSON.stringify({
        question,
        answer,
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
