'use client';

interface Props {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon: React.ReactNode;
}

export default function SummaryCard({ title, amount, type, icon }: Props) {
  const getColorClasses = () => {
    switch (type) {
      case 'income':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'expense':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'balance':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'balance':
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${getTextColor()}`}>
            Rp {amount.toLocaleString('id-ID')}
          </p>
        </div>
        <div className={`p-3 rounded-full ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
