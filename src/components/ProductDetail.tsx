import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { Product } from '@/types/product';
import { apiService } from '@/service/api';
import { toast } from 'react-hot-toast';
import { getRatingImage } from '@/utils/generateRatingImages';

export const ProductDetail = () => {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await apiService.get<Product>(`products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate({ to: '/' })}
        className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start space-x-6">
          <div className="text-6xl">{getRatingImage(product.rating)}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="ml-2 text-gray-700">{product.rating.toFixed(1)}</span>
                <span className="ml-2 text-sm text-gray-500">({product.reviews.length} reviews)</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
                {product.discountPercentage > 0 && (
                  <div className="text-green-600">
                    {product.discountPercentage}% off
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Brand:</span> {product.brand}
                </div>
                <div>
                  <span className="font-semibold">Category:</span> {product.category}
                </div>
                <div>
                  <span className="font-semibold">Stock:</span> {product.stock} units
                </div>
                <div>
                  <span className="font-semibold">SKU:</span> {product.sku}
                </div>
                <div>
                  <span className="font-semibold">Weight:</span> {product.weight}kg
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {product.availabilityStatus}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Shipping & Returns</h3>
                <div className="text-sm text-gray-600">
                  <p>{product.shippingInformation}</p>
                  <p className="mt-1">{product.returnPolicy}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Customer Reviews</h3>
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{review.reviewerName}</div>
                        <div className="text-yellow-500">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 