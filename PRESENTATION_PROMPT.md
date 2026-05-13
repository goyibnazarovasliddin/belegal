# BMI Prezentatsiya generatsiyasi uchun Prompt

Quyidagi promptni Claude'ga (yoki ChatGPT'ga) yuboring. U sizga to'liq prezentatsiya tuzilmasini va har bir slayd matnini chiqarib beradi.

---

## PROMPT (nusxa olib joylang):

```
Sen tajribali akademik maslahatchi va prezentatsiya dizayneri sifatida ishlaysan.
Bitiruv Malakaviy Ishi (BMI) himoyasi uchun rasmiy uslubdagi PowerPoint
prezentatsiyasi tuzilmasini ishlab chiqishing kerak.

LOYIHA NOMI: BeLegal — O'zbekiston Respublikasi qonunchiligi bo'yicha
sun'iy intellektga asoslangan huquqiy maslahat tizimi.

LOYIHA TEXNIK STEKI:
- Backend: FastAPI (Python), SQLite + SQLAlchemy, JWT autentifikatsiya, bcrypt
- RAG yadrosi: BM25Okapi (rank-bm25) keyword qidiruv algoritmi
- LLM: OpenAI GPT-4o-mini (langchain-openai orqali, streaming javob)
- Frontend: React 18 + TypeScript + Vite + TailwindCSS, React Router v6
- Real-time: Server-Sent Events (SSE) yordamida token-by-token streaming
- Holatni boshqarish: React Context API (Auth, Chat)
- Ma'lumotlar bazasi: 5 ta huquqiy hujjat — Konstitutsiya, Jinoyat kodeksi,
  Mehnat kodeksi, Fuqarolik kodeksi, Ma'muriy javobgarlik kodeksi
- Ishlab chiqilgan funksiyalar: chat tarixi, ko'p hujjat qidiruvi, kontakt
  tavsiyasi, foydalanuvchi profili, obuna rejalari (Free/Pro/Advokat)

LOYIHANING DOLZARBLIGI:
O'zbekistonda aholining katta qismi huquqiy savollar bo'yicha advokatga
murojaat qilish imkoniyatiga ega emas yoki qonunchilikni mustaqil
o'rganish qiyin. BeLegal — bepul, mahalliy tilda (o'zbek), aniq modda
asoslari bilan birga ishlovchi yordamchi.

RAG (Retrieval-Augmented Generation) TANLOVI SABABLARI (bularni batafsil yorit):
1. LLM hallyutsinatsiyasi muammosini hal qiladi — har bir javob real
   modda matnidan kelib chiqadi
2. Fine-tuning'ga qaraganda arzon va tezkor (qayta o'qitish shart emas)
3. Hujjatlar yangilanganda darhol qo'shish mumkin — model qayta
   trenirovkasi kerak emas
4. Manba shaffofligi — foydalanuvchi har bir iqtibos qaysi moddadan
   olinganini ko'radi (auditga yaroqli)
5. Domain-specific aniqlik — umumiy LLM emas, faqat O'zbekiston huquqiy
   bazasidan javob beradi

NIMA UCHUN BM25 (vektor embedding emas):
- O'zbek tili uchun yuqori sifatli embedding modellari kam
- Huquqiy hujjatlarda aniq terminologiya muhim — keyword match yuqori
  precision beradi
- Resurs samaradorligi: CPU'da ishlaydi, GPU shart emas
- Indeks tezda quriladi va lru_cache bilan in-memory saqlanadi
- Embedding modellari xotira (RAM) muammosi keltirib chiqargan edi —
  BM25 muammoni butunlay hal qildi

BOSHQA TEXNIK YONDASHUVLAR BILAN SOLISHTIRISH (slayd qil):
| Yondashuv | Kamchilik | RAG ustunligi |
|-----------|-----------|---------------|
| Sof LLM (RAG'siz) | Hallyutsinatsiya, eskirgan ma'lumot | Real matnga asoslangan |
| Fine-tuning | Qimmat, sekin, qayta o'qitish kerak | Hujjat qo'shish — bir daqiqa |
| Keyword qidiruv (oddiy) | Kontekst yo'q, foydalanuvchi o'zi o'qiydi | LLM tushuntirib beradi |
| Qo'lda yozilgan FAQ | Cheklangan, eskiradi | 750+ moddani avtomatik qamrab oladi |
| Dense vector search | O'zbek til uchun sifatsiz, RAM yutadi | BM25 + LLM = optimal |

TIZIM ARXITEKTURASI (diagramma slaydi uchun matn ber):
Foydalanuvchi → React UI → FastAPI → BM25 retrieval → Top-K modda →
GPT-4o-mini (kontekst bilan) → SSE stream → Foydalanuvchi

CHIQARIB BER:
1. 15-18 ta slayddan iborat to'liq tuzilma (har bir slayd uchun: sarlavha,
   asosiy matn/tezislar, vizual tavsiyasi)
2. Har bir slaydning notiq matni (himoyada nima deyish kerakligi) —
   rasmiy akademik uslubda, o'zbek tilida
3. Mumkin bo'lgan komissiya savollariga 8-10 ta javob namunasi
4. Kirish va xulosa qismlari uchun aniq formulalar

TUZILMA TARTIBI (qat'iy ushla):
1. Titul varaq (loyiha nomi, muallif, rahbar, yil)
2. Maqsad va vazifalar
3. Muammoning dolzarbligi (statistika bilan)
4. Mavjud yechimlar va ularning kamchiliklari (raqobatchilar tahlili)
5. Tanlangan yechim — RAG arxitekturasi
6. Texnik stek tafsilotlari
7. Tizim arxitekturasi (diagramma)
8. BM25 algoritmi — matematik asoslar (TF-IDF formulasi)
9. LLM integratsiyasi va prompt engineering
10. Boshqa texnik yondashuvlar bilan solishtirish (jadval)
11. Foydalanuvchi interfeysi (screenshot tavsiyalari)
12. Xavfsizlik va autentifikatsiya (JWT, bcrypt)
13. Sinov natijalari va metrikalar (javob aniqligi, vaqt)
14. Iqtisodiy samaradorlik
15. Cheklovlar va kelajakdagi rivojlanish
16. Xulosa
17. Foydalanilgan adabiyotlar
18. Rahmat slaydi / savollar uchun

USLUB TALABLARI:
- Rasmiy, akademik o'zbek tili
- "Men" emas — "ishda", "tadqiqotda", "loyihada"
- Texnik atamalar — birinchi marta ishlatilganda izoh
- Statistik dalillar va manba ko'rsatish
- Slaydlardagi matn — qisqa tezislar, paragraflar emas
- Notiq matni — to'liq jumlalar, ravon

Endi barchasini chiqarib ber.
```

---

## Qo'shimcha maslahatlar:

- Promptni Claude'ga (claude.ai) yuborganingiz ma'qul — uzun chiqish va
  o'zbek tilini yaxshi biladi
- Chiqarib bergan natijani PowerPoint'ga ko'chirib, har bir slaydga
  screenshot, diagramma va kod parchasi qo'shing
- Diagramma uchun: draw.io yoki Excalidraw ishlating
- Notiq matnini eslab qoling — yoddan emas, ravon o'qing
