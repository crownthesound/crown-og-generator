import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Force Vercel to never cache this endpoint
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const brandParam = searchParams.get('brand');
    
    if (!id) {
      return new Response('Contest ID is required', { status: 400 });
    }
    
    // Determine brand
    let brand = 'CrownTheSound.com';
    if (brandParam === 'sing') {
      brand = 'Sing.Win';
    }

    // Fetch contest data from Supabase
    const supabaseUrl = 'https://mhflahfkeqxsolneaoxy.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZmxhaGZrZXF4c29sbmVhb3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MDg0NjIsImV4cCI6MjA1OTQ4NDQ2Mn0.TKLy609teZ2sZ5spCvKx8W9tsir5uXLXd-c9epe0znA';
    
    const supabaseResponse = await fetch(
      `${supabaseUrl}/rest/v1/contests?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      }
    );
    
    const contests = await supabaseResponse.json();
    const contest = contests[0];
    
    if (!contest) {
      return new Response('Contest not found', { status: 404 });
    }

    const title = (contest.name || 'CONTEST').toUpperCase();
    const subtitle = contest.name2 || '';
    const coverImage = contest.cover_image;

    // Fetch and convert cover image to base64
    let imageData = null;
    if (coverImage) {
      try {
        const imageResponse = await fetch(coverImage);
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';
        imageData = `data:${mimeType};base64,${base64}`;
        console.log('Successfully fetched cover image for contest:', id);
      } catch (error) {
        console.error('Failed to fetch cover image:', error);
      }
    }

    console.log('Request for contest ID:', id);
    console.log('Contest data:', JSON.stringify({
      id: contest.id,
      name: contest.name,
      name2: contest.name2,
      cover_image: contest.cover_image ? 'Has image' : 'None'
    }));
    console.log('Generating image - Title:', title, 'Subtitle:', subtitle);
    
    // Create response with no-cache headers
    const response = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, sans-serif',
            fontWeight: 900,
            position: 'relative',
          }}
        >
          {/* Background Image */}
          {imageData ? (
            <img
              src={imageData}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            />
          )}
          
          {/* Darker overlay extending up from bottom */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.98) 100%)',
            }}
          />
          

          {/* Song info left-aligned at bottom */}
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 1,
          }}>
            {/* Artist name - smaller */}
            {subtitle && (
              <p style={{
                fontSize: 36,
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 10px 0',
                paddingLeft: '7px',
                fontFamily: 'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, sans-serif',
                fontWeight: 'bold',
                letterSpacing: 8,
                textTransform: 'uppercase',
              }}>{subtitle}</p>
            )}
            
            {/* Song title - much larger and bolder */}
            <h1 style={{
              fontSize: 110,
              fontFamily: 'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, sans-serif',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: -2,
              textTransform: 'uppercase',
              color: 'white',
              lineHeight: 0.85,
              maxWidth: '1100px',
              textShadow: '0 6px 30px rgba(0,0,0,0.9)',
            }}>{title}</h1>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    
    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('X-Contest-ID', id);
    
    return response;
  } catch (error) {
    console.error('OG Image error:', error);
    return new Response(`Error: ${error.message}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
