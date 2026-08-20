import React from 'react';
import { ProductOverviewDto } from '../../types';
import { ProductXDrillDown } from '../drilldown/ProductXDrillDown';
import { ShoppingBag } from 'lucide-react';

interface ProductsPageProps {
  productData: ProductOverviewDto | null;
  onExecuteAction: (actionKey: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  productData,
  onExecuteAction
}) => {
  if (!productData) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        Mahsulotlar ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShoppingBag style={{ width: 28, height: 28, color: '#38bdf8' }} />
          Mahsulotlar & Xarid Voronkasi (Funnel)
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Mahsulot X (Smart Pro X) bo'yicha konversiya 14.2% dan 4.2% ga qulashi va bartaraf etish choralari
        </p>
      </div>

      <ProductXDrillDown
        data={productData}
        onApplyDiscount={() => onExecuteAction('discount_product_x')}
      />
    </div>
  );
};
