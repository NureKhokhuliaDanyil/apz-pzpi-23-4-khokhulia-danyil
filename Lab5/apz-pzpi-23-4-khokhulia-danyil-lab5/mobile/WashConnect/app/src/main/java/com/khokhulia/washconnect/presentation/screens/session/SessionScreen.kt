package com.khokhulia.washconnect.presentation.screens.session

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.khokhulia.washconnect.domain.model.WashMode
import com.khokhulia.washconnect.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SessionScreen(
    machineId: Int,
    laundryId: Int,
    onBack: () -> Unit,
    viewModel: SessionViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(laundryId) { viewModel.loadWashModes(laundryId) }

    uiState.successMessage?.let {
        LaunchedEffect(it) {
            kotlinx.coroutines.delay(2000)
            viewModel.clearMessages()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Start Session", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null) }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = WashBlue,
                    titleContentColor = Color.White, navigationIconContentColor = Color.White)
            )
        },
        containerColor = WashBackground
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Active session card
            uiState.activeSession?.let { session ->
                item {
                    ActiveSessionCard(
                        status = session.status,
                        price = session.actualPrice,
                        onCancel = { viewModel.cancelSession() }
                    )
                }
            }

            // Success / error messages
            uiState.successMessage?.let { msg ->
                item {
                    Card(colors = CardDefaults.cardColors(containerColor = WashAvailable.copy(alpha = 0.1f)),
                        shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CheckCircle, null, tint = WashAvailable)
                            Spacer(Modifier.width(8.dp))
                            Text(msg, color = WashAvailable, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }

            uiState.errorMessage?.let { msg ->
                item {
                    Card(colors = CardDefaults.cardColors(containerColor = WashError.copy(alpha = 0.1f)),
                        shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Error, null, tint = WashError)
                            Spacer(Modifier.width(8.dp))
                            Text(msg, color = WashError)
                        }
                    }
                }
            }

            // Mode selection
            if (uiState.activeSession == null) {
                item {
                    Text("Select Wash Mode", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = WashOnSurface)
                }

                if (uiState.isLoadingModes) {
                    item { Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = WashBlue) } }
                } else {
                    items(uiState.washModes) { mode ->
                        WashModeCard(
                            mode = mode,
                            isSelected = uiState.selectedMode?.id == mode.id,
                            onClick = { viewModel.selectMode(mode, laundryId) }
                        )
                    }
                }

                // Price preview
                uiState.pricingDetail?.let { pricing ->
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = WashBlue.copy(alpha = 0.08f))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text("Price Preview", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = WashBlue)
                                Spacer(Modifier.height(8.dp))
                                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Base price:", color = WashGray)
                                    Text("${pricing.basePrice} UAH", fontWeight = FontWeight.SemiBold)
                                }
                                if (pricing.appliedModifiers.isNotEmpty()) {
                                    Text("Applied: ${pricing.appliedModifiers.joinToString()}", fontSize = 12.sp, color = WashGray)
                                }
                                Divider(modifier = Modifier.padding(vertical = 8.dp))
                                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Final price:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    Text("${pricing.finalPrice} UAH", fontWeight = FontWeight.Bold, color = WashBlue, fontSize = 18.sp)
                                }
                            }
                        }
                    }
                }

                // Start button
                if (uiState.selectedMode != null) {
                    item {
                        Button(
                            onClick = { viewModel.startSession(machineId) },
                            modifier = Modifier.fillMaxWidth().height(56.dp),
                            enabled = !uiState.isLoading,
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = WashBlue)
                        ) {
                            if (uiState.isLoading) {
                                CircularProgressIndicator(Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp)
                            } else {
                                Icon(Icons.Default.PlayArrow, null)
                                Spacer(Modifier.width(8.dp))
                                Text("Start Session", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WashModeCard(mode: WashMode, isSelected: Boolean, onClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) WashBlue.copy(alpha = 0.12f) else WashSurface
        ),
        border = if (isSelected) androidx.compose.foundation.BorderStroke(2.dp, WashBlue) else null,
        elevation = CardDefaults.cardElevation(if (isSelected) 0.dp else 3.dp),
        onClick = onClick
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("🧺", fontSize = 28.sp)
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(mode.name, fontWeight = FontWeight.SemiBold, fontSize = 15.sp)
                Text("${mode.durationMinutes} min · ${mode.temperature}°C", fontSize = 12.sp, color = WashGray)
            }
            Text("${mode.price} UAH", fontWeight = FontWeight.Bold, color = if (isSelected) WashBlue else WashOnSurface)
        }
    }
}

@Composable
fun ActiveSessionCard(status: String, price: Double, onCancel: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = WashAvailable.copy(alpha = 0.1f))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CheckCircle, null, tint = WashAvailable, modifier = Modifier.size(28.dp))
                Spacer(Modifier.width(12.dp))
                Text("Active Session", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = WashAvailable)
            }
            Spacer(Modifier.height(12.dp))
            Text("Status: $status", fontSize = 14.sp, color = WashOnSurface)
            Text("Price: $price UAH", fontSize = 14.sp, color = WashOnSurface)
            Spacer(Modifier.height(16.dp))
            OutlinedButton(
                onClick = onCancel,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = WashError),
                border = androidx.compose.foundation.BorderStroke(1.dp, WashError)
            ) {
                Icon(Icons.Default.Cancel, null)
                Spacer(Modifier.width(8.dp))
                Text("Cancel Session")
            }
        }
    }
}
