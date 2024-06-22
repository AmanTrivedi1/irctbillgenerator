import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

interface InputPair {
  id: string;
  detail: string;
  amount: string;
}

const DynamicForm: React.FC = () => {
  const [inputPairs, setInputPairs] = useState<InputPair[]>([{ id: crypto.randomUUID(), detail: '', amount: '' }]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const newTotal = inputPairs.reduce((sum, pair) => sum + (parseFloat(pair.amount) || 0), 0);
    setTotalAmount(newTotal);
  }, [inputPairs]);

  const addInputPair = () => {
    setInputPairs([...inputPairs, { id: crypto.randomUUID(), detail: '', amount: '' }]);
  };

  const handleInputChange = (id: string, field: 'detail' | 'amount', value: string) => {
    setInputPairs(
      inputPairs.map((pair) =>
        pair.id === id ? { ...pair, [field]: value } : pair
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nonEmptyPairs = inputPairs.filter(pair => pair.detail.trim() !== '' && pair.amount.trim() !== '');
      if (nonEmptyPairs.length === 0) {
        toast.error("Please enter at least one valid entry");
        return;
      }
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputPairs: nonEmptyPairs }),
      });
      if (response.ok) {
        const result = await response.json();
        toast.success("Data Saved!");
        setInputPairs([{ id: crypto.randomUUID(), detail: '', amount: '' }]);
        setTotalAmount(0);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error while saving data!");
    }
  };



  const handleExportToPdf = async () => {
    try {
      const nonEmptyPairs = inputPairs.filter(pair => pair.detail.trim() !== '' && pair.amount.trim() !== '');
      if (nonEmptyPairs.length === 0) {
        toast.error("Please enter at least one valid entry");
        return;
      }

      const response = await fetch('/api/pdfgenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputPairs: nonEmptyPairs, totalAmount }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        toast.error("Error generating PDF");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error generating PDF");
    }
  };


  return (
    <div className='flex flex-col w-full md:p-4 p-2 '>
      <div className=' mb-2'>
        <h1 className='font-semibold text-4xl  '>Create Bill</h1>
        <p>Enter the description about the bill that you want in your bill</p>
      </div>
      <div className='max-w-7xl '>
        <form onSubmit={handleSubmit} className='flex gap-4 flex-col'>
          {inputPairs.map((pair) => (
            <div key={pair.id}>
              <div className='flex flex-col gap-5'>
                <Input
                  type="text"
                  value={pair.detail}
                  onChange={(e) => handleInputChange(pair.id, 'detail', e.target.value)}
                  placeholder="Enter Description"
                />
                <Input
                  type="number"
                  value={pair.amount}
                  onChange={(e) => handleInputChange(pair.id, 'amount', e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          ))}
          <div className='mt-4 fixed bottom-4 right-4  '>
            <p className='font-semibold text-2xl'>Total Amount: {totalAmount.toFixed(2)}</p>
          </div>
          <div className='mt-2 flex gap-10'>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={addInputPair}>Add More Section</Button>
            <Button type="button"  onClick={handleExportToPdf}>Export to PDF</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;