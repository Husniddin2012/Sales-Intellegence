using SalesIntelligence.Api.Models;

namespace SalesIntelligence.Api.Data;

public class SalesDataStore
{
    private static readonly object _lock = new();

    public decimal PreviousPeriodSales { get; set; } = 125_000_000m; // 125M UZS (or standard monetary unit)
    public decimal CurrentPeriodSales { get; set; } = 102_500_000m; // 102.5M UZS -> -18.0% drop!
    public decimal LostRevenueEstimated => PreviousPeriodSales - CurrentPeriodSales; // 22,500,000 UZS

    public List<HotLeadDto> HotLeads { get; set; } = [];
    public List<AgentPerformanceDto> Agents { get; set; } = [];
    public List<ProductMetricDto> Products { get; set; } = [];
    public List<AdCampaignDto> InstagramCampaigns { get; set; } = [];
    public List<RootCauseDto> RootCauses { get; set; } = [];
    public List<DailySalesTrend> DailyTrends { get; set; } = [];
    public HashSet<string> ExecutedActions { get; set; } = [];

    public SalesDataStore()
    {
        InitializeData();
    }

    public void InitializeData()
    {
        lock (_lock)
        {
            // 1. Root Causes (5 Asosiy Sabab)
            RootCauses =
            [
                new RootCauseDto
                {
                    Id = "rc-instagram-drop",
                    Category = "Marketing & Leadgen",
                    Title = "Instagram leadlari 31% ga kamaygan",
                    Severity = "Critical",
                    ImpactPercentage = -6.4m,
                    LostRevenue = 8_000_000m,
                    Icon = "Instagram",
                    ShortDescription = "Oxirgi 30 kunda Instagram reklamalari to'yinishi va CPL $2.4 dan $4.9 ga oshishi oqibatida kiruvchi leadlar soni 310 tadan 214 taga tushdi.",
                    DetailedReason = "Meta Ads kampaniyalarida asosiy 2 ta video bannerda 'Creative Fatigue' (charchash) kuzatildi. CTR 3.2% dan 1.4% ga tushib ketgan, oqibatda byudjet sarflansa ham leadlar soni keskin qisqardi.",
                    KeyMetricBefore = "310 ta lead (CPL: $2.4)",
                    KeyMetricAfter = "214 ta lead (CPL: $4.9)",
                    ActionKey = "refresh_instagram_creatives",
                    ActionTitle = "Yangi kreativlarni ishga tushirish & Byudjetni optimallash"
                },
                new RootCauseDto
                {
                    Id = "rc-agent-response-delay",
                    Category = "Sales Team Performance",
                    Title = "2 ta sotuvchining response time'i keskin oshgan (42 min)",
                    Severity = "Critical",
                    ImpactPercentage = -4.8m,
                    LostRevenue = 6_000_000m,
                    Icon = "ClockAlert",
                    ShortDescription = "Sardor Aliyev va Madina Karimova bo'yicha o'rtacha javob berish vaqti 5 daqiqadan 38-46 daqiqaga cho'zilib ketgan. Natijada mijozlar raqobatchilarga o'tib ketgan.",
                    DetailedReason = "Tahlillar shuni ko'rsatadiki, 15 daqiqadan kech berilgan javoblarda konversiya 4 baravarga qulaydi. Ushbu 2 sotuvchiga tushgan 112 ta leadning 64% sovuq holatga o'tgan.",
                    KeyMetricBefore = "4.5 daqiqa (normativ)",
                    KeyMetricAfter = "42.0 daqiqa (8.4x kechikish)",
                    ActionKey = "alert_lagging_agents",
                    ActionTitle = "SLA Avtomatik eslatish & Leadlarni navbatchiga o'tkazish"
                },
                new RootCauseDto
                {
                    Id = "rc-product-x-conversion",
                    Category = "Product & Pricing",
                    Title = "Mahsulot X (Smart Pro X) bo‘yicha conversion 14.2% dan 4.2% ga tushgan",
                    Severity = "High",
                    ImpactPercentage = -3.5m,
                    LostRevenue = 4_375_000m,
                    Icon = "ShoppingBag",
                    ShortDescription = "Top bestseller mahsulot 'Smart Pro X' bo'yicha savatchadan to'lovga o'tish (Checkout) bosqichida 70% mijoz xaridni to'xtatmoqda.",
                    DetailedReason = "Bozorda raqobatchi tomonidan arzonroq analog chiqarilishi va yetkazib berish narxining ko'tarilishi sababli konversiya uzilgan. Funnelning 'Add to Cart' bosqichidan keyin xaridlar 3.4 baravar tushgan.",
                    KeyMetricBefore = "14.2% konversiya",
                    KeyMetricAfter = "4.2% konversiya (-70.4% pasayish)",
                    ActionKey = "discount_product_x",
                    ActionTitle = "Mahsulot X uchun -10% chegirma & Free Delivery promo"
                },
                new RootCauseDto
                {
                    Id = "rc-unanswered-hot-leads",
                    Category = "Lost Opportunities",
                    Title = "37 ta hot lead mutlaqo javobsiz qolib ketgan",
                    Severity = "Critical",
                    ImpactPercentage = -2.1m,
                    LostRevenue = 2_625_000m,
                    Icon = "Flame",
                    ShortDescription = "Xaridga 100% tayyor, to'lov yoki shartnoma so'ragan 37 ta mijozga 24 soatdan ortiq vaqt mobaynida hech kim bog'lanmagan.",
                    DetailedReason = "CRM tizimida yangi leadlar oqimining avtomatik taqsimlanishidagi uzilish va xodimlarning ta'tildaligi sababli ushbu leadlar 'Inbox'da harakatsiz yotibdi.",
                    KeyMetricBefore = "0 ta qoldiq lead",
                    KeyMetricAfter = "37 ta kutayotgan issiq lead",
                    ActionKey = "reassign_hot_leads",
                    ActionTitle = "37 ta leadni darhol TOP sotuvchilarga taqsimlash"
                },
                new RootCauseDto
                {
                    Id = "rc-repeat-purchase-drop",
                    Category = "Customer Retention",
                    Title = "Eski mijozlarning repeat purchase ulushi 28% ga kamaygan",
                    Severity = "Medium",
                    ImpactPercentage = -1.2m,
                    LostRevenue = 1_500_000m,
                    Icon = "Repeat",
                    ShortDescription = "Doimiy xaridorlarning qayta xarid qilish ko'rsatkichi 22.8% dan 16.4% ga tushgan. LTV (Lifetime Value) kamaymoqda.",
                    DetailedReason = "Xariddan keyingi 30 kunlik avtomatik follow-up va sodiqlik bonuslari yuborilmagan. Natijada ikkinchi xarid qilish davri cho'zilib ketgan.",
                    KeyMetricBefore = "22.8% qayta xarid",
                    KeyMetricAfter = "16.4% qayta xarid (-28.1%)",
                    ActionKey = "trigger_winback_campaign",
                    ActionTitle = "Eski mijozlar uchun SMS/Telegram Win-Back aksiyasi"
                }
            ];

            // 2. 37 ta Real Hot Leads Seed Data
            string[] firstNames = ["Jasur", "Aziza", "Bekzod", "Dilnoza", "Ulug'bek", "Malika", "Sherzod", "Nilufar", "Otabek", "Shahnoza", "Farhod", "Gulbahor", "Rustam", "Zilola", "Anvar", "Nodira", "Bobur", "Umida", "Sanjar", "Munisa", "Javohir", "Dildora", "Akmal", "Kamola", "Mansur", "Diyora", "Jamshid", "Zarina", "Timur", "Sevara", "Alisher", "Madina", "Davron", "Shoira", "Eldor", "Rayhon", "Siroj"];
            string[] lastNames = ["Karimov", "Rahimova", "Toshmatov", "Yusupova", "Soliyev", "Qodirova", "Nazarov", "Aliyeva", "Ergashev", "Saidova", "Mirzayev", "Ismoilova", "Husanov", "Umarova", "Vohidov", "Sharipova", "Xoliqov", "Azimova", "G'aniyev", "Rustamova", "Bozorov", "Sobirova", "Yo'ldoshev", "Axmedova", "Norov", "Qosimova", "Turayev", "Ikromova", "Jumayev", "Davlatova", "Sultonov", "Rajabova", "Po'latov", "Olimova", "Hamidov", "Nabiyeva", "Shukurov"];
            string[] products = ["Smart Pro X Komplekt", "Enterprise CRM Litsenziya", "StartUp Full Bundle", "Smart Pro X (VIP)", "Kompaniya Avtomatizatsiya Paketi"];
            string[] channels = ["Instagram DM", "Instagram Lead Form", "Telegram Bot", "Veb-sayt Forma"];
            string[] inquiries = [
                "Bugun to'lov qilsam qachon yetkazib berasiz?",
                "Katta hajmda olmoqchimiz, hisob-faktura yubora olasizmi?",
                "Karta orqali to'lov havolasini bering, tayyorman.",
                "Shartnoma loyihasini tashlang, bugun imzolaymiz.",
                "Demo ko'rdik, 5 ta litsenziyaga buyurtma bermoqchimiz.",
                "Instagram orqali yozgandim, narxini tasdiqlab yuboring sotib olaman."
            ];

            var rnd = new Random(42);
            HotLeads = new List<HotLeadDto>();
            for (int i = 0; i < 37; i++)
            {
                var fName = firstNames[i % firstNames.Length];
                var lName = lastNames[i % lastNames.Length];
                var phoneNum = $"+998 9{rnd.Next(0, 9)} {rnd.Next(100, 999)} {rnd.Next(10, 99)} {rnd.Next(10, 99)}";
                var ig = $"@{fName.ToLower()}_{lName.ToLower().Substring(0, Math.Min(4, lName.Length))}";
                var product = products[rnd.Next(products.Length)];
                var channel = channels[rnd.Next(channels.Length)];
                var value = rnd.Next(15, 85) * 100_000m; // 1.5M - 8.5M UZS
                var hoursAgo = Math.Round(rnd.NextDouble() * 36 + 12, 1); // 12h to 48h ago

                HotLeads.Add(new HotLeadDto
                {
                    Id = $"HL-{1000 + i + 1}",
                    CustomerName = $"{fName} {lName}",
                    Phone = phoneNum,
                    InstagramHandle = ig,
                    Channel = channel,
                    ProductName = product,
                    EstimatedValue = value,
                    CreatedAt = DateTime.UtcNow.AddHours(-hoursAgo),
                    UnansweredHours = hoursAgo,
                    Status = "Unanswered",
                    AssignedAgentId = "",
                    AssignedAgentName = "Taqsimlanmagan (Kutmoqda)",
                    Urgency = hoursAgo > 24 ? "Critical" : "High",
                    CustomerInquiry = inquiries[rnd.Next(inquiries.Length)]
                });
            }

            // 3. Sales Agents Performance
            Agents =
            [
                new AgentPerformanceDto
                {
                    Id = "ag-1",
                    Name = "Sardor Aliyev",
                    Role = "Senior Sales Rep",
                    Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                    AvgResponseTimeMinutes = 46, // Flagged 1
                    TargetResponseTimeMinutes = 5,
                    TotalAssignedLeads = 68,
                    ClosedDeals = 4,
                    MissedHotLeads = 18,
                    ConversionRate = 5.8m,
                    PreviousConversionRate = 18.2m,
                    Status = "Critical",
                    Diagnosis = "Response time 46 daqiqa! Leadlarning 73% sovigan. Tezkor yuklamani yengillatish va SLA talab qilinadi."
                },
                new AgentPerformanceDto
                {
                    Id = "ag-2",
                    Name = "Madina Karimova",
                    Role = "Sales Specialist",
                    Avatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
                    AvgResponseTimeMinutes = 38, // Flagged 2
                    TargetResponseTimeMinutes = 5,
                    TotalAssignedLeads = 54,
                    ClosedDeals = 3,
                    MissedHotLeads = 14,
                    ConversionRate = 5.5m,
                    PreviousConversionRate = 16.5m,
                    Status = "Critical",
                    Diagnosis = "Response time 38 daqiqa. Kiruvchi xabarlarga kech javob bergani sababli 14 ta hot lead yo'qotilgan."
                },
                new AgentPerformanceDto
                {
                    Id = "ag-3",
                    Name = "Otabek Rustamov",
                    Role = "Top Closer",
                    Avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                    AvgResponseTimeMinutes = 4,
                    TargetResponseTimeMinutes = 5,
                    TotalAssignedLeads = 72,
                    ClosedDeals = 16,
                    MissedHotLeads = 1,
                    ConversionRate = 22.2m,
                    PreviousConversionRate = 21.0m,
                    Status = "Top",
                    Diagnosis = "A'lo darajada. O'rtacha 4 daqiqada javob beradi. Konversiyasi 22.2%. 37 ta leadni qayta taqsimlashga tayyor."
                },
                new AgentPerformanceDto
                {
                    Id = "ag-4",
                    Name = "Zilola Umarova",
                    Role = "Sales Rep",
                    Avatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                    AvgResponseTimeMinutes = 6,
                    TargetResponseTimeMinutes = 5,
                    TotalAssignedLeads = 58,
                    ClosedDeals = 11,
                    MissedHotLeads = 2,
                    ConversionRate = 18.9m,
                    PreviousConversionRate = 17.5m,
                    Status = "Normal",
                    Diagnosis = "Barqaror natija. O'rtacha 6 daqiqada javob bermoqda."
                },
                new AgentPerformanceDto
                {
                    Id = "ag-5",
                    Name = "Javohir Yo'ldoshev",
                    Role = "Inbound Closer",
                    Avatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                    AvgResponseTimeMinutes = 5,
                    TargetResponseTimeMinutes = 5,
                    TotalAssignedLeads = 62,
                    ClosedDeals = 13,
                    MissedHotLeads = 2,
                    ConversionRate = 20.9m,
                    PreviousConversionRate = 19.8m,
                    Status = "Top",
                    Diagnosis = "Top ko'rsatkich. Tezkor va sifatli muloqot qiladi."
                }
            ];

            // 4. Products & Conversion Funnel (Mahsulot X problematik)
            Products =
            [
                new ProductMetricDto
                {
                    Id = "prod-x",
                    Name = "Smart Pro X (Flagship Komplekt)",
                    Sku = "SPX-2026",
                    Category = "Hardware & Software",
                    Price = 3_800_000m,
                    CurrentConversionRate = 4.2m,
                    PreviousConversionRate = 14.2m,
                    ConversionChangePercent = -70.4m,
                    LostRevenue = 4_375_000m,
                    ViewsCount = 4250,
                    AddToCartCount = 680,
                    CheckoutCount = 210,
                    OrdersCount = 28,
                    IsAlerted = true,
                    RootCauseNote = "Savatchadan Checkoutga o'tishda xaridorlar narx va yetkazib berish xarajatlari sababli buyurtmani to'xtatmoqda."
                },
                new ProductMetricDto
                {
                    Id = "prod-crm",
                    Name = "CRM Enterprise Yillik Litsenziya",
                    Sku = "CRM-ENT-1Y",
                    Category = "SaaS Software",
                    Price = 6_500_000m,
                    CurrentConversionRate = 9.8m,
                    PreviousConversionRate = 10.4m,
                    ConversionChangePercent = -5.7m,
                    LostRevenue = 950_000m,
                    ViewsCount = 1820,
                    AddToCartCount = 260,
                    CheckoutCount = 140,
                    OrdersCount = 26,
                    IsAlerted = false,
                    RootCauseNote = "Barqaror konversiya, kichik mavsumiy tebranish."
                },
                new ProductMetricDto
                {
                    Id = "prod-startup",
                    Name = "StartUp Business Starter Pack",
                    Sku = "STP-START-01",
                    Category = "All-in-One Bundle",
                    Price = 1_900_000m,
                    CurrentConversionRate = 12.1m,
                    PreviousConversionRate = 12.8m,
                    ConversionChangePercent = -5.4m,
                    LostRevenue = 600_000m,
                    ViewsCount = 3100,
                    AddToCartCount = 520,
                    CheckoutCount = 310,
                    OrdersCount = 63,
                    IsAlerted = false,
                    RootCauseNote = "Normal konversiya sur'ati."
                },
                new ProductMetricDto
                {
                    Id = "prod-support",
                    Name = "24/7 VIP Premium Texnik Qo'llab-quvvatlash",
                    Sku = "VIP-SUPP-M",
                    Category = "Service Subscription",
                    Price = 850_000m,
                    CurrentConversionRate = 15.6m,
                    PreviousConversionRate = 16.0m,
                    ConversionChangePercent = -2.5m,
                    LostRevenue = 250_000m,
                    ViewsCount = 1450,
                    AddToCartCount = 320,
                    CheckoutCount = 240,
                    OrdersCount = 50,
                    IsAlerted = false,
                    RootCauseNote = "Yaxshi ushlab turish ko'rsatkichi."
                }
            ];

            // 5. Instagram Campaigns
            InstagramCampaigns =
            [
                new AdCampaignDto("Instagram Stories - Smart Pro X (Video 1)", "Creative Fatigue", 420m, 88, 4.77m, 1.35m, "Kreativ charchagan: 45 kundan beri yangilanmagan, CTR 1.35% ga tushgan"),
                new AdCampaignDto("Instagram Reels - Biznes Avtomatizatsiya (Video 2)", "High CPL", 380m, 72, 5.27m, 1.20m, "Auditoriya to'yingan, takroriy ko'rsatish chastotasi 4.8x"),
                new AdCampaignDto("Instagram Feed - CRM Retargeting", "Active / Good", 260m, 54, 4.81m, 2.80m, "Ijobiy natija, lekin byudjet cheklangan"),
            ];

            // 6. Daily Trends for charts
            DailyTrends = new List<DailySalesTrend>();
            var startDate = DateTime.UtcNow.AddDays(-29);
            for (int d = 0; d < 30; d++)
            {
                var dt = startDate.AddDays(d);
                var dateStr = dt.ToString("dd.MM");
                // simulate historical trend where earlier was higher and recent days dropped
                decimal prev = 3_800_000m + (decimal)(Math.Sin(d * 0.4) * 500_000) + rnd.Next(-200_000, 300_000);
                decimal cur = d < 10 
                    ? prev * 0.95m 
                    : prev * (decimal)(0.80 - (d - 10) * 0.005) + rnd.Next(-300_000, 200_000);
                int leads = (int)(cur / 450_000m);
                DailyTrends.Add(new DailySalesTrend(dateStr, Math.Round(cur, 0), Math.Round(prev, 0), leads));
            }
        }
    }
}
