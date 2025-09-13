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
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZmxhaGZrZXF4c29sbmVhb3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxODc4NzUsImV4cCI6MjAzOTc2Mzg3NX0.8fK0sGLgqPrdqDw0Y5zzyLKqPMJVzqYJHtJlHmMfKKs';
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/contests?id=eq.${contestId}`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      }
    );
    
    const contests = await response.json();
    const contest = contests[0];
    
    if (!contest) {
      return new Response('Contest not found', { status: 404 });
    }

    const title = contest.name ? contest.name.toUpperCase() : 'CROWN';
    const subtitle = contest.name2 || 'MUSIC COMPETITION';
    const coverImage = contest.cover_image;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: '#000',
            position: 'relative',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            }}
          />
          
          {/* Decorative circles - pump.fun style */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <circle
              cx="-50"
              cy="-50"
              r="200"
              stroke="rgba(74, 222, 128, 0.15)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="1250"
              cy="300"
              r="250"
              stroke="rgba(74, 222, 128, 0.15)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="200"
              cy="680"
              r="150"
              stroke="rgba(74, 222, 128, 0.1)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          
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
                  display: 'flex',
                  alignItems: 'center',
                  background: '#4ade80',
                  color: '#000',
                  padding: '24px 48px',
                  borderRadius: '60px',
                  fontSize: '22px',
                  fontWeight: 800,
                  width: 'fit-content',
                  gap: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                <span>ENTER</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
