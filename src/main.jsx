import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Clock3,
  Edit3,
  Flame,
  Home,
  Menu,
  MessageCircle,
  PenSquare,
  Search,
  Sparkles,
  Tag,
  UserRound,
  X
} from 'lucide-react';
import './styles.css';

const initialPosts = [
  {
    id: 'designing-for-small-screens',
    title: 'Designing Blog Systems for Small Screens First',
    excerpt:
      'A practical look at shaping navigation, reading rhythm, and discovery around the realities of mobile attention.',
    category: 'Design',
    author: 'Mina Verma',
    authorRole: 'Product Designer',
    date: 'Jun 12, 2026',
    readTime: 6,
    image:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    comments: 18,
    body: [
      'Mobile-first design is not a smaller desktop layout. It starts with asking what a reader needs when space, time, and patience are all limited.',
      'For a blog platform, that means search should be fast, categories should be visible, and each post should make its reading promise quickly. The best layouts keep momentum: scan, choose, read, save, continue.',
      'Spacing matters as much as typography. Dense controls can still feel calm when they align cleanly and keep touch targets generous. A responsive blog should feel focused on a commute and still composed on a wide monitor.'
    ]
  },
  {
    id: 'state-that-feels-invisible',
    title: 'State Management That Feels Invisible',
    excerpt:
      'How bookmarks, drafts, and filters can work together without making the interface feel busy.',
    category: 'React',
    author: 'Jon Bell',
    authorRole: 'Frontend Engineer',
    date: 'Jun 10, 2026',
    readTime: 8,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    comments: 31,
    body: [
      'Good interface state is usually quiet. The user should feel that the app remembers what matters without making them understand its machinery.',
      'Reducer-based state works well when several parts of the blog need to coordinate. Bookmarks update across listing pages and detail pages. New drafts can appear instantly in feeds. Filters can be reset in one predictable action.',
      'The goal is not to use the largest state library possible. The goal is to choose a pattern that keeps changes explicit and easy to reason about.'
    ]
  },
  {
    id: 'routing-as-reading-flow',
    title: 'Routing as Reading Flow',
    excerpt:
      'Routes are more than URLs. They define how readers move between feeds, authors, and article details.',
    category: 'Architecture',
    author: 'Ari Chen',
    authorRole: 'Software Architect',
    date: 'Jun 7, 2026',
    readTime: 5,
    image:
      'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    comments: 12,
    body: [
      'Routing gives content a map. A home feed, a post detail page, a category filter, and an author view each answer a different reader question.',
      'React Router keeps that map readable in code. Dynamic route parameters are especially useful for articles and authors because the URL can describe the content directly.',
      'A strong reading flow makes backtracking obvious. Readers should always know how to return to the feed, jump to related articles, or narrow the collection.'
    ]
  },
  {
    id: 'css-that-scales-with-content',
    title: 'CSS That Scales With Content',
    excerpt:
      'Fluid grids, stable media ratios, and container-aware spacing keep a blog polished as posts change.',
    category: 'CSS',
    author: 'Mina Verma',
    authorRole: 'Product Designer',
    date: 'Jun 3, 2026',
    readTime: 7,
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    comments: 24,
    body: [
      'Content changes constantly in a publishing product, so the layout has to expect long headlines, uneven excerpts, and mixed media.',
      'CSS grid with minmax tracks is a sturdy foundation for responsive article cards. Aspect ratios prevent images from shifting the page while they load.',
      'Polish is often just the absence of surprises: buttons stay the same size, cards align, and text wraps without colliding with neighboring controls.'
    ]
  },
  {
    id: 'editorial-systems-for-teams',
    title: 'Editorial Systems for Tiny Teams',
    excerpt:
      'A lightweight publishing workflow can still offer drafts, category strategy, and clear ownership.',
    category: 'Workflow',
    author: 'Nora Singh',
    authorRole: 'Managing Editor',
    date: 'May 29, 2026',
    readTime: 4,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    comments: 9,
    body: [
      'Small editorial teams need tools that reduce coordination friction. Clear post ownership, fast search, and simple categorization do more than a heavy approval system.',
      'A blog interface can support that workflow by surfacing post metadata and letting teams create new entries from a focused composer.',
      'When publishing tools are lightweight, teams are more likely to use them consistently.'
    ]
  },
  {
    id: 'search-without-stopping-the-reader',
    title: 'Search Without Stopping the Reader',
    excerpt:
      'Search should narrow the feed immediately while preserving context, route state, and reading momentum.',
    category: 'UX',
    author: 'Ari Chen',
    authorRole: 'Software Architect',
    date: 'May 24, 2026',
    readTime: 6,
    image:
      'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    comments: 16,
    body: [
      'Readers search with fragments: a topic, a remembered author, a phrase from a title. Blog search should reward that imprecision.',
      'Keeping the query in route state makes the interface shareable and recoverable. A copied URL should preserve what the reader was looking at.',
      'The interaction works best when search and category filters feel like one combined lens over the same content.'
    ]
  }
];

