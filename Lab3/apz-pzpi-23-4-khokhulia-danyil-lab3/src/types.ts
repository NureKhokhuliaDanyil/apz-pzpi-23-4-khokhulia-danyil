/* ───────────────────────────────────────────
 *  WashConnect — TypeScript types
 *  Accurately mirrors C# backend DTOs/Entities
 * ─────────────────────────────────────────── */

// ── Enums ──────────────────────────────────
export enum UserRole {
  Client = 0,
  Admin = 1,
  Technician = 2,
}

/** Backend: Idle=0, Busy=1, Maintenance=2 */
export enum MachineStatus {
  Idle = 0,
  Busy = 1,
  Maintenance = 2,
}

export enum TransactionType {
  Payment = 0,
  Deposit = 1,
}

// ── Auth ───────────────────────────────────
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponseDto {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
  resetToken: string;
}

// ── User ───────────────────────────────────
export interface UserResponseDto {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  balance: number;
}

export interface UpdateUserDto {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  balance: number;
}

// ── Laundry ────────────────────────────────
export interface LaundryResponseDto {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  workingHours: string;
}

export interface CreateLaundryDto {
  ownerId: number;
  name: string;
  address: string;
  workingHours: string;
}

export interface UpdateLaundryDto {
  ownerId: number;
  name: string;
  address: string;
  workingHours: string;
}

// ── Washing Machine ────────────────────────
export interface MachineResponseDto {
  id: number;
  laundryId: number;
  serialNumber: string;
  model: string;
  status: MachineStatus;
}

export interface CreateMachineDto {
  laundryId: number;
  serialNumber: string;
  model: string;
  status: MachineStatus;
}

export interface UpdateMachineDto {
  laundryId: number;
  serialNumber: string;
  model: string;
  status: MachineStatus;
}

// ── Wash Mode ──────────────────────────────
export interface WashModeResponseDto {
  id: number;
  laundryId: number;
  name: string;
  price: number;
  durationMinutes: number;
  temperature: number;
}

export interface CreateWashModeDto {
  laundryId: number;
  name: string;
  price: number;
  durationMinutes: number;
  temperature: number;
}

export interface UpdateWashModeDto {
  laundryId: number;
  name: string;
  price: number;
  durationMinutes: number;
  temperature: number;
}

// ── Sessions ───────────────────────────────
export interface StartSessionDto {
  userId: number;
  machineId: number;
  modeId: number;
  startTime?: string;
}

export interface SessionResponseDto {
  id: number;
  userId: number;
  machineId: number;
  modeId: number;
  startTime: string;
  endTime: string | null;
  status: string;
  actualPrice: number;
  doorLocked: boolean;
}

// ── Pricing ────────────────────────────────
export interface PricingDetailDto {
  basePrice: number;
  finalPrice: number;
  appliedModifiers: string[];
}

export interface BusyHourDto {
  hour: number;
  sessionCount: number;
  totalRevenue: number;
  loadLevel: string;
}

// ── Wallet / Finance ───────────────────────
export interface DepositDto {
  userId: number;
  amount: number;
}

export interface ApplyPromoDto {
  userId: number;
  code: string;
}

export interface RevenueStatsDto {
  totalRevenue: number;
  todayRevenue: number;
  monthRevenue: number;
  revenueByLaundry: Record<number, number>;
}

// ── Transactions ───────────────────────────
export interface TransactionResponseDto {
  id: number;
  userId: number;
  amount: number;
  type: TransactionType;
  timestamp: string;
}

// ── Admin Stats ────────────────────────────
export interface SystemStatsDto {
  totalUsers: number;
  activeSessions: number;
  totalRevenue: number;
  idleMachines: number;
  busyMachines: number;
  maintenanceMachines: number;
}

// ── Reviews ────────────────────────────────
export interface ReviewResponseDto {
  id: number;
  userId: number;
  laundryId: number;
  rating: number;
  comment: string;
}

export interface CreateReviewDto {
  userId: number;
  laundryId: number;
  rating: number;
  comment: string;
}

// ── Notifications ──────────────────────────
export interface NotificationResponseDto {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
}

// ── PromoCode Entity (for admin) ───────────
export interface PromoCode {
  id: number;
  code: string;
  discountAmount: number;
  isActive: boolean;
}

// ── Export / Import ────────────────────────
export interface SystemExportData {
  exportedAt: string;
  version: string;
  users: UserResponseDto[];
  laundries: LaundryResponseDto[];
  machines: MachineResponseDto[];
  washModes: WashModeResponseDto[];
}
