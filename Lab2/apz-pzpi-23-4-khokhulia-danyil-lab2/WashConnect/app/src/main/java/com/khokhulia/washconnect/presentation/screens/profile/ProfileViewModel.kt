package com.khokhulia.washconnect.presentation.screens.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.khokhulia.washconnect.data.local.TokenDataStore
import com.khokhulia.washconnect.domain.model.User
import com.khokhulia.washconnect.domain.repository.WalletRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val user: User? = null,
    val isLoading: Boolean = true,
    val depositAmount: String = "",
    val depositSuccess: Boolean = false,
    val promoCode: String = "",
    val promoSuccess: Boolean = false,
    val errorMessage: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val tokenDataStore: TokenDataStore,
    private val walletRepository: WalletRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState())
    val uiState: StateFlow<ProfileUiState> = _uiState

    init { loadUser() }

    private fun loadUser() {
        viewModelScope.launch {
            val userId = tokenDataStore.userId.firstOrNull()
            val name = tokenDataStore.userName.firstOrNull()
            val email = tokenDataStore.userEmail.firstOrNull()
            val role = tokenDataStore.userRole.firstOrNull()
            if (userId != null) {
                walletRepository.getUserById(userId)
                    .onSuccess { _uiState.value = ProfileUiState(user = it, isLoading = false) }
                    .onFailure {
                        _uiState.value = ProfileUiState(
                            user = User(userId, name ?: "", email ?: "", role ?: "Client", 0.0),
                            isLoading = false
                        )
                    }
            }
        }
    }

    fun setDepositAmount(amount: String) {
        _uiState.value = _uiState.value.copy(depositAmount = amount)
    }

    fun deposit() {
        val amount = _uiState.value.depositAmount.toDoubleOrNull() ?: return
        viewModelScope.launch {
            val userId = tokenDataStore.userId.firstOrNull() ?: return@launch
            walletRepository.deposit(userId, amount)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(depositSuccess = true, depositAmount = "")
                    loadUser()
                }
                .onFailure { _uiState.value = _uiState.value.copy(errorMessage = it.message) }
        }
    }

    fun setPromoCode(code: String) {
        _uiState.value = _uiState.value.copy(promoCode = code)
    }

    fun applyPromo() {
        val code = _uiState.value.promoCode.trim()
        if (code.isEmpty()) return
        viewModelScope.launch {
            val userId = tokenDataStore.userId.firstOrNull() ?: return@launch
            walletRepository.applyPromo(userId, code)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(promoSuccess = true, promoCode = "", errorMessage = "Promo code applied successfully!")
                    loadUser()
                }
                .onFailure { _uiState.value = _uiState.value.copy(errorMessage = it.message ?: "Failed to apply promo code") }
        }
    }

    fun logout() {
        viewModelScope.launch { tokenDataStore.clearSession() }
    }
}
