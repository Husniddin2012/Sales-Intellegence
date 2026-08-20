using SalesIntelligence.Api.Data;
using SalesIntelligence.Api.Models;

namespace SalesIntelligence.Api.Services;

public class SalesIntelligenceService : ISalesIntelligenceService
{
    private readonly SalesDataStore _dataStore;

    public SalesIntelligenceService(SalesDataStore dataStore)
    {
        _dataStore = dataStore;
    }

    public SalesSummaryDto GetOverview()
    {
        var prev = _dataStore.PreviousPeriodSales;
        var cur = _dataStore.CurrentPeriodSales;
        var diff = cur - prev;
        var percent = Math.Round((diff / prev) * 100m, 1); // -18.0%

        var waterfall = new List<WaterfallItem>
        {
            new("O'tgan davr bazaviy sotuv", prev, 100m, "Baseline", false),
            new("Instagram leadlari kamayishi", -8_000_000m, -6.4m, "Marketing", true),
            new("Sotuvchilar response time kechikishi", -6_000_000m, -4.8m, "Sales Team", true),
            new("Mahsulot X konversiyasi tushishi", -4_375_000m, -3.5m, "Product", true),
            new("37 ta hot lead javobsiz qolishi", -2_625_000m, -2.1m, "Operations", true),
            new("Eski mijozlar qayta xaridi kamayishi", -1_500_000m, -1.2m, "Retention", true),
            new("Joriy davr yakuniy sotuv", cur, 82.0m, "Current", false)
        };

        var unansweredCount = _dataStore.HotLeads.Count(l => l.Status == "Unanswered");

        var aiText = $"So'nggi 30 kunda umumiy sotuv {Math.Abs(percent)}% ga pasaygan (Yo'qotilgan daromad: {_dataStore.LostRevenueEstimated:N0} so'm). " +
                     $"AI diagnostikasi 5 ta asosiy bo'g'indagi uzilishlarni aniqladi: Instagram reklama oqimi -31% ga tushgan, " +
                     $"2 nafar sotuvchining javob berish vaqti normativdan 8 baravarga cho'zilgan, 'Smart Pro X' bo'yicha checkout konversiyasi 14.2% dan 4.2% ga qulagan, " +
                     $"{unansweredCount} ta eng issiq (hot) leadga 24 soatdan beri hech kim bog'lanmagan hamda eski mijozlarning qayta xaridi 28% ga kamaygan.";

        return new SalesSummaryDto
        {
            CurrentPeriodSales = cur,
            PreviousPeriodSales = prev,
            PercentageChange = percent,
            LostRevenueEstimated = _dataStore.LostRevenueEstimated,
            TotalLeadsCurrent = 412,
            TotalLeadsPrevious = 532,
            LeadChangePercentage = -22.5m,
            OverallConversionCurrent = 5.8m,
            OverallConversionPrevious = 7.9m,
            PeriodLabel = "So'nggi 30 kun vs Oldingi 30 kun",
            AiSummaryText = aiText,
            WaterfallBreakdown = waterfall,
            DailyTrends = _dataStore.DailyTrends
        };
    }

    public List<RootCauseDto> GetRootCauses()
    {
        var causes = _dataStore.RootCauses.ToList();
        foreach (var c in causes)
        {
            c.ActionCompleted = _dataStore.ExecutedActions.Contains(c.ActionKey);
        }
        return causes;
    }

    public InstagramAnalyticsDto GetInstagramAnalytics()
    {
        return new InstagramAnalyticsDto
        {
            LeadsThisMonth = 214,
            LeadsLastMonth = 310,
            DropPercentage = -30.96m,
            AdSpendThisMonth = 1060m, // $1060
            AdSpendLastMonth = 744m, // $744
            CostPerLeadCurrent = 4.95m, // $4.95
            CostPerLeadPrevious = 2.40m, // $2.40
            CtrCurrent = 1.45m, // 1.45%
            CtrPrevious = 3.20m, // 3.20%
            AiAnalysis = "Meta Ads kampaniyalarida 'Creative Fatigue' (kreativ to'yinishi) holati yuzaga kelgan. Bannerlar yangilanmaganligi sababli bitta lead narxi 2 baravardan ko'proqqa qimmatlashdi ($2.40 -> $4.95). 2 ta asosiy video-kreativni yangilash va 'Lookalike 2%' auditoriyaga qayta yo'naltirish talab etiladi.",
            Campaigns = _dataStore.InstagramCampaigns,
            Channels =
            [
                new("Instagram Ads / Direct", 214, 310, -30.96m),
                new("Telegram Kanal & Bot", 112, 118, -5.08m),
                new("Organik Qidiruv & Sayt", 56, 62, -9.67m),
                new("Tavsiya & Referral", 30, 42, -28.57m)
            ]
        };
    }

