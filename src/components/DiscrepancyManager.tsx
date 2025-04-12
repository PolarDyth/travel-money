import React, { useState, useEffect } from 'react';

interface Discrepancy {
  id: string;
  currency: string;
  date: string;
  expectedAmount: string;
  actualAmount: string;
  difference: string;
  notes?: string;
}

const DiscrepancyManager: React.FC = () => {
  const [formData, setFormData] = useState({
    currency: '',
    date: new Date().toISOString().split('T')[0],
    expectedAmount: '',
    actualAmount: '',
    notes: '',
  });
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscrepancies = async () => {
      try {
        const response = await fetch('/api/discrepancies');
        if (!response.ok) {
          throw new Error('Failed to fetch discrepancies');
        }
        const data: Discrepancy[] = await response.json();
        setDiscrepancies(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchDiscrepancies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch('/api/discrepancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create discrepancy');
      }

      // Optimistically update the list
      const newDiscrepancy: Discrepancy = await response.json();
      setDiscrepancies([...discrepancies, newDiscrepancy]);

      // Clear the form
      setFormData({
        currency: '',
        date: new Date().toISOString().split('T')[0],
        expectedAmount: '',
        actualAmount: '',
        notes: '',
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discrepancy Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currency" className="block text-gray-700 text-sm font-bold mb-2">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              id="currency"
              value={formData.currency}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="expectedAmount" className="block text-gray-700 text-sm font-bold mb-2">
              Expected Amount
            </label>
            <input
              type="number"
              name="expectedAmount"
              id="expectedAmount"
              value={formData.expectedAmount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="actualAmount" className="block text-gray-700 text-sm font-bold mb-2">
              Actual Amount
            </label>
            <input
              type="number"
              name="actualAmount"
              id="actualAmount"
              value={formData.actualAmount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Add Discrepancy
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Discrepancy History</h2>
      {discrepancies.length === 0 ? (
        <p>No discrepancies found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Date</th>
                <th className="px-4 py-2 border-b text-left">Currency</th>
                <th className="px-4 py-2 border-b text-right">Expected Amount</th>
                <th className="px-4 py-2 border-b text-right">Actual Amount</th>
                <th className="px-4 py-2 border-b text-right">Difference</th>
                <th className="px-4 py-2 border-b text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.map((discrepancy) => (
                <tr key={discrepancy.id}>
                  <td className="px-4 py-2 border-b text-left">{new Date(discrepancy.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b text-left">{discrepancy.currency}</td>
                  <td className="px-4 py-2 border-b text-right">{parseFloat(discrepancy.expectedAmount).toFixed(2)}</td>
                  <td className="px-4 py-2 border-b text-right">{parseFloat(discrepancy.actualAmount).toFixed(2)}</td>
                  <td className="px-4 py-2 border-b text-right"
                    className={parseFloat(discrepancy.difference) > 0 ? 'text-green-600 px-4 py-2 border-b text-right' : 'text-red-600 px-4 py-2 border-b text-right'}>
                    {parseFloat(discrepancy.difference).toFixed(2)}
                    {parseFloat(discrepancy.difference) > 0 ? ' (Over)' : ' (Short)'}
                  </td>
                  <td className="px-4 py-2 border-b text-left">{discrepancy.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DiscrepancyManager;