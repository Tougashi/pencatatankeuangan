'use client';

import { useState, useMemo, useEffect } from 'react';
import { Transaction } from './types';
import SummaryCard from './SummaryCard';
import TransactionList from './TransactionList';
import AddTransactionModal from './AddTransactionModal';
import EditTransactionModal from './EditTransactionModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Pagination from './Pagination';
import FilterButtons from './FilterButtons';

const ITEMS_PER_PAGE = 5;

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Load data saat component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // ==================== READ (Fetch All Transactions) ====================
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') return transactions;
    return transactions.filter((t) => t.type === filterType);
  }, [transactions, filterType]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredTransactions]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedTransactions.slice(startIndex, endIndex);
  }, [sortedTransactions, currentPage]);

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);

  const handleFilterChange = (filter: 'all' | 'income' | 'expense') => {
    setFilterType(filter);
    setCurrentPage(1);
  };

  // ==================== CREATE (Add Transaction) ====================
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (response.ok) {
        await fetchTransactions();
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Gagal menambah transaksi');
    }
  };

  // ==================== UPDATE (Edit Transaction) ====================
  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(`/api/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (response.ok) {
        await fetchTransactions();
        setIsEditModalOpen(false);
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Gagal mengupdate transaksi');
    }
  };

  // ==================== DELETE (Remove Transaction) ====================
  const handleDeleteTransaction = async () => {
    if (selectedTransaction) {
      try {
        const response = await fetch(`/api/transactions/${selectedTransaction.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchTransactions();
          
          const newTotalPages = Math.ceil((transactions.length - 1) / ITEMS_PER_PAGE);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
          
          setIsDeleteModalOpen(false);
          setSelectedTransaction(null);
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Gagal menghapus transaksi');
      }
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pencatatan Keuangan Harian
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola pemasukan dan pengeluaran Anda dengan mudah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            title="Total Pemasukan"
            amount={summary.income}
            type="income"
            icon={
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            }
          />
          <SummaryCard
            title="Total Pengeluaran"
            amount={summary.expense}
            type="expense"
            icon={
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            }
          />
          <SummaryCard
            title="Saldo"
            amount={summary.balance}
            type="balance"
            icon={
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Riwayat Transaksi
                </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Transaksi
            </button>
          </div>

          <div className="mb-6">
            <FilterButtons
              activeFilter={filterType}
              onFilterChange={handleFilterChange}
            />
          </div>

          <TransactionList
            transactions={paginatedTransactions}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
            </>
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
      />

      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onUpdate={handleUpdateTransaction}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onConfirm={handleDeleteTransaction}
      />
    </div>
  );
}
