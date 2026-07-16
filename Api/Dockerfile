# execução
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS base
WORKDIR /app
EXPOSE 8080

RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENV ASPNETCORE_URLS=http://+:8080

USER app

FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

COPY ["src/MedFlow.Domain/MedFlow.Domain.csproj", "src/MedFlow.Domain/"]
COPY ["src/MedFlow.Application/MedFlow.Application.csproj", "src/MedFlow.Application/"]
COPY ["src/MedFlow.Infrastructure/MedFlow.Infrastructure.csproj", "src/MedFlow.Infrastructure/"]
COPY ["src/MedFlow.Api/MedFlow.Api.csproj", "src/MedFlow.Api/"]

RUN dotnet restore "src/MedFlow.Api/MedFlow.Api.csproj"

COPY src/MedFlow.Domain/ src/MedFlow.Domain/
COPY src/MedFlow.Application/ src/MedFlow.Application/
COPY src/MedFlow.Infrastructure/ src/MedFlow.Infrastructure/
COPY src/MedFlow.Api/ src/MedFlow.Api/

WORKDIR "/src/src/MedFlow.Api"
RUN dotnet publish "MedFlow.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MedFlow.Api.dll"]