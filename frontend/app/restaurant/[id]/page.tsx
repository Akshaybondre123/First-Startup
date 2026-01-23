import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Share2, Phone, Clock, Navigation, ChevronLeft, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewSection from "@/components/ReviewSection";
import SocialShare from "@/components/SocialShare";
import PhotoGallery from "@/components/PhotoGallery";

interface Restaurant {
  _id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisines: string[];
  tags: string[];
  address: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  features: string[];
  verified: boolean;
  phone?: string;
  email?: string;
  website?: string;
}

async function getRestaurant(id: string): Promise<Restaurant | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://first-startup-pink.vercel.app/api';
    const response = await fetch(`${apiUrl}/restaurants/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<any> {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  
  if (!restaurant) {
    return {
      title: "Restaurant Not Found - Wampin",
    };
  }
  
  return {
    title: `${restaurant.name} - Wampin`,
    description: `${
      restaurant.description ||
      `Discover ${restaurant.name}. ${restaurant.cuisines?.join(', ')} cuisine. Rating: ${restaurant.rating}/5. ${restaurant.priceRange}.`
    }`,
    openGraph: {
      title: `${restaurant.name} - Wampin`,
      description: restaurant.description || `Check out ${restaurant.name} on Wampin`,
      images: restaurant.image ? [restaurant.image] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${restaurant.name} - Wampin`,
      description: restaurant.description || `Check out ${restaurant.name} on Wampin`,
      images: restaurant.image ? [restaurant.image] : [],
    },
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  if (!restaurant) {
    notFound();
  }

  const [lng, lat] = restaurant.location.coordinates;

  // Mock multiple images for gallery - in production, this would come from restaurant data
  const restaurantImages = [
    restaurant.image,
    restaurant.image, // Replace with actual gallery images
    restaurant.image,
    restaurant.image,
    restaurant.image,
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* Header Image - Full width with gradient */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        
        <div className="absolute top-0 left-0 right-0 p-6 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/explore">
              <Button size="icon" className="rounded-full h-12 w-12 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
           <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                   {restaurant.verified && (
                     <Badge className="mb-4 bg-green-500/90 hover:bg-green-500 text-white border-none backdrop-blur-md px-4 py-1.5 text-sm font-medium">
                        Verified
                     </Badge>
                   )}
                   {restaurant.tags.length > 0 && (
                     <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1.5 text-sm font-medium">
                        {restaurant.tags[0]}
                     </Badge>
                   )}
                   <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight">{restaurant.name}</h1>
                   <div className="flex items-center gap-4 text-lg md:text-xl font-medium text-zinc-300">
                      <span className="flex items-center gap-1.5"><MapPin className="h-5 w-5" /> {restaurant.address}</span>
                      <span>•</span>
                      <span>{restaurant.priceRange}</span>
                   </div>
                </div>
                <div className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full font-bold shadow-2xl">
                  <Star className="h-5 w-5 fill-black" />
                  <span className="text-2xl">{restaurant.rating}</span>
                  <span className="text-sm text-zinc-500 font-normal ml-1 border-l border-zinc-200 pl-2">{restaurant.reviewCount} reviews</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-12">
              <div className="flex flex-wrap gap-3 mb-10">
                {restaurant.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-zinc-100">
                    {tag}
                  </Badge>
                ))}
                 <Badge variant="outline" className="text-sm px-4 py-2 rounded-full border-zinc-200 text-zinc-600">
                  {restaurant.cuisines.join(", ")}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 mb-12">
                 <a 
                   href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex-1 min-w-[140px]"
                 >
                   <Button className="w-full gap-2 rounded-full h-14 px-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl">
                     <Navigation className="h-5 w-5" /> Get Directions
                   </Button>
                 </a>
                 {restaurant.phone && (
                   <>
                     <a href={`tel:${restaurant.phone}`} className="flex-1 min-w-[140px]">
                       <Button className="w-full gap-2 rounded-full h-14 px-6 text-lg font-bold bg-green-600 text-white hover:bg-green-700 shadow-xl">
                         <Phone className="h-5 w-5" /> Call Now
                       </Button>
                     </a>
                     <a 
                       href={`https://wa.me/${restaurant.phone.replace(/\D/g, '')}?text=Hi, I'm interested in ${restaurant.name}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 min-w-[140px]"
                     >
                       <Button className="w-full gap-2 rounded-full h-14 px-6 text-lg font-bold bg-[#25D366] text-white hover:bg-[#20BA5A] shadow-xl">
                         <Phone className="h-5 w-5" /> WhatsApp
                       </Button>
                     </a>
                   </>
                 )}
                 <div className="flex-1 min-w-[140px]">
                   <SocialShare 
                     title={restaurant.name}
                     url={`${typeof window !== 'undefined' ? window.location.origin : ''}/restaurant/${id}`}
                     description={restaurant.description}
                   />
                 </div>
              </div>

              <div className="space-y-16">
                {/* Photo Gallery */}
                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-zinc-400" />
                    Photo Gallery
                  </h2>
                  <PhotoGallery images={restaurantImages} restaurantName={restaurant.name} />
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-zinc-400" />
                    About the Vibe
                  </h2>
                  <p className="text-zinc-600 leading-loose text-xl font-light">
                    {restaurant.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-8">Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {restaurant.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                           <CheckCircle2 className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-medium text-zinc-800">{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                       <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                           <CheckCircle2 className="h-5 w-5 text-black" />
                        </div>
                       <span className="font-medium text-zinc-800">Clean Washrooms</span>
                    </div>
                  </div>
                </section>

                <ReviewSection restaurantId={id} />
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:w-[400px] shrink-0 space-y-8">
            <Card className="border-zinc-100 shadow-2xl shadow-zinc-100 rounded-3xl overflow-hidden sticky top-8">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                     <h3 className="font-bold text-xl mb-4">Location & Hours</h3>
                     <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <MapPin className="h-5 w-5 text-zinc-400 mt-1" />
                          <p className="text-zinc-600 leading-relaxed font-medium">{restaurant.address}</p>
                        </div>
                        {restaurant.phone && (
                          <div className="flex items-start gap-4">
                            <Phone className="h-5 w-5 text-zinc-400 mt-1" />
                            <a href={`tel:${restaurant.phone}`} className="text-zinc-600 leading-relaxed font-medium hover:text-black">
                              {restaurant.phone}
                            </a>
                          </div>
                        )}
                        {restaurant.email && (
                          <div className="flex items-start gap-4">
                            <span className="h-5 w-5 text-zinc-400 mt-1">@</span>
                            <a href={`mailto:${restaurant.email}`} className="text-zinc-600 leading-relaxed font-medium hover:text-black">
                              {restaurant.email}
                            </a>
                          </div>
                        )}
                        {restaurant.website && (
                          <div className="flex items-start gap-4">
                            <span className="h-5 w-5 text-zinc-400 mt-1">🌐</span>
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-zinc-600 leading-relaxed font-medium hover:text-black">
                              Visit Website
                            </a>
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          <Clock className="h-5 w-5 text-zinc-400 mt-1" />
                          <div>
                            <p className="font-bold text-green-600 flex items-center gap-2">
                               <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                               Open Now
                            </p>
                            <p className="text-zinc-500">11:00 AM - 11:00 PM</p>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
