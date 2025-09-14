import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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
    
    const contests = await response.json();
    const contest = contests[0];
    
    if (!contest) {
      return new Response('Contest not found', { status: 404 });
    }

    const title = (contest.name || 'CONTEST').toUpperCase();
    const subtitle = contest.name2 || '';

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Brand */}
          <div style={{
            position: 'absolute',
            top: 60,
            left: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ 
              fontSize: 24, 
              fontWeight: 700,
              color: 'white',
            }}>CrownTheSound.com</span>
            <span style={{
              fontSize: 14,
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: 6,
              color: 'white',
              fontWeight: 600,
            }}>CONTEST</span>
          </div>

          {/* Main Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 80px',
          }}>
            {subtitle && (
              <p style={{
                fontSize: 32,
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 20px 0',
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>{subtitle}</p>
            )}
            
            <h1 style={{
              fontSize: 96,
              fontWeight: 900,
              margin: 0,
              letterSpacing: -2,
              textTransform: 'uppercase',
              color: 'white',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              WebkitTextStroke: '2px white',
              paintOrder: 'stroke fill',
            }}>{title}</h1>
          </div>

          {/* CTA Button */}
          <div style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            background: 'white',
            color: '#764ba2',
            padding: '20px 48px',
            borderRadius: 16,
            fontSize: 24,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            ENTER CONTEST →
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
