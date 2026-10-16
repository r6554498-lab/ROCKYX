import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';

type VideoPost = {
  id: string;
  creator: string;
  username: string;
  caption: string;
  sound: string;
  likes: number;
  comments: string[];
  following: boolean;
  videoUrl?: string;
  color: string;
};

type FeedType = 'For You' | 'Following' | 'Friends' | 'LIVE';

const initialPosts: VideoPost[] = [
  {
    id: '1',
    creator: 'RockyX Creator',
    username: '@rockyxcreator',
    caption: 'Welcome to RockyX! 🌍 One World. One Platform.',
    sound: 'Original sound - RockyX Creator',
    likes: 12800,
    comments: ['Welcome to RockyX! 🔥', 'Amazing!'],
    following: false,
    color: '#482477',
  },
  {
    id: '2',
    creator: 'Music Explorer',
    username: '@musicexplorer',
    caption: 'Discover your next favorite sound. 🎵',
    sound: 'Original sound - Music Explorer',
    likes: 8450,
    comments: ['Love this vibe ❤️', 'More music please!'],
    following: true,
    color: '#164e63',
  },
  {
    id: '3',
    creator: 'Creative World',
    username: '@creativeworld',
    caption: 'Create something beautiful today. ✨',
    sound: 'Creative vibes - Original sound',
    likes: 3260,
    comments: ['So creative!', '🔥🔥🔥'],
    following: false,
    color: '#713f12',
  },
];

const pageStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: 'calc(100dvh - 66px)',
  minHeight: 480,
  background: '#08080d',
  color: '#fff',
  overflow: 'hidden',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const iconButtonStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  color: '#fff',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'center',
};

function formatCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }

  return String(value);
}

