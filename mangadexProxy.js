export default async (req, context) => {
  const urlParams = new URL(req.url).searchParams;
  const action = urlParams.get('action') || 'search';
  const query = urlParams.get('query') || '';
  const mangaId = urlParams.get('mangaId') || '';
  const chapterId = urlParams.get('chapterId') || '';
  const lang = urlParams.get('lang') || 'en';

  let targetUrl = '';

  // Route requests based on action
  if (action === 'search') {
    targetUrl = `https://api.mangadex.org/manga?includes[]=cover_art&order[followedCount]=desc&limit=20`;
    if (query) targetUrl += `&title=${encodeURIComponent(query)}`;
  } else if (action === 'chapters') {
    targetUrl = `https://api.mangadex.org/manga/${mangaId}/feed?translatedLanguage[]=${lang}&order[chapter]=desc&limit=100`;
  } else if (action === 'pages') {
    targetUrl = `https://api.mangadex.org/at-home/server/${chapterId}`;
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'NetlifyMangaReader/1.0 (https://netlify.app)'
      }
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from MangaDex' }), { status: 500 });
  }
};