    public AgentResponseOverviewDto GetAgentPerformance()
    {
        var lagging = _dataStore.Agents.Where(a => a.AvgResponseTimeMinutes > 15).ToList();
        var avgTeam = (int)_dataStore.Agents.Average(a => a.AvgResponseTimeMinutes);

        return new AgentResponseOverviewDto
        {
            TotalAgents = _dataStore.Agents.Count,
            LaggingAgentsCount = lagging.Count,
            AvgTeamResponseTimeMinutes = avgTeam,
            TargetResponseTimeMinutes = 5,
            RevenueLostDueToDelay = 6_000_000m,
            AiInsight = $"Jamoada 2 nafar sotuvchi (Sardor Aliyev: 46 min, Madina Karimova: 38 min) belgilangan 5 daqiqalik SLA normativini keskin buzmoqda. " +
                        $"Tahlillarimizga ko'ra, 15+ daqiqa kutgan mijozlarning 73% i raqobatchiga o'tib ketgan yoki qiziqishini yo'qotgan. " +
                        $"Ularning navbatidagi leadlarini zudlik bilan Otabek Rustamov va Javohir Yo'ldoshev kabi tezkor sotuvchilarga qayta yo'naltirish tavsiya etiladi.",
            Agents = _dataStore.Agents,
            SlaDistribution =
            [
                new("0 - 5 daqiqa (Optimal)", 134, 21.8m, true),
                new("5 - 15 daqiqa (Qoniqarli)", 122, 14.5m, true),
                new("15 - 30 daqiqa (Kechikkan)", 86, 6.2m, false),
                new("30+ daqiqa (Kritik Kechikish)", 70, 2.1m, false)
            ]
        };
    }

    public ProductOverviewDto GetProductAnalytics()
    {
        var problemProduct = _dataStore.Products.FirstOrDefault(p => p.Id == "prod-x") ?? _dataStore.Products.First();

        var funnel = new List<FunnelStep>
        {
            new("1. Mahsulot sahifasini ko'rish (Views)", problemProduct.ViewsCount, 100m, 100m),
            new("2. Savatchaga qo'shish (Add to Cart)", problemProduct.AddToCartCount, Math.Round((decimal)problemProduct.AddToCartCount / problemProduct.ViewsCount * 100m, 1), 18.0m),
            new("3. Buyurtmani rasmiylashtirish (Checkout)", problemProduct.CheckoutCount, Math.Round((decimal)problemProduct.CheckoutCount / problemProduct.AddToCartCount * 100m, 1), 65.0m),
            new("4. Muvaffaqiyatli Xarid (Purchased)", problemProduct.OrdersCount, Math.Round((decimal)problemProduct.OrdersCount / problemProduct.CheckoutCount * 100m, 1), 50.0m)
        };

        return new ProductOverviewDto
        {
            HighlightedProblemProductId = problemProduct.Id,
            AiAnalysis = $"'{problemProduct.Name}' mahsulotida eng katta yo'qotish Savatcha -> To'lov bosqichida sodir bo'lmoqda (konversiya 14.2% dan 4.2% ga tushib ketgan). " +
                         $"Mijozlar buyurtmani tasdiqlash sahifasida yetkazib berish narxini ko'rib xaridni bekor qilmoqda. 10% chegirmali promo-kod va bepul yetkazib berish aksiyasi yo'qotilgan 4.3M so'mni qaytaradi.",
            Products = _dataStore.Products,
            ProblemProductFunnel = funnel
        };
    }

    public HotLeadsOverviewDto GetHotLeads()
    {
        var unanswered = _dataStore.HotLeads.Where(l => l.Status == "Unanswered").ToList();
        var totalEstimated = unanswered.Sum(l => l.EstimatedValue);
        var avgWait = unanswered.Any() ? Math.Round(unanswered.Average(l => l.UnansweredHours), 1) : 0;

        return new HotLeadsOverviewDto
        {
            TotalUnansweredCount = unanswered.Count,
            TotalEstimatedLostValue = totalEstimated,
            AverageWaitTimeHours = avgWait,
            AiPrescription = $"{unanswered.Count} ta xaridga tayyor mijoz 'Hot' (yuqori daromadli) maqomiga ega bo'lib, o'rtacha {avgWait} soatdan beri javobsiz qolmoqda. " +
                             $"Kutilayotgan umumiy xarid qiymati: {totalEstimated:N0} so'm. 'Bir bosishda taqsimlash' tugmasi orqali ushbu leadlar darhol bo'sh va top sotuvchilarga SMS xabarnoma bilan biriktiriladi.",
            Leads = _dataStore.HotLeads
        };
    }

