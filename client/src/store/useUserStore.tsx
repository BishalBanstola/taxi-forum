import {create} from 'zustand'

interface PaymentStatus {
  hasPaid: boolean;
}
interface UserState {
  user: string | null;
  paymentStatus: PaymentStatus;
  setUser: (user: string | null) => void;
  setPaymentStatus: (paymentStatus: PaymentStatus) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  paymentStatus: { hasPaid: false }, // Default value
  setUser: (user) => set({ user }),
  setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
}));