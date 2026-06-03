package com.khokhulia.washconnect.presentation.screens.laundries

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.khokhulia.washconnect.domain.model.Laundry
import com.khokhulia.washconnect.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LaundriesScreen(
    onLaundryClick: (Int) -> Unit,
    onNotificationsClick: () -> Unit,
    onProfileClick: () -> Unit,
    viewModel: LaundriesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🫧 WashConnect", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onNotificationsClick) {
                        Icon(Icons.Default.Notifications, "Notifications")
                    }
                    IconButton(onClick = onProfileClick) {
                        Icon(Icons.Default.Person, "Profile")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = WashBlue,
                    titleContentColor = androidx.compose.ui.graphics.Color.White,
                    actionIconContentColor = androidx.compose.ui.graphics.Color.White)
            )
        },
        containerColor = WashBackground
    ) { padding ->
        when (val state = uiState) {
            is LaundriesUiState.Loading -> {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = WashBlue)
                }
            }
            is LaundriesUiState.Error -> {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(state.message, color = WashError)
                        Spacer(Modifier.height(12.dp))
                        Button(onClick = { viewModel.loadLaundries() }) { Text("Retry") }
                    }
                }
            }
            is LaundriesUiState.Success -> {
                Column(modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
                    Text("Available Laundries", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = WashOnSurface)
                    Text("${state.laundries.size} locations found", fontSize = 13.sp, color = WashGray)
                    Spacer(Modifier.height(16.dp))
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(state.laundries) { laundry ->
                            LaundryCard(laundry = laundry, onClick = { onLaundryClick(laundry.id) })
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun LaundryCard(laundry: Laundry, onClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = WashSurface),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Card(
                modifier = Modifier.size(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = WashBlue.copy(alpha = 0.1f))
            ) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("🏪", fontSize = 24.sp)
                }
            }
            Spacer(Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(laundry.name, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = WashOnSurface)
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, null, tint = WashGray, modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text(laundry.address, fontSize = 13.sp, color = WashGray)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Schedule, null, tint = WashGray, modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text(laundry.workingHours, fontSize = 12.sp, color = WashGray)
                }
            }
            Icon(Icons.Default.ChevronRight, null, tint = WashGray)
        }
    }
}
