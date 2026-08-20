using SalesIntelligence.Api.Data;
using SalesIntelligence.Api.Models;

namespace SalesIntelligence.Api.Services;

public class AiConsultantService : IAiConsultantService
{
    private readonly SalesDataStore _dataStore;

    public AiConsultantService(SalesDataStore dataStore)
    {
        _dataStore = dataStore;
    }

    public ExecutiveBriefingResponseDto GetExecutiveBriefing()
    {
        var steps = new List<BriefingStepDto>
        {
            new(
                StepNumber: 1,
                Id: "step-intro",
                Title: "Umumiy Tahlil: Sotuvning -18% Pasayishi",
                NarrationText: "Assalomu alaykum, hurmatli Husniddin aka! So'nggi 30 kunlik ma'lumotlarni chuqur tahlil qilib chiqdim. O'tgan oyga nisbatan sotuvimiz 18 foizga, ya'ni 22 million 500 ming so'mga kamaygan. Tizimimiz barcha bo'g'inlarni tekshirib, muammoning asosiy 5 ta ildiz sababini aniqladi. Keling, har birini batafsil ko'rib chiqamiz.",
                DisplayText: "So'nggi 30 kunda umumiy sotuv 18.0% ga pasaygan (Yo'qotilgan daromad: 22,500,000 so'm). Asosiy 5 ta bo'g'indagi uzilishlar aniqlandi.",
                KeyStat: "-18% Sotuv Tushishi",
                Category: "Executive Summary",
                ImpactAmount: -22_500_000m,
                RecommendedAction: "5 ta AI tavsiyasini bosqichma-bosqich qo'llash"
            ),
            new(
                StepNumber: 2,
                Id: "step-instagram",
                Title: "1-Sabab: Instagram Leadlari Oqimi -31% ga Tushgan",
                NarrationText: "Birinchi va eng katta omil — Instagram marketingimiz. Reklama kreativlarimiz eskirgani va charchagani sababli kiruvchi leadlar soni 31 foizga kamayib ketgan. Natijada bitta mijozni jalb qilish narxi 2 baravarga qimmatlashgan. Biz darhol kreativlarni yangilab, eng yaxshi ishlayotgan e'lonlarga byudjetni yo'naltirishimiz zarur.",
                DisplayText: "Instagram leadlari 31% ga kamaygan, bitta lead narxi (CPL) $1.72 dan $3.68 ga oshgan. Kreativlar charchagan.",
                KeyStat: "-31% Lead Oqimi",
                Category: "Marketing & Acquisition",
                ImpactAmount: -8_000_000m,
                RecommendedAction: "Kreativlarni yangilash & Byudjetni optimallash"
            ),
            new(
                StepNumber: 3,
                Id: "step-agents",
                Title: "2-Sabab: 2 ta Sotuvchining Javob Vaqti 42 Daqiqaga Cho'zilgan",
                NarrationText: "Ikkinchi muammo — sotuvchilarimizning javob berish tezligi. Xususan, Sardor va Madinada o'rtacha javob berish vaqti 42 daqiqani tashkil etmoqda. Vaholanki, me'yordagi vaqt 5 daqiqa bo'lishi kerak. Mijoz 30 daqiqadan ko'p kutsa, uning xarid qilish ehtimoli 4 baravarga qulab ketadi. Bu xodimlarga SLA ogohlantirishi yuborish va leadlarni avtomatik navbatchilarga yo'naltirish kerak.",
                DisplayText: "2 ta xodimda o'rtacha javob berish vaqti 42 daqiqaga cho'zilgan (norma: 5 min). Konversiya 18% dan 3.8% ga tushgan.",
                KeyStat: "42 min Kechikish",
                Category: "Sales Team SLA",
                ImpactAmount: -6_000_000m,
                RecommendedAction: "SLA ogohlantirish & Leadlarni avto-yo'naltirish"
            ),
            new(
                StepNumber: 4,
                Id: "step-product-x",
                Title: "3-Sabab: Mahsulot X Konversiyasi 14.2% dan 4.2% ga Qulagan",
                NarrationText: "Uchinchi muammo — bizning eng ommabop mahsulotimiz bo'lgan Smart Pro X bilan bog'liq. Mahsulotni savatga qo'shayotganlar soni ko'p, ammo checkout, ya'ni to'lov sahifasida yetkazib berish narxi va boshqa to'siqlar sababli 70 foiz mijoz xariddan voz kechmoqda. Unga 10 foizlik promo-kod va bepul yetkazish aksiyasini ulasak, konversiya darhol tiklanadi.",
                DisplayText: "Smart Pro X bo'yicha checkout uzilishi 70.4% ga yetgan. Konversiya 14.2% dan 4.2% ga tushgan.",
                KeyStat: "14.2% -> 4.2%",
                Category: "Conversion Funnel",
                ImpactAmount: -4_375_000m,
                RecommendedAction: "-10% Promo-kod & Bepul yetkazish aksiyasi"
            ),
            new(
                StepNumber: 5,
                Id: "step-hot-leads",
                Title: "4-Sabab: 37 ta Issiq (Hot) Lead Mutlaqo Javobsiz Qolgan",
                NarrationText: "To'rtinchi juda jiddiy masala — hozirning o'zida bazamizda to'lov va shartnoma so'ragan 37 ta eng issiq mijoz 24 soatdan beri inboxda kutib yotibdi. Bu leadlarning umumiy qiymati 2 million 600 ming so'mni tashkil etadi. Agar ularni hoziroq Otabek va Javohir kabi eng kuchli sotuvchilarimizga biriktirsak, bu summaning kamida 80 foizini bugunning o'zida yopishimiz mumkin.",
                DisplayText: "37 ta xaridga tayyor mijoz 24+ soatdan beri javobsiz qolgan. Yo'qotilayotgan summa: 2,625,000 so'm.",
                KeyStat: "37 ta Javobsiz Lead",
                Category: "Lost Opportunities",
                ImpactAmount: -2_625_000m,
                RecommendedAction: "1 bosishda TOP sotuvchilarga taqsimlash"
            ),
            new(
                StepNumber: 6,
                Id: "step-retention",
                Title: "5-Sabab: Eski Mijozlarning Qayta Xaridi 28% ga Kamaygan",
                NarrationText: "Beshinchi sabab — doimiy xaridorlarimizning qayta xaridi 28 foizga kamaygan. Xariddan keyingi 30 kunlik avtomatik eslatmalar va sodiqlik bonuslari yuborilmagani sababli 48 ta mijoz passiv holatga tushgan. Ularga maxsus Win-Back aksiyasi va sovg'a vaucherlari yuborsak, takroriy xaridlar tiklanadi.",
                DisplayText: "Repeat purchase 22.8% dan 16.4% ga tushgan. 48 ta doimiy mijoz passivlashgan.",
                KeyStat: "-28% Qayta Xarid",
                Category: "Customer Retention",
                ImpactAmount: -1_500_000m,
                RecommendedAction: "Win-Back SMS/Telegram kampaniyasi"
            ),
            new(
                StepNumber: 7,
                Id: "step-conclusion",
                Title: "Xulosa va Qayta Tiklash Rejasi",
                NarrationText: "Xulosa qilib aytganda, Husniddin aka, agar ushbu 5 ta tavsiyani bir bosishda qo'llasak, keyingi 30 kunda yo'qotilgan 22 million 500 ming so'm daromadning 19 million 300 ming so'mini to'liq tiklab olamiz. Harakatni hoziroq boshlashni tavsiya qilaman!",
                DisplayText: "Barcha 5 ta amalni birdaniga qo'llash orqali jami daromad 102.5 mln so'mdan 121.8 mln so'mga yetkaziladi (+18.8% tiklanish).",
                KeyStat: "+19,300,000 so'm Tiklanish",
                Category: "Action Plan",
                ImpactAmount: 19_300_000m,
                RecommendedAction: "Barcha 5 ta tavsiyani 1 bosishda qo'llash"
            )
        };

        return new ExecutiveBriefingResponseDto(
            SummaryTitle: "Sales Intelligence — Boshqaruvchi uchun To'liq Ovozli Brifing",
            TotalEstimatedMinutes: 4,
            TotalLostRevenue: 22_500_000m,
            Steps: steps,
            Conclusion: "Barcha 5 ta tavsiya bir vaqtda bajarilganda sotuv darhol o'sish dinamikasiga qaytadi."
        );
    }

