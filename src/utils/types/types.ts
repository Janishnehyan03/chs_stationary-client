// export interface Invoice {
//   _id: string;
//   user: {
//     name: string;
//     role: string;
//     admissionNumber: string;
//     balance: number;
//     class: {
//       name: string;
//       section: string;
//     };
//   };
//   status?: "paid" | "pending";
//   amountPaid: number;
//   items: {
//     price: number;
//     product: {
//       title: string;
//       price: number;
//     };
//     quantity: number;
//   }[];
//   createdAt: string;
//   totalAmount: number;
// }

export interface Invoice {
  _id: string;
  user: {
    name: string;
    admissionNumber?: string;
    class?: { name: string; section: string };
    balance: number;
    role?: string;
  };
  items: {
    price: number; product: { price: number }; quantity: number 
}[];
  totalAmount: number;
  amountPaid: number;
  status: "paid" | "unpaid" | "partially_paid";
  paymentHistory: {
    _id: string;
    amount: number;
    method: "cash" | "online" | "balance" | "other";
    date: string;
    corrected: boolean;
  }[];
  createdAt: string;
}

export interface Class {
  _id: string;
  name: string;
  section: string;
}
export interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dueAmount: number;
  balance: number;
}

export interface User {
  _id: string;
  name: string;
  password: string;
  admissionNumber: string;
  class?: Class;
  dueAmount: number;
  balance: number;
  role: string;
  phone: string;
  email: string;
  invoices: Invoice[];
  permissions: Permission[];
}
export interface Permission {
  _id?: string;
  permissionTitle: string;
  description: string;
}

export interface Product {
  _id: number;
  title: string;
  price: number;
  productCode: string;
  wholeSalePrice?: number;
  description?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  product: string;
  title: string;
  quantity: number;
  price: number;
}
