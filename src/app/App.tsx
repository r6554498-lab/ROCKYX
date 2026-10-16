import { useState, type CSSProperties } from 'react';
import Videos from '../modules/videos/Videos';

type ModuleName =
  | 'Home'
  | 'Videos'
  | 'Music'
  | 'Creator Studio'
  | 'Templates'
  | 'Marketplace'
  | 'LIVE'
  | 'Discovery'
  | 'Messages'
  | 'Notifications'
  | 'Creator Center'
  | 'Business Center'
  | 'Wallet'
  | 'Profile'
  | 'Settings';

const modules: ModuleName[] = [
  'Home',
  'Videos',
  'Music',
  'Creator Studio',
  'Templates',
  'Marketplace',
  'LIVE',
  'Discovery',
  'Messages',
  'Notifications',
  'Creator Center',
  'Business Center',
  'Wallet',
  'Profile',
  'Settings',
];

const descriptions: Record<ModuleName, string> = {
  Home: 'Discover content, creators, music, and businesses.',
  Videos: 'Watch and share videos with the RockyX community.',
  Music: 'Discover artists, songs, albums, and playlists.',
  'Creator Studio': 'Create content and manage your creative projects.',
  Templates: 'Explore templates and tools for creating content.',
  Marketplace: 'Discover products, stores, and services.',
  LIVE: 'Connect with your audience through live streaming.',
  Discovery: 'Explore nearby businesses, transport, and services.',
  Messages: 'Your conversations will appear here.',
  Notifications: 'Keep up with activity across RockyX.',
  'Creator Center': 'Manage your creator activities and performance.',
  'Business Center': 'Manage business listings and advertising.',
  Wallet: 'Manage your wallet and view transaction history.',
  Profile: 'Manage your RockyX profile.',
  Settings: 'Manage your account and application preferences.',
};

