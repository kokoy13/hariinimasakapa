const { GoogleGenerativeAI } = require('@google/generative-ai');
const { coerceRecipe } = require('../models/recipeModel');

function getModelName() {
  return String(process.env.GEMINI_MODEL || 'gemini-2.5-flash');
}

function requireApiKey() {
  const key = String(process.env.GEMINI_API_KEY || '').trim();
  if (!key) {
    const err = new Error(
      'GEMINI_API_KEY belum diisi. Set di backend/.env (jangan pernah push).',
    );
    err.status = 500;
    err.expose = true;
    throw err;
  }
  return key;
}

function buildPrompt(ingredients) {
  return `
Kamu adalah koki rumahan yang paham budget terbatas dan waktu sempit (anak kos/pemula).
Tugas: buat 1 resep yang masuk akal, aman dikonsumsi, hemat, dan cocok untuk bahan yang tersedia.

Input bahan (array): ${JSON.stringify(ingredients)}

Aturan output:
- Keluarkan HANYA JSON valid (tanpa markdown, tanpa code fence).
- Bahasa Indonesia.
- Jangan gunakan istilah kuliner Perancis/Barat yang mengintimidasi. Pakai bahasa sehari-hari.
- Prioritaskan langkah "all-in-one" (minim alat, satu wajan/panci bila memungkinkan).
- Struktur JSON WAJIB seperti ini (gunakan snake_case persis):
{
  "nama_resep": string,
  "estimasi_waktu": number,
  "bahan_utama": string[],
  "level_skill": "Pemula",
  "indikator_biaya": "$" | "$$" | "$$$",
  "versi_murah": {
    "judul": string,
    "ganti_bahan": { "bahan mahal": "opsi murah" }
  },
  "bumbu_substitusi": { "nama bumbu": "alternatif" },
  "langkah_masak": string[],
  "tips_hemat": string,
  "fun_fact": string
}
- "bahan_utama" gunakan yang benar-benar dari input (jangan tambahkan bahan utama baru).
- Jika ada bahan yang tergolong mahal (contoh: daging sapi), isi "versi_murah" dengan alternatif (contoh: telur/jamur/tempe).
- Jika tidak ada bahan mahal, isi "versi_murah" dengan judul yang relevan dan object kosong untuk "ganti_bahan".
- "bumbu_substitusi" hanya berisi bumbu dapur umum + alternatifnya.
- "langkah_masak" maksimal 2 kalimat per langkah, runtut, spesifik, dan aman.
- "tips_hemat" 1 kalimat, fokus hemat gas/bahan.
- "fun_fact" 1 kalimat singkat tentang masakan.
`.trim();
}

function extractJson(text) {
  const raw = String(text || '').trim();

  // If model accidentally returns fenced code, strip it.
  const stripped = raw
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  // Try parse directly first.
  try {
    return JSON.parse(stripped);
  } catch (_) {
    // Attempt to locate first JSON object substring.
    const firstBrace = stripped.indexOf('{');
    const lastBrace = stripped.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const candidate = stripped.slice(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    }
    throw new Error('AI tidak mengembalikan JSON yang valid.');
  }
}

