export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
