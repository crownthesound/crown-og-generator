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
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Image or Gradient */}
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
          
          {/* Dark overlay for depth */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          />
          
          {/* Logo in top left */}
          <div style={{
            position: 'absolute',
            top: 40,
            left: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: 'white',
            }}>C</div>
            <span style={{ 
              fontSize: 20, 
              fontWeight: 700,
              color: 'white',
              letterSpacing: -0.5,
            }}>{brand}</span>
          </div>

          {/* Main content with glassmorphism card */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'absolute',
            bottom: 80,
            left: 60,
            right: 60,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: '48px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }}>
            {/* Artist name */}
            {subtitle && (
              <p style={{
                fontSize: 18,
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 8px 0',
                fontWeight: 500,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}>{subtitle}</p>
            )}
            
            {/* Song title */}
            <h1 style={{
              fontSize: 72,
              fontWeight: 900,
              margin: '0 0 24px 0',
              letterSpacing: -2,
              textTransform: 'uppercase',
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              lineHeight: 1,
            }}>{title}</h1>

            {/* Contest badge and CTA */}
            <div style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 100,
                fontSize: 16,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>🏆 Live Contest</span>
              
              <span style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 16,
                fontWeight: 600,
              }}>Join now to compete →</span>
            </div>
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
