import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html'  // <- this makes dynamic routes work as SPA
    })
  }
};