    public RepeatPurchaseDto GetRepeatPurchaseAnalytics()
    {
        return new RepeatPurchaseDto
        {
            RepeatRateCurrent = 16.4m,
            RepeatRatePrevious = 22.8m,
            DropPercentage = -28.07m,
            LostLtvRevenue = 1_500_000m,
            ChurnedLoyalCustomersCount = 48,
            InactiveDaysThreshold = 45,
            AiDiagnosis = "So'nggi 45 kunda oldin xarid qilgan 48 nafar doimiy mijoz qaytib kelmagan. Sababi: xariddan keyingi 14 va 30 kunlik avtomatlashtirilgan push/SMS takliflar to'xtab qolgan. Win-Back sodiqlik bonusini ishga tushirish orqali 30-40% mijozlarni qayta faollashtirish mumkin.",
            CohortHistory =
            [
                new("Yanvar", 24.5m, 180),
                new("Fevral", 23.2m, 210),
                new("Mart", 22.8m, 225),
                new("Aprel (Joriy)", 16.4m, 195)
            ],
            ChurnReasons =
            [
                new("Xariddan keyin aloqa bo'lmagani (Follow-up yo'qligi)", 42.0m, "30 kunlik avtomatik SMS/Telegram bot xabarnomasi"),
                new("Raqobatchi aksiyalariga o'tib ketgani", 31.0m, "Eski mijozlar uchun 15% VIP qayta xarid vaucheri"),
                new("Xizmat ko'rsatish tezligidan norozilik", 18.0m, "Sifat nazorati qo'ng'irog'i (NPS so'rovnoma)"),
                new("Boshqa / Mahsulotga ehtiyoj tugagani", 9.0m, "Yangi turdosh mahsulotlar tavsiyasi")
            ]
        };
    }

    public SimulationResultDto RunSimulation(SimulationRequestDto req)
    {
        decimal recoveredTotal = 0;
        var breakdown = new List<SimulationBreakdownItem>();

        // Lever 1: Reassign 37 Hot Leads
        if (req.ReassignHotLeads)
        {
            var hotLeadPotential = 2_625_000m * 0.82m; // ~82% conversion if contacted promptly
            recoveredTotal += hotLeadPotential;
            breakdown.Add(new("37 ta Hot Leadni tezkor taqsimlash", hotLeadPotential, "Javobsiz leadlarning 82% i muvaffaqiyatli xaridga aylanadi"));
        }

        // Lever 2: Response time improvement (e.g. reduce by 25 min -> saves 5.2M)
        if (req.ResponseTimeImprovementMinutes > 0)
        {
            var ratio = Math.Min(1.0m, (decimal)req.ResponseTimeImprovementMinutes / 35.0m);
            var agentRecovery = 6_000_000m * 0.85m * ratio;
            recoveredTotal += agentRecovery;
            breakdown.Add(new($"Response Time ni {req.ResponseTimeImprovementMinutes} daqiqaga qisqartirish", agentRecovery, "Sotuvchilar tezkor javob berishi orqali yo'qotilayotgan 85% leadlar saqlab qolinadi"));
        }

        // Lever 3: Instagram budget & creative refresh
        if (req.InstagramBudgetIncreasePercent > 0)
        {
            var igRecovery = 8_000_000m * 0.75m * ((decimal)req.InstagramBudgetIncreasePercent / 20.0m);
            recoveredTotal += igRecovery;
            breakdown.Add(new($"Instagram kreativlarini yangilash (+{req.InstagramBudgetIncreasePercent}% ROI)", igRecovery, "CPL narxi $2.5 ga qaytib, leadlar oqimi 300+ taga oshadi"));
        }

        // Lever 4: Product X discount & promo
        if (req.ProductXDiscountPercent > 0)
        {
            var prodXRecovery = 4_375_000m * 0.80m * ((decimal)req.ProductXDiscountPercent / 10.0m);
            recoveredTotal += prodXRecovery;
            breakdown.Add(new($"Mahsulot X ga {req.ProductXDiscountPercent}% promo & Bepul yetkazish", prodXRecovery, "Checkout bosqichidagi to'siqlar yengilib, konversiya 12%+ ga ko'tariladi"));
        }

        // Lever 5: Winback campaign
        if (req.TriggerWinbackCampaign)
        {
            var winback = 1_500_000m * 0.70m;
            recoveredTotal += winback;
            breakdown.Add(new("Eski mijozlarga Win-Back aksiyasi yuborish", winback, "Churn bo'lgan 48 mijozning kamida 35% i qayta xarid amalga oshiradi"));
        }

        var baselineDeficit = _dataStore.LostRevenueEstimated; // 22.5M UZS
        var newTotal = _dataStore.CurrentPeriodSales + recoveredTotal;
        var newPercentChange = Math.Round(((newTotal - _dataStore.PreviousPeriodSales) / _dataStore.PreviousPeriodSales) * 100m, 1);

        var summary = $"Ushbu ssenariy orqali jami {recoveredTotal:N0} so'm yo'qotilgan daromadni tiklash mumkin. " +
                      $"Natijada umumiy sotuv ko'rsatkichi {newTotal:N0} so'mga yetadi (o'zgarish: {newPercentChange}% ga yaxshilanadi).";

        return new SimulationResultDto
        {
            CurrentSales = _dataStore.CurrentPeriodSales,
            BaselineDeficit = baselineDeficit,
            ProjectedRecoveredRevenue = recoveredTotal,
            ProjectedNewTotalSales = newTotal,
            ProjectedNewPercentageChange = newPercentChange,
            ImpactBreakdown = breakdown,
            AiExecutiveSummary = summary
        };
    }

