package com.khokhulia.washconnect.presentation.screens.machines

import androidx.compose.foundation.clickable
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
import com.khokhulia.washconnect.domain.model.Machine
import com.khokhulia.washconnect.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MachinesScreen(
    laundryId: Int,
    onMachineClick: (Int) -> Unit,
    onBack: () -> Unit,
    viewModel: MachinesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(laundryId) { viewModel.loadMachines(laundryId) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Washing Machines", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null) }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = WashBlue,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White)
            )
        },
        containerColor = WashBackground
    ) { padding ->
        when (val state = uiState) {
            is MachinesUiState.Loading -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = WashBlue)
            }
            is MachinesUiState.Error -> Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text(state.message, color = WashError)
            }
            is MachinesUiState.Success -> {
                Column(modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
                    val available = state.machines.count { it.status.lowercase() in listOf("available", "0", "idle") }
                    Text("${state.machines.size} machines · $available available", fontSize = 14.sp, color = WashGray)
                    Spacer(Modifier.height(12.dp))
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(state.machines) { machine ->
                            MachineCard(machine = machine, onClick = {
                                if (machine.status.lowercase() in listOf("available", "0", "idle")) onMachineClick(machine.id)
                            })
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MachineCard(machine: Machine, onClick: () -> Unit) {
    val statusColor = when (machine.status.lowercase()) {
        "available", "0", "idle" -> WashAvailable
        "busy", "1" -> WashBusy
        else -> WashMaintenance
    }
    val isClickable = machine.status.lowercase() in listOf("available", "0", "idle")

    Card(
        modifier = Modifier.fillMaxWidth().clickable(enabled = isClickable, onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = WashSurface),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("🫧", fontSize = 36.sp)
            Spacer(Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(machine.model, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Text("SN: ${machine.serialNumber}", fontSize = 12.sp, color = WashGray)
            }
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = statusColor.copy(alpha = 0.15f))
            ) {
                Text(
                    machine.status,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                    color = statusColor,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
