import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, conversations, messages } from "@workspace/db";
import {
  CreateConversationBody,
  GetConversationParams,
  DeleteConversationParams,
  SendMessageParams,
  SendMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const MOCK_REPLIES: Record<string, string> = {
  default:
    "Namaste! Main AgriSmart AI hun. Aapki kheti se judi koi bhi samasya mein madad kar sakta hun. Aap mujhse fasal rog, khaad, sinchai, mausam ya sarkar ki yojanaon ke baare mein puch sakte hain.",
  wheat:
    "Gehun ki fasal ke liye yeh zaroori baatein yaad rakhein:\n\n1. **Beej Upchar**: Buvai se pehle Thiram (2g/kg beej) ya Carboxin se beej shaodhit karein.\n2. **Khaad**: Buvai par 120 kg urea, 60 kg DAP aur 40 kg MOP per hectare daalein.\n3. **Sinchai**: Pehli sinchai 20-25 din baad (crown root stage), doosri 40-45 din baad (tillering), teesri 60-65 din baad (jointing) par karein.\n4. **Rog Niyantran**: Gehun ka katta (yellow rust) dikhe to Propiconazole 25 EC (1 ml/litre) ka chhidkaav karein.\n\nKya aur koi jaankari chahiye?",
  rice:
    "Dhan (Paddy) ki kheti ke liye:\n\n1. **Qism Chunaav**: Apne kshetra ke anukul praamanikrit beej istemaal karein — Pusa Basmati, IR-64, Swarnadhan etc.\n2. **Nursery**: 25-30 din ki paudhshaala taiyaar karein, 20 kg beej per hectare.\n3. **Ropai**: 2-3 paudhe per spot, 20x15 cm ki doori rakhein.\n4. **Khaad**: Nitrogen 3 bhaagon mein dein — basal, tillering aur panicle initiation par.\n5. **Keet-Rog**: BPH (brown plant hopper) ke liye Buprofezin ya Chlorpyrifos ka chhidkaav karein.\n\nAur kuch poochna hai?",
  pest:
    "Keet prabandhan ke liye IPM (Integrated Pest Management) apnaaein:\n\n1. **Pheromone Trap**: Keet ki sankhya jaanchne ke liye pheromone traps lagaaein (5-6 per hectare).\n2. **Neem Kadha**: 5% neem beej ka arkah (Neem Seed Kernel Extract) ka chhidkaav — sasta aur prabhavi.\n3. **Jeevanaashak**: Bacillus thuringiensis (Bt) keet-naashak jeevik option hai suton (caterpillars) ke liye.\n4. **Rasayanik**: Chlorpyrifos, Imidacloprid ya Emamectin benzoate — keet ke hisab se chunein.\n5. **Timing**: Saabere ya shaam ko chhidkaav karein jab hawaa theek ho.\n\nKis fasal par keet ka hamla hai?",
  fertilizer:
    "Khaad ki sahi maatra soil test ke hisab se tay karein. Samanya maapdand:\n\n**Gehun (per hectare):**\n- Urea: 120 kg (nitrogen ke liye)\n- DAP: 60 kg (phosphorus ke liye)\n- MOP: 40 kg (potassium ke liye)\n\n**Dhan (per hectare):**\n- Urea: 100-120 kg\n- SSP: 375 kg ya DAP 75 kg\n- MOP: 60 kg\n\n**Jeevit Khaad (Organic):**\n- Vermicompost: 2-3 tonne/hectare\n- FYM (gobar khaad): 10 tonne/hectare\n\nMitti ki jaanch (Soil Health Card) se sahi maatra pata chalegi. ICAR ka helpline: 1800-180-1551",
  scheme:
    "Sarkar ki pramukh kisan yojanaein:\n\n1. **PM-KISAN**: Har saal Rs. 6,000 seedha bank khate mein. Registration: pmkisan.gov.in\n2. **PMFBY**: Fasal bima — bahut kam premium par poori fasal ka bima. Helpline: 14447\n3. **Kisan Credit Card**: 4% byaj dar par kheti ke liye karj. Najdiki bank se avedan karein.\n4. **PMKSY**: Drip/sprinkler sinchai par 55% subsidy (laghu/seemaant kisan ke liye).\n5. **Soil Health Card**: Muft mitti jaanch aur khaad ki salah.\n\nKis yojana ke baare mein aur jaankari chahiye?",
  weather:
    "Mausam aadharit kheti ki salah:\n\n**Garmi (April–June):**\n- Sinchai subah ya shaam ko karein, dopahar mein nahin\n- Mulching se mitti ki nami bachaaein\n- 'Loo' se paudhe bachaaein — shade net lagaaein\n\n**Monsoon (July–September):**\n- Jal-nikasi ka prabandh karein\n- Fungiside ka prayog badha dein — nami mein rog badhta hai\n- Urea ka top dressing baarish ke baad karein\n\n**Rabi Season (Oct–March):**\n- Mausam ki jaankari ke liye 'Meghdoot' app use karein\n- Pala se fasal bachaaein — raat ko sinchai karein\n\nAur koi sawal?",
};

function getMockReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes("gehun") || msg.includes("wheat") || msg.includes("गेहूं")) return MOCK_REPLIES.wheat;
  if (msg.includes("dhan") || msg.includes("paddy") || msg.includes("rice") || msg.includes("धान")) return MOCK_REPLIES.rice;
  if (msg.includes("keet") || msg.includes("pest") || msg.includes("keeda") || msg.includes("कीट")) return MOCK_REPLIES.pest;
  if (msg.includes("khaad") || msg.includes("fertilizer") || msg.includes("urea") || msg.includes("खाद")) return MOCK_REPLIES.fertilizer;
  if (msg.includes("yojan") || msg.includes("scheme") || msg.includes("subsidy") || msg.includes("योजना")) return MOCK_REPLIES.scheme;
  if (msg.includes("mausam") || msg.includes("weather") || msg.includes("baarish") || msg.includes("मौसम")) return MOCK_REPLIES.weather;
  return MOCK_REPLIES.default;
}