const colors = {
  background: '#0b0b12',
  panel: '#14141f',
  border: '#29293a',
  text: '#f5f5ff',
  muted: '#a4a4bb',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

export default function App() {
  const [activeModule, setActiveModule] =
    useState<ModuleName>('Home');

  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredModules = modules.filter((module) =>
    module.toLowerCase().includes(search.toLowerCase())
  );

  function navigate(module: ModuleName) {
    setActiveModule(module);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const buttonStyle = (
    active: boolean
  ): CSSProperties => ({
    width: '100%',
    display: 'block',
    padding: '11px 12px',
    marginBottom: 5,
    border: '1px solid transparent',
    borderRadius: 10,
    background: active
      ? 'linear-gradient(110deg, #7c3aed, #db2777)'
      : 'transparent',
    color: colors.text,
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 14,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.background,
        color: colors.text,
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <header
        style={{
          minHeight: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '12px 20px',
          borderBottom: `1px solid ${colors.border}`,
          background: colors.panel,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate('Home')}
          aria-label="RockyX home"
          style={{
            background: 'transparent',
            border: 0,
            color: colors.text,
            fontSize: 24,
            fontWeight: 900,
            cursor: 'pointer',
            letterSpacing: -1,
          }}
        >
          Rocky<span style={{ color: colors.purple }}>X</span>
        </button>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          style={{
            background: '#222234',
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 9,
            padding: '9px 13px',
            cursor: 'pointer',
          }}
        >
          ☰ Menu
        </button>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: menuOpen
            ? '230px minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
          minHeight: 'calc(100vh - 66px)',
        }}
      >
        {menuOpen && (
          <aside
            style={{
              padding: 14,
              borderRight: `1px solid ${colors.border}`,
              background: colors.panel,
              maxHeight: 'calc(100vh - 66px)',
              overflowY: 'auto',
            }}
          >
            <p
              style={{
                color: colors.muted,
                fontSize: 11,
                letterSpacing: 1.5,
                fontWeight: 700,
                padding: '0 10px',
              }}
            >
              ROCKYX MODULES
            </p>

            {filteredModules.map((module) => (
              <button
                key={module}
                onClick={() => navigate(module)}
                style={buttonStyle(activeModule === module)}
              >
                {module}
              </button>
            ))}

            {filteredModules.length === 0 && (
              <p style={{ color: colors.muted, padding: 10 }}>
                No matching modules found.
              </p>
            )}

            <div
              style={{
                marginTop: 24,
                padding: 12,
                borderTop: `1px solid ${colors.border}`,
                color: colors.muted,
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: colors.text }}>
                One World. One Platform.
              </strong>
              <br />
              Create, share, edit, earn, shop, listen and connect.
            </div>
          </aside>
        )}

        <main
          style={{
            width: '100%',
            maxWidth: 1100,
            boxSizing: 'border-box',
            margin: '0 auto',
            padding: '28px 20px 100px',
          }}
        >
          {activeModule === 'Videos' ? (
            <Videos />
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <div>
                  <p
                    style={{
                      color: colors.purple,
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    RockyX Platform
                  </p>

                  <h1
                    style={{
                      fontSize: 'clamp(28px, 5vw, 42px)',
                      margin: '8px 0',
                      letterSpacing: -1,
                    }}
                  >
                    {activeModule}
                  </h1>

                  <p
                    style={{
                      color: colors.muted,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {descriptions[activeModule]}
                  </p>
                </div>

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setMenuOpen(true);
                  }}
                  placeholder="Find a module..."
                  aria-label="Search RockyX modules"
                  style={{
                    width: '100%',
                    maxWidth: 260,
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${colors.border}`,
                    background: colors.panel,
                    color: colors.text,
                    outlineColor: colors.purple,
                  }}
                />
              </div>

              <section
                style={{
                  padding: 'clamp(20px, 5vw, 36px)',
                  borderRadius: 20,
                  border: `1px solid ${colors.border}`,
                  background:
                    'radial-gradient(ellipse at top left, #282044 0%, #14141f 55%)',
                  marginBottom: 26,
                }}
              >
                <p
                  style={{
                    color: '#d8b4fe',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: 1.5,
                  }}
                >
                  ONE WORLD. ONE PLATFORM.
                </p>

                <h2
                  style={{
                    fontSize: 'clamp(25px, 4vw, 38px)',
                    lineHeight: 1.2,
                    margin: '14px 0',
                  }}
                >
                  Everything you love,
                  <br />
                  connected in one place.
                </h2>

                <p
                  style={{
                    color: colors.muted,
                    maxWidth: 520,
                    lineHeight: 1.8,
                  }}
                >
                  RockyX brings creativity, entertainment, music,
                  shopping, and community together in one platform.
                </p>

                <button
                  onClick={() => navigate('Videos')}
                  style={{
                    padding: '12px 18px',
                    border: 0,
                    borderRadius: 10,
                    color: '#ffffff',
                    background:
                      `linear-gradient(110deg, ${colors.purple}, ${colors.pink})`,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Explore Videos →
                </button>
              </section>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <h2 style={{ fontSize: 21, margin: 0 }}>
                  Explore modules
                </h2>

                <span style={{ color: colors.muted, fontSize: 12 }}>
                  {modules.length} modules
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
                  gap: 14,
                }}
              >
                {modules.map((module, index) => (
                  <button
                    key={module}
                    onClick={() => navigate(module)}
                    style={{
                      minHeight: 145,
                      padding: 20,
                      border: `1px solid ${
                        activeModule === module
                          ? colors.purple
                          : colors.border
                      }`,
                      borderRadius: 15,
                      background:
                        activeModule === module
                          ? '#211a36'
                          : colors.panel,
                      color: colors.text,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 11,
                        marginBottom: 15,
                        background: '#28213d',
                        color: '#d8b4fe',
                        fontWeight: 800,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <strong style={{ fontSize: 16 }}>
                      {module}
                    </strong>

                    <p
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        lineHeight: 1.6,
                        marginBottom: 0,
                      }}
                    >
                      {descriptions[module]}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          <footer
            style={{
              marginTop: 40,
              paddingTop: 20,
              borderTop: `1px solid ${colors.border}`,
              color: colors.muted,
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            <strong style={{ color: colors.text }}>RockyX</strong>
            {' '}— One World. One Platform.
            <br />
            Initial development version. Some modules still require
            backend services and further implementation.
          </footer>
        </main>
      </div>
    </div>
  );
}