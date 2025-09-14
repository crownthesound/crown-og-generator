import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams, hostname } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Auto-detect brand based on domain
    let brand = 'sing'; // default
    if (hostname.includes('crownthesound') || hostname.includes('crown-it')) {
      brand = 'crown';
    }
    
    // Allow manual override with brand parameter
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      brand = brandParam;
    }

    if (!id) {
      return new Response('Contest ID is required', { status: 400 });
    }

    // Fetch contest data from Supabase
    const supabaseUrl = 'https://mhflahfkeqxsolneaoxy.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZmxhaGZrZXF4c29sbmVhb3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MDg0NjIsImV4cCI6MjA1OTQ4NDQ2Mn0.TKLy609teZ2sZ5spCvKx8W9tsir5uXLXd-c9epe0znA';
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/contests?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      }
    );
    
    if (!response.ok) {
      console.error('Supabase error:', response.status, response.statusText);
      return new Response(`Database error: ${response.status}`, { status: 500 });
    }
    
    const contests = await response.json();
    console.log('Fetched contests:', contests);
    const contest = contests[0];
    
    if (!contest) {
      console.log('No contest found for ID:', id);
      return new Response('Contest not found', { status: 404 });
    }

    // Hardcode for testing
    const title = 'MY FAVORITE THINGS';
    const subtitle = 'JULIE ANDREWS';
    const coverImage = 'https://mhflahfkeqxsolneaoxy.supabase.co/storage/v1/object/public/leaderboard-images/cover-images/ggcq3ro1exe.jpg';
    
    // Brand configuration
    const brandConfig = {
      sing: {
        name: 'Sing.Win',
        badge: 'Contest'
      },
      crown: {
        name: 'CrownTheSound.com',
        badge: 'Contest'
      }
    };
    
    const currentBrand = brandConfig[brand as keyof typeof brandConfig] || brandConfig.sing;
    console.log('Using hardcoded data - Title:', title, 'Subtitle:', subtitle, 'Image:', coverImage, 'Brand:', currentBrand.name);

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: 'radial-gradient(circle at 20% 50%, #1a1a1a 0%, #000000 50%)',
            alignItems: 'center',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Left content */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            paddingRight: '60px',
            justifyContent: 'center',
          }}>
            {/* Crown Logo */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '40px',
              gap: '10px',
            }}>
              <span style={{ fontSize: '20px', color: 'white', fontWeight: 600 }}>{currentBrand.name}</span>
              <span style={{ 
                fontSize: '12px', 
                color: '#4ade80', 
                background: 'rgba(74, 222, 128, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600,
              }}>
                {currentBrand.badge}
              </span>
            </div>
            
            {/* Subtitle */}
            <p style={{ 
              fontSize: '24px', 
              color: 'rgba(255,255,255,0.5)', 
              marginBottom: '-10px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              WebkitTextStroke: '0.5px rgba(255,255,255,0.3)',
            }}>
              {subtitle}
            </p>
            
            {/* Title */}
            <h1 style={{ 
              fontSize: '72px', 
              fontWeight: 900, 
              marginBottom: '80px', 
              paddingTop: '5px',
              letterSpacing: '0.04em',
              fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif',
              textTransform: 'uppercase',
              lineHeight: 1,
              color: 'white',
              textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white',
              WebkitTextStroke: '2px white',
            }}>
              {title}
            </h1>
            
            {/* Enter button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: 900,
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                width: '280px',
                WebkitTextStroke: '0.5px #000',
              }}
            >
              ENTER CONTEST
            </div>
          </div>
          
          {/* Right image */}
          {coverImage && (
            <div
              style={{
                width: '500px',
                height: '400px',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                position: 'relative',
                boxShadow: '0 20px 80px rgba(0, 0, 0, 0.8)',
              }}
            >
              <img
                src={coverImage}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Subtle gradient */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 30%)',
                }}
              />
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
