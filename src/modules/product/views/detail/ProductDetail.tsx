import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/types/product';
import { apiService } from '@/service/api';
import { StarIcon } from '@/constants/svgs/star';
import { useTranslation } from 'react-i18next';
import { ImageGallery, ImageSkeleton } from '@/components/molecules';
import { Button } from '@/components/atoms/button/button';
import { Card } from '@/components/atoms/card/card';


export const ProductDetail = () => {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const response = await apiService.get<Product>(`products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Link
          to="/"
          className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          {t("products.detail.backToProducts")}
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageSkeleton />
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="h-8 bg-gray-200 rounded mt-4 w-3/4" />
                <div className="h-4 bg-gray-200 rounded mt-2 w-full" />
                <div className="h-4 bg-gray-200 rounded mt-2 w-2/3" />
                
                <div className="mt-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="h-4 bg-gray-200 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error instanceof Error ? error.message : t("products.detail.productNotFound")}</p>
        <Button
          variant="outline"
          color="primary"
          onClick={() => navigate({ to: '/' })}
        >
          {t("products.detail.backToProducts")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button
        onClick={() => navigate({ to: '/' })}
        variant="outline"
        color="primary"      >
        {t("products.detail.backToProducts")}
      </Button>

      <Card className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageGallery images={product.images} title={product.title} />

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <StarIcon className="text-yellow-500 w-8 h-8" />
              <span className="text-gray-700 text-xl">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">
                {t("products.detail.reviews", { count: product.reviews.length })}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
                {product.discountPercentage > 0 && (
                  <div className="text-green-600">
                    {t("products.detail.off", { percentage: product.discountPercentage })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  {
                    label: "products.detail.brand",
                    value: product.brand
                  },
                  {
                    label: "products.category",
                    value: product.category
                  },
                  {
                    label: "products.detail.stock",
                    value: `${product.stock} ${t("products.detail.units")}`
                  },
                  {
                    label: "products.detail.sku",
                    value: product.sku
                  },
                  {
                    label: "products.detail.weight",
                    value: `${product.weight}kg`
                  },
                  {
                    label: "products.status",
                    value: product.availabilityStatus
                  },
                  {
                    label: "products.detail.dimensions",
                    value: `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`
                  },
                  {
                    label: "products.detail.minOrder",
                    value: `${product.minimumOrderQuantity} ${t("products.detail.units")}`
                  }
                ].map((detail, index) => (
                  <div key={index}>
                    <span className="font-semibold">{t(detail.label)}:</span> {detail.value}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">{t("products.detail.shippingAndReturns")}</h3>
                <div className="text-sm text-gray-600">
                  <p>{product.shippingInformation}</p>
                  <p className="mt-1">{product.returnPolicy}</p>
                  <p className="mt-1">{t("products.detail.warranty")}: {product.warrantyInformation}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">{t("products.detail.customerReviews")}</h3>
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <Card key={index} className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{review.reviewerName}</div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className="text-yellow-500 w-4 h-4"
                              filled={i < review.rating}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}; 