async function generateRecipeFromIngredients(ingredients) {
  const genAI = new GoogleGenerativeAI(requireApiKey());
  const model = genAI.getGenerativeModel({ model: getModelName() });

  let text = '';
  try {
    const result = await model.generateContent(buildPrompt(ingredients));
    text = result?.response?.text?.() ?? '';
  } catch (e) {
    const msg = String(e?.message || 'Gagal memanggil AI.');
    const err = new Error('AI sedang sibuk. Coba lagi ya.');
    err.status = msg.includes('429') ? 429 : 502;
    err.expose = true;
    throw err;
  }

  const json = extractJson(text);
  const parsed = coerceRecipe(json);

  // Normalize to frontend shape while keeping all-in-one fields.
  const recipe = {
    namaResep: parsed?.namaResep || parsed?.nama_resep || '',
    waktuMasakMenit: parsed?.waktuMasakMenit || parsed?.estimasi_waktu || 0,
    kesulitan:
      parsed?.kesulitan ||
      (parsed?.estimasi_waktu
        ? parsed.estimasi_waktu <= 15
          ? 'mudah'
          : parsed.estimasi_waktu <= 30
            ? 'sedang'
            : 'sulit'
        : 'mudah'),
    bahanUtama: parsed?.bahanUtama?.length
      ? parsed.bahanUtama
      : parsed?.bahan_utama || [],
    bahanTambahan: parsed?.bahanTambahan || [],
    langkah: parsed?.langkah?.length ? parsed.langkah : parsed?.langkah_masak || [],
    tips: parsed?.tips || [],

    // extra UX fields
    bumbuSubstitusi: parsed?.bumbu_substitusi || {},
    tipsHemat: parsed?.tips_hemat || '',
    funFact: parsed?.fun_fact || '',

    // low_effort_high_value.md
    skillLevel: parsed?.level_skill || 'Pemula',
    costIndicator: parsed?.indikator_biaya || '$',
    versiMurah: parsed?.versi_murah || {},
  };

  // Minimal shape check
  if (!recipe || !recipe.namaResep || recipe.langkah.length === 0) {
    const err = new Error('Format resep dari AI tidak sesuai.');
    err.status = 502;
    err.expose = true;
    throw err;
  }

  return recipe;
}

async function streamRecipeFromIngredients(ingredients, onDelta) {
  const genAI = new GoogleGenerativeAI(requireApiKey());
  const model = genAI.getGenerativeModel({ model: getModelName() });

  try {
    const streamResult = await model.generateContentStream(
      buildPrompt(ingredients),
    );

    let fullText = '';
    for await (const chunk of streamResult.stream) {
      const part = chunk?.text?.() ?? '';
      if (part) {
        fullText += part;
        onDelta(part);
      }
    }

    const json = extractJson(fullText);
    const parsed = coerceRecipe(json);
    const recipe = {
      namaResep: parsed?.namaResep || parsed?.nama_resep || '',
      waktuMasakMenit: parsed?.waktuMasakMenit || parsed?.estimasi_waktu || 0,
      kesulitan:
        parsed?.kesulitan ||
        (parsed?.estimasi_waktu
          ? parsed.estimasi_waktu <= 15
            ? 'mudah'
            : parsed.estimasi_waktu <= 30
              ? 'sedang'
              : 'sulit'
          : 'mudah'),
      bahanUtama: parsed?.bahanUtama?.length
        ? parsed.bahanUtama
        : parsed?.bahan_utama || [],
      bahanTambahan: parsed?.bahanTambahan || [],
      langkah: parsed?.langkah?.length
        ? parsed.langkah
        : parsed?.langkah_masak || [],
      tips: parsed?.tips || [],
      bumbuSubstitusi: parsed?.bumbu_substitusi || {},
      tipsHemat: parsed?.tips_hemat || '',
      funFact: parsed?.fun_fact || '',
      skillLevel: parsed?.level_skill || 'Pemula',
      costIndicator: parsed?.indikator_biaya || '$',
      versiMurah: parsed?.versi_murah || {},
    };

    if (!recipe.namaResep || recipe.langkah.length === 0) {
      const err = new Error('Format resep dari AI tidak sesuai.');
      err.status = 502;
      err.expose = true;
      throw err;
    }

    return recipe;
  } catch (e) {
    const msg = String(e?.message || 'Gagal memanggil AI.');
    const err = new Error('AI sedang sibuk. Coba lagi ya.');
    err.status = msg.includes('429') ? 429 : 502;
    err.expose = true;
    throw err;
  }
}

module.exports = { generateRecipeFromIngredients, streamRecipeFromIngredients };