const categories = ['All', 'Design', 'React', 'Architecture', 'CSS', 'Workflow', 'UX'];

const BlogContext = createContext(null);

function blogReducer(state, action) {
  switch (action.type) {
    case 'toggleBookmark': {
      const bookmarks = new Set(state.bookmarks);
      if (bookmarks.has(action.id)) {
        bookmarks.delete(action.id);
      } else {
        bookmarks.add(action.id);
      }
      return { ...state, bookmarks: [...bookmarks] };
    }
    case 'addPost': {
      return { ...state, posts: [action.post, ...state.posts] };
    }
    default:
      return state;
  }
}

function BlogProvider({ children }) {
  const [state, dispatch] = useReducer(blogReducer, {
    posts: initialPosts,
    bookmarks: ['state-that-feels-invisible']
  });

  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider');
  }
  return context;
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <BlogProvider>
      <BrowserRouter>
        <div className="app-shell">
          <header className="topbar">
            <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
              <span className="brand-mark"><PenSquare size={21} /></span>
              <span>
                <strong>Responsive Blog</strong>
                <small>Stories, routes, and state</small>
              </span>
            </Link>

            <button
              className="icon-button menu-button"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Primary">
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                <Home size={17} /> Feed
              </NavLink>
              <NavLink to="/bookmarks" onClick={() => setMenuOpen(false)}>
                <Bookmark size={17} /> Bookmarks
              </NavLink>
              <NavLink to="/write" onClick={() => setMenuOpen(false)}>
                <Edit3 size={17} /> Write
              </NavLink>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/author/:name" element={<AuthorPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/write" element={<WritePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </BlogProvider>
  );
}

