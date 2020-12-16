FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.1-stretch AS build
WORKDIR /src
COPY ["CashTrackerApiService/CashTrackerApiService.csproj", "CashTrackerApiService/"]
RUN dotnet restore "CashTrackerApiService/CashTrackerApiService.csproj"
COPY . .
WORKDIR "/src/CashTrackerApiService"
RUN dotnet build "CashTrackerApiService.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "CashTrackerApiService.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CashTrackerApiService.dll"]