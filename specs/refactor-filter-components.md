# Refactoring Filter Components for Category Pages

## 1. Problem Statement

Currently, the filter components and their associated logic are duplicated across multiple category listing pages at different nesting levels:

- One-level deep: `/[categoryLevel1]/page.tsx`
- Two-levels deep: `/[categoryLevel1]/[categoryLevel2]/page.tsx`
- Three-levels deep: `/[categoryLevel1]/[categoryLevel2]/[categoryLevel3]/page.tsx`

This duplication leads to increased maintenance effort and potential inconsistencies if changes are not applied uniformly across all relevant files. The core filter components (`FilterEstateTransaction`, `FilterEstateType`, `FilterEstateKind`, `FilterPrice`, `FilterArea`, `FilterBedrooms`, and `ProductsListWithFilter`) are largely the same, with differences mainly in how their props are derived based on the current category depth and path.

## 2. Affected Files

The primary files to be refactored are:

-   `src/app/(frontend)/[categoryLevel1]/page.tsx`
-   `src/app/(frontend)/[categoryLevel1]/[categoryLevel2]/page.tsx`
-   `src/app/(frontend)/[categoryLevel1]/[categoryLevel2]/[categoryLevel3]/page.tsx`

## 3. Proposed Solution

To address the duplication, we will create a new reusable component: `src/components/filterComponent/FilterBar.tsx`.

This `FilterBar` component will:

-   Encapsulate the rendering of all common filter components:
    -   `ProductsListWithFilter`
    -   `FilterEstateTransaction`
    -   `FilterEstateType`
    -   `FilterEstateKind` (conditionally rendered based on category depth)
    -   `FilterPrice`
    -   `FilterArea`
    -   `FilterBedrooms`
-   Accept props that allow it to dynamically determine the context for the filters, such as all available categories and the current category path segments.
-   Internally derive the specific props required by each individual filter component based on the provided category data and current path.
-   The existing page components will then be simplified to instantiate this `FilterBar` component, passing the necessary high-level data.

## 4. `FilterBar.tsx` Component Design

### Props

```typescript
// Assuming Category is a type defined elsewhere in the project, e.g., from db/schema or types
// import { Category } from '@/types'; 

interface FilterBarProps {
  allCategories: Category[]; // All categories from the database
  level1Slug?: string;        // Current slug for categoryLevel1
  level2Slug?: string;        // Current slug for categoryLevel2 (if applicable)
  level3Slug?: string;        // Current slug for categoryLevel3 (if applicable)
  // searchParams might be needed if filters interact directly with URL query params not handled by sub-components
  // searchParams: { [key: string]: string | string[] | undefined }; 
}
```

### Internal Logic

1.  **Category Derivation**:
    -   Based on `level1Slug`, `level2Slug`, and `level3Slug`, find the `parentCategory` (level 1), `currentCategory` (level 2), and `currentSubChildCategory` (level 3) from `allCategories`.
    -   This involves constructing paths like `/${level1Slug}`, `/${level1Slug}/${level2Slug}`, etc., and finding matches in `allCategories`. The `getCategoryByPath` utility function (if available and suitable, or similar logic) can be used.
2.  **Filter Props Calculation**:
    -   `filteredCategories` for `FilterEstateTransaction`: Categories at level 1 (e.g., `allCategories.filter(c => c.level === 1)`).
    -   `filteredChildCategories` for `FilterEstateType`: Children of `parentCategory` (e.g., `allCategories.filter(c => c.parentId === parentCategory?.id && c.level === 2)`).
    -   `filteredSubChildCategories` for `FilterEstateKind`: Children of `currentCategory` (e.g., `allCategories.filter(c => c.parentId === currentCategory?.id && c.level === 3)`).
3.  **Conditional Rendering**:
    -   `FilterEstateKind` should only be rendered if `level3Slug` is present (or if `filteredSubChildCategories` is not empty and relevant).