function HomePage() {
  const { posts } = useBlog();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const featured = posts.find((post) => post.featured) || posts[0];
  const filteredPosts = filterPosts(posts, query, category);

  const updateSearch = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === 'All') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  return (
    <div className="page">
      <section className="feed-hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> Dynamic publishing workspace</span>
          <h1>Responsive Blog Application</h1>
          <p>
            Browse routed articles, filter the feed, save favorites, and draft new posts in a
            mobile-first React interface.
          </p>
        </div>
        <ArticleSpotlight post={featured} />
      </section>

      <section className="toolbelt" aria-label="Search and category filters">
        <label className="search-field">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => updateSearch({ q: event.target.value })}
            placeholder="Search titles, topics, authors"
          />
        </label>

        <div className="category-scroll" role="list" aria-label="Categories">
          {categories.map((item) => (
            <button
              key={item}
              className={item === category ? 'category-chip active' : 'category-chip'}
              onClick={() => updateSearch({ category: item })}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="content-layout">
        <div>
          <div className="section-heading">
            <div>
              <span className="eyebrow"><Flame size={15} /> Latest thinking</span>
              <h2>{filteredPosts.length} posts found</h2>
            </div>
          </div>
          <PostGrid posts={filteredPosts} emptyText="No posts match this filter yet." />
        </div>
        <Sidebar />
      </section>
    </div>
  );
}

function ArticleSpotlight({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="spotlight">
      <img src={post.image} alt="" />
      <div className="spotlight-overlay">
        <span>{post.category}</span>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </div>
    </Link>
  );
}

function PostGrid({ posts, emptyText }) {
  if (!posts.length) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }) {
  const { bookmarks, dispatch } = useBlog();
  const saved = bookmarks.includes(post.id);

  return (
    <article className="post-card">
      <Link to={`/post/${post.id}`} className="card-media">
        <img src={post.image} alt="" />
      </Link>
      <div className="card-body">
        <div className="card-meta">
          <span><Tag size={14} /> {post.category}</span>
          <span><Clock3 size={14} /> {post.readTime} min</span>
        </div>
        <h3>
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <div className="card-footer">
          <Link to={`/author/${encodeURIComponent(post.author)}`} className="author-link">
            <UserRound size={16} /> {post.author}
          </Link>
          <button
            className="icon-button"
            aria-label={saved ? 'Remove bookmark' : 'Save bookmark'}
            onClick={() => dispatch({ type: 'toggleBookmark', id: post.id })}
          >
            {saved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
          </button>
        </div>
      </div>
    </article>
  );
}

function Sidebar() {
  const { posts, bookmarks } = useBlog();
  const popular = [...posts].sort((a, b) => b.comments - a.comments).slice(0, 3);
  const categoryCounts = categories
    .filter((item) => item !== 'All')
    .map((item) => ({ label: item, count: posts.filter((post) => post.category === item).length }));

  return (
    <aside className="sidebar" aria-label="Blog insights">
      <section className="insight-panel">
        <h2>Reading stats</h2>
        <div className="stat-grid">
          <span><strong>{posts.length}</strong> Posts</span>
          <span><strong>{bookmarks.length}</strong> Saved</span>
        </div>
      </section>

      <section className="insight-panel">
        <h2>Popular now</h2>
        <div className="compact-list">
          {popular.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`}>
              <span>{post.title}</span>
              <small><MessageCircle size={13} /> {post.comments}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="insight-panel">
        <h2>Topics</h2>
        <div className="topic-list">
          {categoryCounts.map((item) => (
            <Link key={item.label} to={`/?category=${encodeURIComponent(item.label)}`}>
              <span>{item.label}</span>
              <small>{item.count}</small>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

function PostPage() {
  const { id } = useParams();
  const { posts, bookmarks, dispatch } = useBlog();
  const post = posts.find((item) => item.id === id);
  const navigate = useNavigate();

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const saved = bookmarks.includes(post.id);
  const related = posts
    .filter((item) => item.category === post.category && item.id !== post.id)
    .slice(0, 3);

  return (
    <article className="article-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>
      <header className="article-header">
        <div className="article-kicker">
          <span>{post.category}</span>
          <span><CalendarDays size={15} /> {post.date}</span>
          <span><Clock3 size={15} /> {post.readTime} min read</span>
        </div>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="article-actions">
          <Link to={`/author/${encodeURIComponent(post.author)}`} className="author-pill">
            <UserRound size={18} />
            <span>
              <strong>{post.author}</strong>
              <small>{post.authorRole}</small>
            </span>
          </Link>
          <button
            className="save-button"
            onClick={() => dispatch({ type: 'toggleBookmark', id: post.id })}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </header>

      <img className="article-image" src={post.image} alt="" />

      <div className="article-body">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="related-section">
        <h2>Related posts</h2>
        <PostGrid posts={related} emptyText="No related posts yet." />
      </section>
    </article>
  );
}

function AuthorPage() {
  const { name } = useParams();
  const { posts } = useBlog();
  const author = decodeURIComponent(name || '');
  const authorPosts = posts.filter((post) => post.author === author);

  if (!authorPosts.length) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page narrow-page">
      <header className="profile-header">
        <div className="profile-avatar">{author.split(' ').map((part) => part[0]).join('')}</div>
        <div>
          <span className="eyebrow"><UserRound size={15} /> Author archive</span>
          <h1>{author}</h1>
          <p>{authorPosts[0].authorRole} with {authorPosts.length} published posts.</p>
        </div>
      </header>
      <PostGrid posts={authorPosts} emptyText="No posts from this author yet." />
    </div>
  );
}

function BookmarksPage() {
  const { posts, bookmarks } = useBlog();
  const savedPosts = posts.filter((post) => bookmarks.includes(post.id));

  return (
    <div className="page narrow-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow"><BookmarkCheck size={15} /> Saved library</span>
          <h1>Bookmarks</h1>
        </div>
      </div>
      <PostGrid posts={savedPosts} emptyText="Saved articles will appear here." />
    </div>
  );
}

function WritePage() {
  const { dispatch } = useBlog();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    title: '',
    excerpt: '',
    category: 'React',
    author: 'Guest Writer'
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canPublish = form.title.trim().length > 5 && form.excerpt.trim().length > 20;

  const submitPost = (event) => {
    event.preventDefault();
    if (!canPublish) return;

    const id = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    dispatch({
      type: 'addPost',
      post: {
        id: `${id}-${Date.now().toString(36)}`,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        category: form.category,
        author: form.author.trim() || 'Guest Writer',
        authorRole: 'Contributor',
        date: 'Today',
        readTime: Math.max(3, Math.ceil(form.excerpt.length / 160)),
        image:
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        comments: 0,
        body: [
          form.excerpt.trim(),
          'This draft was created from the in-app composer. It is stored in application state for the current session and appears immediately across the routed feed.'
        ]
      }
    });

    navigate('/');
  };

  return (
    <div className="page composer-page">
      <section className="composer-intro">
        <span className="eyebrow"><Edit3 size={15} /> Create a post</span>
        <h1>Write for the feed</h1>
        <p>Publish a session draft and see the global blog state update instantly.</p>
      </section>

      <form className="composer" onSubmit={submitPost}>
        <label>
          Title
          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Add a clear article title"
          />
        </label>

        <label>
          Excerpt
          <textarea
            value={form.excerpt}
            onChange={(event) => updateField('excerpt', event.target.value)}
            placeholder="Summarize the post in one or two strong sentences"
            rows="6"
          />
        </label>

        <div className="form-grid">
          <label>
            Category
            <select value={form.category} onChange={(event) => updateField('category', event.target.value)}>
              {categories.filter((item) => item !== 'All').map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Author
            <input
              value={form.author}
              onChange={(event) => updateField('author', event.target.value)}
              placeholder="Author name"
            />
          </label>
        </div>

        <button className="publish-button" type="submit" disabled={!canPublish}>
          <PenSquare size={18} /> Publish draft
        </button>
      </form>
    </div>
  );
}

function filterPosts(posts, query, category) {
  const normalizedQuery = query.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesCategory = category === 'All' || post.category === category;
    const haystack = `${post.title} ${post.excerpt} ${post.author} ${post.category}`.toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

createRoot(document.getElementById('root')).render(<App />);
