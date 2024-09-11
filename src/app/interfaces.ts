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
    irpf?: number;
    iva?: number;
  }

export interface Invoice {
    id: string;
    clientId: string;
    date: string;
    total:number;
    isPaid: boolean;
  }
