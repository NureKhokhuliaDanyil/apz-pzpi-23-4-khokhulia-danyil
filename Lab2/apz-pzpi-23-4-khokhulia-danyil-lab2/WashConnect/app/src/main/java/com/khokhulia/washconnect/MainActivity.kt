package com.khokhulia.washconnect

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.khokhulia.washconnect.presentation.navigation.NavGraph
import com.khokhulia.washconnect.presentation.theme.WashConnectTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WashConnectTheme {
                NavGraph()
            }
        }
    }
}
