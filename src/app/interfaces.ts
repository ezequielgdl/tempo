export interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address: string;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    CIF?: string;
    pricePerHour: number;
}

export interface Timer {
    id?: number;
    clientId: string;
    invoiceId?: string;
    clientName?: string;
    commentary: string;
    elapsedTime: number;
    formattedTime?: string;
    isRunning: boolean;
    pricePerHour: number;
    total?: number;
    tempId?: number;
  }

export interface Invoice {
    clientId: string;
    clientName: string;
    currency: string;
    date: string;
    dueDate: string;
    id: string;
    invoiceNumber: string;
    irpfAmount: number;
    irpfRate: number;
    isPaid: boolean;
    issueDate: string;
    ivaAmount: number;
    ivaRate: number;
    notes: string;
    subject: string;
    subtotal: number;
    timers: Timer[];
    total: number;
  }

  export interface UserInfo {
    id: string;
    name: string;
    address: string;
    phone: string;
    website: string;
    nif: string;
  }