### Example Structure

```typescript
// src/components/filterComponent/FilterBar.tsx
'use client'; // This component will likely need client-side interactivity or hooks

import React from 'react';
// Import individual filter components
import ProductsListWithFilter from './ProductsListWithFilter';
import FilterEstateTransaction from './FilterEstateTransaction';
import FilterEstateType from './FilterEstateType';
import FilterEstateKind from './FilterEstateKind';
import FilterPrice from './FilterPrice';
import FilterArea from './FilterArea';
import FilterBedrooms from './FilterBedrooms';
// Import types and utility functions (e.g., Category, getCategoryByPath)
// import { Category } from '@/types'; 
// import { getCategoryByPath } from '@/lib/queries/categoryQueries'; // Or similar

// Define Category type placeholder if not imported
interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
  level: number;
  parentId: string | null;
  // Add other relevant fields
}


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
  // --- Logic to derive categories based on slugs ---
  // This logic will replicate what's currently in the page.tsx files
  // to find parentCategory, currentCategory, currentSubChildCategory

  const parentCategory = level1Slug 
    ? allCategories.find(c => c.path === `/${level1Slug}`) 
    : undefined;

  const currentCategory = level1Slug && level2Slug 
    ? allCategories.find(c => c.path === `/${level1Slug}/${level2Slug}`) 
    : undefined;
    
  const currentSubChildCategory = level1Slug && level2Slug && level3Slug
    ? allCategories.find(c => c.path === `/${level1Slug}/${level2Slug}/${level3Slug}`)
    : undefined;

  // --- Logic to filter categories for dropdowns ---
  const filteredCategoriesForLevel1 = allCategories.filter(c => c.level === 1);
  
  const filteredChildCategoriesForLevel2 = parentCategory
    ? allCategories.filter(c => c.parentId === parentCategory.id && c.level === 2)
    : [];

  const filteredSubChildCategoriesForLevel3 = currentCategory
    ? allCategories.filter(c => c.parentId === currentCategory.id && c.level === 3)
    : [];

  return (
    <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
      <ProductsListWithFilter />
      <FilterEstateTransaction 
        currentCategory={parentCategory} 
        categories={filteredCategoriesForLevel1} 
      />
      {parentCategory && (
        <FilterEstateType 
          childCategories={filteredChildCategoriesForLevel2} 
          currentChildCategory={currentCategory} 
          parentCategorySlug={parentCategory.slug} // Required by FilterEstateType from existing code
        />
      )}
      {currentCategory && filteredSubChildCategoriesForLevel3.length > 0 && (
        <FilterEstateKind 
          childSubCategories={filteredSubChildCategoriesForLevel3} 
          CurrentSubCategory={currentSubChildCategory}
          parentCategorySlug={parentCategory?.slug} // Pass if needed
          childCategorySlug={currentCategory?.slug}  // Pass if needed
        />
      )}
      <FilterPrice priceType="sale" /> {/* Assuming 'sale' is a common default or can be prop-driven if needed */}
      <FilterArea />
      <FilterBedrooms />
    </div>
  );
}
```

## 5. Implementation Steps

1.  **Create `FilterBar.tsx`**:
    -   Create the file `src/components/filterComponent/FilterBar.tsx`.
    -   Implement the component structure as designed above, including props definition and internal logic for category derivation.
    -   Ensure all necessary imports for sub-filter components and types are included.
    -   The `Category` type needs to be correctly defined or imported. It appears to be available from `categoryQueries` or a global types file.
2.  **Refactor `page.tsx` (Level 3)**:
    -   Modify `src/app/(frontend)/[categoryLevel1]/[categoryLevel2]/[categoryLevel3]/page.tsx`.
    -   Remove the individual filter component instantiations.
    -   Import and use the new `FilterBar` component.
    -   Pass `allCategories` (fetched as `categories`) and the `categoryLevel1`, `categoryLevel2`, `categoryLevel3` slugs from `params` to `FilterBar`.
    -   Ensure `getCategoryByPath` calls used for `parentCategory`, `currentCategory`, and `currentSubChildCategory` within the page are no longer needed if `FilterBar` handles this, or pass these directly if `FilterBar` expects them pre-fetched. The current design of `FilterBar` assumes it will derive them from slugs and `allCategories`.
