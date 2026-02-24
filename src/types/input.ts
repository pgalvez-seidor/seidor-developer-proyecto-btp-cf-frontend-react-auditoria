import React, { HTMLInputTypeAttribute } from "react";

export interface InputTextProps {
  disable?: boolean | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string | null | React.ReactNode;
  label?: string;
  min?: string | number;
  max?: string | number;
  minLength?: number | undefined;
  name: string;
  needHelp?: boolean;
  placeholder?: string;
  styles?: string;
  type?: HTMLInputTypeAttribute;
  value: string | number;
}
export interface OptionProps {
  id?: string | number | null;
  label: string;
  value: string;
}
export interface SelectProps {
  label: string;
  icon?: string | null | React.ReactNode;
  name: string;
  value: string | number;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  option?: OptionProps[];
}