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
    formattedTime: string;
    isRunning: boolean;
    pricePerHour: number;
    total?: number;
    tempId?: number;
  }

export interface Invoice {
    id: string;
    clientId: string;
    invoiceNumber: number | string;
    date: string;
    subtotal: number;
    total: number;
    isPaid: boolean;
    timers: Timer[];
    issueDate: string;
    dueDate: string;
    iva: number;
    irpf: number;
    currency: string;
    subject: string;
    notes: string;
  }
