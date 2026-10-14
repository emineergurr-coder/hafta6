import { useState, useEffect } from "react";
import "./App.css";
import { events } from "./data/events";
import type { CampusEvent } from "./types/campus-event";
import { searchEvents, filterByCategory, findEventById } from "./utils/filter-events";

type PageName = "home" | "events" | "add" | "detail" | "update";

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
  }

  // Slayt Adım 8 / 13: Sekme başlığını güncelleme (useEffect)
  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${
      page === "home"
        ? "Ana Sayfa"
        : page === "events"
        ? "Tüm Etkinlikler"
        : page === "add"
        ? "Etkinlik Ekle"
        : page === "update"
        ? "Etkinlik Güncelle"
        : "Detay"
    }`;
  }, [page]);

  // Slayt Adım 9: Yaklaşan 2 etkinlik (sort + slice)
  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  // Slayt Adım 10: Filtrelenmiş liste
  const filtered = filterByCategory(
    searchEvents(events, searchText),
    category as any
  );

  // Slayt Adım 11: Seçili etkinlik
  const selected = selectedId ? findEventById(events, selectedId) : undefined;

  // Kategori seçenekleri
  const categories = [...new Set(events.map((e) => e.category))];

  // Slayt Adım 9: renderCard fonksiyonu
  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        <h2>{event.title}</h2>
        <p><strong>Kategori:</strong> {event.category}</p>
        <p><strong>Tarih:</strong> {event.date} - {event.time}</p>
        <p><strong>Mekan:</strong> {event.location}</p>
        <button onClick={() => go("detail", event.id)}>Detayları Gör</button>
      </article>
    );
  }

  const menuItems: { name: PageName; label: string }[] = [
    { name: "home", label: "Ana Sayfa" },
    { name: "events", label: "Etkinlikler" },
    { name: "add", label: "Etkinlik Ekle" },
  ];

  return (
    <>
      <header className="site-baslik">
        <h1>Kampüs Etkinlikleri</h1>
        <nav className="menu">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.name}`}
              aria-current={page === item.name ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(item.name);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        {/* ANA SAYFA */}
        {page === "home" && (
          <section className="etkinlik-listesi">
            <h2>Yaklaşan Etkinlikler</h2>
            <div className="liste">{upcoming.map(renderCard)}</div>
          </section>
        )}

        {/* ETKİNLİKLER SAYFASI */}
        {page === "events" && (
          <section className="etkinlik-listesi">
            <h2>Tüm Etkinlikler</h2>
            <div className="filtreler">
              <input
                type="search"
                placeholder="Etkinlik ara..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="liste">
              {filtered.length === 0 ? (
                <p>Etkinlik bulunamadı.</p>
              ) : (
                filtered.map(renderCard)
              )}
            </div>
          </section>
        )}

        {/* DETAY SAYFASI */}
        {page === "detail" && (
          <section className="detay-sayfasi">
            {!selected ? (
              <div>
                <p>Etkinlik bulunamadı.</p>
                <button onClick={() => go("events")}>Listeye Dön</button>
              </div>
            ) : (
              <article className="detay">
                <h2>{selected.title}</h2>
                <p>{selected.description}</p>
                <p><strong>Kategori:</strong> {selected.category}</p>
                <p><strong>Tarih:</strong> {selected.date} - {selected.time}</p>
                <p><strong>Mekan:</strong> {selected.location}</p>
                <button onClick={() => go("update", selected.id)}>
                  Bu Etkinliği Güncelle
                </button>
                <br />
                <button onClick={() => go("events")}>Listeye Dön</button>
              </article>
            )}
          </section>
        )}

        {/* EKLE / GÜNCELLE SAYFASI */}
        {(page === "add" || page === "update") && (
          <section className="form-sayfasi">
            <h2>{page === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}</h2>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="title">Etkinlik Adı</label>
                <input
                  id="title"
                  maxLength={80}
                  defaultValue={selected?.title || ""}
                />
              </div>
              <div>
                <label htmlFor="description">Açıklama</label>
                <textarea
                  id="description"
                  rows={5}
                  defaultValue={selected?.description || ""}
                />
              </div>
              <button type="submit">Kaydet</button>
            </form>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; Kampüs Etkinlikleri Projesi</p>
      </footer>
    </>
  );
}

export default App;