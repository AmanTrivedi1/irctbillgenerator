"use client"
import React, { useState, useEffect } from 'react';
import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation'
import { Button } from './ui/button';
import { toast } from 'sonner';
import { CalendarIcon, Loader } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface InputPair {
  id: string;
  detail: string;
  amount: string;
}

interface DefaultFields {
  orderNo: string;
  deliveryDateTime: Date | undefined;
  deliveryTime: string | null;
  deliveryStation: string;
  customerName: string;
  customerContact: string;
  trainNumber: string;
  pnrNumber: string;
  coach: string;
  seat: string;
  paymentMode: string;
  customerNote: string;
}

const DynamicForm: React.FC = () => {
  const [defaultFields, setDefaultFields] = useState<DefaultFields>({
    orderNo: '',
    deliveryDateTime: undefined,
    deliveryTime: '',
    deliveryStation: '',
    customerName: '',
    customerContact: '',
    trainNumber: '',
    pnrNumber: '',
    coach: '',
    seat: '',
    paymentMode: '',
    customerNote: '',
  });
  const [inputPairs, setInputPairs] = useState<InputPair[]>([{ id: crypto.randomUUID(), detail: '', amount: '' }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  const handleDefaultFieldChange = (field: keyof DefaultFields, value: string | Date | null | undefined) => {
    setDefaultFields(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    const userPassword = localStorage.getItem('userPassword')

    const ENV_USER_EMAIL = process.env.NEXT_PUBLIC_USER_ID
    const ENV_USER_PASSWORD = process.env.NEXT_PUBLIC_USER_PASSWORD

   

    if (userEmail !== ENV_USER_EMAIL || userPassword !== ENV_USER_PASSWORD) {
      router.push('/')
    }
  }, [])

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
    setIsSubmitting(true);
    try {
      const nonEmptyPairs = inputPairs.filter(pair => pair.detail.trim() !== '' && pair.amount.trim() !== '');
      if (nonEmptyPairs.length === 0) {
        toast.error("Please enter at least one valid entry");
        setIsSubmitting(false);
        return;
      }
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          defaultFields: {
            ...defaultFields,
            deliveryDateTime: defaultFields.deliveryDateTime ? format(defaultFields.deliveryDateTime, "yyyy-MM-dd'T'HH:mm:ss") : null,
            deliveryTime: defaultFields.deliveryTime || '',
          },
          inputPairs: nonEmptyPairs,
          totalAmount
        }),
      });
      if (response.ok) {
        const result = await response.json();
        toast.success("Data Saved!");
        setDefaultFields({
          orderNo: '',
          deliveryDateTime: undefined,
          deliveryTime: '',
          deliveryStation: '',
          customerName: '',
          customerContact: '',
          trainNumber: '',
          pnrNumber: '',
          coach: '',
          seat: '',
          paymentMode: '',
          customerNote: '',
        });
        setInputPairs([{ id: crypto.randomUUID(), detail: '', amount: '' }]);
        setTotalAmount(0);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error while saving data!");
    } finally {
      setIsSubmitting(false);
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
        body: JSON.stringify({ 
          defaultFields,
          inputPairs: nonEmptyPairs, 
          totalAmount 
        }),
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
    <div className='flex flex-col w-full md:p-4  '>
      <div className=' mb-2'>
        <h1 className='font-semibold text-4xl  '>Create Bill</h1>
        <p>Enter the description about the bill.</p>
      </div>
      <div className='max-w-7xl mt-4 '>
        <form onSubmit={handleSubmit} className='flex gap-4 flex-col'>
          {/* Default Fields */}
          <label  className='-mb-4' htmlFor="deliveryDateTime">Order Number</label>
          <Input
            type="text"
            value={defaultFields.orderNo}
            onChange={(e) => handleDefaultFieldChange('orderNo', e.target.value)}
            placeholder="Order No"
          />
           <label className='-mb-4' htmlFor="deliveryDateTime">Delivery Date </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !defaultFields.deliveryDateTime && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {defaultFields.deliveryDateTime ? (
                    format(defaultFields.deliveryDateTime, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={defaultFields.deliveryDateTime}
                  onSelect={(date) =>
                    handleDefaultFieldChange('deliveryDateTime', date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <label  className='-mb-4' htmlFor="deliveryDateTime">Delivery Time</label>
            <TimePicker
             onChange={(time) => handleDefaultFieldChange('deliveryTime', time as string | null)}
             value={defaultFields.deliveryTime}
             format="h:mm a"
              />

            <label  className='-mb-4' htmlFor="deliveryDateTime">Delivery Stattion</label>
          <Input
            type="text"
            value={defaultFields.deliveryStation}
            onChange={(e) => handleDefaultFieldChange('deliveryStation', e.target.value)}
            placeholder="Delivery Station"
          />
          <label  className='-mb-4' htmlFor="deliveryDateTime">Customer Name</label>
          <Input
            type="text"
            value={defaultFields.customerName}
            onChange={(e) => handleDefaultFieldChange('customerName', e.target.value)}
            placeholder="Customer Name"
          />
          <label  className='-mb-4' htmlFor="deliveryDateTime">Customer Contact</label>
          <Input
            type="text"
            value={defaultFields.customerContact}
            onChange={(e) => handleDefaultFieldChange('customerContact', e.target.value)}
            placeholder="Customer Contact"
          />
          <label  className='-mb-4' htmlFor="deliveryDateTime">Train Number</label>
          <Input
            type="text"
            value={defaultFields.trainNumber}
            onChange={(e) => handleDefaultFieldChange('trainNumber', e.target.value)}
            placeholder="Train Number"
          />
          <label  className='-mb-4' htmlFor="deliveryDateTime">PNR Number</label>
          <Input
            type="text"
            value={defaultFields.pnrNumber}
            onChange={(e) => handleDefaultFieldChange('pnrNumber', e.target.value)}
            placeholder="PNR Number"
          />
          <label  className='-mb-4' htmlFor="deliveryDateTime">Coach</label>
          <Input
            type="text"
            value={defaultFields.coach}
            onChange={(e) => handleDefaultFieldChange('coach', e.target.value)}
            placeholder="Coach"
          />
          <label  className='-mb-4' htmlFor="deliveryDateTime">Seat</label>
          <Input
            type="text"
            value={defaultFields.seat}
            onChange={(e) => handleDefaultFieldChange('seat', e.target.value)}
            placeholder="Seat"
          />
           <label  className='-mb-4' htmlFor="deliveryDateTime">Payment Method</label>
          <Input
            type="text"
            value={defaultFields.paymentMode}
            onChange={(e) => handleDefaultFieldChange('paymentMode', e.target.value)}
            placeholder="Payment Mode"
          />
           <label  className='-mb-4' htmlFor="deliveryDateTime">Customer Note</label>
          <Input
            type="text"
            value={defaultFields.customerNote}
            onChange={(e) => handleDefaultFieldChange('customerNote', e.target.value)}
            placeholder="Customer Note"
          />
          <h3 className='font-semibold text-xl'>Items:</h3>
          {inputPairs.map((pair) => (
            <div key={pair.id}>
              <div className='flex flex-col gap-5'>
              <label  className='-mb-4' htmlFor="deliveryDateTime">Item Name</label>
                <Input
                  type="text"
                  value={pair.detail}
                  onChange={(e) => handleInputChange(pair.id, 'detail', e.target.value)}
                  placeholder="Enter Description"
                />
                <label  className='-mb-4' htmlFor="deliveryDateTime">Item Price</label>
                <Input
                  type="number"
                  value={pair.amount}
                  onChange={(e) => handleInputChange(pair.id, 'amount', e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          ))}
          
          {/* Remaining Default Fields */}
        
          
          <div className='mt-4  '>
            <p className='font-semibold text-2xl'>Total Amount: {totalAmount.toFixed(2)}</p>
          </div>
          <div className='mt-2 flex flex-col sm:flex-row gap-10'>
           <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <> 
              <div className='flex items-center'>
                 <p>Saving</p>
                 <Loader  className='animate-spin text-xs'/>
              </div>
               </> : 'Save'}
           </Button>
           <div className='flex gap-4'>
             <Button className='w-full' type="button" onClick={addInputPair}>Add More Section</Button>
             <Button className='w-full' type="button"  onClick={handleExportToPdf}>Export to PDF</Button>
           </div>
       
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;