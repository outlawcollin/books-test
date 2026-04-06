import { fetchGutenbergBooks } from "@/lib/gutenberg";

const CHARACTER_IMAGES = [
  { name: "Young Man", file: "young-man.png" },
  { name: "Young Woman", file: "young-woman.png" },
  { name: "Older Man", file: "older-man.png" },
  { name: "Older Woman", file: "older-woman.png" },
  { name: "Warrior", file: "warrior.png" },
  { name: "Child", file: "child.png" },
  { name: "Monster", file: "monster.png" },
  { name: "Mysterious", file: "mysterious.png" },
];

const PERSONA_IMAGES = [
  { name: "Daera", file: "daera.png" },
  { name: "Pam", file: "pam.png" },
  { name: "Toru", file: "toru.png" },
];

export default async function AssetsPage() {
  const books = await fetchGutenbergBooks(25);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 48,
        background: "#f4f0e9",
        height: "100dvh",
        overflowY: "auto",
      }}
    >
      <h1 style={{ fontSize: 32, color: "#3e2733", marginBottom: 8 }}>
        Book Assets
      </h1>
      <p style={{ color: "#3e2733", opacity: 0.6, marginBottom: 48 }}>
        Right-click → Save Image As to download. All images served from /public.
      </p>

      {/* Book Covers */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, color: "#3e2733", marginBottom: 24 }}>
          Book Covers ({books.filter((b) => b.coverImage).length})
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 24,
          }}
        >
          {books
            .filter((b) => b.coverImage)
            .map((book) => (
              <div key={book.id} style={{ textAlign: "center" }}>
                <a
                  href={book.coverImage}
                  download={`${book.title.replace(/[^a-zA-Z0-9]/g, "-")}-cover.jpg`}
                  style={{ display: "block" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: 260,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid rgba(62,39,51,0.12)",
                      background: book.spineColor,
                    }}
                  />
                </a>
                <p
                  style={{
                    fontSize: 12,
                    color: "#3e2733",
                    marginTop: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {book.title}
                </p>
                <p style={{ fontSize: 10, color: "#3e2733", opacity: 0.5 }}>
                  {book.author}
                </p>
              </div>
            ))}
        </div>
      </section>

      {/* Character Silhouettes */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, color: "#3e2733", marginBottom: 8 }}>
          Character Silhouettes (8 archetypes)
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#3e2733",
            opacity: 0.5,
            marginBottom: 24,
          }}
        >
          /public/images/book_characters/
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 24,
          }}
        >
          {CHARACTER_IMAGES.map((img) => (
            <div key={img.file} style={{ textAlign: "center" }}>
              <a
                href={`/images/book_characters/${img.file}`}
                download={img.file}
                style={{ display: "block" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/book_characters/${img.file}`}
                  alt={img.name}
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid rgba(62,39,51,0.12)",
                    background: "#e5dfeb",
                  }}
                />
              </a>
              <p
                style={{
                  fontSize: 13,
                  color: "#3e2733",
                  marginTop: 8,
                  fontWeight: 600,
                }}
              >
                {img.name}
              </p>
              <p style={{ fontSize: 10, color: "#3e2733", opacity: 0.4 }}>
                {img.file}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Persona Avatars */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, color: "#3e2733", marginBottom: 8 }}>
          Persona Avatars
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#3e2733",
            opacity: 0.5,
            marginBottom: 24,
          }}
        >
          /public/personas/
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 24,
          }}
        >
          {PERSONA_IMAGES.map((img) => (
            <div key={img.file} style={{ textAlign: "center" }}>
              <a
                href={`/personas/${img.file}`}
                download={img.file}
                style={{ display: "block" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/personas/${img.file}`}
                  alt={img.name}
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid rgba(62,39,51,0.12)",
                    background: "#e5dfeb",
                  }}
                />
              </a>
              <p
                style={{
                  fontSize: 13,
                  color: "#3e2733",
                  marginTop: 8,
                  fontWeight: 600,
                }}
              >
                {img.name}
              </p>
              <p style={{ fontSize: 10, color: "#3e2733", opacity: 0.4 }}>
                {img.file}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Icons */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, color: "#3e2733", marginBottom: 8 }}>
          Icons
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#3e2733",
            opacity: 0.5,
            marginBottom: 24,
          }}
        >
          /public/icons/ — SVG
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {[
            {
              label: "Home Nav",
              icons: [
                "home/all books.svg",
                "home/in progress.svg",
                "home/my copies.svg",
                "home/add a book.svg",
              ],
            },
            {
              label: "Modal",
              icons: [
                "modal/close3.svg",
                "modal/upload.svg",
                "modal/link.svg",
              ],
            },
            {
              label: "Subpage",
              icons: [
                "subpage/arrow-left.svg",
                "subpage/arrow-top.svg",
                "subpage/horizon.svg",
                "subpage/magic-edit, magic-writing.svg",
                "subpage/bookmark, banner, flag, tag.svg",
                "subpage/plus-large, add large.svg",
                "subpage/chevron-down-sm.svg",
                "subpage/cross-small, crossed small, delete, remove.svg",
                "subpage/circle-check, check radio, circle, checkbox, check, checkmark, confirm.svg",
                "subpage/circle-info, info circle, tooltip, information.svg",
                "subpage/arrow-out-of-box, upload, share.svg",
              ],
            },
          ].map((group) => (
            <div key={group.label}>
              <h3
                style={{
                  fontSize: 16,
                  color: "#3e2733",
                  marginBottom: 12,
                  opacity: 0.7,
                }}
              >
                {group.label}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                {group.icons.map((icon) => (
                  <a
                    key={icon}
                    href={`/icons/${icon}`}
                    download={icon.split("/").pop()}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid rgba(62,39,51,0.12)",
                      background: "white",
                      textDecoration: "none",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/icons/${icon}`}
                      alt={icon}
                      style={{ width: 32, height: 32 }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        color: "#3e2733",
                        opacity: 0.5,
                        maxWidth: 80,
                        textAlign: "center",
                        wordBreak: "break-all",
                      }}
                    >
                      {icon.split("/").pop()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spine Colors */}
      <section>
        <h2 style={{ fontSize: 24, color: "#3e2733", marginBottom: 24 }}>
          Spine Colors
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                width: 40,
                height: 120,
                borderRadius: 3,
                background: book.spineColor,
              }}
              title={`${book.title} — ${book.spineColor}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
