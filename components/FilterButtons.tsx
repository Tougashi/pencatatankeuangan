'use client';

interface Props {
  activeFilter: 'all' | 'income' | 'expense';
  onFilterChange: (filter: 'all' | 'income' | 'expense') => void;
}

export default function FilterButtons({ activeFilter, onFilterChange }: Props) {
  const filters = [
    { value: 'all' as const, label: 'Semua', color: 'blue' },
    { value: 'income' as const, label: 'Pemasukan', color: 'green' },
    { value: 'expense' as const, label: 'Pengeluaran', color: 'red' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeFilter === filter.value
              ? filter.color === 'blue'
                ? 'bg-blue-600 text-white shadow-md'
                : filter.color === 'green'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-red-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
