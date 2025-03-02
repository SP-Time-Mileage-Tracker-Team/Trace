export type IconT = {
  name: any;
  size: number;
  color: string;
  style?: any;
};

export type ProfileItemT = {
  age?: string;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  location?: string;
  name: string;
};

export type TabBarIconT = {
  focused: boolean;
  iconName: any;
  text: string;
};

export type DataT = {
  id: number;
  name: string;
  image: any;
  description: string;
  isOnline: boolean;
  isHomeless?: boolean;
  lastJobDate?: Date;
  birthday?: Date;
  militaryBranch?: string;
  yearsServed?: number;
  amountReceived?: number;
  message: string;
  age?: string;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  location?: string;
};
