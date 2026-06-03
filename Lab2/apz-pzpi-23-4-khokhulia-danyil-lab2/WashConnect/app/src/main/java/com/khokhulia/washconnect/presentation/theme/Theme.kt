package com.khokhulia.washconnect.presentation.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = WashBlue,
    onPrimary = androidx.compose.ui.graphics.Color.White,
    primaryContainer = WashBlueLight,
    secondary = WashTeal,
    background = WashBackground,
    surface = WashSurface,
    onSurface = WashOnSurface,
    error = WashError
)

private val DarkColorScheme = darkColorScheme(
    primary = WashBlueLight,
    secondary = WashTeal,
    background = WashOnSurface,
    surface = androidx.compose.ui.graphics.Color(0xFF1E2A3A),
    error = WashError
)

@Composable
fun WashConnectTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
