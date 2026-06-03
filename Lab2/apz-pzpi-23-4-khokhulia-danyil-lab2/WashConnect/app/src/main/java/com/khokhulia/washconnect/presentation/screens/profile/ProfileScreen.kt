package com.khokhulia.washconnect.presentation.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.khokhulia.washconnect.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onLogout: () -> Unit,
    onBack: () -> Unit,
    viewModel: ProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Profile", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null) } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = WashBlue,
                    titleContentColor = Color.White, navigationIconContentColor = Color.White)
            )
        },
        containerColor = WashBackground
    ) { padding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            if (uiState.errorMessage != null) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (uiState.promoSuccess || uiState.depositSuccess) WashAvailable.copy(alpha = 0.15f) else WashError.copy(alpha = 0.15f)
                    )
                ) {
                    Text(
                        text = uiState.errorMessage ?: "",
                        color = if (uiState.promoSuccess || uiState.depositSuccess) WashAvailable else WashError,
                        modifier = Modifier.padding(12.dp),
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp
                    )
                }
            }

            // Avatar + name
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = WashSurface),
                elevation = CardDefaults.cardElevation(4.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp).fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier.size(72.dp).clip(CircleShape)
                            .background(WashBlue),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = uiState.user?.fullName?.take(1)?.uppercase() ?: "?",
                            color = Color.White,
                            fontSize = 30.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(Modifier.height(12.dp))
                    Text(uiState.user?.fullName ?: "Loading...", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Text(uiState.user?.email ?: "", fontSize = 14.sp, color = WashGray)
                    Spacer(Modifier.height(8.dp))
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = WashBlue.copy(alpha = 0.1f))
                    ) {
                        Text(
                            uiState.user?.role ?: "",
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
                            color = WashBlue,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }

            // Balance card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = WashBlue),
                elevation = CardDefaults.cardElevation(6.dp)
            ) {
                Row(
                    modifier = Modifier.padding(24.dp).fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Wallet Balance", color = Color.White.copy(alpha = 0.7f), fontSize = 13.sp)
                        Spacer(Modifier.height(4.dp))
                        Text(
                            "${uiState.user?.balance ?: 0.0} UAH",
                            color = Color.White,
                            fontSize = 26.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Icon(Icons.Default.AccountBalanceWallet, null, tint = Color.White.copy(alpha = 0.7f), modifier = Modifier.size(40.dp))
                }
            }

            // Deposit
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = WashSurface),
                elevation = CardDefaults.cardElevation(3.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Top Up Wallet", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                    Spacer(Modifier.height(12.dp))
                    OutlinedTextField(
                        value = uiState.depositAmount,
                        onValueChange = { viewModel.setDepositAmount(it) },
                        label = { Text("Amount (UAH)") },
                        leadingIcon = { Icon(Icons.Default.CurrencyExchange, null) },
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                    Spacer(Modifier.height(12.dp))
                    Button(
                        onClick = { viewModel.deposit() },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = WashTeal)
                    ) {
                        Icon(Icons.Default.Add, null)
                        Spacer(Modifier.width(8.dp))
                        Text("Add Funds", fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            // Promo Code Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = WashSurface),
                elevation = CardDefaults.cardElevation(3.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Apply Promo Code", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                    Spacer(Modifier.height(12.dp))
                    OutlinedTextField(
                        value = uiState.promoCode,
                        onValueChange = { viewModel.setPromoCode(it) },
                        label = { Text("Promo Code") },
                        leadingIcon = { Icon(Icons.Default.LocalActivity, null) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                    Spacer(Modifier.height(12.dp))
                    Button(
                        onClick = { viewModel.applyPromo() },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = WashBlue)
                    ) {
                        Icon(Icons.Default.Redeem, null)
                        Spacer(Modifier.width(8.dp))
                        Text("Apply Code", fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            Spacer(Modifier.weight(1f))

            // Logout
            OutlinedButton(
                onClick = { viewModel.logout(); onLogout() },
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = WashError),
                border = androidx.compose.foundation.BorderStroke(1.5.dp, WashError)
            ) {
                Icon(Icons.Default.Logout, null)
                Spacer(Modifier.width(8.dp))
                Text("Sign Out", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
            }
        }
    }
}