3.  **Refactor `page.tsx` (Level 2)**:
    -   Modify `src/app/(frontend)/[categoryLevel1]/[categoryLevel2]/page.tsx`.
    -   Perform similar changes as for the Level 3 page, adapting props for `FilterBar` (e.g., `level3Slug` will be undefined).
4.  **Refactor `page.tsx` (Level 1)**:
    -   Modify `src/app/(frontend)/[categoryLevel1]/page.tsx`.
    -   Perform similar changes, adapting props for `FilterBar` (e.g., `level2Slug` and `level3Slug` will be undefined).
5.  **Testing**:
    -   Thoroughly test the category pages at all three levels to ensure:
        -   Filters are displayed correctly.
        -   Dropdowns are populated with the correct options.
        -   Conditional rendering (like for `FilterEstateKind`) works as expected.
        -   No change in existing filter behavior or product listing.

## 6. Benefits

-   **Reduced Code Duplication**: Significant reduction in repeated JSX and logic across page files.
-   **Improved Maintainability**: Changes to the filter bar (e.g., adding a new filter, modifying an existing one) only need to be done in `FilterBar.tsx`.
-   **Increased Consistency**: Ensures a uniform filter experience across all category depths.
-   **Cleaner Page Components**: Page components become simpler and more focused on their primary responsibility of fetching data and displaying the main content.

## 7. Considerations

-   **Type Safety**: Ensure the `Category` type used in `FilterBar` matches the actual data structure.
-   **Client Component**: `FilterBar` will likely need to be a Client Component (`'use client'`) if any of its sub-components use client-side hooks or interactivity, which is typical for filter UI. The page components fetching data will remain Server Components.
-   **Performance**: The logic for deriving categories within `FilterBar` should be efficient. Since `allCategories` is passed as a prop, this primarily involves array traversals (`find`, `filter`), which should be acceptable for typical category list sizes.
-   **Props for sub-filters**: The example `FilterBar` passes slugs like `parentCategorySlug` to `FilterEstateType` and `FilterEstateKind`. This needs to be verified against the actual props these components expect from the existing page implementations. Some props might need to be adjusted. For example, the existing `FilterEstateType` in `[categoryLevel3]/page.tsx` receives `currentChildCategory={currentCategory}` and `FilterEstateKind` receives `CurrentSubCategory={currentSubChildCategory}`. The `FilterBar` should ensure these are correctly mapped. The provided example needs refinement in how these specific props are passed.

---
*Self-correction during spec generation: The initial `FilterBar.tsx` example needs to ensure that props like `currentChildCategory` for `FilterEstateType` and `CurrentSubCategory` for `FilterEstateKind` are correctly derived and passed, as they are objects, not just slugs. The `parentCategorySlug` and `childCategorySlug` were also noted from the provided file structure and seem to be passed as props to some filters for constructing links/paths within those components.*

*Further refinement for `FilterBar.tsx` props based on `[categoryLevel3]/page.tsx`:*
*   `FilterEstateTransaction` uses `currentCategory={parentCategory}` and `categories={filteredCategories}`.
*   `FilterEstateType` uses `childCategories={filteredChildCategories}` and `currentChildCategory={currentCategory}`.
*   `FilterEstateKind` uses `childSubCategories={filteredSubChildCategories}` and `CurrentSubCategory={currentSubChildCategory}`.

The `FilterBar` internal logic for deriving these category objects (`parentCategory`, `currentCategory`, `currentSubChildCategory`) and filtered lists is crucial and should replicate the logic from the page files.
--- 