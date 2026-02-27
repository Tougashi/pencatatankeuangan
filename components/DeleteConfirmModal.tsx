'use client';

import Modal from './Modal';
import { ModalProps, Transaction } from './types';

interface Props extends ModalProps {
  transaction: Transaction | null;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isOpen, onClose, transaction, onConfirm }: Props) {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Apakah Anda yakin ingin menghapus transaksi ini?
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tanggal:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(transaction.date).toLocaleDateString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Deskripsi:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {transaction.description}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Jumlah:</span>
            <span className={`text-sm font-medium ${
              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}