    public ActionResultDto ExecuteAction(ActionTriggerDto trigger)
    {
        _dataStore.ExecutedActions.Add(trigger.ActionKey);

        if (trigger.ActionKey == "reassign_hot_leads")
        {
            // Reassign all 37 unanswered leads to top closers
            var topAgents = _dataStore.Agents.Where(a => a.Status == "Top" || a.Status == "Normal").ToList();
            if (!topAgents.Any()) topAgents = _dataStore.Agents;

            int i = 0;
            foreach (var lead in _dataStore.HotLeads.Where(l => l.Status == "Unanswered"))
            {
                var assigned = topAgents[i % topAgents.Count];
                lead.Status = "Reassigned";
                lead.AssignedAgentId = assigned.Id;
                lead.AssignedAgentName = assigned.Name;
                i++;
            }

            return new ActionResultDto
            {
                Success = true,
                ActionKey = trigger.ActionKey,
                Message = $"Muvaffaqiyatli bajarildi! 37 ta Hot Lead eng yaxshi sotuvchilar ({string.Join(", ", topAgents.Select(a => a.Name))}) o'rtasida teng taqsimlandi va ularga Telegram xabarnoma jo'natildi.",
                ResultPayload = new { ReassignedCount = i, AssignedTo = topAgents.Select(a => a.Name) }
            };
        }

        if (trigger.ActionKey == "alert_lagging_agents")
        {
            var lagging = _dataStore.Agents.Where(a => a.Status == "Critical").ToList();
            return new ActionResultDto
            {
                Success = true,
                ActionKey = trigger.ActionKey,
                Message = $"{lagging.Count} nafar sotuvchiga (Sardor Aliyev, Madina Karimova) qat'iy SLA ogohlantirishi yuborildi. 15 daqiqadan oshgan leadlar avtomatik navbatchiga yo'naltirish rejimi yoqildi.",
                ResultPayload = new { WarnedAgents = lagging.Select(a => a.Name), AutoReassignEnabled = true }
            };
        }

        if (trigger.ActionKey == "discount_product_x" || trigger.ActionKey == "refresh_instagram_creatives" || trigger.ActionKey == "trigger_winback_campaign")
        {
            return new ActionResultDto
            {
                Success = true,
                ActionKey = trigger.ActionKey,
                Message = $"'{trigger.ActionKey}' amali muvaffaqiyatli ishga tushirildi va tizim konfiguratsiyasiga qo'llandi.",
                ResultPayload = new { ActionKey = trigger.ActionKey, Timestamp = DateTime.UtcNow }
            };
        }

        return new ActionResultDto
        {
            Success = true,
            ActionKey = trigger.ActionKey,
            Message = "Amal muvaffaqiyatli bajarildi."
        };
    }

    public void ResetData()
    {
        _dataStore.ExecutedActions.Clear();
        _dataStore.InitializeData();
    }
}
