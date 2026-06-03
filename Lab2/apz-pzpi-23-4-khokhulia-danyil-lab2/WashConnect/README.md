# WashConnect Android App

Smart laundry management mobile application built with Kotlin + Jetpack Compose.

## Architecture

**Clean Architecture + MVVM + Jetpack Compose**

```
app/
├── data/           # DTOs, Retrofit ApiService, Repository implementations, DataStore
├── domain/         # Domain models, Repository interfaces, Use Cases
├── presentation/   # Screens, ViewModels, Navigation, Theme
└── di/             # Hilt dependency injection modules
```

## Tech Stack

| Layer | Technology |
|---|---|
| UI | Jetpack Compose + Material3 |
| Architecture | Clean Architecture + MVVM |
| DI | Hilt |
| Networking | Retrofit + OkHttp |
| State | StateFlow + collectAsStateWithLifecycle |
| Storage | DataStore Preferences (JWT token) |
| Navigation | Navigation Compose |

## Screens

- **Login / Register** — JWT authentication
- **Laundries** — list of available laundromats
- **Machines** — machines with real-time status (Available / Busy / Maintenance)
- **Session** — wash mode selection, price preview, session start/cancel
- **Notifications** — push notification history
- **Profile** — user info, wallet balance, top-up

## Setup

1. Start the backend server (`Washing` ASP.NET Core project)
2. Open project in Android Studio
3. Run on emulator or device (BASE_URL set to `10.0.2.2:5000` for emulator)
