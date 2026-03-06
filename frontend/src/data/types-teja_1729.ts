import type { Product as MasterProduct, StyleTag } from '../types';

export type { StyleTag };

export interface Product extends MasterProduct {
    id: string; // Ensure id is mandatory for static data
}