    public AiAskResponseDto AskQuestion(AiAskRequestDto req)
    {
        var rawQ = req.Question?.Trim() ?? string.Empty;
        var q = rawQ.ToLowerInvariant();

        var unansweredLeads = _dataStore.HotLeads.Where(x => x.Status == "Unanswered").ToList();
        var unansweredCount = unansweredLeads.Count;
        var unansweredSum = unansweredLeads.Sum(x => x.EstimatedValue);
        var completedActions = _dataStore.RootCauses.Count(x => x.ActionCompleted);
        var laggingAgents = _dataStore.Agents.Where(a => a.AvgResponseTimeMinutes > 15).ToList();
        var currentSales = _dataStore.CurrentPeriodSales;
        var lostRevenue = _dataStore.LostRevenueEstimated;

        // 1. Off-Topic & Non-Business Filter (Strict Startup Security Boundary)
        var nonBusinessKeywords = new[]
        {
            "ob-havo", "ob havo", "havo qanday", "yomg'ir", "qor", "quyosh",
            "ovqat", "osh qanday", "retsept", "taom", "pishirish", "sho'rva", "shashlik",
            "latifa", "hazil", "kulgi", "anekdot", "she'r", "qoshiq", "qo'shiq", "musiqa",
            "kino", "film", "serial", "aktyor", "o'yin", "game", "futbol", "messi", "ronaldo",
            "siyosat", "prezident", "urush", "saylov",
            "dasturlash", "python yoz", "javascript yoz", "c# yoz", "kod yozib ber", "algoritm",
            "sevgi", "muhabbat", "tanishaylik", "uylan", "turmush"
        };

        if (nonBusinessKeywords.Any(k => q.Contains(k)))
        {
            return new AiAskResponseDto(
                Success: false,
                AnswerText: "Kechirasiz. Men faqat sizning kompaniyangiz sotuv tahlili, leadlar, xodimlar samaradorligi va daromadni oshirish bo'yicha shaxsiy biznes maslahatchingizman. Biznesdan tashqari boshqa mavzularda ma'lumot bera olmayman. Keling, diqqatimizni sotuvimizni tiklash va daromadni oshirishga qaratamiz!",
                VoiceScriptText: "Kechirasiz. Men faqat biznesingiz, sotuvlar, marketing va xodimlar bo'yicha maslahat bera olaman. Biznesdan tashqari savollarga javob bera olmayman. Keling, sotuvni oshirish masalalarini ko'rib chiqamiz.",
                SuggestedFollowUps: new() { "Nega sotuv tushib ketdi?", "37 ta hot lead nima bo'ladi?", "Instagram reklamamiz holati qanday?" },
                RelatedMetric: "🔒 Faqat Biznes Tahlil Rejimi"
            );
        }

        // 2. Sales Drop & Root Causes (-18%, Revenue lost)
        if (q.Contains("nega") || q.Contains("sabab") || q.Contains("tushdi") || q.Contains("pasaydi") || q.Contains("18") || q.Contains("22.5") || q.Contains("kamaydi") || q.Contains("umumiy holat"))
        {
            var statusText = completedActions > 0 
                ? $"Hozirgacha {completedActions}/5 ta AI tavsiyasi qo'llanildi. Qolgan choralarni ham qo'llash orqali jami yo'qotilgan {lostRevenue:N0} so'm tiklanmoqda."
                : $"Sotuv pasayishining 5 ta asosiy ildiz sababi aniqlangan (Yo'qotish: {lostRevenue:N0} so'm): Instagram leadlari (-31%), sotuvchilar kechikishi (42 min), Mahsulot X konversiyasi, 37 ta javobsiz lead va qayta xarid pasayishi.";

            return new AiAskResponseDto(
                Success: true,
                AnswerText: statusText,
                VoiceScriptText: $"Sotuvimiz holati bo'yicha {completedActions} ta chora amalga oshirildi. Asosiy 5 ta bo'g'indagi AI tavsiyalarini to'liq qo'llasak, 19 million 300 ming so'mni to'liq qaytaramiz.",
                SuggestedFollowUps: new() { "37 ta hot leadni qanday qutqaramiz?", "Sotuvchilarga qanday chora ko'ramiz?", "Instagramda qanday yangilik qilish kerak?" },
                RelatedMetric: $"📉 Yo'qotilgan summa: {lostRevenue:N0} so'm ({completedActions}/5 yechim qo'llandi)"
            );
        }

        // 3. Hot Leads & Unanswered Requests
        if (q.Contains("lead") || q.Contains("37") || q.Contains("hot") || q.Contains("javobsiz") || q.Contains("mijoz") || q.Contains("ariza") || q.Contains("inbox"))
        {
            if (unansweredCount == 0)
            {
                return new AiAskResponseDto(
                    Success: true,
                    AnswerText: "Ajoyib! Barcha issiq leadlar tajribali TOP sotuvchilarga (Otabek va Javohir) muvaffaqiyatli taqsimlandi va ular bilan aloqa o'rnatilmoqda.",
                    VoiceScriptText: "Barcha issiq leadlar kuchli sotuvchilarimizga to'liq taqsimlandi. Natijada xaridlarning ko'p qismi muvaffaqiyatli yopilmoqda.",
                    SuggestedFollowUps: new() { "Sotuvchilar holati qanday?", "Instagram reklamasi nima bo'ldi?", "Daromad tiklanishi" },
                    RelatedMetric: "✅ 0 ta qolgan javobsiz lead"
                );
            }

            return new AiAskResponseDto(
                Success: true,
                AnswerText: $"Hozirgi paytda bazamizda to'lov va shartnoma so'ragan {unansweredCount} ta xaridga tayyor issiq lead javobsiz kutib yotibdi. Ularning umumiy summasi {unansweredSum:N0} so'm. Ularni darhol eng kuchli sotuvchilarimiz — Otabek va Javohirga taqsimlash orqali bugunning o'zida 80%+ daromadni yopishimiz mumkin.",
                VoiceScriptText: $"{unansweredCount} ta juda issiq mijozimiz javobsiz qolmoqda. Bu mijozlar xaridga tayyor. Ularni bir bosishda eng kuchli sotuvchilarimizga taqsimlasak, bugunning o'zida natija olamiz.",
                SuggestedFollowUps: new() { "Leadlarni hoziroq taqsimlash", "Sotuvchilar kimlar?", "Kechikayotgan xodimlar kim?" },
                RelatedMetric: $"🔥 {unansweredCount} ta kutayotgan lead ({unansweredSum:N0} so'm)"
            );
        }

        // 4. Sales Reps & SLA delays
        if (q.Contains("sotuvchi") || q.Contains("agent") || q.Contains("kechik") || q.Contains("vaqt") || q.Contains("response") || q.Contains("sardor") || q.Contains("madina") || q.Contains("otabek") || q.Contains("javohir") || q.Contains("sla"))
        {
            return new AiAskResponseDto(
                Success: true,
                AnswerText: "Sotuv jamoasida Sardor Aliyev (45 min) va Madina Karimova (39 min) bo'yicha javob vaqti me'yordan 8 baravar oshgan (normativ: 5 daqiqa). Kechikish sababli ularning konversiyasi 18% dan 3.8% ga tushgan. Aksincha, Otabek Rahimov (4 min) va Javohir Rustamov (5 min) TOP darajada ishlamoqda. Sardor va Madinaga SLA ogohlantirish yuborish va yangi leadlarni avto-yo'naltirish zarur.",
                VoiceScriptText: "Sardor va Madinaning javob berish vaqti me'yordan 8 baravarga oshib, 42 daqiqani tashkil etmoqda. Otabek va Javohir esa a'lo darajada ishlayapti. Kechikayotgan xodimlarga SLA ogohlantirishini yuboramiz.",
                SuggestedFollowUps: new() { "SLA ogohlantirish yuborish", "Top sotuvchilar kimlar?", "Leadlarni taqsimlash" },
                RelatedMetric: "⏱️ O'rtacha kechikish: 42 daqiqa (norma: 5 min)"
            );
        }

        // 5. Instagram Marketing, CPL & Ad fatigue
        if (q.Contains("instagram") || q.Contains("reklama") || q.Contains("marketing") || q.Contains("cpl") || q.Contains("kreativ") || q.Contains("byudjet") || q.Contains("target") || q.Contains("ctr"))
        {
            return new AiAskResponseDto(
                Success: true,
                AnswerText: "Instagram reklama kampaniyalarimizda kreativlarning charchashi (ad fatigue) tufayli yangi leadlar oqimi 31% ga kamaygan. Bitta mijozni jalb qilish narxi (CPL) $1.72 dan $3.68 ga ko'tarilgan (+114%). Byudjetni eng yuqori CTR (5.4%) ga ega 'Video Demo 3' kreativiga yo'naltirib, qolganlarini yangilash lozim.",
                VoiceScriptText: "Instagramdagi reklamalarimiz eskirgani uchun lead narxi ikki barobarga qimmatlashgan. Yangi videoroliklar va matnlarni qo'yib, byudjetni eng yaxshi e'lonlarga yo'naltirsak, mijozlar oqimi yana tiklanadi.",
                SuggestedFollowUps: new() { "Kreativlarni yangilash", "Mahsulot X holati qanday?", "Qayta xaridni qanday oshiramiz?" },
                RelatedMetric: "📱 CPL: $1.72 &rarr; $3.68 (+114%)"
            );
        }

        // 6. Product Funnel, Checkout & Product X
        if (q.Contains("mahsulot") || q.Contains("smart") || q.Contains("funnel") || q.Contains("voronka") || q.Contains("promo") || q.Contains("tovar") || q.Contains("konversiya") || q.Contains("checkout"))
        {
            return new AiAskResponseDto(
                Success: true,
                AnswerText: "Smart Pro X (narxi: 1,250,000 so'm) mahsulotimiz sahifasiga tashriflar yuqori, biroq to'lov (checkout) sahifasida 70.4% mijoz xariddan voz kechmoqda. Natijada konversiya 14.2% dan 4.2% ga qulagan. Unga 10% promo-kod va bepul yetkazib berishni yoqish orqali 4,375,000 so'm yo'qotishni bartaraf etamiz.",
                VoiceScriptText: "Smart Pro X bo'yicha asosiy to'siq to'lov sahifasida. Mijozlar to'lov paytida ikkilanmoqda. 10 foizlik chegirma va bepul yetkazish aksiyasi konversiyani yana 12 foizga qaytaradi.",
                SuggestedFollowUps: new() { "-10% Promoni yoqish", "Tiklanadigan daromad qancha?", "Barcha choralarni qo'llash" },
                RelatedMetric: "🛍️ Konversiya: 4.2% (oldin 14.2%)"
            );
        }

        // 7. Retention, LTV & Repeat Purchase
        if (q.Contains("qayta") || q.Contains("retention") || q.Contains("eski") || q.Contains("doimiy") || q.Contains("ltv") || q.Contains("win-back") || q.Contains("sms") || q.Contains("telegram"))
        {
            return new AiAskResponseDto(
                Success: true,
                AnswerText: "Doimiy xaridorlarimizning qayta xarid qilish ko'rsatkichi 22.8% dan 16.4% ga tushgan (-28%). Jami 48 ta doimiy mijoz passivlashgan. Ularga Win-Back SMS va Telegram orqali 50,000 so'mlik vaucher yuborish orqali 1,500,000 so'm daromadni tiklaymiz.",
                VoiceScriptText: "Eski mijozlarimizning qayta xaridi 28 foizga tushgan. 48 ta doimiy xaridorimiz passiv turibdi. Ularga sovg'a vaucherlari va xabarnoma yuborsak, takroriy xaridlar yana faollashadi.",
                SuggestedFollowUps: new() { "Win-Back kampaniyasini boshlash", "Simulyator natijalari", "Barcha choralarni qo'llash" },
                RelatedMetric: "🔁 Qayta xarid: -28% (48 ta passiv mijoz)"
            );
        }

        // 8. What-If Simulator & Recovery Forecast
        if (q.Contains("simulya") || q.Contains("prognoz") || q.Contains("kelajak") || q.Contains("reja") || q.Contains("tiklanish") || q.Contains("19.3") || q.Contains("daromad"))
        {
            return new AiAskResponseDto(
                Success: true,
                AnswerText: $"What-If simulyatsiyamiz bo'yicha barcha 5 ta AI tavsiyasi birgalikda qo'llanganda:\n- Umumiy oylik daromad: {currentSales:N0} so'mdan 121.8 mln so'mga ko'tariladi (+19,300,000 so'm);\n- O'rtacha konversiya: 3.8% dan 7.2% ga oshadi;\n- CPL narxi: $3.68 dan $2.10 ga tushadi.",
                VoiceScriptText: "Tavsiyalarni to'liq bajarsak, keyingi 30 kunda 19 million 300 ming so'm sof daromadni qaytarib, oylik aylanmani 121 million so'mga yetkazamiz.",
                SuggestedFollowUps: new() { "Barcha 5 ta tavsiyani qo'llash", "37 ta leadni taqsimlash", "SLA ogohlantirish" },
                RelatedMetric: "📈 Tiklanish: +19,300,000 so'm (+18.8%)"
            );
        }

        // 9. Default Comprehensive Dynamic Business Intelligence Response
        return new AiAskResponseDto(
            Success: true,
            AnswerText: $"Biznesingiz tahlili bo'yicha: Hozirgi kunda -18% sotuv pasayishini bartaraf qilish uchun 5 ta asosiy bo'g'in (Instagram marketing, SLA javob tezligi, Mahsulot X sahifasi, {unansweredCount} ta hot lead va mijozlar qayta xaridi) bo'yicha AI tavsiyalarini bir bosishda qo'llash tavsiya etiladi.",
            VoiceScriptText: "Ushbu savol bo'yicha tahlillarimiz shuni ko'rsatmoqdaki, tizimdagi 5 ta asosiy choralarni bosqichma-bosqich qo'llash orqali umumiy daromadimizni 121 million so'mdan oshirib olishimiz mumkin.",
            SuggestedFollowUps: new() { "Nega sotuv tushdi?", "37 ta hot lead nima bo'ladi?", "Barcha choralarni birdaniga qo'llash" },
            RelatedMetric: "💡 AI Tiklash salohiyati: +19.3 mln so'm"
        );
    }
}
