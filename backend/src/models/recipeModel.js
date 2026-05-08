function coerceStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((x) => String(x || '').trim()).filter(Boolean);
}

function coerceRecipe(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    // legacy keys
    namaResep: raw.namaResep ? String(raw.namaResep).trim() : '',
    waktuMasakMenit: Number(raw.waktuMasakMenit || 0) || 0,
    kesulitan: raw.kesulitan ? String(raw.kesulitan).trim() : '',
    bahanUtama: coerceStringArray(raw.bahanUtama),
    bahanTambahan: coerceStringArray(raw.bahanTambahan),
    langkah: coerceStringArray(raw.langkah),
    tips: coerceStringArray(raw.tips),

    // new all-in-one keys (core_effecinecy_ux.md)
    nama_resep: raw.nama_resep ? String(raw.nama_resep).trim() : '',
    estimasi_waktu: Number(raw.estimasi_waktu || 0) || 0,
    bahan_utama: coerceStringArray(raw.bahan_utama),
    langkah_masak: coerceStringArray(raw.langkah_masak),
    tips_hemat: raw.tips_hemat ? String(raw.tips_hemat).trim() : '',
    fun_fact: raw.fun_fact ? String(raw.fun_fact).trim() : '',
    bumbu_substitusi:
      raw.bumbu_substitusi && typeof raw.bumbu_substitusi === 'object'
        ? raw.bumbu_substitusi
        : {},

    // low_effort_high_value.md
    level_skill: raw.level_skill ? String(raw.level_skill).trim() : '',
    indikator_biaya: raw.indikator_biaya ? String(raw.indikator_biaya).trim() : '',
    versi_murah:
      raw.versi_murah && typeof raw.versi_murah === 'object' ? raw.versi_murah : {},
  };
}

module.exports = { coerceRecipe };

