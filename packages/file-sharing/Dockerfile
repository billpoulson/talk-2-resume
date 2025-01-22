# #See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# USER app
# WORKDIR /app
# EXPOSE 8281
# EXPOSE 8281

# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# ARG BUILD_CONFIGURATION=Release
# WORKDIR /src
# COPY ["file-sharing.csproj", "."]
# RUN dotnet restore "./file-sharing.csproj"
# COPY . .
# WORKDIR "/src/."
# RUN dotnet build "./file-sharing.csproj" -c $BUILD_CONFIGURATION -o /app/build

# FROM build AS publish
# ARG BUILD_CONFIGURATION=Release
# RUN dotnet publish "./file-sharing.csproj" -c $BUILD_CONFIGURATION -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "file-sharing.dll"]






FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8281
EXPOSE 8443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["file-sharing.csproj", "."]
RUN dotnet restore "./file-sharing.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "./file-sharing.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./file-sharing.csproj" -c $BUILD_CONFIGURATION -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Set the environment variable for ASP.NET Core to use HTTPS.
ENV ASPNETCORE_URLS=http://+:8281

ENTRYPOINT ["dotnet", "file-sharing.dll"]