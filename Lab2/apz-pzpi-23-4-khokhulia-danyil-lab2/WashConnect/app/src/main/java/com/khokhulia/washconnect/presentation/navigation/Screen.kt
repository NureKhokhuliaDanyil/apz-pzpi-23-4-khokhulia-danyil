package com.khokhulia.washconnect.presentation.navigation

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Register : Screen("register")
    object Laundries : Screen("laundries")
    object Machines : Screen("machines/{laundryId}") {
        fun createRoute(laundryId: Int) = "machines/$laundryId"
    }
    object Session : Screen("session/{machineId}/{laundryId}") {
        fun createRoute(machineId: Int, laundryId: Int) = "session/$machineId/$laundryId"
    }
    object Notifications : Screen("notifications")
    object Profile : Screen("profile")
}
