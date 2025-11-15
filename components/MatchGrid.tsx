import { Trainer } from "@/types/Trainer";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect } from "react";

interface MatchGridProps {
  matches: Trainer[];
  isLoading?: boolean;
}

export const MatchGrid = ({ matches, isLoading = false }: MatchGridProps) => {
  useEffect(() => {
    console.log(matches)
  },[matches])
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 animate-pulse">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#252525]"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#2d2d2d] rounded w-3/4"></div>
                <div className="h-3 bg-[#2d2d2d] rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-[#2d2d2d] rounded"></div>
              <div className="h-3 bg-[#2d2d2d] rounded w-5/6"></div>
            </div>
            <div className="h-10 bg-[#2d2d2d] rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#252525] mb-4">
          <span className="text-(--color-primary) text-2xl">🔍</span>
        </div>
        <h3 className="text-(--color-secondary) font-semibold text-lg mb-1">No matches found</h3>
        <p className="text-(--color-contrast) max-w-md">
          We couldn't find experts matching your preferences. Try updating your goals or health info.
        </p>
      </div>
    );
  }

  if(matches.length > 0) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/*dont forget to fix this */}
      {matches.map((trainer, i) => (
        <div
          key={i}
          className="bg-(--color-accent) border border-[#333333] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
          <div className="p-5 border-b border-[#333333]">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center overflow-hidden">
                  {trainer?.avatar_url ? (
                    <Image
                      src={trainer?.avatar_url}
                      alt={trainer?.name}
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized 
                    />
                  ) : (
                    <span className="text-(--color-primary) font-bold text-xl">
                      {trainer?.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {trainer?.rating != null && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-(--color-primary) text-(--color-secondary) text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    aria-label={`Rated ${trainer?.rating} out of 5`}
                  >
                    {trainer?.rating >= 10 ? "★" : trainer?.rating}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-(--color-secondary) text-lg truncate">{trainer?.name}</h3>
                {trainer?.experience_years != null && (
                  <p className="text-sm text-(--color-contrast)">
                    {trainer?.experience_years}+ years
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {trainer?.bio && (
              <p className="text-(--color-contrast) text-sm mb-4 line-clamp-3 flex-1">
                {trainer?.bio}
              </p>
            )}

            {(trainer?.specialties?.length || 0) > 0 && (
              <div className="mb-3">
                <p className="text-xs text-(--color-contrast) font-medium mb-1.5">Specialties</p>
                <div className="flex flex-wrap gap-1.5">
                  {trainer?.specialties?.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#252525] text-(--color-contrast) text-xs rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                  {trainer?.specialties && trainer?.specialties.length > 3 && (
                    <span className="px-2 py-1 text-xs text-(--color-contrast)">+{trainer?.specialties.length - 3}</span>
                  )}
                </div>
              </div>
            )}

            {(trainer?.certifications?.length || 0) > 0 && (
              <div>
                <p className="text-xs text-(--color-contrast) font-medium mb-1.5">Certifications</p>
                <p className="text-xs text-(--color-contrast) line-clamp-1">
                  {trainer?.certifications?.join(", ")}
                </p>
              </div>
            )}
          </div>

          <div className="p-5 pt-2">
            <Link
              href={`/get_matched/${trainer?.id}`}
              className="w-full block py-2.5 text-center bg-(--color-primary) text-(--color-secondary) font-semibold rounded-lg hover:bg-[#e6c200] active:bg-[#ccac00] transition duration-200 focus:ring-2 focus:ring-[#e6c200] focus:outline-none"
              aria-label={`View profile of ${trainer?.name}`}
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};