export type StepType = 'cleanser' | 'moisturizer' | 'spf' | 'serum' | 'night_cream' | 'exfoliant' | 'eye_cream' | 'retinol' | 'toner' | 'oil';

export interface StepInstruction {
  instruction: string; // main action text
  tip: string;         // rotating knowledge tip
  timerSeconds?: number; // if step needs a timer
  timerLabel?: string;
}

// Each step type has 4 arrays (one per level), each array has 5+ rotating tips
export const STEP_INSTRUCTIONS: Record<StepType, StepInstruction[][]> = {
  cleanser: [
    // Level 1 — Beginner
    [
      { instruction: "Wet your face with lukewarm water. Apply a dime-sized amount and massage in gentle circles for 30–60 seconds. Rinse and pat dry with a clean towel.", tip: "Lukewarm water is key — hot water strips your skin's natural oils, cold water doesn't open pores enough to cleanse effectively.", timerSeconds: 60, timerLabel: "Massage Timer" },
      { instruction: "Wet your face with lukewarm water. Apply a dime-sized amount and massage in gentle circles for 30–60 seconds. Rinse and pat dry.", tip: "Always use clean hands before applying cleanser — transferring bacteria from dirty hands defeats the purpose of cleansing.", timerSeconds: 60, timerLabel: "Massage Timer" },
      { instruction: "Wet your face with lukewarm water. Massage cleanser gently in circular motions for 30–60 seconds, then rinse thoroughly.", tip: "Pat dry — never rub. Rubbing creates micro-friction that can irritate skin and accelerate collagen breakdown over time.", timerSeconds: 60, timerLabel: "Massage Timer" },
      { instruction: "Apply cleanser to damp skin, massage for 30–60 seconds focusing on the T-zone, then rinse with cool water.", tip: "Finish with a cool water rinse — it helps close pores and leaves skin feeling refreshed before moisturizer.", timerSeconds: 60, timerLabel: "Massage Timer" },
      { instruction: "Wet your face, apply cleanser, and massage gently for 30–60 seconds. Rinse thoroughly and pat dry.", tip: "Cleansing twice daily is optimal — morning removes overnight oils and sweat; evening removes the day's pollution and sunscreen.", timerSeconds: 60, timerLabel: "Massage Timer" },
    ],
    // Level 2 — Intermediate
    [
      { instruction: "Apply cleanser to damp skin. If it contains an active like salicylic or glycolic acid, massage for 60 seconds then leave on for 1–2 minutes before rinsing — this maximizes the active's benefit.", tip: "BHA cleansers (salicylic acid) work better with a short contact time. That 60–90 second dwell time lets the acid penetrate the pore lining before you rinse.", timerSeconds: 90, timerLabel: "Active Dwell Timer" },
      { instruction: "Work cleanser into skin for 60 seconds. If it contains niacinamide or glycolic acid, let it sit for 1–2 minutes before rinsing to allow absorption.", tip: "Foaming cleansers can be over-stripping. If your skin feels tight after cleansing, consider a gel or cream cleanser — tight = disrupted moisture barrier.", timerSeconds: 90, timerLabel: "Dwell Timer" },
      { instruction: "Apply to damp skin and massage for 60 seconds. For active-ingredient cleansers, leave on for 1–2 minutes. Rinse with lukewarm water.", tip: "Your cleanser's pH matters: skin sits at ~4.5–5.5 pH. Harsh alkaline cleansers (high pH) disrupt your microbiome — look for 'pH-balanced' on the label.", timerSeconds: 90, timerLabel: "Dwell Timer" },
      { instruction: "Massage cleanser for 60 seconds focusing on congested areas (nose, chin). If active-based, hold for 90 seconds before rinsing.", tip: "Double cleansing (oil cleanser first, then your regular cleanser) is the gold standard for PM routines, especially if you wear SPF or makeup.", timerSeconds: 90, timerLabel: "Active Dwell Timer" },
      { instruction: "Apply and massage for 60 seconds. Active ingredient cleansers (salicylic, glycolic) benefit from 60–90 seconds of dwell time — they need contact time to work.", tip: "Using a clarisonic or silicone brush once a week enhances cleanser penetration — but don't use it daily, it can over-exfoliate.", timerSeconds: 90, timerLabel: "Dwell Timer" },
    ],
    // Level 3 — Advanced
    [
      { instruction: "Cleanse for 60 seconds, then let active ingredient cleansers dwell for 90 seconds. Follow immediately with next steps — don't let skin dry out completely between steps.", tip: "The 'wet skin' method for humectants: apply moisturizer to still-damp (not dripping) skin. Water in the upper skin layers boosts hyaluronic acid effectiveness by 40%.", timerSeconds: 90, timerLabel: "Active Dwell Timer" },
      { instruction: "Massage for 60 seconds. If using a low-pH active cleanser, dwell for 90 seconds — then move to serum application within 2 minutes while skin is still slightly damp.", tip: "Acid cleansers lower skin pH temporarily (~3.5). Wait 20–30 minutes before applying vitamin C serum to avoid over-acidifying the skin surface.", timerSeconds: 90, timerLabel: "pH Timing" },
      { instruction: "Apply to damp skin, massage 60 seconds, dwell 90 seconds if active-based. Rinse with cool water to preserve skin's acid mantle.", tip: "Your skin's acid mantle (the protective oil-water layer) takes 15–30 minutes to recover after cleansing. This is why your skin can feel tight right after washing.", timerSeconds: 90, timerLabel: "Dwell Timer" },
      { instruction: "Work cleanser into skin for 60 seconds. For glycolic acid cleansers, a 2-minute dwell time mimics a mild AHA exfoliation treatment.", tip: "Glycolic acid has the smallest molecular weight of AHAs — it penetrates deepest. A 2% glycolic cleanser with dwell time gives similar results to a 5% leave-on product.", timerSeconds: 120, timerLabel: "Glycolic Dwell Timer" },
      { instruction: "Cleanse with 60 seconds massage + 90 second dwell. This activates the keratolytic effect of active cleansers, softening the top layer for better serum penetration.", tip: "After an exfoliating cleanser, your skin is primed for maximum absorption. The next product you apply will penetrate significantly deeper — choose wisely.", timerSeconds: 90, timerLabel: "Dwell Timer" },
    ],
    // Level 4 — Expert
    [
      { instruction: "Apply active cleanser, massage 60 seconds, dwell 2–3 minutes. pH of skin post-rinse should be ~5.5 — follow immediately with a pH-adjusting toner or serum to restore acid mantle.", tip: "Clinical pearl: using a low-pH vitamin C serum immediately after an acid cleanser creates a 'pH stacking' effect — more effective than either alone but monitor for barrier disruption.", timerSeconds: 120, timerLabel: "Clinical Dwell" },
      { instruction: "Double cleanse on PM days: oil cleanser 30 seconds, then active cleanser with 90-second dwell. This is the protocol used in clinical facials.", tip: "Japanese estheticians pioneered the 2-minute cleanse rule — studies show 2+ minutes of massage increases lymphatic drainage and product penetration vs 30-second cleansing.", timerSeconds: 90, timerLabel: "Professional Protocol" },
      { instruction: "Apply BHA/AHA cleanser, massage 60 seconds in upward circular motions (counter to lymphatic flow), dwell 90–120 seconds, then rinse cool.", tip: "Upward massage motions stimulate lymphatic drainage — professional technique that reduces puffiness and increases the effectiveness of subsequent actives.", timerSeconds: 120, timerLabel: "Expert Dwell" },
      { instruction: "Active cleanser: 60s massage + 2 min dwell. Time this so your vitamin C serum follows within 5 minutes — the transiently lowered skin pH (from acid cleanser) boosts L-ascorbic acid stability.", tip: "L-ascorbic acid (vitamin C) is most stable and effective at pH 2.5–3.5. An acid-washed face right after cleansing is your optimal vitamin C application window.", timerSeconds: 120, timerLabel: "Optimal Window Timer" },
      { instruction: "Massage cleanser 60 seconds, dwell 90–120 seconds. Follow with mist of thermal water before next step to prevent trans-epidermal water loss during the active window.", tip: "Trans-epidermal water loss (TEWL) spikes for 10–15 minutes post-cleansing. Applying a hyaluronic acid serum or thermal water mist immediately traps hydration at the cellular level.", timerSeconds: 120, timerLabel: "Expert Protocol" },
    ],
  ],

  moisturizer: [
    // Level 1
    [
      { instruction: "Apply a pea-sized amount to your face and neck. Warm it between your fingertips first, then press and pat into skin — don't rub.", tip: "Moisturizer works by sealing water into your skin. Apply while skin is slightly damp from cleansing for 2x the hydration effect." },
      { instruction: "Dot moisturizer across your forehead, cheeks, nose and chin. Pat gently until absorbed — focus on dry areas first.", tip: "Don't forget your neck — it's one of the first areas to show aging but most people skip it entirely." },
      { instruction: "Apply moisturizer in upward, outward strokes from the center of your face. Press any excess into your neck and décolletage.", tip: "The 'press and hold' method — pressing moisturizer into skin for 10 seconds — increases absorption by up to 30% vs rubbing it on." },
      { instruction: "Warm a pea-sized amount in your palms, then press gently into skin starting from center of face outward.", tip: "Oily skin still needs moisturizer — skipping it signals your skin to overproduce oil. Use a lightweight gel-cream if you're oily." },
      { instruction: "Apply moisturizer to slightly damp skin in upward strokes. Give it 60 seconds to absorb before applying SPF.", tip: "Wait 60 seconds between moisturizer and SPF — applying sunscreen too quickly can dilute and reduce its SPF factor." },
    ],
    // Level 2
    [
      { instruction: "Apply to damp skin immediately after cleansing. Your moisturizer contains humectants (like hyaluronic acid) that trap ambient moisture — damp skin = better results.", tip: "Hyaluronic acid is a humectant — it draws moisture FROM the environment INTO your skin. In dry climates, follow with an occlusive (like a face oil or barrier cream) to trap it in." },
      { instruction: "Layer your moisturizer after any serums have fully absorbed. Press and hold technique: apply, then press both palms gently against face for 10 seconds.", tip: "The Moisture Sandwich: hydrating toner → serum → moisturizer → oil. Each layer seals the one before it. Your moisturizer is the third layer of protection." },
      { instruction: "Apply to slightly damp skin in gentle pressing motions. Let absorb 2–3 minutes before SPF to prevent pilling.", tip: "Moisturizer pilling (those annoying little balls) happens when product hasn't fully absorbed before you apply the next step. Always wait 60–90 seconds minimum." },
      { instruction: "Use upward pressing motions to apply. Finish by pressing any excess into your neck — always bring skincare products down to your neck.", tip: "AM moisturizer: lightweight, SPF-compatible. PM moisturizer: richer, occlusive ingredients (shea, ceramides) — your skin repairs itself at night and needs the extra barrier." },
      { instruction: "Apply to damp skin immediately — within 60 seconds of patting face dry — to lock in moisture while your pores are still open.", tip: "The 60-second rule: apply moisturizer within 60 seconds of cleansing. Every minute after, your skin loses hydration from TEWL (trans-epidermal water loss)." },
    ],
    // Level 3
    [
      { instruction: "Apply to damp skin. If using a ceramide-based moisturizer, it's actively rebuilding your lipid barrier — give it 3–5 minutes before applying SPF for maximum efficacy.", tip: "Ceramides make up ~50% of your skin barrier. Products with ceramide 1, 3, and 6-II in combination (like CeraVe's blend) most closely mimic your skin's natural lipid composition." },
      { instruction: "Layer moisturizer over damp skin. For anti-aging formulas with peptides or retinol alternatives, use upward facial massage strokes — stimulates collagen production.", tip: "Peptides are collagen messengers — they signal your skin to produce more. But they're fragile: don't mix with acidic serums (low pH denatures them). Apply after any acids have fully absorbed." },
      { instruction: "Press moisturizer into skin using upward strokes. If it contains niacinamide, let it absorb fully before retinol — they compete for the same absorption pathways.", tip: "Niacinamide (vitamin B3) works best at pH 5.5–7. It strengthens your barrier, reduces pores, and balances sebum. It's one of the most evidence-backed ingredients in skincare." },
      { instruction: "Apply to damp skin. For barrier-repairing formulas (ceramides, fatty acids), use gentle pressing — not rubbing — to mimic how skin's own lipids pack together.", tip: "TEWL increases 3–5x in compromised skin. A well-formulated moisturizer reduces TEWL by creating an artificial barrier — measure your skin's progress by how long hydration lasts." },
      { instruction: "Apply immediately to damp skin. Use the '7-skin method' concept: thin layers absorb better than one thick layer — two thin applications beats one heavy application.", tip: "Your moisturizer's ingredient list tells you its purpose: first ingredient after water determines the product's primary action. Glycerin = humectant; shea = occlusive; ceramide = barrier builder." },
    ],
    // Level 4
    [
      { instruction: "Apply to damp skin using upward facial massage. Expert technique: press and hold along facial lymph nodes (under ears, along jaw) for 5 seconds each to stimulate drainage.", tip: "Gua sha and facial massage before moisturizer increases product absorption by stimulating microcirculation. Even 60 seconds of facial massage improves ingredient uptake by 20–30%." },
      { instruction: "Use the 3-layer method: thin layer humectant serum, then moisturizer, then face oil as occlusive. Let each absorb 60 seconds between layers.", tip: "The oil-last rule: face oils go last in AM (before SPF) and last in PM. They're occlusives — they seal the stack. Applying them mid-routine blocks everything applied after." },
      { instruction: "Apply moisturizer as third step in the moisture matrix: humectant → emollient → occlusive. This is the clinical standard for barrier repair protocols.", tip: "Clinical barrier repair requires all three: humectants (draw moisture in), emollients (fill gaps in barrier), occlusives (lock it all in). Most moisturizers combine all three — check your label." },
      { instruction: "Press moisturizer into skin using upward strokes, then immediately seal with 1–2 drops of face oil pressed over the top for maximum barrier occlusion.", tip: "Face oils are not moisturizers — they don't add hydration. They're occlusives that prevent water loss. Never use oil alone without a hydrating base underneath." },
      { instruction: "Apply thin layers of moisturizer using the pressing technique along facial contours. Focus extra on your undereye and nasolabial fold areas — these show dehydration first.", tip: "Expert protocol: apply moisturizer immediately after active ingredients absorb, while skin is still in its post-active 'open' state. This maximizes humectant penetration into treated skin." },
    ],
  ],

  spf: [
    // Level 1
    [
      { instruction: "Apply SPF as the last step of your morning routine. Use about a teaspoon for your face — most people under-apply. Don't forget your ears and neck.", tip: "SPF 30 blocks 97% of UVB rays. SPF 50 blocks 98%. The difference is smaller than you think — consistent daily application matters more than the number." },
      { instruction: "Apply SPF generously to your face, neck, and the backs of your hands. Wait 2–3 minutes before going outside.", tip: "UV rays cause up to 80% of visible skin aging (wrinkles, dark spots). Daily SPF is the single most effective anti-aging step in any routine." },
      { instruction: "Shake or mix your SPF, then apply a generous amount across your entire face. Don't forget your eyelids — they're common sites for skin cancer.", tip: "Clouds don't block UV — up to 80% of UV rays pass through clouds. Wear SPF rain or shine, indoors near windows too." },
      { instruction: "Apply SPF last in your AM routine. Cover your entire face, neck, and any exposed skin. Reapply every 2 hours if outdoors.", tip: "Mineral SPF (zinc oxide, titanium dioxide) starts working immediately. Chemical SPF needs 15–20 minutes to activate — plan accordingly." },
      { instruction: "Apply SPF to your entire face and neck. For best coverage, use two finger lengths of product (the '2-finger rule').", tip: "The 2-finger rule: squeeze SPF along the length of your index and middle fingers — that's the right amount for face + neck." },
    ],
    // Level 2
    [
      { instruction: "Apply SPF after moisturizer has fully absorbed (wait 60 seconds). Use the 2-finger rule: two fingers of product for face + neck. Don't rub — press and pat to avoid disturbing previous layers.", tip: "Chemical filters (avobenzone, octinoxate) need 15–20 minutes to bind to skin before they're effective. Apply and then get dressed, eat breakfast, then head out." },
      { instruction: "Apply a generous amount of SPF as your final AM step. Reapply every 2 hours of sun exposure — SPF breaks down from UV exposure and sweat.", tip: "PA rating (found on Asian SPFs) measures UVA protection: PA+ to PA++++. Look for PA+++ minimum — UVA causes photoaging and penetrates windows and cloud cover." },
      { instruction: "Use the 2-finger rule for dosage. Apply in pressing motions — never rub SPF in vigorously. Rubbing can thin the film and reduce protection.", tip: "Most sunscreen studies are done at 2mg/cm² — that's about 1/4 teaspoon for the face alone. If you're underapplying, your actual SPF might be half what the label says." },
      { instruction: "Apply SPF after all other products. For hybrid SPF-moisturizers, still follow up with a dedicated SPF for reliable protection — dual-purpose products often underprovide both functions.", tip: "Tinted SPFs with iron oxides block visible light — important for hyperpigmentation patients, since HEV (blue) light also triggers melanin production even without UV." },
      { instruction: "Apply SPF last, pressing gently into skin. Focus on often-missed spots: temples, between brows, upper lip, ears, and the triangle under the eyes.", tip: "SPF needs to be reapplied — not because it 'wears off' from time, but because photodegradation occurs. Chemical filters break down when exposed to UV. Reapply every 2 hours in direct sun." },
    ],
    // Level 3
    [
      { instruction: "Apply SPF in two thin layers for better coverage. First layer: press across face. Wait 30 seconds. Second layer: press and pat, especially hairline and around nose.", tip: "Double application of SPF is a professional technique from Korea — applying in 2 thin layers provides more even coverage than one thick application and reaches missed spots." },
      { instruction: "Use a minimum of 1/4 teaspoon for face + neck. Apply first layer, wait 30 seconds, apply second layer. This ensures no gaps in coverage.", tip: "SPF is the only truly proven anti-aging ingredient. Vitamin C second, retinol third. If you had to choose one step, SPF would be it — it prevents the damage everything else tries to repair." },
      { instruction: "Apply SPF in upward strokes to the full face, hairline, and neck. For mineral SPF, it's immediately active. For chemical, wait the 15-minute activation window before peak sun.", tip: "Zinc oxide (mineral SPF) is photostable — it doesn't degrade in sunlight. Avobenzone (chemical) is photounstable unless stabilized by octocrylene or Tinosorb. Check your filter list." },
      { instruction: "Layer SPF as the final morning step. Don't pat over it too aggressively — SPF needs to form an even film on the skin surface. Press, hold, don't rub.", tip: "Wearing SPF indoors matters: UV-A (aging rays) penetrates glass. If you sit near windows, you're getting UVA exposure. UVA causes collagen degradation without the redness of a sunburn." },
      { instruction: "Apply generous amount and pat to even coverage. Follow up with setting mist or powder SPF for reapplication throughout the day without disturbing makeup.", tip: "SPF setting powders are a real and effective reapplication method — studies confirm they can restore UV protection over makeup. Press powder in, don't sweep, for even distribution." },
    ],
    // Level 4
    [
      { instruction: "Quantify your SPF: 2mg/cm² is the clinical standard. For the average face, that's about 1.5ml or 1/3 teaspoon. Most people apply 25–50% of the needed amount.", tip: "SPF testing methodology: products are tested at 2mg/cm² on lab skin. Consumer studies show average application is 0.5–1mg/cm² — meaning your SPF 50 might perform like SPF 15–20 in practice." },
      { instruction: "Apply using the measured 2-finger method for face + neck. Add a third finger's worth if you're covering ears and décolletage. Two thin layers is the professional standard.", tip: "The sun protection factor (SPF) number measures UVB protection only — the rays that cause sunburn. UVA (aging rays) is measured differently. A high SPF number does NOT guarantee UVA protection." },
      { instruction: "Apply SPF last, quantifying with the 2-finger rule. For maximum photoaging protection, look for filters with the broadest UV spectrum: Tinosorb M+S, Mexoryl SX+XL, or zinc oxide + avobenzone.", tip: "Helioplex, Mexoryl, Tinosorb — these are stabilized broad-spectrum filter systems. European and Asian SPFs often use newer, more photostable filters not yet approved by the FDA for the US market." },
      { instruction: "Measure 1/4 teaspoon, apply in two thin layers 30 seconds apart. Don't apply near eyes without an eye-safe SPF — many SPF actives are irritating to the conjunctiva.", tip: "Mineral SPF with non-nano zinc oxide >20% is considered the gold standard by dermatologists: photostable, broad spectrum, safe for reef ecosystems, and appropriate for sensitive/reactive skin." },
      { instruction: "Apply in two measured layers, following the clinical 2mg/cm² standard. For daily office use, reapply with SPF powder at noon. For outdoor exposure, liquid reapplication every 2 hours is required.", tip: "DNA damage from UV begins within minutes of exposure — before visible redness. SPF delays but doesn't eliminate this. Antioxidants (vitamin C, E, ferulic acid) in your serum provide a secondary defense against UV-induced free radicals." },
    ],
  ],

  serum: [
    // Level 1
    [
      { instruction: "Apply 2–3 drops of serum to clean skin before moisturizer. Warm between fingertips and press gently into skin — don't rub.", tip: "Serums are concentrated treatments. A little goes a long way — using more doesn't make them work better and can cause irritation." },
      { instruction: "After cleansing, apply 2–3 drops of serum. Press into skin using your fingertips. Allow 60 seconds to absorb before moisturizer.", tip: "Serums go before moisturizer because their molecules are smaller — they need direct access to skin before heavier products create a barrier." },
    ],
    // Level 2
    [
      { instruction: "Apply serum to clean, slightly damp skin — this boosts absorption. Use 2–3 drops. Press and hold palms against face for 10 seconds to warm the product and aid penetration.", tip: "Vitamin C serums work best on a clean, slightly acidic surface. Skip toner before vitamin C, or use an acid toner to lower skin pH — this enhances L-ascorbic acid stability and absorption." },
      { instruction: "Press 2–4 drops into skin. If your serum contains niacinamide, hyaluronic acid, or peptides, apply before moisturizer and after any acid toners.", tip: "Layering rule for serums: thinnest to thickest. Water-based serums first, then oil-based. Vitamin C (water-based) before retinol alternatives; acids before peptides." },
    ],
    // Level 3
    [
      { instruction: "Apply serum to damp skin (within 60 seconds of cleansing). Press 2–4 drops in, then follow with moisturizer within 2 minutes to lock in the active ingredients before TEWL spikes.", tip: "Vitamin C (L-ascorbic acid) degrades in light and air. Keep it in a dark bottle, refrigerated if possible. If your vitamin C serum has turned orange/brown, it's oxidized and largely ineffective." },
      { instruction: "Apply 2–4 drops in pressing motions from center of face outward. For retinol alternatives (bakuchiol, retinal), wait 2 minutes to absorb before moisturizer to prevent dilution.", tip: "Retinol alternatives like bakuchiol, granactive retinoid, and retinal (retinaldehyde) offer different tolerability and potency. Retinal converts to retinoic acid 11x more efficiently than retinol." },
    ],
    // Level 4
    [
      { instruction: "Apply serum in measured doses: 2–4 drops maximum. More product doesn't equal more benefit — most actives saturate receptors at low concentrations. Wait 90 seconds before next step.", tip: "Vitamin C + Vitamin E + Ferulic Acid is the gold standard antioxidant triad — ferulic doubles the stability and efficacy of vitamins C and E together. This combination has strong clinical data." },
      { instruction: "Press serum into skin using upward strokes. For acid serums (glycolic, lactic, AHA), wait 20 minutes before applying niacinamide — at low pH, niacinamide can convert to niacin causing temporary flushing.", tip: "The niacinamide + vitamin C myth: they CAN be used together in modern stable formulations. The flushing reaction only occurs with pure unstabilized niacinamide at high concentrations. Most formulas are fine." },
    ],
  ],

  retinol: [
    // Level 3 — retinol is locked until level 3+
    [],
    [],
    [
      { instruction: "Apply a pea-sized amount of retinol to dry skin after cleansing. Wait 20–30 minutes after washing — applying to still-damp skin increases absorption and potential irritation.", tip: "The retinol purge is real: skin may break out in weeks 2–4 as cell turnover accelerates, pushing congestion to the surface. This typically resolves by week 6–8. Don't quit — this is it working." },
      { instruction: "Rice grain-sized amount of retinol. Apply to dry skin, avoid eyes and corners of mouth (most sensitive areas). Follow immediately with moisturizer to buffer.", tip: "Sandwich method: moisturizer → retinol → moisturizer. The moisture buffer reduces irritation while allowing retinol to still penetrate. Use this when starting a new, stronger retinol." },
    ],
    // Level 4
    [
      { instruction: "Apply pea-sized amount to completely dry skin 20–30 minutes after cleansing. Use the sandwich method (moisturizer → retinol → moisturizer) until your skin is fully acclimated.", tip: "Retinization takes 12–16 weeks. Don't judge retinol results before 4 months. Initial peeling and dryness give way to smoother, more even skin with continued use." },
      { instruction: "Start with retinol 2x/week, build to nightly over 8 weeks. Apply pea-sized amount to dry skin. Never layer with AHAs/BHAs on the same night — alternate evenings.", tip: "The retinol timeline: 4 weeks to see reduced breakouts, 8–12 weeks for improved texture, 12–24 weeks for fine line reduction, 6–12 months for collagen remodeling. Patience is the active ingredient." },
    ],
  ],

  exfoliant: [
    // Level 2+
    [],
    [
      { instruction: "Apply exfoliant to clean, dry skin. Leave on for the directed time (AHA: 5–10 minutes; BHA: 5 minutes). Don't massage — let it sit undisturbed. Rinse with cool water.", tip: "AHAs (glycolic, lactic) work on the skin surface — best for texture, dullness, dry skin. BHAs (salicylic acid) are oil-soluble and penetrate pores — best for acne and oiliness." },
    ],
    [
      { instruction: "Apply AHA/BHA to clean, dry skin. Leave on 10 minutes maximum. Do not combine with retinol on the same night — alternate. Always follow with SPF the next morning.", tip: "Exfoliation frequency guide: sensitive skin: 1x/week; normal skin: 2x/week; oily/acne: up to 3x/week. Over-exfoliation destroys your acid mantle — if skin feels raw or burns with products, you're overdoing it." },
    ],
    [
      { instruction: "Apply chemical exfoliant (AHA/BHA) at its recommended pH window (AHAs: 3.0–4.0; BHA: 3.0–4.0). Leave on 10–20 minutes. Do not apply to broken or compromised skin.", tip: "The pH window for acid exfoliation: AHAs need to be below pH 4 to have exfoliating effect. Above pH 4, they're just humectants. Low-pH products require a 30-minute wait before pH-sensitive ingredients (like retinol or niacinamide)." },
    ],
  ],

  night_cream: [
    // Level 1
    [
      { instruction: "Apply night cream as the last step of your PM routine. Warm between palms, then press into face and neck using upward strokes.", tip: "Night creams are typically richer than day moisturizers because your skin is in repair mode while you sleep. Your skin regenerates up to 3x faster at night than during the day." },
    ],
    // Level 2
    [
      { instruction: "Apply night cream after all serums have absorbed. Use as an occlusive final layer — it seals in everything below it. Press gently upward into neck.", tip: "Sleep position affects skin: side sleeping creates compression wrinkles over time. Silk pillowcases reduce friction; back sleeping eliminates compression wrinkles entirely." },
    ],
    // Level 3
    [
      { instruction: "Apply night cream as the final occlusive seal over your entire PM routine stack. Include neck and décolletage — skin is thinner there and shows aging faster.", tip: "Skin cell turnover peaks between 11pm–4am. This is your repair window — products applied before sleep have maximum access to regenerating cells. Active night creams (retinol, AHA) leverage this cycle." },
    ],
    // Level 4
    [
      { instruction: "Night cream is your PM occlusive seal. Apply as final step, pressing upward along facial contours. Consider applying to neck in upward strokes — against gravity, which acts on this skin 24/7.", tip: "The circadian rhythm of skin: cortisol peaks in AM (protective), repairs peak at night. Applying cortisol-mimicking ingredients (niacinamide, antioxidants) in AM and repair ingredients (retinol, peptides, ceramides) at PM aligns with your skin's natural biological clock." },
    ],
  ],

  eye_cream: [
    // All levels
    [
      { instruction: "Use your ring finger to gently tap (don't rub) eye cream along the orbital bone — not directly on the eyelid. Use the lightest touch possible.", tip: "The ring finger rule: use your weakest finger for the eye area. The skin here is the thinnest on your body (0.5mm vs 2mm on the rest of your face) and most prone to stretching." },
    ],
    [
      { instruction: "Tap a grain-of-rice amount of eye cream along the orbital bone using ring finger. Apply after serum, before moisturizer. Pat outward from inner corner.", tip: "Eye cream vs regular moisturizer: the main difference is formulation for thin skin. Many dermatologists say a gentle regular moisturizer works equally well — the key is avoiding getting regular actives (retinol, AHAs) too close to the eye." },
    ],
    [
      { instruction: "Apply eye cream along the orbital bone (bony ridge around the eye socket) — never directly on the eyelid. The product will migrate toward the eye area naturally within minutes.", tip: "Caffeine eye creams temporarily constrict blood vessels, reducing dark circles and puffiness for 4–6 hours. Keep your eye cream refrigerated for an added de-puffing effect from the cold." },
    ],
    [
      { instruction: "Use the orbital bone technique: tap from outer corner inward along the upper bone, and from inner corner outward along the lower bone. This follows lymphatic drainage direction.", tip: "Lymphatic drainage technique for eyes: gentle pressure from outer corner to inner corner of lower eye, then downward toward the lymph node under your ear — reduces AM puffiness more effectively than any topical product." },
    ],
  ],

  toner: [
    // All levels
    [
      { instruction: "After cleansing, apply toner to a cotton pad or your palms. Pat gently into skin — don't wipe.", tip: "Modern toners aren't the alcohol-heavy astringents of the 80s. Today's toners are hydrating, pH-balancing preps that enhance everything applied after." },
    ],
    [
      { instruction: "Pat toner gently into skin using palms (skip the cotton pad — it wastes product and can drag skin). Apply while skin is still slightly damp from cleansing.", tip: "Acid toners (with glycolic, lactic, or mandelic acid) lower skin pH before actives, priming skin for better absorption. They can replace your exfoliation step 2–3x/week." },
    ],
    [
      { instruction: "Apply toner to palms and press into face. If using an essence or toner with actives (niacinamide, HA, acids), layer 2–3 times using the 7-skin method for boosted hydration.", tip: "The 7-skin method (from Korean skincare): applying essence or toner 5–7 times in thin layers creates significantly more hydration than one heavy application. Each layer acts as a primer for the next." },
    ],
    [
      { instruction: "Press toner into skin in upward motions. For acid toners, allow 20 minutes before retinol or niacinamide — the temporary pH drop (~3.5) needs time to normalize before pH-sensitive ingredients.", tip: "Using an acid toner creates a temporary pH gradient in your skin: ~3.5 at the surface vs 5.5 naturally. This gap is critical for AHA/BHA exfoliation, but you must wait for neutralization before layering alkaline or pH-sensitive ingredients." },
    ],
  ],

  oil: [
    // All levels
    [
      { instruction: "Apply 2–3 drops of face oil last in your PM routine. Warm between palms and press gently into skin as a final occlusive seal.", tip: "Face oils are NOT moisturizers — they don't add water to skin. They're occlusives that prevent water loss from your previous hydrating steps. Always layer over a water-based product." },
    ],
    [
      { instruction: "Apply face oil as the final PM step. Press into skin and allow to absorb for 60 seconds. It seals your entire routine underneath.", tip: "The oil-last rule: plant oils create an occlusive barrier that blocks penetration of products applied after. Oils must go last — applying serum over oil dramatically reduces serum absorption." },
    ],
    [
      { instruction: "2–3 drops of face oil, press into skin as your final PM seal. In AM, apply under SPF for an emollient layer — but only if your SPF is compatible (test for pilling).", tip: "Rosehip oil contains natural retinoids (retinoic acid precursors), vitamin C, and linoleic acid — one of the most evidence-backed botanicals for anti-aging and hyperpigmentation. Use nightly." },
    ],
    [
      { instruction: "Apply face oil last. For maximum occlusion, mix 1–2 drops into your night cream before applying — this creates a hybrid emollient-occlusive that locks moisture in effectively.", tip: "Facial oil lipid profile matters: linoleic acid-rich oils (rosehip, sea buckthorn) are best for acne-prone skin — they reduce pore-clogging sebum. Oleic acid-rich oils (argan, marula) are better for dry, mature skin." },
    ],
  ],
};

