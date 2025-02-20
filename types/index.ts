import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type UploadState = {
  error?: string;
  paths?: string[];
} | null;

interface BaseProvince {
  code: number;
  codename: string;
  division_type: string;
  name: string;
}

/* https://provinces.open-api.vn/redoc#operation/show_all_divisions_api__get */
export interface Province extends BaseProvince {
  districts: District[];
  phone_code: number;
}

export interface District extends BaseProvince {
  province_code: number;
  wards: Ward[];
}

export interface Ward extends BaseProvince {
  district_code: number;
}