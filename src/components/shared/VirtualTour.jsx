import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, ExternalLink } from "lucide-react";

export default function VirtualTour({ url, title }) {
  if (!url) return null;

  const getEmbedUrl = (url) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    // Matterport
    if (url.includes('matterport.com')) {
      return url.replace('show', 'embed');
    }
    
    // Return as is if already an embed URL
    return url;
  };

  const embedUrl = getEmbedUrl(url);
  const isExternalLink = !embedUrl || (!url.includes('youtube') && !url.includes('matterport'));

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-[#ff6b35]" />
          Virtual Tour
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isExternalLink ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={embedUrl}
              title={`${title} Virtual Tour`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-8 bg-gradient-to-br from-[#ff6b35]/10 to-[#ff8c5a]/10 rounded-lg border-2 border-[#ff6b35]/20 hover:border-[#ff6b35] transition-colors group"
          >
            <Video className="w-8 h-8 text-[#ff6b35]" />
            <span className="text-lg font-semibold text-[#1a1f35] group-hover:text-[#ff6b35]">
              View 3D Virtual Tour
            </span>
            <ExternalLink className="w-5 h-5 text-[#ff6b35]" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}