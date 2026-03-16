import { useState, useEffect, useRef } from "react";

const SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", ayahs: 7 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", ayahs: 286 },
  { number: 3, name: "Ali 'Imran", arabic: "آل عمران", ayahs: 200 },
  { number: 12, name: "Yusuf", arabic: "يوسف", ayahs: 111 },
  { number: 18, name: "Al-Kahf", arabic: "الكهف", ayahs: 110 },
  { number: 19, name: "Maryam", arabic: "مريم", ayahs: 98 },
  { number: 36, name: "Ya-Sin", arabic: "يس", ayahs: 83 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", ayahs: 78 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", ayahs: 30 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", ayahs: 4 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", ayahs: 5 },
  { number: 114, name: "An-Nas", arabic: "الناس", ayahs: 6 },
];
const TRANSLATIONS = [
  { id: 131, name: "Dr. Mustafa Khattab" },
  { id: 20, name: "Sahih International" },
  { id: 85, name: "Abdul Haleem" },
];
const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy" },
  { id: "ar.abdurrahmaansudais", name: "Abdur-Rahman As-Sudais" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
];

export default function App() {
  const [selectedSurah, setSelectedSurah] = useState(SURAHS[0]);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [translation, setTranslation] = useState(TRANSLATIONS[0]);
  const [reciter, setReciter] = useState(RECITERS[0]);
  const [ayahData, setAyahData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => { fetchAyah(); }, [selectedSurah, selectedAyah, translation]);

  async function fetchAyah() {
    setLoading(true); setError(null); setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
    try {
      const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${selectedSurah.number}:${selectedAyah}?translations=${translation.id}&fields=text_uthmani`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAyahData(data.verse);
    } catch { setError("Could not load ayah. Please try again."); }
    finally { setLoading(false); }
  }

  function toggleAudio() {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else {
      const s = String(selectedSurah.number).padStart(3,"0"), a = String(selectedAyah).padStart(3,"0");
      audioRef.current.src = `https://verses.quran.com/${reciter.id}/${s}${a}.mp3`;
      audioRef.current.play(); setIsPlaying(true);
    }
  }

  const ayahNums = Array.from({ length: selectedSurah.ayahs }, (_, i) => i + 1);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f1923,#1a2d3d,#0f1923)", fontFamily:"'Segoe UI',sans-serif", color:"#e8e0d4" }}>
      <div style={{ background:"rgba(0,0,0,0.4)", borderBottom:"1px solid rgba(212,175,55,0.3)", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#d4af37,#f0c040)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>☪</div>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:"#f0c040" }}>QUL Ayah Explorer</div>
            <div style={{ fontSize:11, color:"#8a9bb0" }}>Built with Quranic Universal Library · Tarteel</div>
          </div>
        </div>
        <a href="https://qul.tarteel.ai" target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#8a9bb0", textDecoration:"none", border:"1px solid rgba(138,155,176,0.3)", padding:"4px 10px", borderRadius:20 }}>qul.tarteel.ai ↗</a>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:16, padding:24, marginBottom:24 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div>
              <label style={{ fontSize:11, color:"#8a9bb0", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:8 }}>Surah</label>
              <select value={selectedSurah.number} onChange={e=>{ setSelectedSurah(SURAHS.find(x=>x.number===parseInt(e.target.value))); setSelectedAyah(1); }} style={{ width:"100%", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:8, padding:"10px 12px", color:"#e8e0d4", fontSize:14 }}>
                {SURAHS.map(s=><option key={s.number} value={s.number}>{s.number}. {s.name} — {s.arabic}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, color:"#8a9bb0", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:8 }}>Ayah</label>
              <select value={selectedAyah} onChange={e=>setSelectedAyah(parseInt(e.target.value))} style={{ width:"100%", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:8, padding:"10px 12px", color:"#e8e0d4", fontSize:14 }}>
                {ayahNums.map(n=><option key={n} value={n}>Ayah {n}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <label style={{ fontSize:11, color:"#8a9bb0", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:8 }}>Translation</label>
              <select value={translation.id} onChange={e=>setTranslation(TRANSLATIONS.find(t=>t.id===parseInt(e.target.value)))} style={{ width:"100%", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:8, padding:"10px 12px", color:"#e8e0d4", fontSize:14 }}>
                {TRANSLATIONS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, color:"#8a9bb0", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:8 }}>Reciter</label>
              <select value={reciter.id} onChange={e=>setReciter(RECITERS.find(r=>r.id===e.target.value))} style={{ width:"100%", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:8, padding:"10px 12px", color:"#e8e0d4", fontSize:14 }}>
                {RECITERS.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:16, padding:32, marginBottom:24, minHeight:240, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          {loading && <div style={{ color:"#8a9bb0" }}>Loading ayah...</div>}
          {error && <div style={{ color:"#e07070" }}>{error}</div>}
          {!loading && !error && ayahData && <>
            <div style={{ fontSize:11, color:"#d4af37", letterSpacing:2, textTransform:"uppercase", marginBottom:24 }}>{selectedSurah.name} • Ayah {selectedAyah} of {selectedSurah.ayahs}</div>
            <div style={{ fontSize:34, lineHeight:2, textAlign:"center", fontFamily:"'Amiri','Traditional Arabic',serif", color:"#f5f0e8", direction:"rtl", marginBottom:28 }}>{ayahData.text_uthmani}</div>
            <div style={{ width:"100%", height:1, background:"rgba(212,175,55,0.2)", marginBottom:24 }} />
            <div style={{ fontSize:16, lineHeight:1.8, textAlign:"center", color:"#c8bfb0", maxWidth:600, fontStyle:"italic" }}>{ayahData.translations?.[0]?.text?.replace(/<[^>]+>/g,"") || "—"}</div>
            <div style={{ marginTop:12, fontSize:11, color:"#6a7b8a" }}>— {translation.name}</div>
          </>}
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center", justifyContent:"center" }}>
          <button onClick={()=>selectedAyah>1&&setSelectedAyah(a=>a-1)} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 20px", color:"#e8e0d4", cursor:"pointer", fontSize:18 }}>←</button>
          <button onClick={toggleAudio} style={{ background:isPlaying?"linear-gradient(135deg,#c0392b,#e74c3c)":"linear-gradient(135deg,#d4af37,#f0c040)", border:"none", borderRadius:50, width:56, height:56, cursor:"pointer", fontSize:22, display:"flex", alignItems:"center", justifyContent:"center", color:"#0f1923", fontWeight:700 }}>{isPlaying?"⏸":"▶"}</button>
          <button onClick={()=>selectedAyah<selectedSurah.ayahs&&setSelectedAyah(a=>a+1)} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 20px", color:"#e8e0d4", cursor:"pointer", fontSize:18 }}>→</button>
        </div>
        <audio ref={audioRef} onEnded={()=>setIsPlaying(false)} />
        <div style={{ marginTop:32, padding:16, background:"rgba(212,175,55,0.05)", border:"1px solid rgba(212,175,55,0.15)", borderRadius:12, textAlign:"center" }}>
          <div style={{ fontSize:12, color:"#8a9bb0" }}>Arabic text, translations, and audio from <a href="https://qul.tarteel.ai" target="_blank" rel="noreferrer" style={{ color:"#d4af37", textDecoration:"none" }}>QUL by Tarteel</a></div>
        </div>
      </div>
    </div>
  );
}