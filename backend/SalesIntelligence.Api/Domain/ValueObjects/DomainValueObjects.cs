namespace SalesIntelligence.Api.Domain.ValueObjects;

public readonly record struct Money
{
    public decimal Amount { get; init; }
    public string Currency { get; init; }

    public Money(decimal amount, string currency = "UZS")
    {
        if (amount < 0) throw new ArgumentException("Summa manfiy bo'lishi mumkin emas", nameof(amount));
        Amount = amount;
        Currency = currency;
    }

    public static Money FromUzs(decimal amount) => new(amount, "UZS");
    public static Money FromUsd(decimal amount) => new(amount, "USD");

    public override string ToString() => $"{Amount:N0} {Currency}";
}

public readonly record struct ResponseTime
{
    public int Minutes { get; init; }
    public int SlaTargetMinutes { get; init; }

    public ResponseTime(int minutes, int slaTargetMinutes = 5)
    {
        Minutes = Math.Max(0, minutes);
        SlaTargetMinutes = slaTargetMinutes;
    }

    public bool IsSlaBreached => Minutes > SlaTargetMinutes;
    public bool IsCriticalDelay => Minutes > 30;

    public string StatusText => Minutes switch
    {
        <= 5 => "Optimal",
        <= 15 => "Qoniqarli",
        <= 30 => "Kechikkan",
        _ => "Kritik Kechikish"
    };
}