export default function Videos() {
  const [posts, setPosts] = useState<VideoPost[]>(initialPosts);
  const [activeFeed, setActiveFeed] = useState<FeedType>('For You');
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [activeVideoId, setActiveVideoId] = useState('1');
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [showHeart, setShowHeart] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const lastTapRef = useRef<{ time: number; id: string } | null>(null);
  const heartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));

      if (uploadUrl && !objectUrlsRef.current.includes(uploadUrl)) {
        URL.revokeObjectURL(uploadUrl);
      }

      if (heartTimerRef.current) {
        clearTimeout(heartTimerRef.current);
      }
    };
  }, [uploadUrl]);

  const visiblePosts =
    activeFeed === 'Following'
      ? posts.filter((post) => post.following)
      : activeFeed === 'Friends'
        ? posts.filter((post) => post.following)
        : posts;

  function likePost(postId: string) {
    if (likedIds.includes(postId)) return;

    setLikedIds((current) => [...current, postId]);

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  }

  function handleVideoTap(postId: string) {
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (
      lastTap &&
      lastTap.id === postId &&
      now - lastTap.time < 300
    ) {
      likePost(postId);
      setShowHeart(true);

      if (heartTimerRef.current) {
        clearTimeout(heartTimerRef.current);
      }

      heartTimerRef.current = setTimeout(() => {
        setShowHeart(false);
      }, 750);

      lastTapRef.current = null;
      return;
    }

    lastTapRef.current = { time: now, id: postId };

    const video = videoRefs.current[postId];

    if (video) {
      if (video.paused) {
        void video.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        video.pause();
        setPlaying(false);
      }
    } else {
      setPlaying((current) => !current);
    }
  }

  function toggleFollow(postId: string) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, following: !post.following }
          : post
      )
    );
  }

  function selectFeed(feed: FeedType) {
    setActiveFeed(feed);
    setCommentsFor(null);
    setPlaying(true);

    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }

    setActiveVideoId('');
  }

  function handleScroll() {
    const container = feedRef.current;
    if (!container) return;

    const height = container.clientHeight;

    if (!height) return;

    const index = Math.round(container.scrollTop / height);
    const post = visiblePosts[index];

    if (post && post.id !== activeVideoId) {
      setActiveVideoId(post.id);
      setPlaying(true);
    }
  }

  function handleVideoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadMessage('Please select a video file.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadMessage('Choose a video smaller than 100 MB.');
      return;
    }

    if (uploadUrl) {
      URL.revokeObjectURL(uploadUrl);
    }

    const url = URL.createObjectURL(file);

    objectUrlsRef.current.push(url);
    setUploadUrl(url);
    setUploadFile(file);
    setUploadMessage('');
  }

  function publishVideoPreview() {
    if (!uploadUrl || !uploadFile) {
      setUploadMessage('Select a video before continuing.');
      return;
    }

    const newPost: VideoPost = {
      id: `local-${Date.now()}`,
      creator: 'You',
      username: '@you',
      caption: uploadCaption.trim() || uploadFile.name,
      sound: 'Original sound - You',
      likes: 0,
      comments: [],
      following: false,
      videoUrl: uploadUrl,
      color: '#312e81',
    };

    setPosts((current) => [newPost, ...current]);
    setActiveFeed('For You');
    setActiveVideoId(newPost.id);
    setShowUpload(false);
    setUploadCaption('');
    setUploadUrl(null);
    setUploadFile(null);
    setUploadMessage(
      'Added to this session preview. It has not been uploaded to a server.'
    );

    if (fileInput.current) {
      fileInput.current.value = '';
    }

    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }

  function addComment(postId: string) {
    const comment = commentText.trim();

    if (!comment) return;

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );

    setCommentText('');
  }

  async function sharePost(post: VideoPost) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'RockyX Video',
          text: `${post.caption} ${post.username}`,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${post.caption} — ${post.username} ${window.location.href}`
        );

        setUploadMessage('Share text copied.');
      } else {
        setUploadMessage('Sharing is not supported in this browser.');
      }
    } catch {
      // The user may cancel the share sheet.
    }
  }

  return (
    <div style={pageStyle}>
      <div
        style={{
          position: 'absolute',
          zIndex: 5,
          top: 0,
          left: 0,
          right: 0,
          height: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          padding: '0 8px',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,.55), transparent)',
        }}
      >
        {(['Following', 'For You', 'Friends', 'LIVE'] as FeedType[]).map(
          (feed) => (
            <button
              key={feed}
              onClick={() => {
                if (feed === 'LIVE') {
                  setUploadMessage(
                    'LIVE streaming will be connected in a future module.'
                  );
                  return;
                }

                selectFeed(feed);
              }}
              style={{
                ...iconButtonStyle,
                fontSize: 13,
                fontWeight: activeFeed === feed ? 800 : 500,
                opacity: activeFeed === feed ? 1 : 0.72,
                borderBottom:
                  activeFeed === feed
                    ? '2px solid #fff'
                    : '2px solid transparent',
                padding: '8px 0',
              }}
            >
              {feed}
            </button>
          )
        )}
      </div>

      <div
        ref={feedRef}
        onScroll={handleScroll}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollSnapType: 'y mandatory',
          overscrollBehaviorY: 'contain',
          scrollbarWidth: 'none',
        }}
      >
        {visiblePosts.length === 0 && (
          <div
            style={{
              minHeight: '100%',
              display: 'grid',
              placeItems: 'center',
              padding: 30,
              boxSizing: 'border-box',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <div>
              <h2>No videos yet</h2>
              <p style={{ color: '#bbb' }}>
                Follow creators to see their videos here.
              </p>
              <button
                onClick={() => selectFeed('For You')}
                style={{
                  border: 0,
                  borderRadius: 20,
                  background: '#fe2c55',
                  color: '#fff',
                  padding: '12px 20px',
                  fontWeight: 700,
                }}
              >
                Explore For You
              </button>
            </div>
          </div>
        )}

        {visiblePosts.map((post) => {
          const liked = likedIds.includes(post.id);
          const active = activeVideoId === post.id;

          return (
            <section
              key={post.id}
              data-video-id={post.id}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: 480,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                overflow: 'hidden',
                background: post.color,
                isolation: 'isolate',
              }}
            >
              {post.videoUrl ? (
                <video
                  ref={(element) => {
                    videoRefs.current[post.id] = element;
                  }}
                  src={post.videoUrl}
                  muted={muted}
                  loop
                  playsInline
                  controls={false}
                  autoPlay={active}
                  onClick={() => handleVideoTap(post.id)}
                  onEnded={() => setPlaying(false)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    background: '#08080d',
                    zIndex: -1,
                  }}
                />
              ) : (
                <div
                  onClick={() => handleVideoTap(post.id)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    display: 'grid',
                    placeItems: 'center',
                    background: `radial-gradient(ellipse at 30% 25%, ${post.color}, #09090f 85%)`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ textAlign: 'center', padding: 28 }}>
                    <div
                      style={{
                        fontSize: 58,
                        marginBottom: 16,
                        opacity: 0.85,
                      }}
                    >
                      ▶
                    </div>
                    <strong style={{ fontSize: 21 }}>
                      RockyX
                    </strong>
                    <p
                      style={{
                        color: '#ddd',
                        fontSize: 13,
                        lineHeight: 1.6,
                        maxWidth: 260,
                      }}
                    >
                      Sample feed preview
                      <br />
                      Connect video storage to display real creator videos.
                    </p>
                  </div>
                </div>
              )}

              <div
                onClick={() => handleVideoTap(post.id)}
                onTouchEnd={(event) => {
                  if (event.changedTouches.length === 1) {
                    // Double-tap is also handled by the click event.
                    // Keep touch interaction native for scrolling.
                  }
                }}
                style={{
                  position: 'absolute',
                  inset: '58px 64px 150px 0',
                  zIndex: 1,
                  cursor: 'pointer',
                }}
              />

              {showHeart && active && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '40%',
                    top: '42%',
                    zIndex: 3,
                    fontSize: 76,
                    pointerEvents: 'none',
                    textShadow: '0 3px 25px #000',
                  }}
                >
                  ❤️
                </div>
              )}

              {!playing && post.videoUrl && active && (
                <button
                  onClick={() => handleVideoTap(post.id)}
                  aria-label="Play video"
                  style={{
                    ...iconButtonStyle,
                    position: 'absolute',
                    top: '45%',
                    left: '45%',
                    fontSize: 46,
                    zIndex: 4,
                  }}
                >
                  ▶
                </button>
              )}

              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  right: 78,
                  bottom: 22,
                  zIndex: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,.8)',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
                      border: '2px solid white',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {post.creator.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: 14 }}>
                      {post.username}
                    </strong>
                    <div style={{ fontSize: 11, color: '#eee' }}>
                      {post.creator}
                    </div>
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFollow(post.id);
                    }}
                    style={{
                      border: post.following
                        ? '1px solid white'
                        : '1px solid #fe2c55',
                      background: post.following
                        ? 'rgba(0,0,0,.3)'
                        : '#fe2c55',
                      color: '#fff',
                      padding: '6px 10px',
                      borderRadius: 5,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                    }}
                  >
                    {post.following ? 'Following' : '+ Follow'}
                  </button>
                </div>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    margin: '0 0 12px',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {post.caption}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    overflow: 'hidden',
                  }}
                >
                  <span>♫</span>
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {post.sound}
                  </span>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  right: 12,
                  bottom: 100,
                  zIndex: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 21,
                  width: 54,
                }}
              >
                <button
                  onClick={() => likePost(post.id)}
                  style={iconButtonStyle}
                  aria-label={liked ? 'Liked' : 'Like video'}
                >
                  <div
                    style={{
                      fontSize: 31,
                      filter: liked ? 'none' : 'grayscale(1)',
                    }}
                  >
                    ❤️
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {formatCount(post.likes)}
                  </div>
                </button>

                <button
                  onClick={() => setCommentsFor(post.id)}
                  style={iconButtonStyle}
                  aria-label="Open comments"
                >
                  <div style={{ fontSize: 30 }}>💬</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {formatCount(post.comments.length)}
                  </div>
                </button>

                <button
                  onClick={() => void sharePost(post)}
                  style={iconButtonStyle}
                  aria-label="Share video"
                >
                  <div style={{ fontSize: 30 }}>↗</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    Share
                  </div>
                </button>

                <button
                  onClick={() => setMuted((current) => !current)}
                  style={iconButtonStyle}
                  aria-label={muted ? 'Unmute videos' : 'Mute videos'}
                >
                  <div style={{ fontSize: 25 }}>
                    {muted ? '🔇' : '🔊'}
                  </div>
                  <div style={{ fontSize: 11 }}>
                    {muted ? 'Muted' : 'Sound'}
                  </div>
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          zIndex: 6,
          left: 0,
          right: 0,
          bottom: 0,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          background: 'rgba(8,8,13,.96)',
          borderTop: '1px solid #292936',
        }}
      >
        <button
          onClick={() => selectFeed('For You')}
          style={iconButtonStyle}
        >
          <div style={{ fontSize: 21 }}>⌂</div>
          <div style={{ fontSize: 10 }}>Home</div>
        </button>

        <button
          onClick={() => selectFeed('Following')}
          style={iconButtonStyle}
        >
          <div style={{ fontSize: 21 }}>♧</div>
          <div style={{ fontSize: 10 }}>Following</div>
        </button>

        <button
          onClick={() => {
            setShowUpload(true);
            setUploadMessage('');
          }}
          aria-label="Create video"
          style={{
            ...iconButtonStyle,
            width: 46,
            height: 32,
            borderRadius: 8,
            background: '#fff',
            color: '#08080d',
            fontSize: 28,
            fontWeight: 800,
            lineHeight: '28px',
          }}
        >
          +
        </button>

        <button
          onClick={() => selectFeed('Friends')}
          style={iconButtonStyle}
        >
          <div style={{ fontSize: 21 }}>♙</div>
          <div style={{ fontSize: 10 }}>Friends</div>
        </button>

        <button
          onClick={() => {
            setUploadMessage(
              'Your profile will be connected when account authentication is implemented.'
            );
          }}
          style={iconButtonStyle}
        >
          <div style={{ fontSize: 21 }}>◎</div>
          <div style={{ fontSize: 10 }}>Profile</div>
        </button>
      </div>

      {uploadMessage && !showUpload && (
        <div
          role="status"
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 76,
            zIndex: 10,
            padding: 12,
            borderRadius: 10,
            background: '#29213d',
            color: '#fff',
            fontSize: 12,
          }}
        >
          {uploadMessage}
          <button
            onClick={() => setUploadMessage('')}
            style={{
              ...iconButtonStyle,
              float: 'right',
              paddingLeft: 10,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {showUpload && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create video"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: '#101019',
            padding: 20,
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2>Create video</h2>
            <button
              onClick={() => {
                setShowUpload(false);
                setUploadMessage('');
              }}
              style={iconButtonStyle}
            >
              ✕ Close
            </button>
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="video/*"
            onChange={handleVideoFile}
            style={{ display: 'block', margin: '20px 0', maxWidth: '100%' }}
          />

          {uploadUrl && (
            <video
              src={uploadUrl}
              controls
              playsInline
              style={{
                display: 'block',
                width: '100%',
                maxHeight: 350,
                background: '#000',
                borderRadius: 12,
                marginBottom: 16,
              }}
            />
          )}

          <textarea
            value={uploadCaption}
            onChange={(event) => setUploadCaption(event.target.value)}
            placeholder="Write a caption..."
            rows={3}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#20202e',
              color: '#fff',
              border: '1px solid #414155',
              borderRadius: 10,
              padding: 12,
              font: 'inherit',
            }}
          />

          {uploadMessage && (
            <p role="status" style={{ color: '#f9a8d4' }}>
              {uploadMessage}
            </p>
          )}

          <button
            onClick={publishVideoPreview}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 16,
              padding: 14,
              border: 0,
              borderRadius: 10,
              background: '#fe2c55',
              color: '#fff',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Add to feed preview
          </button>

          <p
            style={{
              color: '#aaa',
              fontSize: 12,
              lineHeight: 1.6,
              marginTop: 16,
            }}
          >
            This is a local preview. The video is not saved online
            and will not be visible to other users. Server uploads
            will be added when RockyX media storage is connected.
          </p>
        </div>
      )}

      {commentsFor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video comments"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'flex-end',
            background: 'rgba(0,0,0,.55)',
          }}
          onClick={() => setCommentsFor(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxHeight: '75%',
              display: 'flex',
              flexDirection: 'column',
              background: '#171722',
              borderRadius: '18px 18px 0 0',
              padding: 18,
              boxSizing: 'border-box',
              borderTop: '1px solid #38384a',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3>
                Comments (
                {posts.find((post) => post.id === commentsFor)
                  ?.comments.length ?? 0}
                )
              </h3>

              <button
                onClick={() => setCommentsFor(null)}
                style={iconButtonStyle}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {posts
                .find((post) => post.id === commentsFor)
                ?.comments.map((comment, index) => (
                  <p
                    key={`${commentsFor}-${index}`}
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid #30303e',
                      overflowWrap: 'anywhere',
                      fontSize: 14,
                    }}
                  >
                    <strong style={{ marginRight: 8 }}>
                      @rockyxuser
                    </strong>
                    {comment}
                  </p>
                ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                addComment(commentsFor);
              }}
              style={{
                display: 'flex',
                gap: 8,
                paddingTop: 12,
              }}
            >
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add a comment..."
                aria-label="Add a comment"
                style={{
                  minWidth: 0,
                  flex: 1,
                  padding: 12,
                  borderRadius: 24,
                  border: '1px solid #444456',
                  background: '#292936',
                  color: '#fff',
                  font: 'inherit',
                }}
              />

              <button
                type="submit"
                style={{
                  border: 0,
                  borderRadius: 22,
                  padding: '0 16px',
                  background: '#fe2c55',
                  color: '#fff',
                  fontWeight: 800,
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}