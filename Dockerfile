FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["backend/ATS/ATS.WebApi/ATS.WebApi.csproj", "backend/ATS/ATS.WebApi/"]
COPY ["backend/ATS/ATS.Infrastructure/ATS.Infrastructure.csproj", "backend/ATS/ATS.Infrastructure/"]
COPY ["backend/ATS/ATS.Domain/ATS.Domain.csproj", "backend/ATS/ATS.Domain/"]
COPY ["backend/ATS/ATS.UseCases/ATS.UseCases.csproj", "backend/ATS/ATS.UseCases/"]
COPY ["backend/ATS/Shared/Shared.csproj", "backend/ATS/Shared/"]

RUN dotnet restore "backend/ATS/ATS.WebApi/ATS.WebApi.csproj"

COPY . .
WORKDIR "/src/backend/ATS/ATS.WebApi"
RUN dotnet build "ATS.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ATS.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ATS.WebApi.dll"]