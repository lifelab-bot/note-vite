const artworks = [
  {
    src: `${import.meta.env.BASE_URL}img/noteweb-mountain.svg`,
    title: "《不知名山岳研究》(Study of an Unknown Mountain)",
    desc: ["Afra(b. 199X, Taiwan)", "2026年（民國115年）", "數位生成、混合媒介習作", "200 x 200 px", "這件作品是 Afra 於 2026 年與 AI 協作生成的 SNG 系列之一。", "冷峻色調與粗獷筆觸，重構山岳的雄偉與孤寂。"],
  },
  {
    src: `${import.meta.env.BASE_URL}img/noteweb-fish.svg`,
    title: "《魚悅》(Joy of the Fin: Golden Ripple)",
    desc: ["Afra(b. 199X, Taiwan)", "2026年（民國115年）", "數位生成、混合媒介習作", "200 x 200 px", "這件作品是 Afra 於 2026 年與 AI 協作生成的 SNG 系列之一。", "色彩交織出躍動感，展現「萬物自得」的東方美學。"],
  },
  {
    src: `${import.meta.env.BASE_URL}img/noteweb-banner.svg`,
    title: "《波浪》(The Raging Blue: Frozen Motion)",
    desc: ["Afra(b. 199X, Taiwan)", "2026年（民國115年）", "數位生成、混合媒介習作", "200 x 200 px", "這件作品是 Afra 於 2026 年與 AI 協作生成的 SNG 系列之一。", "兩道純粹的波浪紋線，探討自然元素的符號化。"],
  },
];

export default function ArtFeatures() {
  return (
    <section className="art-features">
      <div className="art-features__grid">
        {artworks.map((art) => (
          <div key={art.title} className="art-card">
            <div className="art-card__img-wrap">
              <img src={art.src} alt={art.title} className="art-card__img" />
            </div>
            <div className="art-card__body">
              <h3 className="art-card__title">{art.title}</h3>
              <div className="art-card__desc">
                {art.desc.map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
