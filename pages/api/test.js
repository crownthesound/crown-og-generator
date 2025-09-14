export default async function handler(request) {
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

  return new Response(JSON.stringify({
    id: contest.id,
    name: contest.name,
    name2: contest.name2,
    cover_image: contest.cover_image,
    timestamp: Date.now()
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
