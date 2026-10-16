import { useEffect, useRef, useState } from 'react';

type VideoPost = {
  id: number;
  creator: string;
  caption: string;
  likes: number;
  comments: string[];
  videoUrl?: string;
};

export default function Videos() {
  const [posts, setPosts] = useState<VideoPost[]>([
    {
      id: 1,
      creator: 'RockyX Creator',
      caption: 'Welcome to RockyX! One World. One Platform. 🌍',
      likes: 128,
      comments: ['Welcome to RockyX!'],
    },
    {
      id: 2,
      creator: 'Music Explorer',
      caption: 'Discover something new today. 🎵',
      likes: 86,
      comments: [],
    },
  ]);

  const [commentText, setCommentText] = useState('');
  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [message, setMessage] = useState('');

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (uploadUrl) URL.revokeObjectURL(uploadUrl);
    };
  }, [uploadUrl]);

  function handleVideoSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setMessage('Please select a video file.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setMessage('Please select a video smaller than 100 MB.');
      return;
    }

    setMessage('');
    setUploadName(file.name);
    setUploadUrl(URL.createObjectURL(file));
  }

  function publishPreview() {
    if (!uploadUrl) {
      setMessage('Select a video before publishing.');
      return;
    }

    const newPost: VideoPost = {
      id: Date.now(),
      creator: 'You',
      caption: uploadName,
      likes: 0,
      comments: [],
      videoUrl: uploadUrl,
    };

    setPosts((current) => [newPost, ...current]);
    setMessage('Video added to your current feed preview.');
    setUploadUrl(null);
    setUploadName('');

    if (fileInput.current) {
      fileInput.current.value = '';
    }
  }

  function toggleLike(postId: number) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes + 1,
            }
          : post
      )
    );
  }

  function addComment(postId: number) {
    const text = commentText.trim();

    if (!text) return;

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, text],
            }
          : post
      )
    );

    setCommentText('');
  }

  const styles = {
    page: {
      width: '100%',
      maxWidth: 760,
      margin: '0 auto',
      padding: '20px 14px 80px',
      boxSizing: 'border-box' as const,
      color: '#f5f5ff',
      fontFamily: 'system-ui, sans-serif',
    },
    panel: {
      background: '#171724',
      border: '1px solid #303044',
      borderRadius: 16,
      padding: 16,
      marginBottom: 18,
    },
    button: {
      background: 'linear-gradient(110deg, #7c3aed, #db2777)',
      border: 0,
      borderRadius: 9,
      padding: '10px 14px',
      color: '#fff',
      fontWeight: 700,
      cursor: 'pointer',
    },
    secondaryButton: {
      background: '#29293b',
      border: '1px solid #404057',
      borderRadius: 9,
      padding: '9px 12px',
      color: '#fff',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.page}>
      <header style={{ marginBottom: 24 }}>
        <p
          style={{
            color: '#c4b5fd',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          ROCKYX SOCIAL
        </p>

        <h1 style={{ fontSize: 32, margin: '8px 0' }}>
          Videos
        </h1>

        <p style={{ color: '#a4a4bb', lineHeight: 1.7 }}>
          Watch, create, and share videos with the RockyX community.
        </p>
      </header>

      <section style={styles.panel}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>
          Create a video post
        </h2>

        <p style={{ color: '#a4a4bb', fontSize: 13 }}>
          Select a video from your device to preview it.
        </p>

        <input
          ref={fileInput}
          type="file"
          accept="video/*"
          onChange={handleVideoSelection}
          aria-label="Choose a video"
          style={{
            display: 'block',
            width: '100%',
            margin: '14px 0',
            color: '#ddd',
          }}
        />

        {uploadUrl && (
          <div style={{ marginBottom: 14 }}>
            <video
              src={uploadUrl}
              controls
              playsInline
              style={{
                width: '100%',
                maxHeight: 360,
                background: '#08080d',
                borderRadius: 12,
              }}
            />

            <p style={{ color: '#a4a4bb', fontSize: 13 }}>
              Selected: {uploadName}
            </p>

            <button
              onClick={publishPreview}
              style={styles.button}
            >
              Add to feed preview
            </button>
          </div>
        )}

        {message && (
          <p
            role="status"
            style={{ color: '#d8b4fe', fontSize: 13 }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            color: '#85859c',
            fontSize: 12,
            lineHeight: 1.6,
            marginBottom: 0,
          }}
        >
          This preview does not upload videos to a server.
          Persistent publishing will be added when we connect
          secure media storage.
        </p>
      </section>

      <h2 style={{ fontSize: 21, marginBottom: 16 }}>
        Your feed
      </h2>

      {posts.map((post) => (
        <article
          key={post.id}
          style={{
            ...styles.panel,
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 16 }}>
            <strong>@{post.creator.replace(/\s+/g, '')}</strong>

            <p
              style={{
                color: '#dedeea',
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 0,
              }}
            >
              {post.caption}
            </p>
          </div>

          {post.videoUrl ? (
            <video
              src={post.videoUrl}
              controls
              playsInline
              style={{
                width: '100%',
                maxHeight: 540,
                display: 'block',
                background: '#08080d',
              }}
            />
          ) : (
            <div
              style={{
                minHeight: 250,
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                padding: 24,
                boxSizing: 'border-box',
                background:
                  'radial-gradient(ellipse at top left, #433078, #171724 70%)',
              }}
            >
              <div>
                <div style={{ fontSize: 42, marginBottom: 12 }}>
                  ▶
                </div>

                <strong>
                  RockyX Video Preview
                </strong>

                <p
                  style={{
                    color: '#c4c4d8',
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  Real creator videos will appear here when
                  media storage and the feed backend are connected.
                </p>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              padding: 14,
            }}
          >
            <button
              onClick={() => toggleLike(post.id)}
              style={styles.secondaryButton}
              aria-label={`Like post by ${post.creator}`}
            >
              ❤️ Like {post.likes}
            </button>

            <button
              onClick={() =>
                setCommentingOn(
                  commentingOn === post.id ? null : post.id
                )
              }
              style={styles.secondaryButton}
            >
              💬 Comments {post.comments.length}
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  void navigator.share({
                    title: 'RockyX Video',
                    text: post.caption,
                  }).catch(() => {});
                } else {
                  setMessage(
                    'Sharing is not available in this browser.'
                  );
                }
              }}
              style={styles.secondaryButton}
            >
              ↗ Share
            </button>
          </div>

          {commentingOn === post.id && (
            <div
              style={{
                padding: '0 14px 16px',
                borderTop: '1px solid #303044',
              }}
            >
              {post.comments.map((comment, index) => (
                <p
                  key={`${post.id}-${index}`}
                  style={{
                    color: '#dedeea',
                    fontSize: 13,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {comment}
                </p>
              ))}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  addComment(post.id);
                }}
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <input
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(event.target.value)
                  }
                  placeholder="Write a comment..."
                  aria-label="Write a comment"
                  style={{
                    minWidth: 0,
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: '1px solid #404057',
                    background: '#0f0f19',
                    color: '#fff',
                  }}
                />

                <button
                  type="submit"
                  style={styles.button}
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}