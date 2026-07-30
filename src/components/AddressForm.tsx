import { useState } from 'react';

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyAddress: ShippingAddress = {
  name: '',
  email: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  pincode: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAddress(address: ShippingAddress): boolean {
  return (
    address.name.trim().length > 0 &&
    emailPattern.test(address.email.trim()) &&
    /^\d{10}$/.test(address.phone.trim()) &&
    address.addressLine.trim().length > 0 &&
    address.city.trim().length > 0 &&
    address.state.trim().length > 0 &&
    /^\d{6}$/.test(address.pincode.trim())
  );
}

const inputClass =
  'w-full border border-muted px-3 py-2 text-sm outline-none focus:border-black transition-colors bg-transparent';
const labelClass = 'block text-xs uppercase tracking-widest text-muted-foreground mb-1';

export const AddressForm = ({
  address,
  onChange,
}: {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
}) => {
  const update = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...address, [field]: e.target.value });
  };

  return (
    <div className="w-full space-y-4 text-left">
      <h3 className="text-sm font-medium uppercase tracking-wide text-center">Shipping Address</h3>
      <div>
        <label className={labelClass}>Full Name</label>
        <input className={inputClass} value={address.name} onChange={update('name')} placeholder="Jane Doe" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email</label>
          <input className={inputClass} value={address.email} onChange={update('email')} placeholder="jane@example.com" />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={address.phone} onChange={update('phone')} placeholder="9876543210" maxLength={10} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Address</label>
        <input className={inputClass} value={address.addressLine} onChange={update('addressLine')} placeholder="House no, Street, Area" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input className={inputClass} value={address.city} onChange={update('city')} />
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input className={inputClass} value={address.state} onChange={update('state')} />
        </div>
        <div>
          <label className={labelClass}>Pincode</label>
          <input className={inputClass} value={address.pincode} onChange={update('pincode')} maxLength={6} />
        </div>
      </div>
    </div>
  );
};

export const useShippingAddress = () => useState<ShippingAddress>(emptyAddress);