// Map product categories to step types
export function getStepType(category: string, productName: string): StepType {
  const cat = category.toLowerCase();
  const name = productName.toLowerCase();
  if (cat.includes('cleanser') || name.includes('cleanser') || name.includes('wash') || name.includes('foam')) return 'cleanser';
  if (cat.includes('spf') || cat.includes('sunscreen') || name.includes('spf') || name.includes('sunscreen') || name.includes('uv')) return 'spf';
  if (name.includes('retinol') || name.includes('retinal') || name.includes('retin')) return 'retinol';
  if (cat.includes('exfoliant') || name.includes('exfoliant') || name.includes('acid') || name.includes('aha') || name.includes('bha')) return 'exfoliant';
  if (cat.includes('serum') || name.includes('serum') || name.includes('treatment') || name.includes('essence')) return 'serum';
  if (name.includes('eye') || cat.includes('eye')) return 'eye_cream';
  if (name.includes('oil') || cat.includes('oil') || name.includes('rosehip') || name.includes('jojoba')) return 'oil';
  if (name.includes('toner') || cat.includes('toner')) return 'toner';
  if (cat.includes('night') || name.includes('night') || name.includes('overnight')) return 'night_cream';
  return 'moisturizer';
}

// Get level-aware instruction for a step (rotates based on sessionSeed)
export function getStepInstruction(
  stepType: StepType,
  level: number, // 1–4
  sessionSeed: number // random number stored in session to rotate tips
): StepInstruction {
  const levelIndex = Math.min(level - 1, 3); // 0–3
  const instructions = STEP_INSTRUCTIONS[stepType][levelIndex];
  if (!instructions || instructions.length === 0) {
    // Fall back to level 1 if this level has no instructions for this step type
    const fallback = STEP_INSTRUCTIONS[stepType][0];
    if (!fallback || fallback.length === 0) {
      return {
        instruction: "Apply product as directed on the packaging.",
        tip: "Consistency is the most important factor in any skincare routine.",
      };
    }
    return fallback[sessionSeed % fallback.length];
  }
  return instructions[sessionSeed % instructions.length];
}