router.get("/openai/conversations", async (req, res): Promise<void> => {
  const convos = await db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.createdAt));
  res.json(
    convos.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.createdAt.toISOString(),
    }))
  );
});

router.post("/openai/conversations", async (req, res): Promise<void> => {
  const parsed = CreateConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [convo] = await db
    .insert(conversations)
    .values({ title: parsed.data.title })
    .returning();
  res.status(201).json({
    ...convo,
    createdAt: convo.createdAt.toISOString(),
    updatedAt: convo.createdAt.toISOString(),
  });
});

router.get("/openai/conversations/:id", async (req, res): Promise<void> => {
  const params = GetConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, params.data.id));
  if (!convo) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, convo.id))
    .orderBy(messages.createdAt);
  res.json({
    ...convo,
    createdAt: convo.createdAt.toISOString(),
    updatedAt: convo.createdAt.toISOString(),
    messages: msgs.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  });
});

router.delete("/openai/conversations/:id", async (req, res): Promise<void> => {
  const params = DeleteConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(conversations).where(eq(conversations.id, params.data.id));
  res.sendStatus(204);
});

router.post("/openai/conversations/:id/messages", async (req, res): Promise<void> => {
  const params = SendMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = SendMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, params.data.id));
  if (!convo) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  await db.insert(messages).values({
    conversationId: convo.id,
    role: "user",
    content: body.data.content,
  });

  const replyText = getMockReply(body.data.content);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const words = replyText.split(" ");
  const chunkSize = 3;

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ") + (i + chunkSize < words.length ? " " : "");
    res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    await new Promise((r) => setTimeout(r, 60));
  }

  await db.insert(messages).values({
    conversationId: convo.id,
    role: "assistant",
    content: replyText,
  });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
