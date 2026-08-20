# Build bosqichi (.NET 10 SDK)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Loyiha faylini ko'chirib, paketlarni tiklaymiz (keshlash uchun)
COPY ["SalesIntelligence.Api/SalesIntelligence.Api.csproj", "SalesIntelligence.Api/"]
RUN dotnet restore "SalesIntelligence.Api/SalesIntelligence.Api.csproj"

# Butun backend kodini ko'chirib, Release rejimida build qilamiz
COPY . .
WORKDIR "/src/SalesIntelligence.Api"
RUN dotnet publish "SalesIntelligence.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Ishga tushirish (Runtime) bosqichi (.NET 10 ASP.NET)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .

# Port va muhit o'zgaruvchilari
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "SalesIntelligence.Api.dll"]
