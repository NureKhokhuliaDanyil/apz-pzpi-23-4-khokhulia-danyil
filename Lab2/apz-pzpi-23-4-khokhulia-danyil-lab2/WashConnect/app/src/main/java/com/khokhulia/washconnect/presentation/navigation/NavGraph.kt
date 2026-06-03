package com.khokhulia.washconnect.presentation.navigation

import androidx.compose.runtime.*
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.khokhulia.washconnect.data.local.TokenDataStore
import com.khokhulia.washconnect.presentation.screens.auth.LoginScreen
import com.khokhulia.washconnect.presentation.screens.auth.RegisterScreen
import com.khokhulia.washconnect.presentation.screens.laundries.LaundriesScreen
import com.khokhulia.washconnect.presentation.screens.machines.MachinesScreen
import com.khokhulia.washconnect.presentation.screens.notifications.NotificationsScreen
import com.khokhulia.washconnect.presentation.screens.profile.ProfileScreen
import com.khokhulia.washconnect.presentation.screens.session.SessionScreen
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking
import javax.inject.Inject

@Composable
fun NavGraph(tokenDataStore: TokenDataStore? = null) {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Laundries.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                }
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Laundries.route) {
            LaundriesScreen(
                onLaundryClick = { laundryId ->
                    navController.navigate(Screen.Machines.createRoute(laundryId))
                },
                onNotificationsClick = {
                    navController.navigate(Screen.Notifications.route)
                },
                onProfileClick = {
                    navController.navigate(Screen.Profile.route)
                }
            )
        }

        composable(
            route = Screen.Machines.route,
            arguments = listOf(navArgument("laundryId") { type = NavType.IntType })
        ) { backStack ->
            val laundryId = backStack.arguments?.getInt("laundryId") ?: return@composable
            MachinesScreen(
                laundryId = laundryId,
                onMachineClick = { machineId ->
                    navController.navigate(Screen.Session.createRoute(machineId, laundryId))
                },
                onBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.Session.route,
            arguments = listOf(
                navArgument("machineId") { type = NavType.IntType },
                navArgument("laundryId") { type = NavType.IntType }
            )
        ) { backStack ->
            val machineId = backStack.arguments?.getInt("machineId") ?: return@composable
            val laundryId = backStack.arguments?.getInt("laundryId") ?: return@composable
            SessionScreen(
                machineId = machineId,
                laundryId = laundryId,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Notifications.route) {
            NotificationsScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.Profile.route) {
            ProfileScreen(
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onBack = { navController.popBackStack() }
            )
        }
    }
}
