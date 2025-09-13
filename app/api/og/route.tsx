import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contestId = searchParams.get('id');
    
    if (!contestId) {
      return new Response('Contest ID required', { status: 400 });
    }

    // Fetch contest data from Supabase
    const supabaseUrl = 'https://mhflahfkeqxsolneaoxy.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZmxhaGZrZXF4c29sbmVhb3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MDg0NjIsImV4cCI6MjA1OTQ4NDQ2Mn0.TKLy609teZ2sZ5spCvKx8W9tsir5uXLXd-c9epe0znA';
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/contests?id=eq.${contestId}&select=*`,
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
      console.log('No contest found for ID:', contestId);
      return new Response('Contest not found', { status: 404 });
    }

    // Hardcode for testing
    const title = 'MY FAVORITE THINGS';
    const subtitle = 'JULIE ANDREWS';
    const coverImage = 'https://mhflahfkeqxsolneaoxy.supabase.co/storage/v1/object/public/leaderboard-images/cover-images/ggcq3ro1exe.jpg';
    console.log('Using hardcoded data - Title:', title, 'Subtitle:', subtitle, 'Image:', coverImage);

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            position: 'relative',
          }}
        >
          
          {/* Main content */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '80px',
              width: '100%',
              zIndex: 1,
            }}
          >
            {/* Left content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Logo section */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px', gap: '15px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background: '#4ade80',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>👑</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px', color: '#4ade80', fontWeight: 700 }}>
                    Crown
                  </span>
                  <span style={{ fontSize: '16px', color: 'rgba(74, 222, 128, 0.6)', fontWeight: 400 }}>
                    Music Competitions
                  </span>
                </div>
              </div>
              
              {/* Title */}
              <h1
                style={{
                  fontSize: '86px',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 0.9,
                  marginBottom: '24px',
                  letterSpacing: '-3px',
                }}
              >
                {title}
              </h1>
              
              {/* Subtitle */}
              <p
                style={{
                  fontSize: '36px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 400,
                  marginBottom: '50px',
                  letterSpacing: '-0.5px',
                }}
              >
                {subtitle}
              </p>
              
              {/* Enter button */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#4ade80',
                  color: '#000',
                  padding: '24px 48px',
                  borderRadius: '60px',
                  fontSize: '22px',
                  fontWeight: 800,
                  gap: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                <span>ENTER →</span>
              </div>
            </div>
            
            {/* Right image */}
            {coverImage && (
              <div
                style={{
                  width: '440px',
                  height: '440px',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  marginLeft: '80px',
                  display: 'flex',
                  background: '#111',
                  position: 'relative',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Subtle gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%)',
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Bottom site info */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.4)' }}>
              crownthesound.com
            </span>
          </div>
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
