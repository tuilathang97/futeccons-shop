'use client';

import React from 'react';
import ProductsListWithFilter from './ProductsListWithFilter';
import FilterEstateTransaction from './FilterEstateTransaction';
import FilterEstateType from './FilterEstateType';
import FilterEstateKind from './FilterEstateKind';
import FilterPrice from './FilterPrice';
import FilterArea from './FilterArea';
import FilterBedrooms from './FilterBedrooms';
import type { Category } from '@/db/schema';

interface FilterBarProps {
  allCategories: Category[];
  level1Slug?: string;
  level2Slug?: string;
  level3Slug?: string;
}

export default function FilterBar({
  allCategories,
  level1Slug,
  level2Slug,
  level3Slug,
}: FilterBarProps) {
  const parentCategory = level1Slug
    ? allCategories.find(c => c.path === `/${level1Slug}`)
    : undefined;

  const currentCategory = level1Slug && level2Slug
    ? allCategories.find(c => c.path === `/${level1Slug}/${level2Slug}`)
    : undefined;

  const currentSubChildCategory = level1Slug && level2Slug && level3Slug
    ? allCategories.find(c => c.path === `/${level1Slug}/${level2Slug}/${level3Slug}`)
    : undefined;

  const filteredCategoriesForLevel1 = allCategories.filter(c => c.level === 1);

  const filteredChildCategoriesForLevel2 = parentCategory
    ? allCategories.filter(c => c.parentId === parentCategory.id && c.level === 2)
    : [];

  const filteredSubChildCategoriesForLevel3 = currentCategory
    ? allCategories.filter(c => c.parentId === currentCategory.id && c.level === 3)
    : [];

  const shouldRenderFilterEstateType = parentCategory && (filteredChildCategoriesForLevel2.length > 0 || currentCategory);
  
  const shouldRenderFilterEstateKind = currentCategory && (filteredSubChildCategoriesForLevel3.length > 0 || currentSubChildCategory);

  return (
    <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
      <ProductsListWithFilter />
      {parentCategory && (
        <FilterEstateTransaction
          currentCategory={parentCategory}
          categories={filteredCategoriesForLevel1}
        />
      )}
      {shouldRenderFilterEstateType && (
        <FilterEstateType
          childCategories={filteredChildCategoriesForLevel2}
          currentChildCategory={currentCategory}
        />
      )}
      {shouldRenderFilterEstateKind && (
        <FilterEstateKind
          childSubCategories={filteredSubChildCategoriesForLevel3}
          CurrentSubCategory={currentSubChildCategory}
        />
      )}
      <FilterPrice priceType="sale" />
      <FilterArea />
      <FilterBedrooms />
    </div>
  );
} 