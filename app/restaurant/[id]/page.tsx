import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Share2, Phone, Clock, Navigation, ChevronLeft, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { restaurants } from "@/data/restaurants";
import { notFound } from "next/navigation";

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    notFound();
  }

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
                   <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1.5 text-sm font-medium">
                      {restaurant.vibes[0]}
                   </Badge>
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
                {restaurant.vibes.map((vibe) => (
                  <Badge key={vibe} variant="secondary" className="text-sm px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-zinc-100">
                    {vibe}
                  </Badge>
                ))}
                 <Badge variant="outline" className="text-sm px-4 py-2 rounded-full border-zinc-200 text-zinc-600">
                  {restaurant.cuisines.join(", ")}
                </Badge>
              </div>

              <div className="flex gap-4 mb-12 overflow-x-auto pb-2 no-scrollbar">
                 <Button className="flex-1 md:flex-none gap-2 rounded-full h-14 px-8 text-lg font-bold bg-black text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200">
                   <Navigation className="h-5 w-5" /> Get Directions
                 </Button>
                 <Button variant="outline" className="gap-2 rounded-full h-14 px-8 text-lg font-medium border-zinc-200">
                   <Share2 className="h-5 w-5" /> Share
                 </Button>
                 <Button variant="outline" size="icon" className="rounded-full h-14 w-14 shrink-0 border-zinc-200">
                   <Phone className="h-5 w-5" />
                 </Button>
              </div>

              <div className="space-y-16">
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
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:w-[400px] shrink-0 space-y-8">
            <Card className="border-zinc-100 shadow-2xl shadow-zinc-100 rounded-3xl overflow-hidden sticky top-8">
              <CardContent className="p-0">
                {/* Map Placeholder */}
                <div className="aspect-[4/3] w-full bg-zinc-100 relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=21.1458,79.0882&zoom=14&size=600x600&sensor=false')] bg-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                      <MapPin className="h-8 w-8" />
                    </div>
                </div>

                <div className="p-8 space-y-8">
                  <div>
                     <h3 className="font-bold text-xl mb-4">Location & Hours</h3>
                     <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <MapPin className="h-5 w-5 text-zinc-400 mt-1" />
                          <p className="text-zinc-600 leading-relaxed font-medium">{restaurant.address}</p>
                        </div>
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
                  
                  <div className="pt-8 border-t border-zinc-100">
                     <h3 className="font-bold text-xl mb-6">Rate Experience</h3>
                     <div className="flex justify-between">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-8 w-8 text-zinc-200 hover:text-black hover:fill-black cursor-pointer transition-all hover:scale-110" />
                        ))}
                     </div>
                     <Button className="w-full mt-8 h-12 rounded-xl text-base font-bold bg-white border border-zinc-200 text-black hover:bg-zinc-50 shadow-sm" variant="outline">Write a Review</Button>
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
