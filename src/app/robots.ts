import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://voterix.com";
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/super-admin/', 
        '/student/', 
        '/api/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
