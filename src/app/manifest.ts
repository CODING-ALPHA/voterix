import { MetadataRoute } from 'next';
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Voterix Online Voting Platform',
    short_name: 'Voterix',
    description: 'Fast, secure and reliable online voting platform for elections of any scale.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07080E',
    theme_color: '#3457B4',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
