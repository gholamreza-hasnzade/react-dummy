export const ImageSkeleton = () => (
    <div className="animate-pulse">
      <div className="aspect-square rounded-lg bg-gray-200" />
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="aspect-square rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  );
  